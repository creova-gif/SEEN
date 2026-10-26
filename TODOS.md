# TODOS

Deferred by the 6 Oct 2026 plan review (CEO phase). Each item is out of the current beta scope and keeps its reason.

- **P2 Global offline notice.** What: one offline notice on every screen, with write actions explaining why they are disabled. Why deferred: touches every screen while the schedule is at risk. Sign-in already shows one. Effort: S. Priority: P2.
- **P3 Mid-session session-expired notice.** What: show the expiry notice when a session ends during use, not only on the next sign-in screen. Why deferred: the 7-day expiry and the sign-in notice already shipped. Effort: S. Priority: P3.
- **P4 EN/FR/ES report-reason strings.** What: reviewed French and Spanish copy for the report sheet. Why deferred: needs reviewed copy. Effort: M. Priority: P2.
- **P5 Undo on report dismiss.** What: let a moderator undo a dismissal. Why deferred: not needed for the beta. Effort: S. Priority: P3.

## Customer feedback round (requirements: `docs/product/SEEN_PRODUCT_REQUIREMENTS.md`)

Engineering tasks for approved requirements only. Items awaiting product approval (PR-7, PR-8, PR-9) are tracked in the requirements doc and are not tasks yet. Status: `[x]` done, `[ ]` to do.

- [x] **PR-1 Five-tab bar, role-aware Create, creator intro.** Done on `feature/guest-mode-and-create-tab`; tests in `guest.test.tsx` and `e2e/guest.spec.ts`. Not yet reviewed on a real phone.
- [x] **PR-1 Responsive For You hero (DT3).** About 55% of the visible height, max 520 px, dvh, scrim kept. Verify: `for-you-alignment.spec.ts` plus 320/360/390 checks. Effort: S. Priority: P1.
- [x] **PR-2 "Your stories" entry.** Link in the publish flow header and in Profile, creators and admins only. Verify: e2e role check and the `routes.test.ts` matrix. Effort: S. Priority: P1.
- [x] **PR-3 Re-tap active tab scrolls to top.** Replace the ignored re-tap in `BottomNav`/`App`; instant under reduced motion; change the "ignores re-taps" unit test to the new behavior. Effort: S. Priority: P1.
- [x] **PR-4 Chapter-end Next.** Show Next when a chapter ends, no auto-advance; guests get the sign-in sheet. Verify: e2e plus `playback-continuity.spec.ts` unchanged. Effort: S. Priority: P1.
- [x] **PR-5 Single interest chip row.** Replace the interests rail and any separate filter; guests see popular topics. Verify: no overflow at 320 px, keyboard and axe. Effort: M. Priority: P2.
- [x] **PR-6 First-screen motion background (code-drawn).** Done; real footage or a photo poster is still blocked on the owner supplying it (U2). Original entry: Poster first, size cap, no video under reduced motion or data saver; the protected first-screen e2e test must pass unchanged. Blocked on the owner supplying original artwork (U2). Effort: M. Priority: P2.

## Engineering hygiene (from the first-beta plan review)

- [ ] **Figma sync.** Update the Figma file to match approved decisions: guest sheet 348:99 (add the Sign in link and trigger copy), 407:2 and 334:46 (review wording; fix the body text running behind the status card in 334:46), 316:2 (responsive hero), 248:163 (sentence-case labels, five tabs), and mark guest-explore 10:444 as the guest state. Why: keeps design and product in sync so a later audit does not revert approved choices. Needs a Figma editor, about half a day. Priority: P3.
- [ ] **Strict TypeScript.** `tsconfig.json` has `"strict": false`. Turn on `strict` (then `noUnusedLocals`) in stages, one folder at a time, starting with `src/app/services/` and `src/app/guest/`, keeping `npm run typecheck` at zero errors at each step. Effort: M to L. Priority: P3.
- [ ] **Bundle budget.** Re-measured 20 Oct 2026 on `feature/guest-mode-and-create-tab`: entry chunk 97.5 KB gzip (366.9 KB raw), up from about 93 KB before guest mode. Add a CI check that fails when the entry chunk passes 110 KB gzip, and keep heavy screens lazy (the largest lazy chunk, creator earnings, is 100 KB gzip). Effort: S. Priority: P3.
- [ ] **Close stale PRs.** Close #12 and #23 with a pointer comment; compare #14 with `dev`, port any missing fix as a new small change, then close #14 (decision D10). Needs the owner to say go, since closing PRs is visible to others. Priority: P2.

## Store apps and foldables (decision: `docs/product/SEEN_PRODUCT_REQUIREMENTS.md`, "Direction change")

- [x] **Wider column and rotation for foldables.** `--seen-content-max` widens at 600 and 840 px; `orientation` is "default" in `mobile/app.json`; tests at fold-inner and flip sizes.
- [ ] **Two-pane layout.** From 840 px wide (and on dual-segment screens): list on the left, story or creator on the right, state kept when the phone folds or unfolds. Use the `horizontal-viewport-segments` media query and `env(viewport-segment-*)` for hinge-aware screens. Effort: L. Priority: P1.
- [ ] **Side navigation rail on wide screens.** Replace the bottom tab bar from 840 px. Effort: M. Priority: P2.
- [ ] **Background and lock-screen audio in the shell.** Native audio session so narration continues with the screen off; lock-screen controls. Needed for App Store review (4.2) and for the product. Effort: L. Priority: P1.
- [ ] **Push notifications.** `expo-notifications`, permission prompt at a sensible moment, token stored per account. Needs the backend phase. Effort: L. Priority: P1.
- [ ] **Offline reading in the shell.** Chapters saved for offline use, with a clear indicator. Effort: M. Priority: P1.
- [ ] **EAS build and submit setup.** Development, preview and production profiles, app icons and splash at store sizes, version and build numbers, Android signing. Needs the owner's Apple and Google accounts. Effort: M. Priority: P1.
- [ ] **Real-device pass on a phone, a foldable and a flip phone.** iOS and Android. Effort: M. Priority: P1.
