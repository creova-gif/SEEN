#!/usr/bin/env node
/**
 * CRE-167 guard for the Supabase edge functions (supabase/functions/**).
 *
 * Fails if:
 *  - a console.* or log.* call references a request body, password, token, email,
 *    name, phone, auth header, JSON.stringify, user_metadata or a raw error object
 *    (log errInfo(error) instead), or the hono logger middleware is used;
 *  - any code reads a role from user_metadata (roles live in app_metadata / KV).
 *
 * String literal contents are ignored, so event names like 'signup.rejected' with
 * { reason: 'weak_password' } are fine; only code inside the call is checked.
 *
 * Usage: node scripts/server-log-guard.mjs   (exit 1 on violations)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SAFE_LOGGER_FILE = "safe_log.ts";

const RULES = [
  { id: "request-body", re: /\bbody\b|\breq\.json\b|\breq\.text\b|\breq\.raw\b/ },
  { id: "password", re: /pass(word|wd)/i },
  { id: "token", re: /token/i },
  { id: "email", re: /e-?mail/i },
  { id: "auth-header", re: /authorization|\bheaders?\b|\.header\(/i },
  { id: "phone", re: /phone/i },
  { id: "request-metadata", re: /referr?er|\borigin\b|\bhost\b|clientIP|forwarded|\bip\b|cookie/i },
  { id: "name", re: /(?<![.\w])name\b|\b(?:profile|user|body|data\.user|params)\.name\b|fullName|displayName/ },
  { id: "serialized-object", re: /JSON\.stringify/ },
  { id: "user-metadata", re: /user_metadata/ },
];

const RAW_ERROR_ARG = /^(?:\w*[eE]rror|err|e|ex|exception)$/;

/** Blank out string-literal text but keep ${...} template expressions. */
export function stripStringLiterals(src) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      out += ch;
      i++;
      while (i < src.length && src[i] !== ch) {
        if (src[i] === "\\") i++;
        i++;
      }
      out += ch;
      i++;
    } else if (ch === "`") {
      out += ch;
      i++;
      while (i < src.length && src[i] !== "`") {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === "\n") out += "\n";
        if (src[i] === "$" && src[i + 1] === "{") {
          let depth = 1;
          out += "${";
          i += 2;
          while (i < src.length && depth > 0) {
            if (src[i] === "{") depth++;
            else if (src[i] === "}") depth--;
            if (depth > 0) out += src[i];
            i++;
          }
          out += "}";
          continue;
        }
        i++;
      }
      out += "`";
      i++;
    } else if (ch === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
    } else if (ch === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) {
        if (src[i] === "\n") out += "\n"; // keep line numbers stable
        i++;
      }
      i += 2;
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

function splitTopLevelArgs(args) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of args) {
    if ("([{".includes(ch)) depth++;
    if (")]}".includes(ch)) depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

const CALL_RE = /\b(console\.(?:log|info|warn|error|debug|trace)|log\.(?:info|warn|error))\s*\(/g;

/** Returns violations for one source file's text. */
export function findViolations(source, file = "<source>") {
  const violations = [];
  const code = stripStringLiterals(source);
  const lineOf = (idx) => code.slice(0, idx).split("\n").length;
  const isSafeLogger = file.endsWith(SAFE_LOGGER_FILE);

  let m;
  CALL_RE.lastIndex = 0;
  while ((m = CALL_RE.exec(code))) {
    const callee = m[1];
    if (isSafeLogger && callee.startsWith("console.")) continue;
    let depth = 1;
    let j = m.index + m[0].length;
    const start = j;
    while (j < code.length && depth > 0) {
      if (code[j] === "(") depth++;
      else if (code[j] === ")") depth--;
      j++;
    }
    const args = code.slice(start, j - 1);
    const line = lineOf(m.index);
    for (const rule of RULES) {
      if (rule.re.test(args)) violations.push({ file, line, rule: rule.id, call: callee });
    }
    for (const arg of splitTopLevelArgs(args)) {
      if (RAW_ERROR_ARG.test(arg)) violations.push({ file, line, rule: "raw-error-object", call: callee });
    }
  }

  if (/hono\/logger/.test(source) || /\blogger\s*\(\s*console/.test(code)) {
    violations.push({ file, line: 0, rule: "hono-logger", call: "logger" });
  }
  const roleRead = /user_metadata\s*\??\.\s*(?:role|isAdmin|is_admin)\b|user_metadata\s*\??\.?\s*\[\s*['"`](?:role|isAdmin|is_admin)/g;
  let r;
  while ((r = roleRead.exec(source))) {
    violations.push({ file, line: source.slice(0, r.index).split("\n").length, rule: "user-metadata-role-read", call: "-" });
  }
  return violations;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      if (entry === "node_modules" || entry === "tests") continue;
      walk(p, out);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/** Scan every edge function source file under <repoRoot>/supabase/functions. */
export function scanServerLogs(repoRoot) {
  const base = join(repoRoot, "supabase", "functions");
  return walk(base).flatMap((f) => findViolations(readFileSync(f, "utf8"), relative(repoRoot, f)));
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isCli) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const violations = scanServerLogs(root);
  for (const v of violations) console.error(`${v.file}:${v.line} ${v.rule} (${v.call})`);
  if (violations.length) {
    console.error(`server-log-guard: ${violations.length} violation(s)`);
    process.exit(1);
  }
  console.log("server-log-guard: no sensitive data in server log calls, no user_metadata role reads");
}
