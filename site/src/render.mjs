import { LANGS, copy } from "./content.mjs";

export const PAGES = ["home", "terms", "privacy"];

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Absolute URL path of a page: English at the root, "/fr/" and "/es/" for the others. */
export const pathFor = (lang, page = "home") =>
  (lang === "en" ? "/" : `/${lang}/`) + (page === "home" ? "" : `${page}/`);

/** Relative link from one page's URL path to another, so the site works on any host or sub-path. */
export function rel(from, to) {
  const depth = from.split("/").filter(Boolean).length;
  const target = to.replace(/^\//, "");
  return depth === 0 ? target || "./" : "../".repeat(depth) + target;
}

const list = (items) => `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

// The only policy on hosts that cannot send headers (GitHub Pages), so it must stay in every page.
const CSP =
  "default-src 'none'; style-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'none'";

/**
 * Render one page.
 * cfg: { appUrl, creovaUrl, siteUrl? }  siteUrl is optional; without it no canonical or hreflang is emitted.
 */
export function renderPage(lang, cfg, page = "home") {
  const c = copy[lang];
  const here = pathFor(lang, page);
  const toHome = rel(here, pathFor(lang, "home"));
  const isHome = page === "home";
  const anchor = (id) => (isHome ? `#${id}` : `${toHome}#${id}`);
  const abs = (l) => (cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, "") + pathFor(l, page) : null);

  const doc = isHome ? null : c.legal[page];
  const title = isHome ? c.title : `${doc.title} · SEEN`;
  const description = isHome ? c.description : doc.description;

  const alternates = cfg.siteUrl
    ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(l)}" />`).join("\n    ") +
      `\n    <link rel="alternate" hreflang="x-default" href="${abs("en")}" />\n    <link rel="canonical" href="${abs(lang)}" />\n    <meta property="og:url" content="${abs(lang)}" />`
    : "";

  const langLinks = LANGS.map((l) =>
    l === lang
      ? `<li><span aria-current="true" lang="${l}" aria-label="${escapeHtml(copy[l].langName)}">${l.toUpperCase()}</span></li>`
      : `<li><a href="${rel(here, pathFor(l, page))}" lang="${l}" hreflang="${l}" aria-label="${escapeHtml(copy[l].langName)}">${l.toUpperCase()}</a></li>`,
  ).join("");

  const main = isHome ? homeMain(c, cfg) : legalMain(c, doc, cfg, toHome);

  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Security-Policy" content="${CSP}" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="theme-color" content="#000000" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23000'/%3E%3Ctext x='32' y='45' font-size='38' font-family='sans-serif' font-weight='600' text-anchor='middle' fill='%23fff'%3ES%3C/text%3E%3C/svg%3E" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="SEEN by CREOVA" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta name="twitter:card" content="summary" />
    ${alternates}
    <link rel="stylesheet" href="${rel(here, "/styles.css")}" />
  </head>
  <body>
    <a class="skip" href="#main">${escapeHtml(c.skip)}</a>
    <div class="creova-bar">
      <div class="wrap bar-row">
        <img src="${rel(here, "/creova-mark.png")}" alt="" width="22" height="17" />
        <p>${escapeHtml(c.bar.text)} · <a href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">${escapeHtml(c.bar.link)}</a></p>
      </div>
    </div>
    <header class="site-header">
      <div class="wrap header-row">
        <a class="wordmark" href="${toHome}" aria-label="SEEN">SEEN</a>
        <div class="header-tools">
          <nav aria-label="${escapeHtml(c.footer.language)}">
            <ul class="pill">${langLinks}</ul>
          </nav>
          <a class="btn btn-dark btn-small" href="${escapeHtml(cfg.appUrl)}" rel="noopener">${escapeHtml(c.cta)}</a>
        </div>
        <nav class="main-nav" aria-label="${escapeHtml(c.navLabel)}">
          <ul class="nav">
            <li><a href="${anchor("what")}">${escapeHtml(c.nav.what)}</a></li>
            <li><a href="${anchor("creators")}">${escapeHtml(c.nav.creators)}</a></li>
            <li><a href="${anchor("viewers")}">${escapeHtml(c.nav.viewers)}</a></li>
            <li><a href="${anchor("beta")}">${escapeHtml(c.nav.beta)}</a></li>
            <li><a href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">${escapeHtml(c.nav.about)}</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="main">
${main}
    </main>

    <footer class="site-footer">
      <div class="wrap footer-row">
        <p>${escapeHtml(c.footer.line)} · <a href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">creova.one</a></p>
        <ul class="footer-links">
          <li><a href="${rel(here, pathFor(lang, "terms"))}">${escapeHtml(c.footer.terms)}</a></li>
          <li><a href="${rel(here, pathFor(lang, "privacy"))}">${escapeHtml(c.footer.privacyLink)}</a></li>
        </ul>
        <p class="note">${escapeHtml(c.footer.noTracking)}</p>
      </div>
    </footer>
  </body>
</html>
`;
}

function homeMain(c, cfg) {
  const app = escapeHtml(cfg.appUrl);
  return `      <section class="band band--dark hero" aria-labelledby="hero-title">
        <div class="hero-art" aria-hidden="true"></div>
        <div class="wrap hero-inner">
          <p class="eyebrow">${escapeHtml(c.hero.eyebrow)}</p>
          <h1 id="hero-title">${escapeHtml(c.hero.h1)}</h1>
          <p class="lead">${escapeHtml(c.hero.lead)}</p>
          <p class="actions">
            <a class="btn btn-gold" href="${app}" rel="noopener">${escapeHtml(c.cta)}</a>
            <a class="btn btn-ghost" href="#beta">${escapeHtml(c.hero.secondary)}</a>
          </p>
          <p class="note">${escapeHtml(c.hero.note)}</p>
        </div>
      </section>

      <section id="what" class="band band--beige" aria-labelledby="what-title">
        <div class="wrap">
          <h2 id="what-title">${escapeHtml(c.what.h2)}</h2>
          <div class="cards">
            ${c.what.cards.map((k) => `<article class="card"><h3>${escapeHtml(k.h3)}</h3><p>${escapeHtml(k.p)}</p></article>`).join("\n            ")}
          </div>
        </div>
      </section>

      <section id="creators" class="band band--light" aria-labelledby="creators-title">
        <div class="wrap split">
          <div>
            <h2 id="creators-title">${escapeHtml(c.creators.h2)}</h2>
            <p class="lead">${escapeHtml(c.creators.lead)}</p>
            <p>${escapeHtml(c.creators.p)}</p>
          </div>
          <div class="panel panel--outline">
            <h3>${escapeHtml(c.creators.listTitle)}</h3>
            ${list(c.creators.list)}
          </div>
        </div>
      </section>

      <section id="viewers" class="band band--soft" aria-labelledby="viewers-title">
        <div class="wrap split">
          <div>
            <h2 id="viewers-title">${escapeHtml(c.viewers.h2)}</h2>
            <p class="lead">${escapeHtml(c.viewers.lead)}</p>
            <p>${escapeHtml(c.viewers.p)}</p>
          </div>
          <div class="panel panel--outline">
            ${list(c.viewers.list)}
          </div>
        </div>
      </section>

      <section id="beta" class="band band--dark" aria-labelledby="beta-title">
        <div class="wrap">
          <h2 id="beta-title">${escapeHtml(c.beta.h2)}</h2>
          <div class="beta-grid">
            <div class="panel panel--now">
              <h3>${escapeHtml(c.beta.todayTitle)}</h3>
              <p>${escapeHtml(c.beta.today)}</p>
              <p class="actions"><a class="btn btn-gold" href="${app}" rel="noopener">${escapeHtml(c.cta)}</a></p>
            </div>
            <div class="panel panel--plan">
              <h3>${escapeHtml(c.beta.plannedTitle)}</h3>
              ${list(c.beta.plannedList)}
            </div>
          </div>
          <p class="note">${escapeHtml(c.beta.caveat)}</p>
        </div>
      </section>

      <section id="about" class="band band--beige" aria-labelledby="about-title">
        <div class="wrap">
          <h2 id="about-title">${escapeHtml(c.about.h2)}</h2>
          <p class="lead">${escapeHtml(c.about.p)}</p>
          <p class="actions"><a class="btn btn-dark" href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">${escapeHtml(c.about.link)}</a></p>
        </div>
      </section>`;
}

function legalMain(c, doc, cfg, toHome) {
  const l = c.legal;
  return `      <article class="wrap legal">
        <p><a href="${toHome}">${escapeHtml(l.back)}</a></p>
        <h1>${escapeHtml(doc.title)}</h1>
        <p class="note">${escapeHtml(l.updatedLabel)}: <time datetime="${l.updated}">${l.updated}</time></p>
        ${doc.sections.map((s) => `<section><h2>${escapeHtml(s.h2)}</h2><p>${escapeHtml(s.p)}</p></section>`).join("\n        ")}
        <section id="contact"><h2>${escapeHtml(l.contactH2)}</h2><p>${escapeHtml(l.contactP)} <a href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">creova.one</a>.</p></section>
      </article>`;
}
