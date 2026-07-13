# SEEN

**An interactive, branching narrative app exploring identity and "soft power" through story — chapters, reader choices, and a companion mobile app.**

![Status](https://img.shields.io/badge/status-active_development-yellow)
![License](https://img.shields.io/badge/license-proprietary-red)
![Stack](https://img.shields.io/badge/stack-React_Native_%2F_Vite-blue)

## What this is

SEEN began as CREOVA's clothing line concept ("A Season of Soft Power") and has grown into an interactive storytelling app: readers move through chapters with branching choices, a story builder, a content library, and admin/moderation tooling for managing submitted content. It spans both a web app and a mobile (Expo) companion app.

[ADD SCREENSHOT HERE]

## Status: In active development

This is the largest and most feature-complete of CREOVA's early-stage prototypes (100+ custom screens/components), but it has not been through a content-moderation or user-testing pass yet, and the relationship between the original clothing-line concept and the current interactive-story direction should be clarified before external use.

### Roadmap
- Clarify product direction (clothing line vs. narrative app vs. both)
- Content moderation review before any public-facing use
- Backend wiring for user-generated story content

## Quickstart

```bash
npm i
npm run dev          # web
# for mobile (Expo):
cd mobile && npm i && npm start
```

## Folder overview

- `src/app/components/` — web app screens (story builder, library, navigation flow)
- `mobile/` — Expo companion app (chapters, explore, create, moderate)

## Contributing

See the [org-wide CONTRIBUTING.md](https://github.com/creova-gif/.github/blob/main/CONTRIBUTING.md) for guidelines, including our AI-assisted contribution policy.

## License

Proprietary — © CREOVA. All rights reserved.
