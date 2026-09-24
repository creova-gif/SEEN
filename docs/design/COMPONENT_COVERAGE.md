# Component coverage

How much of the UI is built from the shared system versus bespoke markup.

| Area | Uses SEEN primitives/tokens | Bespoke styling remaining |
|---|---|---|
| Header (`NavigationBar`) | ✅ IconButton, badge | — |
| Feature screens (creators, collections, funding, notifications) | ✅ 100% | — |
| Cards across For You / Explore / Library / Search | ✅ ContentCard / StoryCard contract, SeenImage | — |
| Explore tabs | ✅ SegmentedTabs | story sections still use legacy `SectionHeader` (fine) |
| Library | 🟡 ContentCard | Presence-indicator tabs bespoke |
| Profile | 🟡 Your SEEN rows | `SettingItem`, stats and creator promo bespoke |
| Onboarding | ❌ | Fully bespoke (works; restyle to Input/Button components later) |
| Reader, chapter index | ❌ | Bespoke |
| Creator tools, subscriptions, moderation, admin | ❌ | Bespoke; candidates for MetricCard / Subscription Card |
| Bottom navigation | ❌ | Three copies; extract one `BottomNav` |

Adoption rule for new work: build from `components/seen/*`; if a component is
missing, add it there (with its Figma node id in the comment) rather than inline.
