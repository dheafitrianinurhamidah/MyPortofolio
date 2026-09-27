// Dua bahasa (spec §5): teks ID di HTML, teks EN di window.I18N_EN, tombol ID · EN.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const FILE_URL = pathToFileURL(path.join(__dirname, '..', 'site', 'index.html')).href;
const INDONESIAN_WORDS = /\b(dan|yang|untuk|dengan|dari|Sekarang|Unduh|Hubungi|Tentang|bersama)\b/;

const keysInPage = page => page.evaluate(() => {
  const keys = new Set();
  document.querySelectorAll('[data-i18n]').forEach(el => keys.add(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-html]').forEach(el => keys.add(el.dataset.i18nHtml));
  document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => keys.add(pair.split(':')[1])));
  return [...keys].sort();
});

const switchTo = async (page, lang) => {
  await page.locator(`.lang-switch [data-lang="${lang}"]`).click();
  await expect(page.locator('html')).toHaveAttribute('lang', lang);
};

test('default language is Indonesian', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('.lang-switch [data-lang="id"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.lang-switch [data-lang="en"]')).toHaveAttribute('aria-pressed', 'false');
});

test('page keys and English dictionary match exactly', async ({ page }) => {
  await page.goto('/');
  const dictionaryKeys = await page.evaluate(() => Object.keys(window.I18N_EN).sort());
  expect(await keysInPage(page)).toEqual(dictionaryKeys);
});

test('switching to EN translates every tagged element and the document metadata', async ({ page }) => {
  await page.goto('/');
  await switchTo(page, 'en');
  const mismatches = await page.evaluate(() => {
    const dict = window.I18N_EN;
    const bad = [];
    document.querySelectorAll('[data-i18n]').forEach(el => { if (el.textContent !== dict[el.dataset.i18n]) bad.push(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { if (el.innerHTML !== dict[el.dataset.i18nHtml]) bad.push(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (el.getAttribute(attr) !== dict[key]) bad.push(`${key}@${attr}`);
    }));
    return bad;
  });
  expect(mismatches).toEqual([]);
  const dict = await page.evaluate(() => window.I18N_EN);
  await expect(page).toHaveTitle(dict['meta.title']);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', dict['meta.description']);
  await expect(page.locator('h1')).toHaveText('Hi, I’m Dhea');
  await expect(page.locator('.lang-switch [data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.lang-switch [data-lang="id"]')).toHaveAttribute('aria-pressed', 'false');
});

test('English mode leaves no common Indonesian words on screen', async ({ page }) => {
  await page.goto('/');
  await switchTo(page, 'en');
  const text = await page.evaluate(() => document.body.innerText);
  expect(text.match(INDONESIAN_WORDS)).toBeNull();
});

test('switching back to ID restores the original Indonesian text', async ({ page }) => {
  await page.goto('/');
  const snapshot = () => page.evaluate(() => ({
    text: document.body.innerText,
    title: document.title,
    alt: document.querySelector('.avatar__img').alt,
    description: document.querySelector('meta[name="description"]').content,
  }));
  const before = await snapshot();
  await switchTo(page, 'en');
  expect((await snapshot()).text).not.toBe(before.text);
  await switchTo(page, 'id');
  expect(await snapshot()).toEqual(before);
});

test('language choice survives a reload', async ({ page }) => {
  await page.goto('/');
  await switchTo(page, 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.lang-switch [data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
});

test('?lang=en opens English; ?lang=id beats a saved EN choice; ?lang=EN works; ?lang=fr falls back to ID', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/?lang=en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.goto('/?lang=id');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await page.goto('/?lang=EN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await switchTo(page, 'id');
  expect(page.url()).toContain('lang=id');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/?lang=fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  expect(errors).toEqual([]);
});

test('language switch still works when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } });
  });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await switchTo(page, 'en');
  await switchTo(page, 'id');
  expect(errors).toEqual([]);
});

test('English mode has no horizontal overflow at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  await switchTo(page, 'en');
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test('language switch works from the file system', async ({ page }) => {
  await page.goto(FILE_URL);
  await switchTo(page, 'en');
  await expect(page.locator('h1')).toHaveText('Hi, I’m Dhea');
});

test('menu button label follows the language', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'menu ☰ hanya ada di HP');
  await page.goto('/');
  await switchTo(page, 'en');
  const dict = await page.evaluate(() => window.I18N_EN);
  const toggle = page.locator('.menu-toggle');
  await expect(toggle).toHaveAttribute('aria-label', dict['menu.open']);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-label', dict['menu.close']);
});
