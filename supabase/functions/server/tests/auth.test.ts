// deno-lint-ignore-file -- vitest test with loose fakes; not part of the deployed function
/**
 * CRE-167: signup cannot create admins, user_metadata cannot grant roles, and
 * signup/login never log credentials or PII.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthHandlers, type Ctx } from "../auth_handlers.ts";
import { resolveEffectiveRole, resolveSignupRole } from "../auth_policy.ts";
import { errInfo, sanitizeFields } from "../safe_log.ts";

const PASSWORD = "Sup3rSecretPass!";
const EMAIL = "ada.lovelace@example.org";
const NAME = "Ada Lovelace";

type FakeUser = { id: string; email: string; app_metadata: Record<string, unknown>; user_metadata: Record<string, unknown> };

function makeBackend() {
  const users = new Map<string, FakeUser>();
  const passwords = new Map<string, string>();
  const tokens = new Map<string, string>(); // token -> user id
  const kvStore = new Map<string, any>();
  let seq = 0;

  const supabaseAdmin = {
    auth: {
      admin: {
        createUser: vi.fn(async (attrs: any) => {
          if ([...users.values()].some((u) => u.email === attrs.email)) {
            return { data: { user: null }, error: { name: "AuthApiError", code: "email_exists", status: 422, message: `A user with email ${attrs.email} has already been registered` } };
          }
          const id = `user_${++seq}`;
          const user: FakeUser = { id, email: attrs.email, app_metadata: { ...(attrs.app_metadata ?? {}) }, user_metadata: { ...(attrs.user_metadata ?? {}) } };
          users.set(id, user);
          passwords.set(id, attrs.password);
          return { data: { user }, error: null };
        }),
        createSession: vi.fn(async ({ user_id }: { user_id: string }) => {
          const token = `tok_${user_id}`;
          tokens.set(token, user_id);
          return { data: { session: { access_token: token, refresh_token: `ref_${user_id}` } }, error: null };
        }),
        getUserById: vi.fn(async (id: string) => {
          const user = users.get(id);
          return user ? { data: { user }, error: null } : { data: { user: null }, error: { name: "AuthApiError", status: 404 } };
        }),
        listUsers: vi.fn(async ({ page = 1, perPage = 50 }: { page?: number; perPage?: number } = {}) => {
          const all = [...users.values()];
          return { data: { users: all.slice((page - 1) * perPage, page * perPage) }, error: null };
        }),
        updateUserById: vi.fn(async (id: string, attrs: any) => {
          const user = users.get(id)!;
          if (attrs.app_metadata) user.app_metadata = attrs.app_metadata;
          if (attrs.user_metadata) user.user_metadata = attrs.user_metadata;
          return { data: { user }, error: null };
        }),
      },
      getUser: vi.fn(async (token: string) => {
        const id = tokens.get(token);
        const user = id ? users.get(id) : undefined;
        return user ? { data: { user }, error: null } : { data: { user: null }, error: { name: "AuthApiError", status: 401 } };
      }),
    },
  };

  const getSupabaseClient = () => ({
    auth: {
      signInWithPassword: vi.fn(async ({ email, password }: { email: string; password: string }) => {
        const user = [...users.values()].find((u) => u.email === email);
        if (!user || passwords.get(user.id) !== password) {
          return { data: { user: null, session: null }, error: { name: "AuthApiError", status: 400, code: "invalid_credentials", message: `Invalid login credentials for ${email}` } };
        }
        const token = `tok_${user.id}`;
        tokens.set(token, user.id);
        return { data: { user, session: { access_token: token, refresh_token: `ref_${user.id}` } }, error: null };
      }),
    },
  });

  const kv = {
    get: vi.fn(async (key: string) => kvStore.get(key) ?? null),
    set: vi.fn(async (key: string, value: unknown) => {
      kvStore.set(key, structuredClone(value));
    }),
  };

  /** Simulates a user editing their own user_metadata (supabase.auth.updateUser). */
  const selfUpdateUserMetadata = (id: string, data: Record<string, unknown>) => {
    const user = users.get(id)!;
    user.user_metadata = { ...user.user_metadata, ...data };
  };

  /** Simulates an operator creating a user directly in the DB / dashboard. */
  const seedUser = (user: FakeUser, profile?: Record<string, unknown>) => {
    users.set(user.id, user);
    tokens.set(`tok_${user.id}`, user.id);
    if (profile) kvStore.set(`user_profile:${user.id}`, profile);
  };

  const handlers = createAuthHandlers({ supabaseAdmin, getSupabaseClient, kv, randomId: () => "r1" });
  return { handlers, users, kvStore, supabaseAdmin, selfUpdateUserMetadata, seedUser };
}

function ctx(opts: { body?: unknown; token?: string; params?: Record<string, string>; path?: string } = {}) {
  const store = new Map<string, unknown>();
  const res: { status?: number; body?: any } = {};
  const c: Ctx = {
    req: {
      json: async () => {
        if (opts.body === undefined) throw new SyntaxError("no body");
        return structuredClone(opts.body);
      },
      header: (name: string) => (name.toLowerCase() === "authorization" && opts.token ? `Bearer ${opts.token}` : undefined),
      param: (name: string) => opts.params?.[name],
      path: opts.path ?? "/test",
    },
    json: (body: unknown, status = 200) => {
      res.status = status;
      res.body = body;
      return body;
    },
    get: (key: string) => store.get(key),
    set: (key: string, value: unknown) => store.set(key, value),
  };
  return { c, res, store };
}

/** Run a protected handler behind requireRole and report whether it was reached. */
async function callProtected(handlers: ReturnType<typeof makeBackend>["handlers"], roles: any[], token: string) {
  const { c, res } = ctx({ token });
  let reached = false;
  await handlers.requireRole(roles)(c, () => {
    reached = true;
  });
  return { reached, status: res.status ?? 200, body: res.body };
}

const signupBody = (extra: Record<string, unknown> = {}) => ({ email: EMAIL, password: PASSWORD, name: NAME, language: "en", intent: "explore", ...extra });

describe("auth_policy", () => {
  it("only viewer and creator are self-serve; everything else becomes viewer", () => {
    expect(resolveSignupRole("viewer")).toBe("viewer");
    expect(resolveSignupRole("creator")).toBe("creator");
    expect(resolveSignupRole("admin")).toBe("viewer");
    expect(resolveSignupRole("moderator")).toBe("viewer");
    expect(resolveSignupRole("ADMIN")).toBe("viewer");
    expect(resolveSignupRole(undefined)).toBe("viewer");
    expect(resolveSignupRole({ role: "admin" })).toBe("viewer");
  });

  it("effective role ignores user_metadata and legacy KV admin/moderator", () => {
    const selfAdmin = { app_metadata: {}, user_metadata: { role: "admin" } };
    expect(resolveEffectiveRole(selfAdmin, null)).toBe("viewer");
    expect(resolveEffectiveRole(selfAdmin, { role: "admin" })).toBe("viewer");
    expect(resolveEffectiveRole({ app_metadata: {} }, { role: "moderator" })).toBe("viewer");
    expect(resolveEffectiveRole({ app_metadata: {} }, { role: "creator" })).toBe("creator");
    expect(resolveEffectiveRole({ app_metadata: { role: "admin" } }, { role: "viewer" })).toBe("admin");
    expect(resolveEffectiveRole({ app_metadata: { role: "superuser" } }, null)).toBe("viewer");
  });
});

describe("signup", () => {
  it("role=admin produces a viewer, whatever else the client sends", async () => {
    const be = makeBackend();
    const { c, res } = ctx({
      body: signupBody({ role: "admin", isAdmin: true, is_admin: true, user_metadata: { role: "admin" }, app_metadata: { role: "admin" } }),
    });
    await be.handlers.signup(c);

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe("viewer");
    const created = be.supabaseAdmin.auth.admin.createUser.mock.calls[0][0];
    expect(created.app_metadata).toEqual({ role: "viewer" });
    expect(created.user_metadata).not.toHaveProperty("role");
    expect(created.user_metadata).not.toHaveProperty("isAdmin");
    const id = res.body.user.id;
    expect(be.kvStore.get(`user_profile:${id}`).role).toBe("viewer");

    const adminRoute = await callProtected(be.handlers, ["admin"], `tok_${id}`);
    expect(adminRoute.reached).toBe(false);
    expect(adminRoute.status).toBe(403);
    const modRoute = await callProtected(be.handlers, ["moderator", "admin"], `tok_${id}`);
    expect(modRoute.reached).toBe(false);
  });

  it("role=moderator becomes viewer; creator stays creator; missing or unknown role defaults to viewer (no error)", async () => {
    for (const [requested, expected] of [["moderator", "viewer"], ["creator", "creator"], [undefined, "viewer"], ["root", "viewer"]] as const) {
      const be = makeBackend();
      const { c, res } = ctx({ body: signupBody(requested === undefined ? {} : { role: requested }) });
      await be.handlers.signup(c);
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe(expected);
    }
  });

  it("does not return raw Supabase errors to the client", async () => {
    const be = makeBackend();
    await be.handlers.signup(ctx({ body: signupBody() }).c);
    const { c, res } = ctx({ body: signupBody() });
    await be.handlers.signup(c);
    expect(res.status).toBe(409);
    expect(res.body).not.toHaveProperty("details");
    expect(JSON.stringify(res.body)).not.toContain(EMAIL);
  });
});

describe("requireRole", () => {
  it("rejects a user who sets user_metadata.role=admin on themselves", async () => {
    const be = makeBackend();
    const { c, res } = ctx({ body: signupBody({ role: "viewer" }) });
    await be.handlers.signup(c);
    const id = res.body.user.id;
    be.selfUpdateUserMetadata(id, { role: "admin", isAdmin: true });

    const result = await callProtected(be.handlers, ["admin"], `tok_${id}`);
    expect(result.reached).toBe(false);
    expect(result.status).toBe(403);
    expect(result.body).not.toHaveProperty("current");
  });

  it("rejects a pre-fix self-signed admin (KV role admin, no app_metadata role)", async () => {
    const be = makeBackend();
    be.seedUser(
      { id: "legacy", email: "legacy@example.org", app_metadata: {}, user_metadata: { role: "admin" } },
      { id: "legacy", role: "admin" },
    );
    const result = await callProtected(be.handlers, ["admin"], "tok_legacy");
    expect(result.reached).toBe(false);
    expect(result.status).toBe(403);
  });

  it("accepts an admin whose role is in app_metadata (server-controlled)", async () => {
    const be = makeBackend();
    be.seedUser({ id: "op", email: "op@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "op", role: "viewer" });
    const result = await callProtected(be.handlers, ["admin"], "tok_op");
    expect(result.reached).toBe(true);
  });
});

describe("signin", () => {
  it("rebuilds a missing profile as viewer, ignoring user_metadata.role", async () => {
    const be = makeBackend();
    const signup = ctx({ body: signupBody({ role: "viewer" }) });
    await be.handlers.signup(signup.c);
    const id = signup.res.body.user.id;
    be.selfUpdateUserMetadata(id, { role: "admin" });
    be.kvStore.delete(`user_profile:${id}`);

    const { c, res } = ctx({ body: { email: EMAIL, password: PASSWORD } });
    await be.handlers.signin(c);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe("viewer");
    expect(be.kvStore.get(`user_profile:${id}`).role).toBe("viewer");
  });

  it("returns a generic error that does not echo the email", async () => {
    const be = makeBackend();
    const { c, res } = ctx({ body: { email: EMAIL, password: "Wrong1234" } });
    await be.handlers.signin(c);
    expect(res.status).toBe(401);
    expect(JSON.stringify(res.body)).not.toContain(EMAIL);
  });
});

describe("grantRole (admin-only path)", () => {
  it("is blocked for non-admins by requireRole(['admin'])", async () => {
    const be = makeBackend();
    const { c, res } = ctx({ body: signupBody({ role: "admin" }) });
    await be.handlers.signup(c);
    const result = await callProtected(be.handlers, ["admin"], `tok_${res.body.user.id}`);
    expect(result.reached).toBe(false);
  });

  it("writes app_metadata and KV, and audit-logs actor id, target id and role only", async () => {
    const be = makeBackend();
    be.seedUser({ id: "op", email: "op@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "op", role: "admin" });
    const signup = ctx({ body: signupBody() });
    await be.handlers.signup(signup.c);
    const targetId = signup.res.body.user.id;

    const logs = vi.spyOn(console, "log").mockImplementation(() => {});
    const { c, res } = ctx({ token: "tok_op", params: { userId: targetId }, body: { role: "moderator" } });
    let reached = false;
    await be.handlers.requireRole(["admin"])(c, async () => {
      reached = true;
      await be.handlers.grantRole(c);
    });
    expect(reached).toBe(true);
    expect(res.body).toEqual({ userId: targetId, role: "moderator" });
    expect(be.users.get(targetId)!.app_metadata.role).toBe("moderator");
    expect(be.kvStore.get(`user_profile:${targetId}`).role).toBe("moderator");

    const audits = [...be.kvStore.entries()].filter(([k]) => k.startsWith("audit_role_grant:"));
    expect(audits).toHaveLength(1);
    expect(audits[0][1]).toEqual({ actorId: "op", targetId, role: "moderator" });
    const auditLine = logs.mock.calls.map((a) => String(a[0])).find((l) => l.includes("audit.role_grant"))!;
    expect(JSON.parse(auditLine)).toEqual({ level: "info", event: "audit.role_grant", actorId: "op", targetId, role: "moderator" });

    const granted = await callProtected(be.handlers, ["moderator", "admin"], `tok_${targetId}`);
    expect(granted.reached).toBe(true);
  });
});

describe("grantRole guards", () => {
  async function grant(be: ReturnType<typeof makeBackend>, actorToken: string, targetId: string, role: string) {
    const { c, res } = ctx({ token: actorToken, params: { userId: targetId }, body: { role } });
    await be.handlers.requireRole(["admin"])(c, () => be.handlers.grantRole(c));
    return res;
  }

  it("an admin cannot change their own role", async () => {
    const be = makeBackend();
    be.seedUser({ id: "op", email: "op@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "op", role: "admin" });
    const res = await grant(be, "tok_op", "op", "viewer");
    expect(res.status).toBe(403);
    expect(be.users.get("op")!.app_metadata.role).toBe("admin");
    expect([...be.kvStore.keys()].some((k) => k.startsWith("audit_role_grant:"))).toBe(false);
  });

  it("refuses to demote the last admin", async () => {
    const be = makeBackend();
    be.seedUser({ id: "op", email: "op@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "op", role: "admin" });
    be.seedUser({ id: "a2", email: "a2@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "a2", role: "admin" });
    // Simulate the actor having been demoted concurrently: only a2 is still an admin when counted.
    be.supabaseAdmin.auth.admin.listUsers.mockImplementationOnce(async () => ({
      data: { users: [be.users.get("a2")!] },
      error: null,
    }));
    const res = await grant(be, "tok_op", "a2", "viewer");
    expect(res.status).toBe(409);
    expect(be.users.get("a2")!.app_metadata.role).toBe("admin");
  });

  it("allows demoting an admin when another admin remains", async () => {
    const be = makeBackend();
    be.seedUser({ id: "op", email: "op@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "op", role: "admin" });
    be.seedUser({ id: "a2", email: "a2@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "a2", role: "admin" });
    const res = await grant(be, "tok_op", "a2", "moderator");
    expect(res.status).toBe(200);
    expect(be.users.get("a2")!.app_metadata.role).toBe("moderator");
  });

  it("fails closed if the admin count cannot be read", async () => {
    const be = makeBackend();
    be.seedUser({ id: "op", email: "op@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "op", role: "admin" });
    be.seedUser({ id: "a2", email: "a2@example.org", app_metadata: { role: "admin" }, user_metadata: {} }, { id: "a2", role: "admin" });
    be.supabaseAdmin.auth.admin.listUsers.mockImplementationOnce(async () => ({ data: null, error: { name: "AuthApiError", status: 500 } }) as any);
    const res = await grant(be, "tok_op", "a2", "viewer");
    expect(res.status).toBe(500);
    expect(be.users.get("a2")!.app_metadata.role).toBe("admin");
  });
});

describe("logging during signup and login", () => {
  let captured: string[];
  beforeEach(() => {
    captured = [];
    for (const level of ["log", "info", "warn", "error", "debug"] as const) {
      vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
        captured.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
      });
    }
  });
  afterEach(() => vi.restoreAllMocks());

  it("never contains the password, email or name", async () => {
    const be = makeBackend();
    // success, validation failures, duplicate email, and failed + successful sign in
    await be.handlers.signup(ctx({ body: signupBody({ role: "admin" }) }).c);
    await be.handlers.signup(ctx({ body: signupBody({ role: "admin" }) }).c);
    await be.handlers.signup(ctx({ body: { email: EMAIL, password: "short", name: NAME } }).c);
    await be.handlers.signup(ctx({ body: { email: "not-an-email", password: PASSWORD, name: NAME } }).c);
    await be.handlers.signup(ctx({ body: { password: PASSWORD } }).c);
    await be.handlers.signin(ctx({ body: { email: EMAIL, password: "Wrong1234x" } }).c);
    await be.handlers.signin(ctx({ body: { email: EMAIL, password: PASSWORD } }).c);
    await be.handlers.signin(ctx({ body: { email: EMAIL } }).c);

    expect(captured.length).toBeGreaterThan(0);
    const all = captured.join("\n");
    for (const secret of [PASSWORD, "Wrong1234x", EMAIL, "ada.lovelace", NAME, "tok_", "ref_"]) {
      expect(all).not.toContain(secret);
    }
    expect(all).not.toContain("@");
    // Every line is a structured event made only of ids, statuses and error names.
    const allowedKeys = new Set(["level", "event", "userId", "role", "reason", "errorName", "errorCode", "errorStatus"]);
    for (const line of captured) {
      for (const key of Object.keys(JSON.parse(line))) expect(allowedKeys).toContain(key);
    }
  });
});

describe("safe_log", () => {
  it("drops sensitive keys and redacts email/token-looking values", () => {
    const out = sanitizeFields({
      userId: "u1",
      email: EMAIL,
      password: PASSWORD,
      access_token: "abc",
      name: NAME,
      note: `contact ${EMAIL} with Bearer abc.def.ghi`,
    });
    expect(out).toEqual({ userId: "u1", note: "contact [redacted-email] with [redacted-token]" });
  });

  it("errInfo keeps only name, code and status", () => {
    expect(errInfo({ name: "AuthApiError", code: "email_exists", status: 422, message: `exists: ${EMAIL}` })).toEqual({
      errorName: "AuthApiError",
      errorCode: "email_exists",
      errorStatus: 422,
    });
  });
});
