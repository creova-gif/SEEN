# Manual-style verification report (2026-10-06)

Method: `e2e/audit/manual-a11y.spec.ts` drives a real Chromium (Pixel-sized viewport) with keyboard input only, inspects the live accessibility-relevant DOM, reflows at 200% and 400% zoom with Larger text on, and measures contrast of text over photos. **This is not a substitute for VoiceOver, NVDA or TalkBack testing, which has not been done.**

## What failed first, and what changed

| Finding | Where | Fix |
|---|---|---|
| Large white Play button on the story page had no accessible name, and did nothing except start a decorative pulse (a dead control) | `FeaturedStoryPreview` | It now starts the story, is named "Start reading" or "Unlock story", and the decorative pulse and unused state were removed |
| Featured hero text and header fell below 4.5:1 over a bright photo (3.07:1 for the eyebrow line, 2.95:1 for the byline) | `ForYouSections` `FeaturedHero` | Added a top scrim under the header and a stronger, longer bottom scrim; re-measured above 4.5:1 |
| Create Story let creators attach images with no description | `MediaChaptersStep` | Description field (or an explicit "decorative" choice) is required before continuing |
| No way to flag difficult content | `ContextAccessibilityStep`, `FeaturedStoryPreview` | Optional content notes, shown on the story page before "Start reading" |
| Story-completion dialog did not trap focus or close on Escape | `StoryReaderExtras` | Fixed earlier in this phase (focus in, Esc, Tab contained, focus returned) |
| Test-harness false positives (screen-reader-only label counted as clipped; Tailwind v4 colour strings misparsed; pill-shaped badge corners sampled) | the spec | Corrected in the spec; not product bugs |

## Results

| Check | Result | Evidence |
|---|---|---|
| Keyboard-only: landing, onboarding, sign-up, For You, open story, save, start reading, Library Saved, Settings (Larger text), Profile, sign-out confirmation with Escape and focus return | PASS | spec "keyboard-only journeys" |
| Keyboard-only: Create Story chips | PASS (chips); the full Create Story wizard was not driven end to end by keyboard | |
| Accessible name on every button, link, input, switch, tab on 11 routes; document title and `alt` attribute on images | PASS | spec "accessible name" |
| 200% zoom (640 CSS px), 320 px and 390 px with Larger text: no sideways scroll, no clipped controls, bottom nav on screen, on 8 routes | PASS | spec "200% zoom" |
| Text over photos, worst case (every photo forced to pure white): 4.5:1 normal, 3:1 large | PASS for the 7 text elements that overlap imagery on For You after the fix | spec "text over images". Other routes had no measurable text-over-image in the viewport in this environment, so coverage is limited |
| Reduced motion | PASS (app-wide `MotionConfig`) | earlier work |

## Not done (still open)

- VoiceOver (iOS/macOS), NVDA, TalkBack testing with a real person or device.
- Real-device checks of the on-screen keyboard overlap on forms.
- Contrast of text over real photographs (the sandbox cannot load the real covers; white was used as the worst case).
- Video captions: the reader has no video player. Narration transcripts: the transcript sheet shows the chapter text, which is the narrated text; recorded-audio transcripts as a separate file are not supported by the data model.
- The Create Story wizard attaches media by pasting a URL through a browser prompt, which is poor for keyboard and screen-reader users. A real file picker needs upload storage (backend).
