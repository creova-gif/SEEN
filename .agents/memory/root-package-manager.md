---
name: Root package manager
description: The root project is a pnpm-managed web app; npm at root breaks deployment.
---

The repo root is the SEEN web app (React 18 + MUI + Vite), managed by **pnpm**
(`pnpm-lock.yaml` is canonical; `package.json` has a `"pnpm".overrides` block).
The `/mobile` Expo app is separate and uses **npm** (`mobile/package-lock.json`).

**Rule:** Never run `npm install` at the project root. It generates a stray root
`package-lock.json`, creating dual lockfiles, and can leave `pnpm-lock.yaml` stale.

**Why:** Replit's static deployment installs root deps with a **frozen lockfile**.
A stale/ mismatched `pnpm-lock.yaml` (e.g. overrides not matching `package.json`)
fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` *before* the Vite build runs, so the
publish fails with no build record created. This actually happened after an
`npm install expo@^56` was mistakenly run at root.

**How to apply:** For root deps use `pnpm install`. After editing root
`package.json` overrides/deps, run `pnpm install --lockfile-only` to resync
`pnpm-lock.yaml`, and verify with `pnpm install --frozen-lockfile`. For mobile,
`cd mobile && npm install ... --legacy-peer-deps`.
