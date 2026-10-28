// Run with: npm run check (inside site/). Uses only node:test, so no install step is needed.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { LANGS, copy } from "../src/content.mjs";
import { PAGES, pathFor } from "../src/render.mjs";
import { build } from "../build.mjs";

const cfg = { siteUrl: "https://example.test", appUrl: "https://app.example.test", creovaUrl: "https://creova.one" };

/** Flatten an object to "a.b.0.c" -> value. */
function flatten(o, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(o)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

test("every language has exactly the same keys and no empty strings", () => {
  const en = flatten(copy.en);
  for (const lang of LANGS) {
    const flat = flatten(copy[lang]);
    assert.deepEqual(Object.keys(flat).sort(), Object.keys(en).sort(), `${lang} keys differ from en`);
    for (const [k, v] of Object.entries(flat)) assert.ok(String(v).trim().length > 0, `${lang}.${k} is empty`);
  }
});

test("French and Spanish copy is translated, not copied from English", () => {
  const en = flatten(copy.en);
  // "Contact" is the same word in French; the rest are codes or ISO dates.
  const sameAllowed = new Set(["htmlLang", "langName", "legal.updated", "legal.contactH2"]);
  for (const lang of ["fr", "es"]) {
    for (const [k, v] of Object.entries(flatten(copy[lang]))) {
      if (sameAllowed.has(k)) continue;
      assert.notEqual(v, en[k], `${lang}.${k} is identical to English`);
    }
  }
});

const out = build(cfg, mkdtempSync(join(tmpdir(), "seen-site-")));
const file = (lang, page) => join(out, pathFor(lang, page), "index.html");
const read = (lang, page) => readFileSync(file(lang, page), "utf8");

for (const lang of LANGS) {
  for (const page of PAGES) {
    test(`${lang}/${page}: structure, links and accessibility basics`, () => {
      const html = read(lang, page);
      assert.match(html, new RegExp(`<html lang="${copy[lang].htmlLang}">`));
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, "exactly one h1");
      assert.ok(html.includes('id="main"'), "skip link target exists");
      assert.ok(!/undefined|\[object|\bTODO\b|\bTBD\b|\bXXX\b|[Ll]orem ipsum|\{\{/.test(html), "no leaked placeholders");

      // every in-page anchor points at an element that exists
      for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
        if (id === "main") continue;
        assert.ok(html.includes(`id="${id}"`), `anchor #${id} has a target`);
      }
      // the link back to creova.one is on every page; the demo link is on the home page
      assert.ok(html.includes(`href="${cfg.creovaUrl}"`), "links back to creova.one");
      if (page === "home") assert.ok(html.includes(`href="${cfg.appUrl}"`), "links to the app");
      // footer links to terms and privacy on every page
      assert.ok(html.includes("terms/"), "footer links to terms");
      assert.ok(html.includes("privacy/"), "footer links to privacy");
      // external links carry rel="noopener"
      for (const [tag] of html.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) {
        assert.ok(tag.includes('rel="noopener"'), `external link missing rel: ${tag}`);
      }
      // canonical and every language alternate of this same page when SITE_URL is set
      assert.ok(html.includes('rel="canonical"'));
      for (const l of LANGS) {
        assert.ok(html.includes(`hreflang="${l}" href="${cfg.siteUrl}${pathFor(l, page)}"`), `hreflang ${l}`);
      }
      assert.ok(html.includes('hreflang="x-default"'));
      // the policy that holds on hosts that cannot set headers
      assert.ok(html.includes("Content-Security-Policy"), "meta CSP present");
    });
  }
}

test("every relative link and stylesheet resolves to a file in the build", () => {
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const from = file(lang, page);
      const html = readFileSync(from, "utf8");
      for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|data:|#)/.test(href)) continue;
        const clean = href.split("#")[0];
        if (!clean) continue;
        let target = resolve(dirname(from), clean);
        if (!/\.[a-z0-9]+$/.test(target)) target = join(target, "index.html");
        assert.ok(existsSync(target) && statSync(target).isFile(), `${lang}/${page}: ${href} does not resolve`);
      }
    }
  }
});

test("language switcher keeps the reader on the same page", () => {
  assert.ok(read("en", "privacy").includes('href="../fr/privacy/"'));
  assert.ok(read("fr", "terms").includes('href="../../es/terms/"'));
  assert.ok(read("es", "home").includes('href="../"'));
});

test("legal pages say what the site actually does", () => {
  for (const lang of LANGS) {
    for (const page of ["terms", "privacy"]) {
      const sections = copy[lang].legal[page].sections;
      assert.ok(sections.length >= 8, `${lang}/${page} has its sections`);
    }
  }
  // the privacy notice must disclose the third parties the demo app contacts
  for (const lang of LANGS) {
    const text = JSON.stringify(copy[lang].legal.privacy);
    assert.ok(text.includes("Google Fonts") && text.includes("Unsplash"), `${lang} privacy names the demo's third parties`);
  }
});

test("without SITE_URL no canonical, hreflang or sitemap is written", () => {
  const dir = build({ ...cfg, siteUrl: "" }, mkdtempSync(join(tmpdir(), "seen-site-nourl-")));
  const html = readFileSync(join(dir, "index.html"), "utf8");
  assert.ok(!html.includes('rel="canonical"') && !html.includes('hreflang="x-default"'));
  assert.ok(!existsSync(join(dir, "sitemap.xml")));
});

test("GitHub Pages files: CNAME carries the site's host, .nojekyll present", () => {
  assert.equal(readFileSync(join(out, "CNAME"), "utf8"), "example.test\n");
  assert.ok(existsSync(join(out, ".nojekyll")));
  const dir = build({ ...cfg, siteUrl: "" }, mkdtempSync(join(tmpdir(), "seen-site-nocname-")));
  assert.ok(!existsSync(join(dir, "CNAME")), "no CNAME without SITE_URL");
});

test("build output contains every page, styles, robots and a sitemap listing them all", () => {
  for (const lang of LANGS) for (const page of PAGES) assert.ok(existsSync(file(lang, page)), `${lang}/${page}`);
  for (const f of ["styles.css", "robots.txt", "sitemap.xml"]) assert.ok(existsSync(join(out, f)), `${f} exists`);
  const sitemap = readFileSync(join(out, "sitemap.xml"), "utf8");
  for (const lang of LANGS) for (const page of PAGES) assert.ok(sitemap.includes(`${cfg.siteUrl}${pathFor(lang, page)}`));
});

test("headline accent, photos, fonts and licence are in place", () => {
  for (const lang of LANGS) {
    const c = copy[lang];
    assert.ok(c.hero.h1.includes(c.hero.accent), `${lang}: accent word is part of the headline`);
    const html = read(lang, "home");
    assert.ok(html.includes(`<em>${c.hero.accent}</em>`), `${lang}: accent rendered`);
    for (const k of ["hero", "creators", "viewers"]) {
      assert.ok(c.photos[k].length > 40, `${lang}: ${k} photo has a real description`);
      assert.ok(html.includes(`alt="${c.photos[k].replace(/"/g, "&quot;")}"`), `${lang}: ${k} alt text rendered`);
    }
    for (const [tag] of html.matchAll(/<img [^>]*>/g)) {
      assert.match(tag, /\swidth="\d+"/, `img has width: ${tag}`);
      assert.match(tag, /\sheight="\d+"/, `img has height: ${tag}`);
      assert.match(tag, /\salt="/, `img has alt: ${tag}`);
    }
  }
  for (const f of ["fonts/instrument-serif-latin-400-normal.woff2", "fonts/instrument-serif-latin-400-italic.woff2", "fonts/OFL.txt", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "img/hero-portrait.jpg", "img/creators-laptop.jpg", "img/viewers-chess.jpg"]) {
    assert.ok(existsSync(join(out, f)), `${f} is in the build`);
  }
  const css = readFileSync(join(out, "styles.css"), "utf8");
  for (const [, u] of css.matchAll(/url\("([^"]+)"\)/g)) assert.ok(existsSync(join(out, u)), `css asset ${u} exists`);
});

test("the site makes no third-party requests", () => {
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const html = read(lang, page);
      assert.ok(!/<script|<iframe|<img[^>]+src="https?:/.test(html), "no scripts, iframes or remote images");
    }
  }
  assert.ok(!/@import|url\(\s*["']?https?:/.test(readFileSync(join(out, "styles.css"), "utf8")));
});
