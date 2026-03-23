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

## Data Layer
- `src/app/data/queries.ts` exports all data access functions:
  - `getForYouFeed()` — viewer feed
  - `getForYouSections(language)` — creator feed sections with layout metadata
  - `getCreatorDrafts()`, `getCreatorPerformanceData()`, `getCreatorRecommendations()` — creator analytics
  - `getExploreCategories()`, `getCreatorOpenCalls(language)` — explore screen
  - `getInstitutionalOpportunities(language)` — institutional collections
- `src/app/data/database.ts` — Content arrays (ALL_CONTENT, MUSIC_CONTENT, etc.)

## Development
- Dev server: `npm run dev` (port 5000, host 0.0.0.0)
- Build: `npm run build`

## Deployment
- Static deployment using `dist/` directory after build
