# SEEN — development guide

SEEN by CREOVA: a mobile-first web app for multilingual (EN/FR/ES) community story worlds — stories, creators, collections, funding for storytellers. Production: https://seen-sigma-eight.vercel.app (Vercel, deploys `main`).

## Commands

```bash
npm install
npm run dev          # Vite dev server
npm run typecheck    # must be 0 errors
npm test             # Vitest unit + component tests
npm run test:e2e     # Playwright journeys + axe (sandbox: PW_CHROMIUM_PATH=/opt/pw-browsers/chromium)
npm run check        # typecheck + test + build
```

## Where things are

- `src/app/App.tsx` — screen state, hash URL sync, role guards, providers. Screens/URLs/roles: `src/app/navigation/routes.ts`. Navigation from anywhere: `useAppNav()`.
- `src/app/services/` — feature data behind typed contracts (`contracts.ts`); `api` currently uses the demo adapter (`services/demo/`). Never import the adapter directly.
- `src/app/components/seen/` — design-system primitives and Figma organisms; tokens in `src/styles/seen-tokens.css`.
- `src/app/data/storyDatabase.ts` — the story catalogue (single source of truth; chapters via `CHAPTERS_REGISTRY`).
- `archive/` — unreachable code kept for history/content. Not built, not type-checked; don't import from it.
- Docs: `docs/` (start with `docs/release/RELEASE_READINESS.md`, `docs/product/MASTER_FEATURE_MATRIX.md`). `docs/archive/` is historical and its "complete/ready" claims are not current.

## Rules

- Cards are the single tap target; use `typeLabel`/`badge` slots, never overlay badges or wrap cards in clickable divs.
- No dead buttons: render "See all"/actions only when wired.
- Every async surface uses `useResource` + `ResourceView` (loading, empty, error+retry, offline, stale).
- Mutations are optimistic with rollback and a toast; never show success before the write succeeds.
- Secondary text is `text-white/55` or `text-seen-muted` (AA contrast); touch targets ≥ 44 px.
- Demo data must be labelled (`isDemo`) and derived from real catalogue data where possible.
- Role checks in the UI are UX only; real enforcement belongs in the backend (see `docs/security/`).
- Analytics: only `track()` with allow-listed events and id/enum properties — no names, emails, free text.
