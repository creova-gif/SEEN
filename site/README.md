# SEEN website (`site/`)

The customer-facing website for SEEN: what it is, who it is for, beta status, and a clear way into the app. It is a separate deployment from the app in the repo root, with its own domain, and it links back to creova.one. The only link between the two sites is navigation; they share no auth, cookies or analytics.

Static, no dependencies, three pages (EN at `/`, FR at `/fr/`, ES at `/es/`). All copy lives in `src/content.mjs`; FR and ES are drafts until a native speaker reviews them.

```bash
cd site
npm run build      # writes dist/
npm run check      # node:test checks: key parity, links, a11y basics, no third-party requests
```

Node 18 or newer. Nothing to install.

## Configuration (environment variables at build time)

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | unset | The website's public URL. Set it once the domain exists: it turns on canonical, hreflang and `sitemap.xml`. Not set means none of those are written |
| `APP_URL` | `https://seen-sigma-eight.vercel.app` | Where "Try the demo app" goes. Change to the app's own domain when it has one |
| `CREOVA_URL` | `https://creova.one` | Where the links back to CREOVA go |

## Deploying (its own Vercel project)

Create a new Vercel project from this repo with **Root Directory = `site`**. `site/vercel.json` already sets the build command, output directory and security headers (strict CSP, since the site loads nothing from other origins). Add the custom domain in that project and set `SITE_URL` and `APP_URL`. Do not reuse the app's project (`seen`).

## Rules for this site

- Describe only what exists. The app runs on sample data today; say so. Planned items are labelled planned.
- Name no real organisation as a partner without a signed agreement.
- State the beta date only as the owner has confirmed it (currently: January 2027, to be confirmed). creova.one also carries a beta date, so change both together.
- No scripts, trackers, fonts or images from other origins without updating the CSP and the "no cookies, no analytics" line in the footer.
- Link to terms and privacy pages from the footer once they are published. They do not exist yet.
