import { LANGS, copy } from "./content.mjs";
import { mascot, spot, sparkle, burst } from "./art.mjs";

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
// Fonts and images are served from this site; nothing is requested from other origins.
const CSP =
  "default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'none'";

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

  const main = isHome ? homeMain(c, cfg, here) : legalMain(c, doc, cfg, toHome);

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
    <link rel="icon" type="image/png" sizes="192x192" href="${rel(here, "/icons/icon-192.png")}" />
    <link rel="apple-touch-icon" href="${rel(here, "/icons/apple-touch-icon.png")}" />
    <meta name="apple-mobile-web-app-title" content="SEEN" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="SEEN by CREOVA" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta name="twitter:card" content="summary" />
    ${cfg.siteUrl ? `<meta property="og:image" content="${cfg.siteUrl.replace(/\/$/, "")}/icons/icon-512.png" />` : ""}
    ${alternates}
    <link rel="preload" href="${rel(here, "/fonts/instrument-serif-latin-400-italic.woff2")}" as="font" type="font/woff2" crossorigin />
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
          <a class="btn btn-primary btn-small" href="${escapeHtml(cfg.appUrl)}" rel="noopener">${escapeHtml(c.cta)}</a>
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

const h1Html = (c) => {
  const t = escapeHtml(c.hero.h1), a = escapeHtml(c.hero.accent);
  return t.replace(a, `<em>${a}</em>`);
};

const spark = (cls, size, fill) =>
  `<svg class="spark ${cls}" viewBox="-14 -14 28 28" width="${size}" height="${size}" aria-hidden="true" focusable="false">${sparkle(0, 0, 1, fill)}</svg>`;

function homeMain(c, cfg, here) {
  const app = escapeHtml(cfg.appUrl);
  const url = (name) => rel(here, `/img/${name}`);
  const img = (name, alt, w, h, eager = false) =>
    `<img src="${url(name)}" alt="${escapeHtml(alt)}" width="${w}" height="${h}"${eager ? "" : ' loading="lazy"'} decoding="async" />`;
  const phone = (name, alt, cls = "", eager = false) => `<div class="phone ${cls}">${img(name, alt, 508, 1100, eager)}</div>`;
  const bubble = (text, cls = "") => `<p class="bubble ${cls}" aria-hidden="true">${escapeHtml(text)}</p>`;
  const words = c.marquee.map((w) => `<span>${escapeHtml(w)}</span>`).join("");
  const shots = [
    ["app-onboard.jpg", c.photos.shotOnboard],
    ["app-home.jpg", c.photos.shotHome],
    ["app-explore.jpg", c.photos.shotExplore],
    ["app-creators.jpg", c.photos.shotCreators],
  ];
  const panels = [
    ["story", "lang", c.what.cards[0]],
    ["creator", "create", c.what.cards[1]],
    ["funding", "fund", c.what.cards[2]],
  ];
  return `      <section class="band band--black hero" aria-labelledby="hero-title">
        <div class="focus-lines" aria-hidden="true"></div>
        <div class="wrap hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">${escapeHtml(c.hero.eyebrow)}</p>
            <h1 id="hero-title">${h1Html(c)}</h1>
            <p class="lead">${escapeHtml(c.hero.lead)}</p>
            <p class="actions">
              <a class="btn btn-primary" href="${app}" rel="noopener">${escapeHtml(c.cta)}</a>
              <a class="btn btn-ghost" href="#beta">${escapeHtml(c.hero.secondary)}</a>
            </p>
            <p class="note">${escapeHtml(c.hero.note)}</p>
          </div>
          <div class="hero-stage">
            ${phone("app-creators.jpg", c.photos.shotCreators, "phone--back", true)}
            ${phone("app-home.jpg", c.photos.shotHome, "phone--front", true)}
            <div class="hero-mascot">${bubble(c.hero.bubble, "bubble--hero")}${mascot("hello", 1)}</div>
            ${spark("spark--a", 34, "#ffd166")}${spark("spark--b", 22, "#c084fc")}${spark("spark--c", 28, "#fff")}
          </div>
        </div>
      </section>

      <div class="marquee" aria-hidden="true"><div class="marquee-track"><div class="marquee-group">${words}</div><div class="marquee-group">${words}</div></div></div>

      <section id="what" class="band band--black" aria-labelledby="what-title">
        <div class="wrap">
          <h2 id="what-title">${escapeHtml(c.what.h2)}</h2>
          <div class="panels">
            ${panels
              .map(
                ([k, art, card]) => `<article class="mpanel mpanel--${k}">
              <div class="paper"><div class="tone" aria-hidden="true"></div>${spot(art)}</div>
              <div class="caption"><h3>${escapeHtml(card.h3)}</h3><p>${escapeHtml(card.p)}</p></div>
            </article>`,
              )
              .join("\n            ")}
          </div>
        </div>
      </section>

      <section class="band band--surface tour" aria-labelledby="tour-title">
        <div class="wrap">
          <h2 id="tour-title">${escapeHtml(c.showcase.h2)}</h2>
          <p class="lead">${escapeHtml(c.showcase.p)}</p>
          <div class="shots">
            ${shots
              .map(([name, alt], i) => `<figure class="shot shot--${i + 1}">${phone(name, alt)}<figcaption>${escapeHtml(c.showcase.captions[i])}</figcaption></figure>`)
              .join("\n            ")}
          </div>
          <p class="note">${escapeHtml(c.showcase.note)}</p>
        </div>
      </section>

      <section id="creators" class="band band--elevated band--creator" aria-labelledby="creators-title">
        <div class="wrap split">
          <div>
            <h2 id="creators-title">${escapeHtml(c.creators.h2)}</h2>
            <p class="lead">${escapeHtml(c.creators.lead)}</p>
            <p>${escapeHtml(c.creators.p)}</p>
            <div class="quest-card">
              <h3>${escapeHtml(c.creators.listTitle)}</h3>
              ${list(c.creators.list)}
            </div>
          </div>
          <figure class="polaroid polaroid--a">
            <span class="tape" aria-hidden="true"></span>
            ${img("creators-laptop.jpg", c.photos.creators, 960, 639)}
            <div class="figure-mascot">${bubble(c.bubbles.creators)}${mascot("read", 2)}</div>
          </figure>
        </div>
      </section>

      <section id="viewers" class="band band--surface band--story" aria-labelledby="viewers-title">
        <div class="wrap split split--flip">
          <div>
            <h2 id="viewers-title">${escapeHtml(c.viewers.h2)}</h2>
            <p class="lead">${escapeHtml(c.viewers.lead)}</p>
            <p>${escapeHtml(c.viewers.p)}</p>
            <ul class="chips">${c.viewers.list.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
          </div>
          <figure class="polaroid polaroid--b">
            <span class="tape" aria-hidden="true"></span>
            ${img("viewers-chess.jpg", c.photos.viewers, 960, 639)}
            <div class="figure-mascot figure-mascot--left">${bubble(c.bubbles.viewers)}${mascot("wow", 3)}</div>
          </figure>
        </div>
      </section>

      <section id="beta" class="band band--black" aria-labelledby="beta-title">
        <div class="wrap">
          <h2 id="beta-title">${escapeHtml(c.beta.h2)}</h2>
          <div class="quest">
            <div class="stage stage--now">
              <span class="ribbon">${escapeHtml(c.beta.now)}</span>
              <h3><span class="live-dot" aria-hidden="true"></span>${escapeHtml(c.beta.todayTitle)}</h3>
              <p>${escapeHtml(c.beta.today)}</p>
              <p class="actions"><a class="btn btn-primary" href="${app}" rel="noopener">${escapeHtml(c.cta)}</a></p>
            </div>
            <div class="trail" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>
            <div class="stage stage--next">
              <span class="ribbon ribbon--next">${escapeHtml(c.beta.next)}</span>
              <h3>${escapeHtml(c.beta.plannedTitle)}</h3>
              ${list(c.beta.plannedList)}
            </div>
          </div>
          <p class="note">${escapeHtml(c.beta.caveat)}</p>
        </div>
      </section>

      <section class="band band--surface closer" aria-labelledby="closer-title">
        <div class="wrap closer-grid">
          <figure class="arch">
            ${img("hero-portrait.jpg", c.photos.hero, 533, 800)}
            <span class="arch-burst" aria-hidden="true">${burst("burst", "#c084fc")}</span>
          </figure>
          <div class="closer-copy">
            <div class="figure-mascot figure-mascot--inline">${bubble(c.bubbles.closer)}${mascot("joy", 4)}</div>
            <h2 id="closer-title">${escapeHtml(c.closer.h2)}</h2>
            <p class="lead">${escapeHtml(c.closer.p)}</p>
            <p class="actions"><a class="btn btn-primary btn-big" href="${app}" rel="noopener">${escapeHtml(c.cta)}</a></p>
          </div>
        </div>
      </section>

      <section id="about" class="band band--black about" aria-labelledby="about-title">
        <div class="wrap">
          <h2 id="about-title">${escapeHtml(c.about.h2)}</h2>
          <p class="lead">${escapeHtml(c.about.p)}</p>
          <p class="actions"><a class="btn btn-ghost" href="${escapeHtml(cfg.creovaUrl)}" rel="noopener">${escapeHtml(c.about.link)}</a></p>
          <p class="note">${escapeHtml(c.photos.credit)}</p>
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
