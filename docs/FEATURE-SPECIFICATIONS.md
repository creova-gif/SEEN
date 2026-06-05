# Feature Specifications — SEEN by CREOVA

**Document status:** Draft v1.0
**Last updated:** June 5, 2026
**Related docs:** [PRD](./PRD.md) · [User Stories](./USER-STORIES.md)

This document catalogs the platform's features, their behavior, and where state is stored. Features marked *(localStorage/AsyncStorage)* are client-persisted and UI-additive.

---

## 1. Foundation Features

### 1.1 Onboarding System
Sequential flow: **Language → Invocation → Role → Intent → Account → Accessibility**, plus an "Explore without signing in" guest path. The Invocation step uses a sage-green CTA with an expanding ring (no violet glow).

### 1.2 Role-Based Navigation
The app renders distinct screen sets per `userRole`:
- **Viewer:** For You, Explore, Library, Profile.
- **Creator:** Creator variants of those screens + a centred "+" Create tab.
- **Moderator/Admin:** Viewer screens + a Moderation Queue primary tab (Shield icon, badge count) + a 5-tab admin surface.

### 1.3 Cinematic Story Player
Chapter player with eyebrow (tracked caps), large cinematic title, body text, top controls, language pills, and an audio scrubber. Captions overlay renders chapter text in a styled card when enabled.

### 1.4 Library
Tabbed library: saved stories, collections, and offline downloads (viewer); creator library adds per-story actions including collaboration.

### 1.5 Settings & Compliance
Language radio selection, audio control, accessibility toggles, CMF compliance indicators, and PIPEDA data export/deletion.

---

## 2. The 7 Enhanced Platform Features

### Feature 1 — Timed In-Story Reactions *(localStorage/AsyncStorage)*
- Emoji picker in the player: ❤️ 🔥 💫 😢 🙏.
- Each reaction stores `{ storyId, chapterId, emoji, timePosition, timestamp }`.
- Reactions render as floating emoji dots above the progress bar at the timestamp they were left.

### Feature 2 — Multilingual Audio Track Indicator
- Language switcher simulates an audio track load (~1.2s) with a globe spinner overlay.
- EN/FR/ES availability pills shown beneath chapter content.
- The active track is highlighted; switching animates a "Loading [language] track…" banner.

### Feature 3 — Story Collections / Playlists *(localStorage/AsyncStorage)*
- Bookmark action opens a "Save to Collection" bottom sheet.
- Create named collections inline or save to existing ones with one tap.
- Collections store `{ id, name, storyIds, createdAt }`.
- Library Collections tab lists collections with counts and delete.

### Feature 4 — Offline Download Mode *(localStorage/AsyncStorage)*
- Download action animates spinner → checkmark.
- Downloads store with a 30-day expiry (`expiresAt`).
- Library Downloads tab shows thumbnail, title, days-until-expiry, and type badge; ≤3 days enters a warning state; supports removal.

### Feature 5 — Creator Collaboration Mode *(localStorage/AsyncStorage)*
- Each creator story card has a "Collab" action.
- Invite sheet: email input + Lead/Contributor role.
- Invites store `{ id, itemId, email, role, status, sentAt }`.
- Cards with pending invites show a "N collaborators invited" badge.

### Feature 6 — CMF Eligibility Checker
- Creator Tools entry point.
- 3-step guided checker: Budget range → Production type → Language/Region.
- Matches against real CMF programs (Indigenous, Documentary, Experimental, Convergent, etc.).
- Each result links to the relevant CMF program page.

### Feature 7 — Cultural Tag Cloud on Explore
- "Cultural Identities" rail with 14 tags (e.g. Métis, Cree, Anishinaabe, Haudenosaunee, Haitian-Canadian, Québécois, Acadian, Somali-Canadian).
- Each tag has a unique identity colour dot.
- Selecting a tag shows a context banner and highlights matching content; clear resets; the rail scrolls horizontally.

---

## 3. Content

### 3.1 CREOVA Music (first-party)
First-party CREOVA releases are featured content. A story's `audioSrc` supports a Spotify embed (renders a live player), a SoundCloud URL, or a hosted MP3/OGG. The featured story preview detects Spotify URLs and renders an embedded player instead of the static play button.

### 3.2 Curated Cultural Stories & Collections
Seasons of cinematic audio stories plus curated films and institutional collections, surfaced through the shared content layer with accessibility metadata (captions/transcripts).

---

## 4. Compliance Features

| Area | Feature |
|---|---|
| **CMF** | French as equal-first language; CMF compliance section with certification status and French first-class indicator; CMF Eligibility Checker. |
| **PIPEDA** | Data export (JSON download); data deletion with two-step confirmation. |
| **Accessibility** | Caption overlays on chapters; transcript coverage targets; accessibility toggles in onboarding and settings. |

---

## 5. Client-Persisted State Keys

| Key | Purpose |
|---|---|
| `seen_reactions` | Timed story reactions |
| `seen_collections` | User story collections/playlists |
| `seen_downloads` | Offline stories with 30-day expiry |
| `seen_collab_invites` | Creator collaboration invites |
| `seen_social_links` | Creator social profile links (max 5) |
| `seen_role` | Persisted user role (mobile) |

---

## 6. Platform Surfaces

| Surface | Stack | Distribution |
|---|---|---|
| **Web** | React 18, Vite 6, Tailwind v4, Supabase | Static build (`dist/`) |
| **Mobile** | Expo SDK 56, React 19.2, RN 0.85, Expo Router | App Store / Play Store |

Both surfaces share a single content database (stories, music, queries, types) as one source of truth.
