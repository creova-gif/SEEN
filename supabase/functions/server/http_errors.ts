/**
 * App-level error and not-found handlers (CRE-167).
 *
 * Without app.onError, Hono's default handler calls console.error(err) with the raw
 * error object, so anything thrown outside a route's try/catch (requireRole's
 * getUser/kv.get, the CSRF and request-log middleware, kv_store errors that carry
 * error.message) would be logged with its message and stack. These handlers log only
 * errInfo fields and return generic bodies.
 */
import { errInfo, log } from "./safe_log.ts";

// deno-lint-ignore no-explicit-any
type AnyCtx = { req: { method: string; path: string }; json: (body: any, status?: any) => any };

export function onAppError(err: unknown, c: AnyCtx) {
  log.error("http.unhandled", { method: c.req.method, path: c.req.path, ...errInfo(err) });
  return c.json({ error: "Internal error" }, 500);
}

export function onNotFound(c: AnyCtx) {
  return c.json({ error: "Not found" }, 404);
}

/** Install both handlers on a Hono app. */
// deno-lint-ignore no-explicit-any
export function registerErrorHandlers(app: { onError: (h: any) => unknown; notFound: (h: any) => unknown }) {
  app.onError(onAppError);
  app.notFound(onNotFound);
}
