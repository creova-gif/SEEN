# SEEN by Creova — Mobile (Expo)

Native React Native port of the SEEN web app, designed to run on **Expo Go** for iOS and Android.

## Status

This is **Phase 1 — Foundation**. Currently implemented:

- Expo SDK 52 (managed workflow, new architecture)
- expo-router with Stack → Tabs navigation
- Design tokens ported from `src/styles/theme.css`
- SEEN logo component
- Welcome screen with "Begin Listening" CTA
- 4 native tabs: For You, Explore, Library, Profile
- For You screen with native scroll + story cards
- Placeholder screens for Explore / Library / Profile

## Phase 2 (next sessions)

- Port `OnboardingSystem` (Language → Invocation → Role → Intent → Account → Accessibility)
- Port `ExploreScreen` with cultural tag cloud
- Port `LibraryScreen` (Saved, Continue, Downloads, Collections)
- Port `ProfileScreen` + `ProfilePreferencesScreen`
- Port `ForYouScreen` full feature set (FeaturedStoryPreview, reactions, etc.)
- Audio playback via `expo-av`
- Spotify embeds via `react-native-webview`
- Supabase auth wiring
- AsyncStorage migration for all `seen_*` localStorage keys

## Run on Expo Go

From the repo root:

```bash
cd mobile
npm install
npm start          # uses --tunnel so your phone can connect from anywhere
```

A QR code appears in the terminal. Open **Expo Go** on your phone and scan it:

- **iOS** — use the iPhone Camera app, then tap the banner
- **Android** — use the QR scanner inside Expo Go

If you and your phone are on the same Wi-Fi network, you can use the faster LAN mode:

```bash
npm run start:lan
```

## Why this is a separate folder

Keeping the Expo project in `mobile/` means:

1. The existing Vite web app at the repo root is **completely unaffected** — `npm run dev` still runs the PWA
2. The native and web stacks don't fight over `package.json`, peer deps, or `node_modules`
3. We can port screens incrementally from `src/app/components/` into `mobile/app/` without breakage

## Project layout

```
mobile/
├── app/                       # expo-router file-based routes
│   ├── _layout.tsx            # root Stack (safe-area + status bar)
│   ├── index.tsx              # Welcome screen
│   └── (tabs)/
│       ├── _layout.tsx        # bottom tabs
│       ├── index.tsx          # For You
│       ├── explore.tsx
│       ├── library.tsx
│       └── profile.tsx
├── components/
│   ├── SeenLogo.tsx
│   └── Placeholder.tsx
├── constants/
│   └── theme.ts               # ported design tokens (colors, spacing, type)
├── app.json                   # Expo config
├── package.json
├── babel.config.js
└── tsconfig.json
```
