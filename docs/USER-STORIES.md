# User Stories — SEEN by CREOVA

**Document status:** Draft v1.0
**Last updated:** June 5, 2026
**Related docs:** [PRD](./PRD.md) · [Feature Specifications](./FEATURE-SPECIFICATIONS.md)

User stories follow the format: *As a [role], I want [capability], so that [benefit].* Each story includes acceptance criteria.

---

## Epic A — Onboarding & Access

### A1 — Choose my language first
**As a** new user, **I want** to pick my language at the very start, **so that** the experience (including French as an equal-first option) reflects me from the first screen.
**Acceptance criteria:**
- Language selection is the first onboarding step.
- French is presented with equal prominence to English.
- The chosen language persists across sessions.

### A2 — Explore without an account
**As a** curious visitor, **I want** to explore stories without signing up, **so that** I can evaluate the platform before committing.
**Acceptance criteria:**
- A clear "Explore without signing in" guest path exists in onboarding.
- Guests can browse and play; account-only actions prompt sign-up when used.

### A3 — Set accessibility preferences during onboarding
**As a** user with accessibility needs, **I want** to set preferences early, **so that** captions and other aids are on when I start listening.
**Acceptance criteria:**
- Accessibility step appears in onboarding.
- Preferences (e.g. captions) apply immediately and persist.

---

## Epic B — Discovery (Viewer)

### B1 — Get a personalized feed
**As a** viewer, **I want** a For You feed, **so that** I see stories relevant to me without searching.
**Acceptance criteria:**
- For You renders curated sections from the content layer.
- A featured story preview is shown with playback affordance.

### B2 — Browse by cultural identity
**As a** viewer, **I want** to filter Explore by cultural identity tags, **so that** I can find stories from a specific community.
**Acceptance criteria:**
- A "Cultural Identities" tag rail shows 14 tags, each with a unique colour dot.
- Selecting a tag shows a context banner and highlights matching content.
- A clear control resets the filter; the rail scrolls horizontally.

### B3 — Discover institutional collections
**As a** viewer, **I want** to browse institutional collections, **so that** I can engage with archive-backed, contextualized content.
**Acceptance criteria:**
- Institutional collection detail screens show a hero, curator note, and content list.

---

## Epic C — Story Playback (Viewer)

### C1 — Listen to a cinematic chapter player
**As a** viewer, **I want** an immersive chapter player, **so that** listening feels cinematic, not utilitarian.
**Acceptance criteria:**
- Player shows eyebrow, title, body, and top controls.
- Audio progress is shown on a scrubber.

### C2 — Read captions while listening
**As a** viewer who needs captions, **I want** subtitle captions overlaid, **so that** I can follow the story text.
**Acceptance criteria:**
- When captions are enabled, chapter text renders in a styled overlay card.

### C3 — Leave timed reactions
**As a** viewer, **I want** to drop emoji reactions at a moment in the audio, **so that** I can mark what moved me.
**Acceptance criteria:**
- An emoji picker offers ❤️ 🔥 💫 😢 🙏.
- Each reaction stores story, chapter, emoji, time position, and timestamp.
- Reactions appear as floating dots above the progress bar at their timestamp.

### C4 — Switch audio language
**As a** multilingual viewer, **I want** to switch the audio track language, **so that** I can listen in EN/FR/ES where available.
**Acceptance criteria:**
- Language switcher shows availability pills (EN/FR/ES).
- Switching shows a brief "Loading [language] track…" state and highlights the active track.

---

## Epic D — Library (Viewer)

### D1 — Save stories to collections
**As a** viewer, **I want** to save stories into named collections, **so that** I can organize what I love.
**Acceptance criteria:**
- A bookmark action opens a "Save to Collection" picker.
- I can create a new named collection or add to an existing one in one tap.
- A Collections tab lists collections with story counts and a delete option.

### D2 — Download for offline listening
**As a** viewer with limited connectivity, **I want** to download stories, **so that** I can listen offline.
**Acceptance criteria:**
- A download action shows a spinner then a checkmark.
- Downloads carry a 30-day expiry.
- A Downloads tab shows thumbnail, title, days-until-expiry, and type; ≤3 days shows a warning state; items can be removed.

---

## Epic E — Creation (Creator)

### E1 — Apply to become a creator
**As a** viewer, **I want** to apply for creator access from my profile, **so that** I can publish my own stories.
**Acceptance criteria:**
- A role-elevation form exists on the viewer profile.
- Submitting requests elevation; status is reflected to the user.

### E2 — Publish a story via a guided wizard
**As a** creator, **I want** a step-by-step create flow, **so that** publishing is approachable.
**Acceptance criteria:**
- A multi-step create wizard is available from the centred "+" tab.

### E3 — See how my stories perform
**As a** creator, **I want** analytics and drafts on my For You, **so that** I can understand engagement and resume work.
**Acceptance criteria:**
- Creator For You shows an analytics card, drafts, and creator sections.

### E4 — Invite collaborators
**As a** creator, **I want** to invite collaborators by email with a role, **so that** I can co-produce stories.
**Acceptance criteria:**
- A "Collab" action opens an invite sheet with email input and a Lead/Contributor role.
- Invites store item, email, role, status, and sent time.
- Cards with pending invites show a "N collaborators invited" badge.

### E5 — Check CMF eligibility
**As a** creator, **I want** to check which CMF programs I qualify for, **so that** I can pursue funding.
**Acceptance criteria:**
- A guided 3-step checker covers budget, production type, and language/region.
- Results match against real CMF programs and link to the relevant program page.

---

## Epic F — Governance (Moderator/Admin)

### F1 — Review the moderation queue
**As a** moderator, **I want** a queue of submissions, **so that** I can review and act on them.
**Acceptance criteria:**
- A Moderation Queue is a primary tab with a badge count.
- The governance system exposes queue, flagged, and approved states.

### F2 — Administer the platform
**As an** admin, **I want** a multi-tab admin surface, **so that** I can manage governance comprehensively.
**Acceptance criteria:**
- A 5-tab admin screen is available to admins.

---

## Epic G — Settings & Compliance (All roles)

### G1 — Manage language, audio, and accessibility
**As a** user, **I want** settings for language, audio, and accessibility, **so that** the app fits my needs.
**Acceptance criteria:**
- Settings expose language selection, an audio control, and accessibility toggles.

### G2 — See CMF compliance status
**As a** user/partner, **I want** to see CMF compliance indicators, **so that** I can trust the platform's standards.
**Acceptance criteria:**
- Preferences show CMF compliance status and a French first-class indicator.

### G3 — Export or delete my data (PIPEDA)
**As a** user, **I want** to export or delete my data, **so that** I control my privacy.
**Acceptance criteria:**
- Data export produces a JSON download.
- Data deletion requires a two-step confirmation.
