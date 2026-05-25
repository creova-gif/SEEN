# SEEN by Creova

## Overview
A Canadian cultural storytelling platform (React 18 + Vite 6 + Tailwind CSS v4) that surfaces underrepresented voices (Indigenous, Black Canadian, francophone, immigrant communities) through cinematic audio-first story experiences. Targets Canada Media Fund (CMF) grant compliance.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **UI Libraries**: Radix UI, MUI Material, Lucide React icons
- **Animation**: Motion (framer-motion successor)
- **Charts**: Recharts
- **Drag & Drop**: react-dnd
- **Backend**: Supabase (auth + API via Edge Functions)

## Project Structure
- `src/main.tsx` — Entry point
- `src/app/App.tsx` — Root router; role-based screen selection (viewer / creator / moderator)
- `src/app/components/` — All UI screens and components
- `src/app/contexts/AuthContext.tsx` — Auth (sign-up, sign-in, role elevation)
- `src/app/contexts/StoryStateContext.tsx` — Global story/UI state
- `src/app/data/` — Content database, queries, types
- `src/app/hooks/` — Custom React hooks
- `src/app/navigation/` — Navigation controller
- `src/styles/` — Global styles

## Role-Based Architecture
App.tsx renders different screen variants per `state.userRole`:
- **viewer**: ForYouScreen, ExploreScreen, LibraryScreen, ProfileScreen (with role-elevation apply form)
- **creator**: ForYouScreenCreator, ExploreScreenCreator, LibraryScreenCreator, ProfileScreenCreator — all with a centred "+" Create tab in the bottom nav
- **moderator / admin**: Standard viewer screens + ModeratorQueueScreen as a primary tab (Shield icon, badge count)

## Key Screens
| Screen | Path | Notes |
|---|---|---|
| OnboardingSystem | `src/app/components/OnboardingSystem.tsx` | Language → Invocation → Role → Intent → Account → Accessibility; "Explore without signing in" guest path |
| ForYouScreenCreator | Creator For You | Shows analytics card + drafts + sections from `getForYouSections()` |
| ModeratorQueueScreen | `src/app/components/ModeratorQueueScreen.tsx` | Wraps ModerationGovernanceSystem with 5-tab nav including Queue |
| ProfileScreen | Viewer profile | Role-elevation form (`requestRoleElevation`) for viewers applying as creators |
| ProfilePreferencesScreen | Settings | Language, accessibility, audio, CMF compliance status, PIPEDA data export + account deletion |
| StoryChapterScreen | Chapter player | Subtitle captions overlay renders chapter text in styled card when captions enabled |

## CMF / PIPEDA Compliance Features
- French available as equal-first language throughout
- CMF Compliance section in Preferences: CAVCON certification status, French first-class indicator
- PIPEDA section: data export (JSON download) + data deletion request with 2-step confirmation

## CREOVA Music Content
The platform features CREOVA's own released music as first-party content:
- `creova-single-001` — New Single (Mar 2026, featured + trending)
- `creova-album-001` — CREOVA: The Album (Feb 2026, full 42-min album)
- `creova-album-002` — Racines / Roots (bilingual track, trending)
- `creova-album-003` — Corridor (instrumental)

The `audioSrc` field on a `ContentItem` accepts:
- Spotify embed: `https://open.spotify.com/embed/track/{trackId}?utm_source=generator` ← renders a live Spotify player
- Soundcloud: `https://soundcloud.com/creova/track-slug`
- Hosted MP3/OGG: `https://cdn.example.com/audio/track.mp3`

`creova-single-001` currently has a live Spotify embed wired in.
`FeaturedStoryPreview` detects Spotify URLs and renders an iframe embed instead of the static play button.

## Data Layer
- `src/app/data/types.ts` — `ContentItem` includes optional `audioSrc?: string`
- `src/app/data/queries.ts` exports all data access functions:
  - `getForYouFeed()` — viewer feed (storyDatabase)
  - `getForYouSections(language)` — creator feed sections with layout metadata (database.ts)
  - `getCreatorDrafts()`, `getCreatorPerformanceData()`, `getCreatorRecommendations()` — creator analytics
  - `getExploreCategories()`, `getCreatorOpenCalls(language)` — explore screen
  - `getInstitutionalOpportunities(language)` — institutional collections
- `src/app/data/database.ts` — Content arrays (ALL_CONTENT, MUSIC_CONTENT, etc.)
- `src/app/data/demoData.ts` — Dev-only demo data (only runs in `import.meta.env.DEV`)

## 7 New Platform Features (all localStorage-persisted, UI-additive)

### Feature 1 — Timed In-Story Reactions (StoryChapterScreen)
- Emoji picker button (SmilePlus) in top control row: ❤️ 🔥 💫 😢 🙏
- Each reaction stores `{ storyId, chapterId, emoji, timePosition, timestamp }` in `seen_reactions`
- Reactions show as floating emoji dots positioned above the audio progress bar at the exact timestamp they were left

### Feature 2 — Multilingual Audio Track Indicator (StoryChapterScreen)
- Language switcher now calls `handleLanguageChange` which simulates a 1.2s audio track load with a globe spinner overlay
- EN/FR/ES track availability pills displayed beneath the chapter content
- Active track is highlighted; switching animates "Loading [language] track..." banner

### Feature 3 — Story Collections / Playlists (FeaturedStoryPreview + LibraryScreen viewer)
- Bookmark button on FeaturedStoryPreview now opens a bottom-sheet "Save to Collection" picker
- Create named collections with a text field + plus button; save to existing ones with one tap
- Collections stored in `seen_collections` as `{ id, name, storyIds, createdAt }`
- LibraryScreen now has a 4th tab "Collections curated" (violet) listing all saved collections with story counts and delete

### Feature 4 — Offline Download Mode (FeaturedStoryPreview + LibraryScreen viewer)
- New Download button (beside Volume) on FeaturedStoryPreview with animated spinner → checkmark
- Downloads stored in `seen_downloads` with 30-day expiry (`expiresAt`)
- LibraryScreen "Downloads saved offline" tab (amber) shows story thumbnail, title, days-until-expiry, type badge; ≤3 days turns red; swipe-to-delete

### Feature 5 — Creator Collaboration Mode (LibraryScreenCreator)
- Each story card's action bar now has a 5th "Collab" button (Users icon)
- Tapping opens an "Invite Collaborator" bottom sheet: email input + Lead/Contributor role dropdown
- Invites stored in `seen_collab_invites` as `{ id, itemId, email, role, status, sentAt }`
- Cards with pending invites show a violet "N collaborators invited" badge

### Feature 6 — CMF Eligibility Checker (ProfileScreenCreator)
- New "CMF Eligibility Checker" button in the Creator Tools section
- 3-step guided checker: Budget range → Production type → Language/Region
- Matches against 6 real CMF programs (Indigenous, Documentary, Experimental, Convergent, etc.)
- Each matched result links directly to the relevant cmf-fmc.ca program page

### Feature 7 — Cultural Tag Cloud on Explore (ExploreScreen)
- "Cultural Identities" tag rail between Type Filters and content (14 tags: Métis, Cree, Anishinaabe, Haudenosaunee, Haitian-Canadian, Québécois, Acadian, Somali-Canadian, etc.)
- Each tag has a unique identity colour dot; selecting one shows a context banner and highlights content below
- Clear button resets the filter; tags are horizontally scrollable

## localStorage Keys
- `seen_reactions` — timed story reactions
- `seen_collections` — user story collections/playlists
- `seen_downloads` — offline stories with 30-day expiry
- `seen_collab_invites` — creator collaboration invites
- `seen_social_links` — creator social profile links (max 5)

## Mobile App (Expo SDK 52)

Native iOS/Android port under `/mobile`. Aligned to the web design system in 5 focused passes (all complete):

- **Pass 1 — Onboarding**: Sage-green Invocation CTA with expanding ring, left-aligned lists, white-pill purpose button, no violet glow.
- **Pass 2 — Tabs**: Lucide bottom-nav (Home/Compass/Library/User + Plus/ShieldCheck), 32×2 white indicator bar, Explore cultural-identity tag rail with 14-colour dot palette, Library presence-indicator grid + 16:9 content cards, Profile soft `rgba(255,255,255,0.04)` cards.
- **Pass 3 — Story player**: `mobile/app/story/[id].tsx` — eyebrow at 4pt tracking, 30pt cinematic title, white/70 body, top controls now `white/15` (was violet), language pills uppercase tracking, reactions-overlay on white scrubber.
- **Pass 4 — Creator + Moderator**: `mobile/app/(tabs)/create.tsx` (4-step wizard), `mobile/app/(tabs)/moderate.tsx` (queue/flagged/approved), `mobile/app/admin.tsx` (5-tab admin). All Switch toggles use neutral white-track/dark-thumb (no violet).
- **Pass 5 — Settings, About, Chapters, Institutional**:
  - `mobile/app/settings.tsx` — language radio cards, audio segmented control, accessibility toggles, CMF compliance dots, PIPEDA export + delete chips
  - `mobile/app/about.tsx` — hero, manifesto, 2×2 principles grid, CREOVA + funding sections, quote card, email/website pills
  - `mobile/app/chapters/[id].tsx` — sticky header, ToC title, 6 chapter cards with playing/done indicators, white "RESUME STORY" pill footer
  - `mobile/app/institutional/[id].tsx` — 40vh hero with scrim, floating logo, italic curator note, 96px-thumb content cards, partnership note
  - Entry points wired: profile → settings + about (More section); story player → chapters (list icon in top controls)

## Web Development
- Dev server: `npm run dev` (port 5000, host 0.0.0.0)
- Build: `npm run build`

## Mobile Development
- Dev server: `cd mobile && REACT_NATIVE_PACKAGER_HOSTNAME=$REPLIT_DEV_DOMAIN npx expo start --port 5000 --clear`
- Workflow `Start application` runs this automatically

## Deployment
- Web: Static deployment using `dist/` directory after build
- Mobile: Expo build → App Store / Play Store (not a web app)
