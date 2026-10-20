# SEEN product requirements (customer feedback round, October 2026)

What the product should do, how we will know it does, and which decisions are still open. Engineering tasks live in `TODOS.md` and point back here. Earlier parked decisions stay in `PRODUCT_DECISIONS_PENDING.md`; guest mode and the Create tab are already built (design decisions 1A, 3A, 6A).

**Status words.** Approved: the owner decided it. Built: shipped on a branch. Awaiting approval: a recommendation, not a requirement; do not build it yet. Blocked: needs something outside engineering.

**Principles.** Reading feels uninterrupted. Creating is one tap away. Personalization never prevents discovery.

## Summary

| ID | Requirement | Status | Priority |
|---|---|---|---|
| PR-1 | Create tab and main-page sizing | Create tab built; hero sizing approved | High |
| PR-2 | Creator navigation: New story, Your stories | Approved | High |
| PR-3 | Bottom navigation and scroll behavior | Approved; nav built, re-tap to top not built | High |
| PR-4 | Chapter-end Next | Approved | High |
| PR-5 | Interest chips and back-to-top | Approved | Medium |
| PR-6 | Intro video behind the first screen | Approved as poster first; footage blocked | Medium |
| PR-7 | Chapter autoplay | Awaiting approval | Medium |
| PR-8 | "Here is your story" section | Awaiting approval | Medium |
| PR-9 | Expandable story description | Awaiting approval | Low |
| PR-10 | Brand refresh: palette, buttons, creator profiles | Blocked: brand reference not supplied | High |

## Approved requirements

### PR-1 Create tab and main-page sizing
- **Behavior.** Create is the middle of five tabs. Guests get the sign-in sheet; a signed-in non-creator sees the "Become a creator" intro once, then the publish flow; creators and admins go straight to the publish flow. The main-page hero and cards are sized so nothing sits behind the bar and the first story card is visible without scrolling.
- **Problem.** Creating is the core loop and was buried.
- **Built.** The five-tab bar, role-aware Create and the intro (tests: `guest.test.tsx`, `e2e/guest.spec.ts`).
- **Open work.** Hero resizing, about 55% of the visible height, max 520 px (design record DT3).
- **Acceptance.** At 320, 360 and 390 px wide and 568 and 844 px tall: the hero keeps its scrim and 4.5:1 text contrast, uses dvh, and the first card below it is at least partly visible; no control is clipped (`for-you-alignment.spec.ts` covers clipping).

### PR-2 Creator navigation: New story, Your stories
- **Behavior.** A creator reaches "New story" in one tap (the Create tab) and "Your stories" in one tap from the publish flow header and from Profile. Creators with a draft resume it.
- **Problem.** Creators cannot find their drafts or the state of what they submitted.
- **Why this shape.** Create goes straight to publishing for creators (decision 1A), so "Your stories" needs its own entry rather than a hub in front of the flow.
- **Acceptance.** A creator can go from any tab to Your stories in at most two taps. A viewer does not see the link. The role table in `routes.test.ts` still passes, and Your stories stays creator and admin only.

### PR-3 Bottom navigation and scroll behavior
- **Behavior.** The bottom bar stays visible while scrolling. Tapping the active tab again scrolls that screen to the top; tapping it when already at the top does nothing. Content never sits behind the bar or the mini player.
- **Problem.** People lose their place and cannot get back to the top of a long feed.
- **Built.** The fixed bar and bottom clearance (`ux-audit.spec.ts` checks nothing hides under it).
- **Open work.** Re-tap scrolls to top. Today a re-tap is ignored and a unit test asserts that; it changes to the new behavior.
- **Acceptance.** Re-tapping the active tab on For You, Explore, Library and Profile scrolls to the top, and `prefers-reduced-motion` makes it instant. The tab is still announced as the current page. Per-route scroll restoration on Back (decision 8 in `PRODUCT_DECISIONS_PENDING.md`) is unchanged.

### PR-4 Chapter-end Next
- **Behavior.** When a chapter ends, a clear "Next chapter" action is offered. It does not advance by itself. Guests who finish chapter 1 get the sign-in sheet; the last chapter shows the finish screen.
- **Problem.** Readers stall at the end of a chapter.
- **Acceptance.** Reaching the end of a chapter (read or listened) shows Next within one screen height; one tap moves to the next chapter and keeps narration continuity rules (one audio element, `playback-continuity.spec.ts`). The control is at least 44 px and named.

### PR-5 Interest chips and back-to-top
- **Behavior.** One horizontally scrollable row of interest chips replaces any separate rail and filter. The interests chosen at sign-up are preselected; guests, who skip interests, see popular topics. A back-to-top interaction uses the tab re-tap from PR-3. There is no floating button.
- **Problem.** The feed feels generic and long, and there are two ways to filter.
- **Acceptance.** Chips scroll sideways without page overflow at 320 px, are keyboard reachable, show their selected state with more than color, and a chip with no stories is not shown. Selecting none shows everything. Applied filters never hide the way back to the full catalogue.

### PR-6 Intro video behind the first screen
- **Behavior.** The first screen (the glowing S.E.E.N entry button, protected) gets an original poster image and a short motion concept first. Original or licensed footage can replace the motion later. It never delays, replaces or skips the first screen or the manifesto.
- **Problem.** The first screen does not show what SEEN is.
- **Constraints.** Muted. Poster shows immediately. A size cap for any video file. Reduced motion and data saver get the poster only. S.E.E.N and the entry button keep 4.5:1 contrast over any frame. No unlicensed footage.
- **Blocked.** The original poster artwork, and later footage, need an owner source (U2 in the engineering review).
- **Acceptance.** The e2e test that guards the first screen still passes unchanged; with motion reduced no video element loads; first-screen time to interactive does not regress.

## Awaiting approval (recommendations, not requirements)

These are interpretations of unclear feedback. Do not build them until the owner confirms.

### PR-7 Chapter autoplay ("auto plan or next on chapters")
- **Recommendation.** Read "auto plan" as autoplay. Manual Next stays the default (PR-4); autoplay is an opt-in setting. It stops where a guest would be asked to sign in and stops when the person leaves the story.
- **Confirm.** Does "auto plan" mean autoplay, or a reading plan (a schedule of chapters)?

### PR-8 "Here is your story" section
- **Recommendation.** A personalized reader section highlighting recommended stories, with a popular-content fallback for guests. Creator-owned stories stay under "Your stories" (PR-2). It does not re-rank the rest of the feed, matching decision 7 (no re-ranking; a "From creators you follow" rail only when relevant).
- **Confirm.** Is this recommendations, continue reading, or the creator's own work? Which screen is it on? Note the app already has a "Keep reading" row.

### PR-9 Expandable story description ("info collapsing")
- **Recommendation.** An expandable description with "Read more / Show less" that keeps the reader's position when it opens or closes.
- **Confirm.** The original feedback line was unfinished. Which screen, what collapses, and on what trigger?

## Blocked

### PR-10 Brand refresh (palette, buttons, creator profiles)
- **Request.** Audit the live site (`/#/for-you`) against the owner's brand reference, then apply the brand palette to buttons (primary, secondary, hover, active, focus, disabled), links, navigation, tags, progress, icons and other interactive elements, and redesign creator profiles and cards with a creative look using brand colors for accents, headers, borders, badges and highlights. Layout, functionality and content stay unchanged unless branding requires it. Text and buttons meet WCAG AA. Hex codes are used exactly as the reference defines them.
- **Deliverables.** A short brand audit (color codes and where each is used), the code changes by component, a before/after list of every element changed, and a list of places the guidelines were unclear.
- **Blocked.** The brand reference was not attached. Without it the hex codes would be guesses, which the request forbids.
- **Conflict to settle first.** Today's tokens come from the Figma design system (`seen-tokens.css`, `DESIGN_SYSTEM.md`): white primary buttons on a black canvas, with `#c084fc` as the one accent. "Replace default white and black buttons" changes that identity, so the owner should confirm that the new reference supersedes the Figma tokens, and whether the black canvas stays.
- **Acceptance.** Every color in the shipped CSS comes from the supplied reference or a documented status color (success, warning, error, info). Contrast is checked for every text and button pairing at AA (4.5:1 text, 3:1 large text and controls). Focus states stay visible. The protected first screens keep their content. The Figma sync item in `TODOS.md` is updated after the change.

## Overlaps resolved

- Create tab and creator navigation: the tab is New story; Your stories is a separate link (PR-1, PR-2).
- Interest rail and filters: one chip row (PR-5).
- Autoplay and the guest limit: autoplay stops where the sign-in sheet appears (PR-7).
- Intro video and fast onboarding: poster first, capped, with reduced-motion and data-saver fallbacks (PR-6).
- "Here is your story" and "Your stories": recommendations versus creator-owned work, kept apart (PR-8, PR-2).

## Delivery order

1. Navigation and usability: PR-1 hero sizing, PR-2, PR-3, PR-4.
2. Discovery: PR-5. PR-8 only after it is approved.
3. Experience: PR-6 poster and motion concept. PR-7 and PR-9 only after they are approved.
4. Brand refresh (PR-10) as soon as the reference arrives; it touches buttons and profile cards, so it should land before the profile work in PR-2 is polished.

Task status is tracked in `TODOS.md`.
