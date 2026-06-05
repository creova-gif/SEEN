# Product Requirements Document — SEEN by CREOVA

**Document status:** Draft v1.0
**Last updated:** June 5, 2026
**Owner:** CREOVA Product
**Related docs:** [User Stories](./USER-STORIES.md) · [Feature Specifications](./FEATURE-SPECIFICATIONS.md)

---

## 1. Overview

**SEEN by CREOVA** is a Canadian cultural storytelling platform that surfaces underrepresented voices — Indigenous, Black Canadian, francophone, and immigrant communities — through cinematic, audio-first story experiences.

The platform exists to make culturally specific Canadian stories discoverable, accessible, and dignified, while meeting the funding and compliance standards required by the Canada Media Fund (CMF) and Canadian privacy law (PIPEDA).

It ships in two surfaces:
- **Web app** — React 18 + Vite 6 + Tailwind CSS v4 (deployed as a static site).
- **Mobile app** — Expo SDK 56 / React Native (iOS + Android, distributed via the App Store and Play Store).

---

## 2. Problem Statement

Stories from Canada's underrepresented communities are scattered, under-funded, and often presented without cultural context or accessibility. Audiences who want to engage with these voices lack a single, respectful home for them; creators from these communities lack a distribution platform built around their needs; and institutions and funders lack a compliant, measurable channel to support this work.

SEEN addresses three gaps at once:
1. **Discovery** — a curated, identity-aware way to find culturally specific stories.
2. **Creation** — tools for creators to publish, collaborate, and check funding eligibility.
3. **Trust & compliance** — governance, accessibility, and privacy controls that satisfy CMF and PIPEDA.

---

## 3. Goals & Non-Goals

### 3.1 Goals
- Deliver an audio-first, cinematic story experience that treats culture as central, not decorative.
- Support three first-class roles — **viewer**, **creator**, **moderator/admin** — each with a tailored experience.
- Make French an equal-first language throughout, with multilingual audio tracks where available.
- Provide creators with publishing, collaboration, and CMF eligibility tooling.
- Meet CMF grant compliance and PIPEDA data-rights obligations as built-in product features.
- Maintain a single source of truth for content shared across web and mobile.

### 3.2 Non-Goals
- SEEN is **not** a general-purpose music or podcast host; first-party CREOVA music and curated cultural stories are the focus.
- The mobile app is **not** a web wrapper; it is a native experience aligned to the web design system.
- SEEN does not aim to replace institutional archives; it surfaces and contextualizes them.

---

## 4. Target Users & Personas

| Persona | Role | Needs |
|---|---|---|
| **Amara — the Listener** | Viewer | Wants to discover culturally specific stories, listen on the go, save collections, and download for offline. |
| **Daniel — the Creator** | Creator | Wants to publish stories, see analytics, invite collaborators, and confirm CMF funding eligibility. |
| **Renée — the Moderator** | Moderator/Admin | Wants to review submissions, enforce governance, and maintain cultural and accessibility standards. |
| **The Institution** | Partner (via viewer surfaces) | Wants compliant, accessible collections it can point its community to. |

---

## 5. User Roles & Permissions

The app renders different screens per `userRole`:

- **Viewer** — For You, Explore, Library, Profile. Can browse, listen, react, build collections, download offline, and apply for creator elevation. A guest ("Explore without signing in") path exists.
- **Creator** — Creator variants of For You / Explore / Library, plus a centred "+" Create tab. Adds analytics, drafts, collaboration invites, and the CMF Eligibility Checker.
- **Moderator / Admin** — Standard viewer screens plus a Moderation Queue as a primary tab, with a 5-tab governance system.

---

## 6. Scope — Core Experiences

1. **Onboarding** — Language → Invocation → Role → Intent → Account → Accessibility, with a guest path.
2. **Discovery** — For You feed, Explore with cultural-identity tag cloud, institutional collections.
3. **Story playback** — Cinematic chapter player with captions, timed reactions, and multilingual audio track switching.
4. **Library** — Saved stories, collections/playlists, and offline downloads.
5. **Creation** — Multi-step create wizard, drafts, performance analytics, collaboration invites.
6. **Governance** — Moderation queue, flagged/approved states, admin tooling.
7. **Settings & compliance** — Language, accessibility, audio preferences, CMF compliance status, PIPEDA export & deletion.

See [Feature Specifications](./FEATURE-SPECIFICATIONS.md) for detailed behavior.

---

## 7. Compliance Requirements

### 7.1 CMF (Canada Media Fund)
- French available as an equal-first language throughout the product.
- CMF Compliance section in Preferences surfacing CAVCO/CAVCON certification status and a French first-class indicator.
- A creator-facing **CMF Eligibility Checker** that matches creators against real CMF programs.

### 7.2 PIPEDA (Privacy)
- Self-serve **data export** (JSON download) of a user's data.
- Self-serve **data deletion** request with a two-step confirmation.

### 7.3 Accessibility
- Captions/subtitles on story chapters.
- Transcript coverage targets on curated content.
- Accessibility toggles in onboarding and settings.

---

## 8. Platform & Technical Constraints

- **Web stack:** React 18, Vite 6, Tailwind CSS v4, Radix UI, MUI, Motion, Recharts. Backend via Supabase (auth + edge functions). Managed with **pnpm**.
- **Mobile stack:** Expo SDK 56, React 19.2, React Native 0.85, Reanimated 4, Expo Router. Managed with **npm** inside `/mobile`.
- **Shared content layer:** one content database (stories, music, queries, types) shared across surfaces.
- **Persistence:** client-side features persist to localStorage (web) / AsyncStorage (mobile); auth and content via Supabase.
- **Deployment:** Web is a static build (`dist/`); mobile ships via Expo to the app stores.

---

## 9. Success Metrics

| Category | Metric |
|---|---|
| Engagement | Weekly active listeners; average listening minutes per session; chapter completion rate. |
| Discovery | Stories opened from cultural-identity tags; collections created per user. |
| Retention | Offline downloads per user; 30-day returning listener rate. |
| Creation | Creator applications approved; stories published per active creator; collaboration invites accepted. |
| Compliance | % content with captions; % with transcripts; CMF eligibility checks completed; PIPEDA requests fulfilled. |

---

## 10. Release Phases

- **Phase 1 — Foundation (complete):** Onboarding, role-based navigation, story playback, library, creator & moderator surfaces, settings & compliance, full mobile parity (Passes 1–5).
- **Phase 2 — Enhanced engagement (complete):** The 7 platform features — timed reactions, multilingual audio indicator, collections, offline downloads, creator collaboration, CMF eligibility checker, cultural tag cloud.
- **Phase 3 — Scale (planned):** Expanded seasons/content, deeper analytics, institutional partnership surfaces, and broader transcript coverage.

---

## 11. Open Questions & Risks

- **Audio rights & hosting** — confirm licensing and CDN strategy for multilingual tracks at scale.
- **Moderation capacity** — governance workflow must scale with submission volume.
- **Transcript coverage gap** — curated content is at ~85% transcript coverage; full accessibility requires closing this.
- **Offline expiry policy** — 30-day download expiry needs validation against listener expectations and rights terms.
