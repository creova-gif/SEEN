# SEEN website (`site/`)

The customer-facing website for SEEN: what it is, who it is for, beta status, and a clear way into the app. It is a separate deployment from the app in the repo root, with its own domain, and it links back to creova.one. The only link between the two sites is navigation; they share no auth, cookies or analytics.

Static, no dependencies. Nine pages: home, terms and privacy in EN (`/`, `/terms/`, `/privacy/`), FR (`/fr/...`) and ES (`/es/...`). Page copy is in `src/content.mjs`; terms and privacy are in `src/legal.mjs`. FR and ES are drafts until a native speaker reviews them, and **the terms and privacy text must be reviewed by a lawyer before the domain goes live**. Links are relative, so the output works on any host or sub-path.

```bash
cd site
npm run build      # writes dist/
npm run check      # node:test checks: key parity, every link resolves, a11y basics, no third-party requests
```

Node 18 or newer. Nothing to install.

## Configuration (environment variables at build time)

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | unset | The website's public URL. Set it once the domain exists: it turns on canonical, hreflang and `sitemap.xml`. Not set means none of those are written |
| `APP_URL` | `https://seen-sigma-eight.vercel.app` | Where "Try the demo app" goes. Change to the app's own domain when it has one |
| `CREOVA_URL` | `https://creova.one` | Where the links back to CREOVA go |

## Hosting

The build is plain static files in `dist/`, so any static host works. Recommended: **Firebase Hosting (Google Cloud)**, because the repo is private (GitHub Pages on a private repo needs a paid GitHub plan), it has a free tier, supports the security headers in `firebase.json`, and serves a custom domain with HTTPS. The app keeps its own deployment; do not reuse it for the website.

One-time setup (needs the owner's Google account; not done yet):

```bash
npm install -g firebase-tools && firebase login
firebase projects:create <project-id>          # or choose an existing Google Cloud project
cd site && firebase use --add                   # writes .firebaserc (commit it once the id is chosen)
SITE_URL=https://yourseenintheapp.com npm run build && firebase deploy --only hosting
```

Then in the Firebase console: Hosting → Add custom domain → `yourseenintheapp.com`, and add the DNS records it shows at the registrar. A CI deploy can come later with a service account; it is not set up.

Alternatives, if preferred: **GitHub Pages** (works once the repo is public or the account is on a paid plan; no custom headers, so the meta CSP in each page is the only policy); a **Cloud Storage bucket behind a load balancer** (more setup and a monthly cost). WordPress is not recommended: it would replace this checked, dependency-free site, and its plugins and themes tend to add cookies and third-party requests, which would make the "no cookies, no analytics" statements untrue.

## Rules for this site

- Describe only what exists. The app runs on sample data today; say so. Planned items are labelled planned.
- Name no real organisation as a partner without a signed agreement.
- State the beta date only as the owner has confirmed it (currently: January 2027, to be confirmed). creova.one also carries a beta date, so change both together.
- No scripts, trackers, fonts or images from other origins without updating the CSP and the "no cookies, no analytics" line in the footer.
- Keep `src/legal.mjs` true to what the site does. If you add analytics, cookies, a form or any third-party request, change the privacy notice, the footer line and the CSP first.
- The app's own terms and privacy notice (for real accounts) are separate and must be published before anyone can sign up.
