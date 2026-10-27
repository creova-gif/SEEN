# SEEN website (`site/`)

The customer-facing website for SEEN: what it is, who it is for, beta status, and a clear way into the app. It is a separate deployment from the app in the repo root, at `seen.creova.one`, and it links back to creova.one. The only link between the two sites is navigation; they share no auth, cookies or analytics.

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
| `SITE_URL` | `https://seen.creova.one` | The website's public URL: drives canonical, hreflang, `sitemap.xml` and the `CNAME` file. Set it to an empty string for a local preview without them |
| `APP_URL` | `https://seen-sigma-eight.vercel.app` | Where "Try the demo app" goes. Change to the app's own domain when it has one |
| `CREOVA_URL` | `https://creova.one` | Where the links back to CREOVA go |

## Hosting: GitHub Pages at seen.creova.one, DNS on Cloudflare

Same pattern as www.creova.one (GitHub Pages, DNS in Cloudflare). The SEEN source repo is private, and GitHub Pages on a private repo needs a paid plan, so the built site is published to a small **public** repo that holds only the generated files (no source, no secrets). The app keeps its own deployment.

One-time setup (owner actions; not done yet):

1. Create an empty public repo, for example `creova-gif/seen-site`.
2. Publish: `cd site && npm run check && npm run publish -- https://github.com/creova-gif/seen-site.git` (builds, copies `dist/` into the repo, commits, pushes; never force-pushes).
3. In that repo: Settings, Pages, deploy from branch `main`, folder `/`. Set the custom domain to `seen.creova.one` and tick Enforce HTTPS once it is available.
4. In Cloudflare DNS for creova.one: add `CNAME` `seen` pointing to `creova-gif.github.io`, **DNS only (grey cloud)** until GitHub has issued the certificate.
5. Security: verify `creova.one` under the GitHub account's Pages settings (domain verification), so nobody else can claim `seen.creova.one` if the record is ever left dangling.

To update the site later, run step 2 again. A workflow in the private repo can automate this with a deploy key; it is not set up.

Limits to know: GitHub Pages cannot send custom headers, so the policy in each page's `<meta>` tags (CSP, referrer) is all there is; `frame-ancestors` and `X-Frame-Options` cannot be set, which matters little for a static page with no forms or login. The app should get its own one-level subdomain next to this one (for example `seenapp.creova.one`); a name two levels deep such as `app.seen.creova.one` is not covered by Cloudflare's free certificate if it is ever proxied. Firebase Hosting (Google Cloud) remains a fallback if headers become necessary; `site/` works on any static host.

## Look and assets

The look mixes the app's branding with CREOVA's. From the app (`src/styles/seen-tokens.css`): pure black canvas, Fraunces headlines over Inter, white pill buttons with spaced uppercase labels, hairline dark cards, the story / creator / funding accent colours, the green "live" glow, and the app's own tagline (reused from `src/app/i18n/strings.ts` so the FR/ES wording matches). From CREOVA (`creova-gif/creova` DESIGN.md): oxblood `#2D1011`, beige `#CDBFAE`, gold `#C6A45A`, and the mark in the top bar.

- **Fonts**: Fraunces and Inter, open-licence (SIL OFL 1.1), self-hosted in `src/fonts/` with the licence in `src/fonts/OFL.txt`. Nothing is loaded from Google. CREOVA's Quasimoda is a licensed Adobe font and is not used.
- **Photos** (`src/img/`, resized from the public creova.one site): `hero-portrait.jpg`, `creators-laptop.jpg`, `viewers-chess.jpg`. They show real people from CREOVA's community and event work. Before relying on them for SEEN marketing, confirm CREOVA holds releases covering this use. They must not be captioned or described as SEEN users, creators or testimonials; the alt text only describes what is pictured.
- **Motion** is CSS only and switched off for visitors who prefer reduced motion.

## Rules for this site

- Describe only what exists. The app runs on sample data today; say so. Planned items are labelled planned.
- Name no real organisation as a partner without a signed agreement.
- State the beta date only as the owner has confirmed it (currently: January 2027, to be confirmed). creova.one also carries a beta date, so change both together.
- No scripts, trackers, fonts or images from other origins without updating the CSP and the "no cookies, no analytics" line in the footer. Every image needs a real description in all three languages and explicit width and height.
- Keep `src/legal.mjs` true to what the site does. If you add analytics, cookies, a form or any third-party request, change the privacy notice, the footer line and the CSP first.
- The app's own terms and privacy notice (for real accounts) are separate and must be published before anyone can sign up.
