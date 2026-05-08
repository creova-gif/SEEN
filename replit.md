# SEEN by CREOVA — React Native / Expo App

## Overview
A Canadian cultural storytelling platform built as a **React Native / Expo (SDK 53)** mobile app, testable via Expo Go on iOS and Android. Surfaces underrepresented voices (Indigenous, Black Canadian, francophone, immigrant communities) through cinematic audio-first story experiences. Targets Canada Media Fund (CMF) grant compliance.

## How to Test on Your Phone (Expo Go)

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android)
2. Start the workflow (`npm run dev`) — the Expo Metro bundler starts on port 8080
3. In the workflow console, you'll see a **QR code**
4. On **iOS**: open the Camera app and point it at the QR code → tap the Expo Go link
5. On **Android**: open the Expo Go app → tap "Scan QR code"
6. The SEEN app will load on your device

> **Note:** Your phone and Replit server must be able to communicate. If the QR code scan doesn't work, tap "Enter URL manually" in Expo Go and enter `exp://172.31.98.130:8080` or use the Replit public URL.

## Tech Stack
- **Framework**: React Native 0.79 + Expo SDK 53
- **Router**: Expo Router 5 (file-based routing in `app/`)
- **Fonts**: Inter via `@expo-google-fonts/inter`
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Animation**: `react-native-reanimated` + `expo-haptics`
- **Gradients**: `expo-linear-gradient`
- **Storage**: `@react-native-async-storage/async-storage`
- **Auth/API**: Supabase Edge Functions (`cddipfbiqnxouvgsndly`)
- **State**: React Context (AuthContext + StoryStateContext)
- **Data fetching**: `@tanstack/react-query`

## Project Structure
```
app/
  _layout.tsx          — Root stack layout (fonts, providers, splash)
  index.tsx            — Entry point (checks onboarding status → redirect)
  onboarding.tsx       — 4-step onboarding (Welcome → Language → Intent → Auth)
  chapter.tsx          — Full-screen chapter reader/audio player (modal)
  settings.tsx         — Preferences, accessibility, CMF, PIPEDA
  +not-found.tsx       — 404 screen
  (tabs)/
    _layout.tsx        — Tab bar layout (role-aware: Queue tab only for mods)
    index.tsx          — For You feed (featured story, music, stories, films)
    explore.tsx        — Search + cultural lens chips + content grid
    library.tsx        — In Progress / Completed / Collections / Downloads tabs
    queue.tsx          — Moderation queue with approve/reject/flag workflow
    profile.tsx        — User card, stats, role badge, settings
  story/
    [id].tsx           — Story preview (chapters list, begin button, context cards)

app.json               — Expo config (scheme: "seen", router.root: "app")
babel.config.cjs       — babel-preset-expo config
metro.config.cjs       — Metro bundler config
tsconfig.json          — Extends expo/tsconfig.base

constants/
  colors.ts            — Design tokens (black bg, amber accent, violet creator, Inter fonts)

data/
  types.ts             — ContentItem, UserProgress, UserBookmark types
  database.ts          — ALL_CONTENT array (music, stories, films, archives)
  storyDatabase.ts     — STORY_WORLDS with full chapter text (3 worlds, 12 chapters)

contexts/
  AuthContext.tsx      — Sign in/up/out with Supabase, AsyncStorage session
  StoryStateContext.tsx — Language, role, accessibility, progress (AsyncStorage)

components/
  StoryCard.tsx        — Horizontal card with thumbnail, type badge, metadata
  MusicCard.tsx        — Square music card with gradient overlay and play button
  ScreenHeader.tsx     — Reusable header with back button and title
```

## Role-Based Architecture
- **viewer**: For You, Explore, Library, Profile tabs
- **creator**: Same tabs + Creator Mode banner on For You; CMF section in Profile
- **moderator / admin**: All viewer tabs + Queue tab (Shield icon, badge count)
- Switch roles in Settings → "Your Account" section (demo/dev feature)

## Key Screens
| Screen | Route | Notes |
|---|---|---|
| Onboarding | `/onboarding` | Welcome → Language → Intent → Auth (4 steps) |
| For You | `/(tabs)` | Featured story, CREOVA music carousel, story/film lists |
| Explore | `/(tabs)/explore` | Search bar, cultural lens chips (14 tags), content grid |
| Library | `/(tabs)/library` | In Progress (with %) / Completed / Collections / Downloads |
| Queue | `/(tabs)/queue` | Approve/Reject/Flag with reason input; Audit log; Guidelines |
| Profile | `/(tabs)/profile` | User card, stats, role badge, settings link, sign out |
| Story Preview | `/story/[id]` | Cover, chapter list, cultural context cards, begin button |
| Chapter Player | `/chapter` | Text reader + audio player UI, language switcher, chapter nav |
| Settings | `/settings` | Language, accessibility toggles, CMF status, PIPEDA export/delete |

## CMF / PIPEDA Compliance Features
- French available as a language option throughout onboarding + chapter player
- CMF Compliance section in Profile/Settings: CAVCON certification, French first-class indicator
- PIPEDA section: data export request + account deletion with confirmation

## CREOVA Music Content
- `creova-single-001` — New Single (Mar 2026, Spotify embed)
- `creova-album-001` — CREOVA: The Album (Feb 2026, full album)
- `creova-album-002` — Racines / Roots (bilingual)
- `creova-album-003` — Corridor (instrumental)

## Story Worlds (Full Chapter Text)
1. **Midnight Resonance** — Montreal jazz underground, 4 chapters, EN/FR/ES
2. **The Iron Road** — Chinese-Canadian railway history, 4 chapters, EN/FR
3. **Roots in Niagara** — Black Canadian archive + Underground Railroad, 4 chapters, EN/FR

## localStorage Keys (AsyncStorage on native)
- `seenos_onboarding_complete` — bool, skips onboarding on re-open
- `seenos_auth_session` — `{ accessToken, refreshToken, user }`
- `seenos_story_state` — language, role, accessibility prefs, progress snapshots

## Development
- Dev server: `npm run dev` (Expo Metro on port 8080)
- Build: `npm run build` (Expo export for EAS)

## User Preferences
- Pure dark theme: `#000000` background, amber `#F59E0B` accent, violet `#7C3AED` creator
- Inter font family throughout (Regular/Medium/SemiBold/Bold)
- All component styles via React Native `StyleSheet.create` — no Tailwind
