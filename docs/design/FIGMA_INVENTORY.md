# Figma inventory — `06 — COMPONENTS` page

Legend — **Code**: where it lives now. **Status**: ✅ implemented · 🟡 partial · ⏸ deferred (reason in FIGMA_AUDIT).

| Figma node | Component set | Variants | Code | Status |
|---|---|---|---|---|
| 294:54 | Button | Primary/Secondary/Ghost/Destructive × Default/Hover/Focus/Pressed/Disabled/Loading | `seen/primitives.tsx › Button` | ✅ |
| 302:32 | Icon Button | Ghost/Filled × 5 states | `IconButton` (44px hit area, badge) | ✅ |
| 295:27 | Text Input | Default/Focus/Filled/Error/Disabled | Onboarding inputs (bespoke) | 🟡 not extracted |
| 295:47 | Toggle | Off/On/Disabled | `components/ui/switch.tsx` (Radix) | 🟡 unstyled to tokens |
| 295:37 | Chip | Default/Selected/Disabled | `Chip` | ✅ |
| 296:10 | Badge | Gold/Mint/Purple/Surface | `Badge` (+ info, error) | ✅ |
| 296:20 | Avatar | S 32 / M 48 / L 80 | `Avatar` (initials, image fallback) | ✅ |
| 296:30 | Progress | Linear/Circular | Linear inline in Opportunity detail (`role=progressbar`) | 🟡 |
| 296:43 | Skeleton | Line/Block/Card/Circle | `Skeleton`, `SkeletonList` | ✅ |
| 298:82 | Bottom Navigation | Active=ForYou/Explore/Library/Profile | Per-screen `BottomNav` (aria-current added) | 🟡 still duplicated ×3 |
| 298:118 | Top Bar | Default/Scrolled/WithBack | `NavigationBar` (default), `TopBar` (with back) | ✅ |
| 298:137 | Search Bar | Empty/Focused/Filled | Explore + Search screen inputs | 🟡 not extracted |
| 298:162 | Segmented Tabs | Stories/Creators/Collections | `SegmentedTabs` (roving tabindex, arrow keys) | ✅ |
| 300:17 | Story Card | Portrait/Landscape/Compact | `StoryCard` (portrait rail), `ContentCard` (portrait/landscape), `StoryRow` (compact) | ✅ |
| 300:60 | Chapter Row | Available/Playing/Completed/Locked | `ChapterIndexScreen` rows | ⏸ |
| 301:79 | State Template | Empty/Error/Offline | `StateTemplate` (+ Denied) | ✅ |
| 302:42 | Checkbox | Unchecked/Checked/Indeterminate/Disabled | Native checkbox in funding checklist | 🟡 |
| 302:50 | Radio | Unselected/Selected/Disabled | `components/ui/radio-group.tsx` | 🟡 |
| 302:75 | List Item | Default/Pressed/Selected | Profile `SettingItem` | 🟡 |
| 570:3 | Creator Card | — | `seen/cards.tsx › CreatorCard` | ✅ |
| 570:5 | Collection Card | — | `CollectionCard` | ✅ |
| 570:7 | Opportunity Card | — | `OpportunityCard` | ✅ |
| 305:53 | Banner | Info/Success/Warning/Error | `Banner` | ✅ |
| 570:9 | Toast | — | `sonner` `<Toaster theme="dark">` | ✅ |
| 570:11 | Tooltip | — | `components/ui/tooltip.tsx` | 🟡 unused |
| 570:13 | Sheet | — | `components/ui/sheet.tsx` | 🟡 unused |
| 570:15 | Dialog | — | `components/ui/dialog.tsx`; Checkout/Paywall modals | 🟡 |
| 570:17 | Metric Card | — | `MetricCard` | ✅ (not yet adopted by earnings screen) |
| 363:67 | Media Player Bar | Mini/Expanded | `AudioPlayer` inside chapter screen | ⏸ |
| 363:110 | OTP Field | Default/Filled/Error | `components/ui/input-otp.tsx` | ⏸ no OTP backend |
| 363:132 | Password Field | Masked/Visible | Onboarding password input (no reveal) | 🟡 |
| 363:160 | Notification Item | Story/Funding/Money/Moderation | `NotificationItem` | ✅ |
| 570:19 | Subscription Card | — | `SubscriptionManagementScreen` (bespoke) | 🟡 |
| 570:21 | Drawer | — | `components/ui/drawer.tsx` (vaul) | 🟡 unused |
| 248:56 / 248:65 | Status Bar / Home Indicator | — | Device chrome — not implemented on web by design | n/a |
| 248:67 | Divider | — | `border-white/5` hairlines | ✅ |
| 248:68 | Back Button | — | `TopBar` back | ✅ |
| 248:71 | Section Header | — | `SectionHeader` (See-all only when wired), `SectionTitle` | ✅ |

No duplicates or outdated components were found; the loose masters at the canvas
root (e.g. `305:2 Creator Card`, `363:186 Drawer`) are the base symbols that the
documented instances (`570:*`) wrap.
