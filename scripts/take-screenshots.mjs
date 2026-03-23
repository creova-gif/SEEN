import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
const outputDir = path.join(__dirname, '..', 'public', 'screenshots', 'png');

fs.mkdirSync(outputDir, { recursive: true });

const pages = [
  { file: 'onboarding.html', name: 'seen-onboarding' },
  { file: 'for-you.html', name: 'seen-for-you' },
  { file: 'explore.html', name: 'seen-explore' },
  { file: 'story-chapter.html', name: 'seen-story-chapter' },
  { file: 'creator.html', name: 'seen-creator-dashboard' },
  { file: 'settings.html', name: 'seen-settings' },
];

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: 'new',
});

for (const page of pages) {
  const p = await browser.newPage();
  await p.setViewport({ width: 428, height: 926, deviceScaleFactor: 2 });
  const filePath = `file://${path.join(screenshotsDir, page.file)}`;
  await p.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  const outPath = path.join(outputDir, `${page.name}.png`);
  await p.screenshot({ path: outPath, fullPage: false });
  await p.close();
  console.log(`✓ ${page.name}.png`);
}

await browser.close();
console.log('\nAll done →', outputDir);
