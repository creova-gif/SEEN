// Builds the SEEN website into site/dist. No dependencies.
//   SITE_URL    defaults to https://seen.creova.one. Set it to an empty string to build without canonical, hreflang,
//               sitemap or CNAME (for example for a local preview).
//   APP_URL     where "Try the demo app" points. Defaults to the current production demo.
//   CREOVA_URL  where the links back to CREOVA point.
import { mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LANGS } from "./src/content.mjs";
import { renderPage, pathFor, PAGES } from "./src/render.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

export const config = {
  siteUrl: process.env.SITE_URL ?? "https://seen.creova.one",
  appUrl: process.env.APP_URL || "https://seen-sigma-eight.vercel.app",
  creovaUrl: process.env.CREOVA_URL || "https://creova.one",
};

export function build(cfg = config, outDir = dist) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const dir = join(outDir, pathFor(lang, page));
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), renderPage(lang, cfg, page));
    }
  }
  copyFileSync(join(root, "src", "styles.css"), join(outDir, "styles.css"));
  copyFileSync(join(root, "src", "creova-mark.png"), join(outDir, "creova-mark.png"));

  const site = cfg.siteUrl.replace(/\/$/, "");
  // GitHub Pages: keep the custom domain across deploys and skip Jekyll processing.
  writeFileSync(join(outDir, ".nojekyll"), "");
  if (site) writeFileSync(join(outDir, "CNAME"), new URL(site).hostname + "\n");
  writeFileSync(
    join(outDir, "robots.txt"),
    `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ""}`,
  );
  if (site) {
    const urls = LANGS.flatMap((l) => PAGES.map((p) => `  <url><loc>${site}${pathFor(l, p)}</loc></url>`)).join("\n");
    writeFileSync(
      join(outDir, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  } else {
    console.warn("SITE_URL is not set: building without canonical, hreflang or sitemap.");
  }
  return outDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Built ${build()}`);
}
