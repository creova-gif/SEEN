# Known deferred items

Owners are roles until named. P0 = blocks open beta · P1 = next sprint · P2 = soon · P3 = later.

| # | Item | Why deferred | Owner | Priority |
|---|---|---|---|---|
| D1 | Supabase adapter for `SeenApi` + Supabase Auth (replace local accounts) | Needs project access, migrations, RLS policies | Backend | P0 (open beta) |
| D2 | Server/RLS enforcement of roles and tenancy; two-tenant tests | Depends on D1 | Backend + Security | P0 |
| D3 | Decide real-organisation names in story data ("Canadian Museum of Immigration", "National Film Board") — confirm partnerships in writing or remove | Legal/product decision; left untouched | Founder | P0 |
| D4 | Real funding listings: source, editorial owner, apply links, `is_demo=false` | Product decision + data source | Product | P1 |
| D5 | Role-request approval UI in Admin | Needs D1 for real effect | Frontend | P1 |
| D6 | Library "Saved" tab (stories, collections, creators) and search across creators/collections | Scope | Frontend | P1 |
| D7 | Reader E2E + test ids; creator publish E2E | Legacy screens | QA | P1 |
| D8 | Commit lockfile, switch CI to `npm ci`; add ESLint | Changes Vercel install path; separate PR | DevOps | P1 |
| D9 | Promote CSP from Report-Only to enforcing | Needs one clean preview run | Security | P1 |
| D10 | Self-host story covers (Supabase Storage) — Unsplash hot-links fail on restricted networks | Depends on storage | Backend | P1 |
| D11 | Telemetry sink + Web Vitals | Choose sink | DevOps | P2 |
| D12 | FR/ES strings for new screens (i18n extraction) | Content is multilingual; UI strings EN | Content | P2 |
| D13 | Single BottomNav component; extract Input/Search/Password primitives; restyle onboarding, reader, creator money screens to tokens | Visual consistency, not function | Design systems | P2 |
| D14 | `tsconfig` `strict: true` | Large legacy surface | Frontend | P2 |
| D15 | Visual regression baselines | Needs self-hosted covers (D10) | QA | P2 |
| D16 | OTP sign-in, password reveal, social login | Needs D1; social login currently disabled with "coming soon" | Backend | P2 |
| D17 | Persistent mini media player (Figma Media Player Bar) | Global audio state | Frontend | P3 |
| D18 | Fraunces headings (Figma) vs Inter (live) — test with users | Brand decision | Design | P3 |
| D19 | Expo mobile app audit and parity | Out of scope this pass | Mobile | P3 |
| D20 | Stripe integration for subscriptions/payouts | Needs D1 + business setup | Backend | P2 |
