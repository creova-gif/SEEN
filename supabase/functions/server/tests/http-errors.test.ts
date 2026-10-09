// deno-lint-ignore-file -- vitest test; not part of the deployed function
/**
 * CRE-167: errors thrown outside route try/catch (middleware, requireRole's
 * getUser/kv.get, kv_store rethrowing error.message) reach app.onError, which must
 * log only errInfo fields and return a generic 500. Uses the real Hono router.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Hono } from "hono";
import { registerErrorHandlers } from "../http_errors.ts";
import { createAuthHandlers } from "../auth_handlers.ts";

const EMAIL = "grace.hopper@example.org";
const PASSWORD = "Sup3rSecretPass!";

let captured: string[];
let rawArgs: unknown[][];
beforeEach(() => {
  captured = [];
  rawArgs = [];
  for (const level of ["log", "info", "warn", "error", "debug"] as const) {
    vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
      rawArgs.push(args);
      captured.push(args.map((a) => (typeof a === "string" ? a : a instanceof Error ? `${a.message}\n${a.stack}` : JSON.stringify(a))).join(" "));
    });
  }
});
afterEach(() => vi.restoreAllMocks());

/** Error shaped like kv_store / Supabase errors that echo user data. */
function piiError() {
  const err = new Error(`duplicate key for ${EMAIL} (password=${PASSWORD})`);
  err.name = "PostgrestError";
  (err as any).code = "23505";
  return err;
}

function expectSafeLogs() {
  const all = captured.join("\n");
  expect(all).not.toContain(EMAIL);
  expect(all).not.toContain(PASSWORD);
  expect(all).not.toContain("duplicate key");
  expect(all).not.toMatch(/\n\s+at /); // no stack traces
  for (const args of rawArgs) for (const a of args) expect(typeof a).toBe("string");
  const allowed = new Set(["level", "event", "method", "path", "errorName", "errorCode", "errorStatus"]);
  const unhandled = captured.map((l) => JSON.parse(l)).filter((e) => e.event === "http.unhandled");
  expect(unhandled.length).toBeGreaterThan(0);
  for (const e of unhandled) {
    for (const k of Object.keys(e)) expect(allowed).toContain(k);
    expect(e.level).toBe("error");
  }
  return unhandled;
}

function makeApp() {
  const app = new Hono();
  registerErrorHandlers(app);
  return app;
}

describe("app.onError / app.notFound", () => {
  it("a throwing middleware gives a generic 500 and an errInfo-only log", async () => {
    const app = makeApp();
    app.use("*", async () => {
      throw piiError();
    });
    app.get("/x", (c) => c.json({ ok: true }));
    const res = await app.request("/x");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal error" });
    const [entry] = expectSafeLogs();
    expect(entry).toEqual({ level: "error", event: "http.unhandled", method: "GET", path: "/x", errorName: "PostgrestError", errorCode: "23505" });
  });

  it("a throwing route gives a generic 500 and an errInfo-only log", async () => {
    const app = makeApp();
    app.post("/boom", async () => {
      throw piiError();
    });
    const res = await app.request("/boom", { method: "POST", body: JSON.stringify({ email: EMAIL, password: PASSWORD }) });
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).toBe(JSON.stringify({ error: "Internal error" }));
    expectSafeLogs();
  });

  it("requireRole: kv.get throwing (kv_store rethrows error.message) is handled the same way", async () => {
    const app = makeApp();
    const auth = createAuthHandlers({
      supabaseAdmin: { auth: { getUser: async () => ({ data: { user: { id: "u1", app_metadata: {} } }, error: null }) } },
      getSupabaseClient: () => ({}),
      kv: {
        get: async () => {
          throw new Error(`relation lookup failed for ${EMAIL}`);
        },
        set: async () => {},
      },
    });
    app.get("/admin-only", auth.requireRole(["admin"]) as any, (c) => c.json({ ok: true }));
    const res = await app.request("/admin-only", { headers: { Authorization: "Bearer abc.def.ghi" } });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal error" });
    expectSafeLogs();
    expect(captured.join("\n")).not.toContain("abc.def.ghi");
  });

  it("requireRole: getUser throwing is handled the same way", async () => {
    const app = makeApp();
    const auth = createAuthHandlers({
      supabaseAdmin: { auth: { getUser: async () => { throw piiError(); } } },
      getSupabaseClient: () => ({}),
      kv: { get: async () => null, set: async () => {} },
    });
    app.get("/admin-only", auth.requireRole(["admin"]) as any, (c) => c.json({ ok: true }));
    const res = await app.request("/admin-only", { headers: { Authorization: "Bearer t" } });
    expect(res.status).toBe(500);
    expectSafeLogs();
  });

  it("unknown routes get a generic 404", async () => {
    const app = makeApp();
    const res = await app.request(`/make-server-2bdc05e6/users/${EMAIL}`);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
    expect(captured.join("\n")).not.toContain(EMAIL);
  });

  it("without the handlers Hono would log the raw error (regression check for the default)", async () => {
    const app = new Hono();
    app.get("/x", () => {
      throw piiError();
    });
    await app.request("/x");
    expect(captured.join("\n")).toContain(EMAIL);
  });
});
