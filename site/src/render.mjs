import { LANGS, copy } from "./content.mjs";

const escapeHtml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** URL path of a language's page: "/" for English, "/fr/" and "/es/" for the others. */
export const pathFor = (lang) => (lang === "en" ? "/" : `/${lang}/`);

const list = (items) => `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

/**
 * Render one language's page.
 * cfg: { appUrl, creovaUrl, siteUrl? }  siteUrl is optional; without it no canonical or hreflang is emitted.
 */
export function renderPage(lang, cfg) {
  const c = copy[lang];
  const base = lang === "en" ? "" : "../";
  const abs = (l) => (cfg.siteUrl ? cfg.siteUrl.replace(/\/$/, "") + pathFor(l) : null);

  const alternates = cfg.siteUrl
    ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(l)}" />`).join("\n    ") +
      `\n    <link rel="alternate" hreflang="x-default" href="${abs("en")}" />\n    <link rel="canonical" href="${abs(lang)}" />\n    <meta property="og:url" content="${abs(lang)}" />`
    : "";

  const langLinks = LANGS.map((l) =>
    l === lang
      ? `<li><span aria-current="true" lang="${l}">${escapeHtml(copy[l].langName)}</span></li>`
      : `<li><a href="${pathFor(l)}" lang="${l}" hreflang="${l}">${escapeHtml(copy[l].langName)}</a></li>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(c.title)}</title>
    <meta name="description" content="${escapeHtml(c.description)}" />
    <meta name="theme-color" content="#000000" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="SEEN by CREOVA" />
    <meta property="og:title" content="${escapeHtml(c.title)}" />
    <meta property="og:description" content="${escapeHtml(c.description)}" />
    <meta name="twitter:card" content="summary" />
    ${alternates}
    <link rel="stylesheet" href="${base}styles.css" />
  </head>
  <body>
    <a class="skip" href="#main">${escapeHtml(c.skip)}</a>
    <header class="site-header">
      <div class="wrap header-row">
        <a class="wordmark" href="${pathFor(lang)}" aria-label="SEEN">SEEN</a>
        <nav aria-label="${escapeHtml(c.navLabel)}">
          <ul class="nav">
            <li><a href="#what">${escapeHtml(c.nav.what)}</a></li>
            <li><a href="#creators">${escapeHtml(c.nav.creators)}</a></li>
            <li><a href="#viewers">${escapeHtml(c.nav.viewers)}</a></li>
            <li><a href="#beta">${escapeHtml(c.nav.beta)}</a></li>
            <li><a href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">${escapeHtml(c.nav.about)}</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="main">
      <section class="hero wrap" aria-labelledby="hero-title">
        <p class="eyebrow">${escapeHtml(c.hero.eyebrow)}</p>
        <h1 id="hero-title">${escapeHtml(c.hero.h1)}</h1>
        <p class="lead">${escapeHtml(c.hero.lead)}</p>
        <p class="actions">
          <a class="btn btn-primary" href="${escapeHtml(cfg.appUrl)}" rel="noopener">${escapeHtml(c.cta)}</a>
          <a class="btn btn-secondary" href="#beta">${escapeHtml(c.hero.secondary)}</a>
        </p>
        <p class="note">${escapeHtml(c.hero.note)}</p>
      </section>

      <section id="what" class="wrap section" aria-labelledby="what-title">
        <h2 id="what-title">${escapeHtml(c.what.h2)}</h2>
        <div class="cards">
          ${c.what.cards.map((k) => `<article class="card"><h3>${escapeHtml(k.h3)}</h3><p>${escapeHtml(k.p)}</p></article>`).join("\n          ")}
        </div>
      </section>

      <section id="creators" class="wrap section" aria-labelledby="creators-title">
        <h2 id="creators-title">${escapeHtml(c.creators.h2)}</h2>
        <p class="lead">${escapeHtml(c.creators.lead)}</p>
        <p>${escapeHtml(c.creators.p)}</p>
        <h3>${escapeHtml(c.creators.listTitle)}</h3>
        ${list(c.creators.list)}
      </section>

      <section id="viewers" class="wrap section" aria-labelledby="viewers-title">
        <h2 id="viewers-title">${escapeHtml(c.viewers.h2)}</h2>
        <p class="lead">${escapeHtml(c.viewers.lead)}</p>
        <p>${escapeHtml(c.viewers.p)}</p>
        ${list(c.viewers.list)}
      </section>

      <section id="beta" class="wrap section" aria-labelledby="beta-title">
        <h2 id="beta-title">${escapeHtml(c.beta.h2)}</h2>
        <h3>${escapeHtml(c.beta.todayTitle)}</h3>
        <p>${escapeHtml(c.beta.today)}</p>
        <p class="actions"><a class="btn btn-primary" href="${escapeHtml(cfg.appUrl)}" rel="noopener">${escapeHtml(c.cta)}</a></p>
        <h3>${escapeHtml(c.beta.plannedTitle)}</h3>
        ${list(c.beta.plannedList)}
        <p class="note">${escapeHtml(c.beta.caveat)}</p>
      </section>

      <section id="about" class="wrap section" aria-labelledby="about-title">
        <h2 id="about-title">${escapeHtml(c.about.h2)}</h2>
        <p>${escapeHtml(c.about.p)}</p>
        <p class="actions"><a class="btn btn-secondary" href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">${escapeHtml(c.about.link)}</a></p>
      </section>
    </main>

    <footer class="site-footer">
      <div class="wrap footer-row">
        <p>${escapeHtml(c.footer.line)} · <a href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">creova.one</a></p>
        <nav aria-label="${escapeHtml(c.footer.language)}">
          <ul class="langs">${langLinks}</ul>
        </nav>
        <p class="note">${escapeHtml(c.footer.privacy)}</p>
      </div>
    </footer>
  </body>
</html>
`;
}
