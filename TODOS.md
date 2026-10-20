# TODOS

Deferred by the 6 Oct 2026 plan review (CEO phase). Each item is out of the current beta scope and keeps its reason.

- **P2 Global offline notice.** What: one offline notice on every screen, with write actions explaining why they are disabled. Why deferred: touches every screen while the schedule is at risk. Sign-in already shows one. Effort: S. Priority: P2.
- **P3 Mid-session session-expired notice.** What: show the expiry notice when a session ends during use, not only on the next sign-in screen. Why deferred: the 7-day expiry and the sign-in notice already shipped. Effort: S. Priority: P3.
- **P4 EN/FR/ES report-reason strings.** What: reviewed French and Spanish copy for the report sheet. Why deferred: needs reviewed copy. Effort: M. Priority: P2.
- **P5 Undo on report dismiss.** What: let a moderator undo a dismissal. Why deferred: not needed for the beta. Effort: S. Priority: P3.

## Customer feedback round (requirements: `docs/product/SEEN_PRODUCT_REQUIREMENTS.md`)

Engineering tasks for approved requirements only. Items awaiting product approval (PR-7, PR-8, PR-9) are tracked in the requirements doc and are not tasks yet. Status: `[x]` done, `[ ]` to do.

- [x] **PR-1 Five-tab bar, role-aware Create, creator intro.** Done on `feature/guest-mode-and-create-tab`; tests in `guest.test.tsx` and `e2e/guest.spec.ts`. Not yet reviewed on a real phone.
- [ ] **PR-1 Responsive For You hero (DT3).** About 55% of the visible height, max 520 px, dvh, scrim kept. Verify: `for-you-alignment.spec.ts` plus 320/360/390 checks. Effort: S. Priority: P1.
- [x] **PR-2 "Your stories" entry.** Link in the publish flow header and in Profile, creators and admins only. Verify: e2e role check and the `routes.test.ts` matrix. Effort: S. Priority: P1.
- [x] **PR-3 Re-tap active tab scrolls to top.** Replace the ignored re-tap in `BottomNav`/`App`; instant under reduced motion; change the "ignores re-taps" unit test to the new behavior. Effort: S. Priority: P1.
- [x] **PR-4 Chapter-end Next.** Show Next when a chapter ends, no auto-advance; guests get the sign-in sheet. Verify: e2e plus `playback-continuity.spec.ts` unchanged. Effort: S. Priority: P1.
- [ ] **PR-5 Single interest chip row.** Replace the interests rail and any separate filter; guests see popular topics. Verify: no overflow at 320 px, keyboard and axe. Effort: M. Priority: P2.
- [ ] **PR-6 First-screen poster and motion background.** Poster first, size cap, no video under reduced motion or data saver; the protected first-screen e2e test must pass unchanged. Blocked on the owner supplying original artwork (U2). Effort: M. Priority: P2.
