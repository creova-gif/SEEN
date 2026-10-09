/**
 * CRE-167 lint guard: fails if a request body, password, token, email or other PII
 * reaches a console/log call in any edge function, or if code reads a role from
 * user_metadata. Same check as `npm run lint:server`.
 */
import { describe, expect, it } from "vitest";
import path from "node:path";
// @ts-expect-error plain .mjs module without type declarations
import { findViolations, scanServerLogs } from "../../../../scripts/server-log-guard.mjs";

const repoRoot = path.resolve(__dirname, "../../../..");
const rules = (src: string) => findViolations(src, "sample.ts").map((v: { rule: string }) => v.rule);

describe("server log guard", () => {
  it("finds no violations in supabase/functions", () => {
    expect(scanServerLogs(repoRoot)).toEqual([]);
  });

  it.each([
    ['console.log("Signup request received - full body:", JSON.stringify(body));', "request-body"],
    ['console.log("pw", password);', "password"],
    ["console.log({ password: password ? '***' : 'MISSING' });", "password"],
    ['console.log("Sign in request received for:", email);', "email"],
    ["log.info('account.deleted', { userId: user.id, email: user.email });", "email"],
    ["console.log(accessToken);", "token"],
    ["console.warn(c.req.header('Authorization'));", "auth-header"],
    ['console.error("Supabase auth error during signup:", error);', "raw-error-object"],
    ["console.log({ name });", "name"],
    ["console.warn('CSRF', { origin, referer, host });", "request-metadata"],
    ["const role = data.user.user_metadata?.role || 'viewer';", "user-metadata-role-read"],
    ['import { logger } from "npm:hono/logger";', "hono-logger"],
    ['console.log("plain");', "direct-console"],
    ["log.info('signup.created', body);", "object-variable"],
    ["log.info('signin.succeeded', { ...profile });", "object-spread-variable"],
    ["log.info('signin.succeeded', { user });", "object-variable"],
    ["log.warn('x', { snapshot: data });", "object-variable"],
    ["const { role } = user.user_metadata;", "user-metadata-role-read"],
    ["const { isAdmin, name } = data.user.user_metadata ?? {};", "user-metadata-role-read"],
    ["function f({ user_metadata: { role } }) { return role; }", "user-metadata-role-read"],
  ])("flags %s", (src, rule) => {
    expect(rules(src)).toContain(rule);
  });

  it("allows ids, statuses, error names and string-literal event text", () => {
    expect(rules("log.warn('signup.rejected', { reason: 'weak_password' });")).toEqual([]);
    expect(rules("log.error('signin.failed', { userId, ...errInfo(error) });")).toEqual([]);
    expect(rules("log.info('http.request', { method, path: c.req.path, status: 201 });")).toEqual([]);
    expect(rules("log.error('http.unhandled', errInfo(err));")).toEqual([]);
    expect(rules("const { name } = user.user_metadata;")).toEqual([]);
  });
});
