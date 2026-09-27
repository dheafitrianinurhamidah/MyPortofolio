// Kualitas akhir (spec §3.11, §6, §7): meta pratinjau tautan, ikon, URL relatif, tanpa error, gambar, batas ukuran.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { readJpegInfo } = require('./helpers/jpeg');

const SITE_URL = 'https://dheafitrianinurhamidah.github.io/MyPortofolio/';
const SITE = path.join(__dirname, '..', 'site');
const KB = 1024;
const desktopOnly = info => test.skip(info.project.name !== 'desktop', 'pemeriksaan file cukup sekali');

test('head has canonical, Open Graph and Twitter tags with absolute URLs', async ({ page }) => {
  await page.goto('/');
  const attr = (selector, name = 'content') => page.locator(selector).getAttribute(name);
  const description = 'Portofolio Dhea Fitriani Nur Hamidah, Payment Officer di Telkom Corporate University. Administrasi, keuangan, event, dan marketing.';
  expect(await attr('link[rel="canonical"]', 'href')).toBe(SITE_URL);
  expect(await attr('meta[property="og:url"]')).toBe(SITE_URL);
  expect(await attr('meta[property="og:image"]')).toBe(SITE_URL + 'assets/og-image.jpg');
  expect(await attr('meta[property="og:type"]')).toBe('website');
  expect(await attr('meta[property="og:title"]')).toBe('Dhea Fitriani Nur Hamidah · Portofolio');
  expect(await attr('meta[property="og:description"]')).toBe(description);
  expect(await attr('meta[property="og:locale"]')).toBe('id_ID');
  expect(await attr('meta[property="og:locale:alternate"]')).toBe('en_US');
  expect(await attr('meta[name="twitter:card"]')).toBe('summary_large_image');
  await expect(page).toHaveTitle('Dhea Fitriani Nur Hamidah · Portofolio');
  expect(await attr('meta[name="description"]')).toBe(description);
});

test('og-image is a 1200x630 JPEG without EXIF within 300 KB', ({}, info) => {
  desktopOnly(info);
  const file = path.join(SITE, 'assets', 'og-image.jpg');
  expect(readJpegInfo(file)).toEqual({ width: 1200, height: 630, hasExif: false });
  expect(fs.statSync(file).size).toBeLessThanOrEqual(300 * KB);
});

test('favicon and apple-touch-icon are linked and served', async ({ page, request }) => {
  await page.goto('/');
  expect(await page.locator('link[rel="icon"]').getAttribute('href')).toBe('favicon.svg');
  expect(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')).toBe('apple-touch-icon.png');
  const svg = await request.get('/favicon.svg');
  expect(svg.status()).toBe(200);
  expect(svg.headers()['content-type']).toContain('image/svg+xml');
  const png = await request.get('/apple-touch-icon.png');
  expect(png.status()).toBe(200);
  expect(png.headers()['content-type']).toContain('image/png');
});

test('all internal links and sources are relative and point to existing files', ({}, info) => {
  desktopOnly(info);
  const html = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
  const urls = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  const internal = urls.filter(u => !/^(https?:|mailto:|#|data:)/.test(u));
  expect(internal.length).toBeGreaterThan(20);
  for (const u of internal) {
    expect(u, 'harus relatif agar jalan di /MyPortofolio/').not.toMatch(/^\//);
    expect(fs.existsSync(path.join(SITE, decodeURI(u.split(/[?#]/)[0]))), `file ada: ${u}`).toBe(true);
  }
});

test('page loads without console errors', async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/');
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 30));
    }
  });
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});

test('every image has alt text and loads', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('img');
  const count = await images.count();
  expect(count).toBe(12);
  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveAttribute('alt', /\S/);
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test('stylesheet and scripts stay within their size budgets', ({}, info) => {
  desktopOnly(info);
  const size = rel => fs.statSync(path.join(SITE, rel)).size;
  expect(size('css/styles.css')).toBeLessThan(25 * KB);
  expect(size('js/main.js')).toBeLessThan(12 * KB);
  expect(size('js/i18n-en.js')).toBeLessThan(20 * KB);
});
