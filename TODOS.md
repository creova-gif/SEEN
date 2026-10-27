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
- [x] **Two-pane layout (from 840 px wide).** A 420 px list pane (current tab, header, tab bar, mini player) on the left and a detail pane on the right; tests in `e2e/guest.spec.ts`. Still to do: hinge-aware layout on dual-segment screens (`horizontal-viewport-segments`, `env(viewport-segment-*)`), and checking that state survives fold and unfold on a real foldable. Effort: M. Priority: P1.
- [ ] **Side navigation rail on wide screens.** Replace the bottom tab bar from 840 px. Effort: M. Priority: P2.
- [x] **Lock-screen controls and background audio (first step).** The web app sets the Media Session (title, creator, cover, play, pause, back and forward 15 s, scrub bar for recordings); the shell holds a playback audio session and declares the iOS `audio` background mode and the Android media-playback service permissions. Unit-tested only. Still to do: check on real iPhone and Android devices in an EAS development build (Expo Go ignores background modes); native text-to-speech for the device voice, which the system may pause in the background, or ship recorded narration (T14); a native audio player if the web view's audio proves unreliable on Android. Priority: P1.
- [ ] **Push notifications.** `expo-notifications`, permission prompt at a sensible moment, token stored per account. Needs the backend phase. Effort: L. Priority: P1.
- [ ] **Offline reading in the shell.** Chapters saved for offline use, with a clear indicator. Effort: M. Priority: P1.
- [ ] **EAS build and submit setup.** Development, preview and production profiles, app icons and splash at store sizes, version and build numbers, Android signing. Needs the owner's Apple and Google accounts. Effort: M. Priority: P1.
- [ ] **Real-device pass on a phone, a foldable and a flip phone.** iOS and Android. Effort: M. Priority: P1.

## Native app (the product is now the native app; see "Direction change" in the requirements doc)

- [x] **Native slice 1 (Expo SDK 58, React Native).** Five tabs, For You with hero and rails, Explore with topic chips and search, story page (languages line, fallback notice, chapters, save), reader with follow-along text and a native audio player (recordings through the system player with lock-screen controls; the device voice otherwise), Library from saved stories, Profile with the language switch. Reuses the website's story catalogue, strings and search. Bundles for iOS and Android; not yet run on a device by the owner.
- [x] **Native: first-run, sign-in, guest mode and the guest sheet.** Language, S.E.E.N entry with story-cover imagery, manifesto, purpose with "Explore without an account", account form (hashed, stored on the phone), the guest sheet for Save, Follow, Library, Create and chapters after the first; sign out. Accounts are local until the backend phase. Still to do: interests step, the guest banner, Profile account details, native tests of the screens. Priority: P1.
- [x] **Native: creator profiles** (banner, ringed avatar, stats, follow, share, featured story) and Explore creators tab. Done in slice 2.
- [ ] **Native: the Create flow** (intro, publish wizard, Your stories). Priority: P1.
- [ ] **Native: collections, funding, notifications, search screen, settings and account screens.** Priority: P2.
- [x] **Native: strings (first pass).** Chapters, content notes, search, library, language, account and Create placeholders are in `strings.ts` with FR and ES. Still English: a few reader labels (control names, "Recorded narration") and hero eyebrows. Priority: P2.
- [ ] **Native: two-pane layout on foldables and tablets** (list left, reader right) and hinge awareness. Priority: P1.
- [ ] **Native tests.** Add React Native Testing Library tests for the player, reader and navigation, and a Maestro or Detox journey on a device. Priority: P1.
- [ ] **Retire the web app as a product** once the native app covers the screens above; keep it only as a test bench or remove it. Priority: P2.
