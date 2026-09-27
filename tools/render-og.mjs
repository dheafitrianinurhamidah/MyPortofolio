// Membuat gambar pratinjau tautan (site/assets/og-image.jpg, 1200×630) dari tools/og-image.html
// dan ikon Apple (site/apple-touch-icon.png, 180×180) dari site/favicon.svg.
// Pemakaian: npm run og   (memakai Google Chrome yang terpasang)
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

await page.goto(pathToFileURL(path.join(root, 'tools', 'og-image.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(site, 'assets', 'og-image.jpg'), type: 'jpeg', quality: 85 });

// Ikon Apple: favicon di atas latar terakota penuh (iOS membulatkan sudutnya sendiri).
const favicon = readFileSync(path.join(site, 'favicon.svg'), 'utf8').replace('<svg ', '<svg width="180" height="180" ');
await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<body style="margin:0;background:#B5502F">${favicon}</body>`);
await page.screenshot({ path: path.join(site, 'apple-touch-icon.png'), type: 'png' });

await browser.close();
console.log('Diperbarui: site/assets/og-image.jpg dan site/apple-touch-icon.png');
