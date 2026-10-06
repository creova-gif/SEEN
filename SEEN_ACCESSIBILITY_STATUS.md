# SEEN accessibility status

Target: WCAG 2.2 AA. **Not claimed as compliant.** What is evidenced and what is not:

| Area | Status | Evidence |
|---|---|---|
| Automated axe scans (9 routes) | PASS | `e2e/a11y.spec.ts` |
| Touch targets 44 px, hidden-under-nav, horizontal overflow at 320, 360, 390, 768, 1280 px for all roles | PASS | `e2e/audit/ux-audit.spec.ts` |
| Secondary text contrast rule (`/55`) | PASS in source | No `text-white/50` remains; contrast of text over images not measured |
| Focus visible, focus return on dialogs | PASS | Global `:focus-visible`; Radix overlays; reader completion dialog |
| Reduced motion | PASS | `MotionConfig` plus CSS and a setting |
| Larger text setting | PASS (one size) | `data-text="large"` raises root size 18.75 percent |
| Keyboard-only journeys, screen-reader review, 200 percent zoom | NEEDS MANUAL VERIFICATION | Not performed with assistive technology |
| Create Story alt text, captions per media, content warnings | PARTIAL | Captions and transcripts confirmations exist; alt text and content warnings do not |
| Horizontal rails without dragging | NEEDS MANUAL VERIFICATION | |
| Lint | NOT CONFIGURED | No ESLint in the repo; typecheck is the static check |
