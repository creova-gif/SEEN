# CI / CD

Pipeline (`.github/workflows/ci.yml`, on every PR and push to `main`):

```
checkout → npm install → typecheck → unit/component tests → build → npm audit (prod, high+) → E2E + axe (Playwright, Chromium)
```
Vercel builds a preview for every PR and deploys `main` to production (Git integration).

## Gates

Do not merge when typecheck, tests, build, audit or E2E fail. Playwright reports and traces are uploaded as artifacts on failure.

## Not yet in the pipeline

| Item | Plan |
|---|---|
| Lockfile | `package-lock.json` is git-ignored, so CI uses `npm install` and builds are not byte-reproducible. Recommend committing the lockfile and switching CI to `npm ci` (one-line change; also affects Vercel installs — do it in its own PR) |
| Lint | Add ESLint (typescript-eslint, react-hooks, jsx-a11y) |
| E2E against the Vercel preview URL | Use `deployment_status` event with `BASE_URL` |
| DB migrations | With Supabase: `supabase/migrations/*.sql`, `supabase db push` on merge to `main`, staging first |
| Feature flags | Vercel Flags or env-driven flags for risky flows (payments, real funding listings) |
| Branch protection | Require the two CI jobs on `main` |
