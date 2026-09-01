# SEEN Platform - Development Guide

## Project Overview

**SEEN by CREOVA** is a React/TypeScript platform for interactive, multilingual story content with audio, video, and community features.

- **Status**: Pre-launch audit complete
- **System Score**: 38/100 (requires critical fixes)
- **Launch Status**: NOT READY

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18.3.1 + TypeScript |
| **Build** | Vite 6.3.5 |
| **Styling** | Tailwind CSS 4.1.12 + Radix UI |
| **Animation** | Motion (Framer Motion) |
| **State** | Context API (StoryStateContext, AuthContext) |
| **Backend** | Supabase |
| **Languages** | EN, FR, ES |
| **Roles** | viewer, creator, moderator, admin |

## Project Structure

```
src/app/
├── data/
│   ├── content.ts              # Type definitions + sample data (2 stories)
│   ├── storyDatabase.ts        # Complete story data (12 stories) [SOURCE OF TRUTH]
│   ├── storyService.ts         # Data access layer functions
│   ├── types.ts                # TypeScript interfaces
│   └── demoData.ts             # Test data helpers
├── context/
│   ├── StoryStateContext.tsx   # Global state (language, intent, role, progress)
│   ├── AuthContext.tsx         # Authentication & roles
│   └── NavigationProvider.tsx   # Screen routing
├── screens/
│   ├── ForYouScreen.tsx        # Personalized feed
│   ├── ExploreScreen.tsx       # Content discovery
│   ├── LibraryScreen.tsx       # User's reading list
│   ├── ProfileScreen.tsx       # User settings
│   └── OnboardingScreen.tsx    # Initial setup
├── components/
│   ├── NavigationBar.tsx       # Header with logo & buttons
│   ├── StoryCard.tsx           # Story display component
│   ├── StoryReader.tsx         # Content player
│   └── ...other components
└── App.tsx                     # Main router & initialization
```

## Critical Issues (BLOCKING)

### 1. Data Source Conflict ⚠️
**Problem**: Two conflicting story databases exist
- `content.ts`: 2 stories
- `storyDatabase.ts`: 12 stories ← **USE THIS**

**Action**: Delete `content.ts`, use `storyDatabase.ts` as single source of truth

### 2. Incomplete Stories 🚧
**Problem**: 4 of 12 stories have missing chapters (22 total chapters incomplete)
- `black-atlantic-canada` (6 chapters)
- `what-we-carry` (5 chapters)
- `small-histories` (6 chapters)
- `work-worth` (5 chapters)

**Action**: Generate remaining content

### 3. Dead Search Button 🔍
**Problem**: Search button in NavigationBar has no implementation
- File: `src/app/components/NavigationBar.tsx`
- Line: onClick handler logs only

**Action**: Implement search using Fuse.js

### 4. Chapter Architecture Flaw 🏗️
**Problem**: Chapters are nested inside StoryWorld objects, cannot be independently queried
- Cannot look up chapters by storyWorldId + chapterId
- Breaks modularity and API design

**Action**: Refactor to separate chapter references

## Custom Skills / Commands

### Audit & Analysis
```bash
# Full audit (Critical/High/Medium/Low issues)
npm run audit:full

# Check data consistency
npm run validate:content

# CMF compliance audit
npm run audit:cmf

# Runtime testing
npm run test:runtime
```

### Critical Fixes
```bash
# Fix all 4 CRITICAL issues at once
npm run fix:critical

# Or fix individually:
npm run fix:data-conflict
npm run fix:search-button
npm run fix:chapter-architecture
npm run generate:missing-chapters
```

### New Features (from awesome-design-md, svgl, Open-Generative-AI)
```bash
# Create DESIGN.md (design system as code)
npm run create:design-system

# Add search with Fuse.js
npm run implement:search

# Add favorites/bookmarks
npm run add:favorites

# Convert to multi-studio editor
npm run setup:multi-studio-editor
```

## Data Flow Architecture

```
User Input
    ↓
[StoryStateContext] - Global state (language, intent, role, progress, a11y)
    ↓
[AuthContext] - User auth & permissions
    ↓
[NavigationProvider] - Screen routing
    ↓
[Screens] (ForYou, Explore, Library, Profile)
    ↓
[storyService] - Data access layer
    ↓
[storyDatabase] - Story worlds + chapters + media
```

## Language & Multilingual Support

Languages: `en` (English), `fr` (French), `es` (Spanish)

Fallback order: preferred lang → English → first available

**Issue**: Fallback logic untested across all content

## Roles & Permissions

```typescript
type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';

// Current status: Structure defined, enforcement untested
// TODO: Verify role-based access in all screens
```

## Recommended Development Workflow

### Phase 1: Critical Fixes (Week 1)
1. Resolve data source conflict (delete content.ts)
2. Generate missing 22 chapters
3. Implement search button with Fuse.js
4. Refactor chapter storage

### Phase 2: Design System & Components (Week 2)
1. Create DESIGN.md for AI-assisted UI generation
2. Add favorites/bookmarks store
3. Implement multi-studio editor
4. Update component library

### Phase 3: Testing & Validation (Week 3)
1. Runtime testing (browser, feeds, auth, i18n)
2. CMF compliance audit
3. Multilingual content validation
4. Role-based permission testing
5. Media file hosting verification

### Phase 4: Polish & Launch (Week 4)
1. Performance optimization
2. Accessibility review
3. Error handling & edge cases
4. Final QA

## Key Files to Edit

| Issue | File | Priority |
|-------|------|----------|
| Data conflict | `src/app/data/content.ts` | DELETE ASAP |
| Search button | `src/app/components/NavigationBar.tsx` | CRITICAL |
| Chapter structure | `src/app/data/storyDatabase.ts` | CRITICAL |
| Story data | `src/app/data/storyDatabase.ts` | CRITICAL |
| Type definitions | `src/app/data/types.ts` | HIGH |
| Global state | `src/app/context/StoryStateContext.tsx` | HIGH |

## Resources Used

- **Design System**: [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) - DESIGN.md pattern
- **Search & Assets**: [svgl](https://github.com/pheralb/svgl) - Favorites store, Fuse.js search
- **Editor Architecture**: [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI) - Multi-studio tabs, file upload

## Getting Started

```bash
# Install dependencies
npm install fuse.js

# Start dev server
npm run dev

# Run audit
npm run audit:full

# Apply critical fixes
npm run fix:critical
```

## System Score Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| Content Availability | 50/100 | 4 of 12 stories incomplete |
| Functional Completeness | 30/100 | Search dead, no runtime testing |
| Data Integrity | 40/100 | Source conflicts, nested chapters |
| Multilingual Support | 50/100 | System exists, untested |
| Compliance Readiness | 0/100 | CMF audit not performed |
| Architecture Quality | 35/100 | Multiple data layers |
| User Permissions | 25/100 | Structure exists, enforcement untested |
| **TOTAL** | **38/100** | **NOT READY FOR LAUNCH** |

## Next Steps

1. ✅ Audit complete (38/100)
2. 🔄 Apply critical fixes (target: 75/100)
3. 🔄 Implement design system & features (target: 90/100)
4. ⏳ Comprehensive testing & validation (target: 95/100)
5. ⏳ Launch readiness (target: 100/100)

---

**Last Updated**: 2025-02-XX  
**Audit Status**: COMPLETE  
**Launch Status**: NOT READY  
**Next Audit**: After critical fixes applied
