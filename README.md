# SEEN by CREOVA

Multilingual (EN/FR/ES) community story worlds — stories, creators, collections and funding for storytellers.

- Production: https://seen-sigma-eight.vercel.app
- Design system: Figma `seen.io` (file `8WMBpUhanDkUjodZYolyDT`)

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + unit tests + build
npm run test:e2e   # Playwright journeys + accessibility scans
```

Demo test accounts (per browser, password `SeenDemo2026!`): `viewer@seen.demo`, `creator@seen.demo`, `moderator@seen.demo`, `admin@seen.demo`.
Add `?simulate=offline|error|slow` to the URL to exercise failure states.

## Docs

Start with [`docs/release/RELEASE_READINESS.md`](docs/release/RELEASE_READINESS.md) and the
[master feature matrix](docs/product/MASTER_FEATURE_MATRIX.md). Development conventions: [`CLAUDE.md`](CLAUDE.md).
