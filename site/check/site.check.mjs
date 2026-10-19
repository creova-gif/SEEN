// Run with: npm run check (inside site/). Uses only node:test, so no install step is needed.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { LANGS, copy } from "../src/content.mjs";
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
  const sameAllowed = new Set(["htmlLang", "langName"]);
  for (const lang of ["fr", "es"]) {
    for (const [k, v] of Object.entries(flatten(copy[lang]))) {
      if (sameAllowed.has(k)) continue;
      assert.notEqual(v, en[k], `${lang}.${k} is identical to English`);
    }
  }
});

const out = build(cfg, mkdtempSync(join(tmpdir(), "seen-site-")));
const page = (lang) => readFileSync(join(out, lang === "en" ? "index.html" : `${lang}/index.html`), "utf8");

for (const lang of LANGS) {
  test(`${lang}: structure, links and accessibility basics`, () => {
    const html = page(lang);
    assert.match(html, new RegExp(`<html lang="${copy[lang].htmlLang}">`));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, "exactly one h1");
    assert.ok(html.includes('id="main"'), "skip link target exists");
    assert.ok(!/undefined|\[object/.test(html), "no leaked placeholders");

    // every in-page anchor points at an element that exists
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
      if (id === "main") continue;
      assert.ok(html.includes(`id="${id}"`), `anchor #${id} has a target`);
    }
    // the product demo and the link back to creova.one are present
    assert.ok(html.includes(`href="${cfg.appUrl}"`), "links to the app");
    assert.ok(html.includes(`href="${cfg.creovaUrl}"`), "links back to creova.one");
    // external links carry rel="noopener"
    for (const [tag] of html.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) {
      assert.ok(tag.includes('rel="noopener"'), `external link missing rel: ${tag}`);
    }
    // canonical and all alternates when SITE_URL is set
    assert.ok(html.includes('rel="canonical"'));
    for (const l of [...LANGS, "x-default"]) assert.ok(html.includes(`hreflang="${l}"`), `hreflang ${l}`);
  });
}

test("without SITE_URL no canonical, hreflang or sitemap is written", () => {
  const dir = build({ ...cfg, siteUrl: "" }, mkdtempSync(join(tmpdir(), "seen-site-nourl-")));
  const html = readFileSync(join(dir, "index.html"), "utf8");
  assert.ok(!html.includes('rel="canonical"') && !html.includes("hreflang=\"x-default\""));
  assert.ok(!existsSync(join(dir, "sitemap.xml")));
});

test("build output contains all pages, styles, robots and sitemap", () => {
  for (const f of ["index.html", "fr/index.html", "es/index.html", "styles.css", "robots.txt", "sitemap.xml"]) {
    assert.ok(existsSync(join(out, f)), `${f} exists`);
  }
});

test("the site makes no third-party requests", () => {
  for (const lang of LANGS) {
    const html = page(lang);
    assert.ok(!/<script|<iframe|<img[^>]+src="https?:/.test(html), "no scripts, iframes or remote images");
  }
  assert.ok(!/@import|url\(\s*["']?https?:/.test(readFileSync(join(out, "styles.css"), "utf8")));
});
