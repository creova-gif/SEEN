# Live app audit (production = `main@707b179`)

Method: headless Chromium (Playwright) against a local build of the deployed
commit, at 390×844, walking every reachable route as a new viewer and as each
role. Each finding was reproduced before it was fixed; the fix commit is listed.

## Route walk

| # | Screen | How reached | Result at baseline |
|---|---|---|---|
| 1 | Splash / language | first visit | OK |
| 2 | Onboarding: purpose → role → intent → account → accessibility → presence → threshold | first visit | Works. Social login buttons are permanently disabled ("coming soon"). Password rules list centred and misaligned |
| 3 | For You | after onboarding | Loads. Header **Search** and **Profile** buttons do nothing. Stats show "0 Tracks resonating / 0 Films living / 0 Collections forming" (no such content exists). All covers broken when Unsplash is unreachable; alt text spills across cards |
| 4 | Explore | bottom nav | Loads. Music / Films / Collections filters can never match (every item is type `story`) → always "No content found". Same dead header buttons |
| 5 | Library | bottom nav | Loads. Tabs are `div`s (not keyboard-operable). Remove button only appears on mouse hover (unusable on touch and keyboard) and deletes with no confirmation. Subtitle promises "saved" items that the screen never shows |
| 6 | Profile | bottom nav | Loads. "Following" removed earlier because no follow graph existed |
| 7 | Search | only from Library/Profile header | Opens. **Selecting a result immediately bounces back to For You** (select + close both fired) |
| 8 | Story preview → chapter → chapter index | tap a story | Works |
| 9 | About | Profile | **Close button crashes** (`onClose` passed as `onBack`) |
| 10 | Institutional Collections | Profile (admin) | **Crashes on open** — rendered with no data (`stories.map` of undefined) |
| 11 | Branching choice overlay | stories with branches | **Crashes** — calls undefined `getTextHelper` |
| 12 | Creator publish / monetization / earnings / subscriptions / moderation / admin | Profile, by role | Render. No route guard: reachable by any role that can reach Profile items |
| 13 | "See all" (every section header) | For You / Explore | **No handler anywhere** |

## Cross-cutting findings

- **No URLs.** The whole app is one URL; browser back leaves the app, refresh returns to For You, nothing is linkable.
- **Duplicated navigation.** For You, Explore and Library each define their own private bottom-nav component; a fourth shared `BottomNavigation` is unused.
- **Card alignment.** Every feed wrapped the card button in a second clickable `div` and overlaid a type badge exactly on top of the card's own category badge (visible overlap in the Featured rail). Descriptions were passed as the creator line. Rail cards had no reserved title height, so rows were ragged.
- **Contrast.** Secondary text at white/30–45 on black (~3.9:1) fails WCAG AA on every screen (axe `color-contrast`, serious).
- **Performance.** `EmptyState` imported all of `lucide-react` (`import * as Icons`) — ~1,500 icons in the main chunk.
- **Honesty issues.** Zero-count stats for non-existent media types; demo checkout "succeeded" for any card number.
- **Real organisations named as partners.** Two stories list "Canadian Museum of Immigration" and "National Film Board" as `institutionalPartner`. Flagged as a product/legal decision (see `KNOWN_DEFERRED_ITEMS.md`); left unchanged.

All items above except the partner-name decision and social login are fixed on
`claude/clever-gates-cs9out`; see `docs/product/MASTER_FEATURE_MATRIX.md`.
