// Menu HP dan animasi muncul (spec §4.5, §5).
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const FILE_URL = pathToFileURL(path.join(__dirname, '..', 'site', 'index.html')).href;

test('mobile menu opens, closes on link click and on Escape', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'menu ☰ hanya ada di HP');
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await expect(toggle).toHaveAttribute('aria-label', 'Buka menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Tutup menu');
  await expect(page.locator('#site-nav a[href="#pengalaman"]')).toBeVisible();
  await page.locator('#site-nav a[href="#pengalaman"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#site-nav')).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Buka menu');
});

test('desktop shows nav links and hides the menu toggle', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'tata letak desktop');
  await page.goto('/');
  await expect(page.locator('.menu-toggle')).toBeHidden();
  await expect(page.locator('#site-nav a[href="#galeri"]')).toBeVisible();
});

test('sections fade in once scrolled into view', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#kontak')).not.toHaveClass(/is-visible/);
  await expect(page.locator('#kontak')).toHaveCSS('opacity', '0');
  await page.locator('#prestasi').scrollIntoViewIfNeeded();
  await expect(page.locator('#prestasi')).toHaveClass(/is-visible/);
  await expect(page.locator('#prestasi')).toHaveCSS('opacity', '1');
});

test('reduced motion shows every section immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const reveals = page.locator('.reveal');
  const count = await reveals.count();
  expect(count).toBeGreaterThanOrEqual(7);
  for (let i = 0; i < count; i++) await expect(reveals.nth(i)).toHaveCSS('opacity', '1');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('content stays visible without JavaScript', async ({ page }) => {
    await page.goto('/');
    const reveals = page.locator('.reveal');
    const count = await reveals.count();
    for (let i = 0; i < count; i++) await expect(reveals.nth(i)).toHaveCSS('opacity', '1');
  });
});

test('page works when opened straight from the file system', async ({ page }, info) => {
  await page.goto(FILE_URL);
  await expect(page.locator('html')).toHaveClass(/\bjs\b/);
  if (info.project.name === 'mobile') {
    await page.locator('.menu-toggle').click();
    await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');
  } else {
    await page.locator('#prestasi').scrollIntoViewIfNeeded();
    await expect(page.locator('#prestasi')).toHaveClass(/is-visible/);
  }
});

// --- Temuan tinjauan akhir ---

test('every section appears when the page is zoomed in (320×200 viewport)', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 200 });
  await page.goto('/');
  // Setiap bagian dibawa ke layar satu per satu (bukan digulir cepat: saat komputer sibuk,
  // observer bisa melewatkan posisi gulir yang hanya sekejap).
  const reveals = page.locator('.reveal');
  const count = await reveals.count();
  for (let i = 0; i < count; i++) {
    await reveals.nth(i).evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await expect(reveals.nth(i)).toHaveClass(/is-visible/);
  }
});

test('sections stay visible when main.js fails to load', async ({ page }) => {
  await page.route('**/js/main.js', route => route.abort());
  await page.goto('/');
  const reveals = page.locator('.reveal');
  const count = await reveals.count();
  for (let i = 0; i < count; i++) await expect(reveals.nth(i)).toHaveCSS('opacity', '1');
});

test('sections stay visible when a script error stops start-up', async ({ page }) => {
  await page.addInitScript(() => { window.IntersectionObserver = function () { throw new Error('rusak'); }; });
  await page.goto('/');
  const reveals = page.locator('.reveal');
  const count = await reveals.count();
  for (let i = 0; i < count; i++) await expect(reveals.nth(i)).toHaveCSS('opacity', '1');
});

test('opening the mobile menu moves keyboard focus to the first menu link', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'menu ☰ hanya ada di HP');
  await page.goto('/');
  await page.locator('.menu-toggle').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#site-nav a[href="#tentang"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#site-nav a[href="#pengalaman"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-toggle')).toBeFocused();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
});

test.describe('without JavaScript on a phone', () => {
  test.use({ javaScriptEnabled: false });

  test('menu links stay reachable and the ☰ button is hidden', async ({ page }, info) => {
    test.skip(info.project.name !== 'mobile', 'menu ☰ hanya ada di HP');
    await page.goto('/');
    await expect(page.locator('.menu-toggle')).toBeHidden();
    await expect(page.locator('#site-nav a[href="#galeri"]')).toBeVisible();
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
