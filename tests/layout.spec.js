// Tampilan gaya B1 (spec §4): token warna, font, tata letak responsif, foto lingkaran, fokus, area sentuh.
const { test, expect } = require('@playwright/test');

const box = locator => locator.boundingBox();

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('design tokens match the B1 palette', async ({ page }) => {
  const token = name => page.evaluate(n => getComputedStyle(document.documentElement).getPropertyValue(n).trim().toUpperCase(), name);
  expect(await token('--bg')).toBe('#FFF8F2');
  expect(await token('--surface')).toBe('#FFFFFF');
  expect(await token('--ink')).toBe('#1F2A44');
  expect(await token('--muted')).toBe('#5B6475');
  expect(await token('--accent')).toBe('#B5502F');
  expect(await token('--accent-ink')).toBe('#9A4226');
  expect(await token('--accent-soft')).toBe('#F7DFD2');
  expect(await token('--ring')).toBe('#E0A184');
  expect(await token('--gold')).toBe('#E3A857');
  expect(await token('--line')).toBe('#EADFD6');
});

test('body text uses Plus Jakarta Sans', async ({ page }) => {
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family.startsWith('"Plus Jakarta Sans"')).toBe(true);
});

test('no horizontal overflow at 360, 390 and 1280px', async ({ page }) => {
  for (const width of [360, 390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth, `lebar ${width}px`).toBeLessThanOrEqual(clientWidth);
  }
});

test('profile photo renders as a circle inside a square box', async ({ page }) => {
  const img = page.locator('.avatar__img');
  const b = await box(img);
  expect(Math.abs(b.width - b.height)).toBeLessThanOrEqual(1);
  expect(b.width).toBeGreaterThanOrEqual(200);
  const style = await img.evaluate(el => ({ radius: getComputedStyle(el).borderRadius, fit: getComputedStyle(el).objectFit }));
  expect(style).toEqual({ radius: '50%', fit: 'cover' });
});

test('hero is two columns on desktop and stacked with photo first on mobile', async ({ page }, info) => {
  const text = await box(page.locator('.hero__text'));
  const media = await box(page.locator('.hero__media'));
  if (info.project.name === 'desktop') {
    expect(media.x).toBeGreaterThanOrEqual(text.x + text.width - 1);
  } else {
    expect(media.y + media.height).toBeLessThanOrEqual(text.y + 1);
  }
});

test('stats are 4 across on desktop and 2x2 on mobile', async ({ page }, info) => {
  // Diukur dalam satu panggilan (satu frame): bagian ini sedang beranimasi muncul saat halaman dibuka.
  const ys = await page.locator('.stat').evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().top)));
  expect(ys).toHaveLength(4);
  if (info.project.name === 'desktop') {
    expect(new Set(ys).size).toBe(1);
  } else {
    expect(ys[1]).toBe(ys[0]);
    expect(ys[3]).toBe(ys[2]);
    expect(ys[2]).toBeGreaterThan(ys[0]);
  }
});

test('header stays at the top after scrolling to contact', async ({ page }) => {
  await page.locator('#kontak').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const header = await box(page.locator('.site-header'));
  expect(Math.round(header.y)).toBe(0);
});

test('keyboard focus shows a 3px accent outline', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'fokus keyboard diuji di desktop');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveClass(/skip-link/);
  const outline = await focused.evaluate(el => ({ width: getComputedStyle(el).outlineWidth, color: getComputedStyle(el).outlineColor }));
  expect(outline).toEqual({ width: '3px', color: 'rgb(181, 80, 47)' });
});

test('touch targets are at least 44px on mobile', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'area sentuh diuji di HP');
  const targets = page.locator('.menu-toggle, .lang-switch button, .hero__actions a, .filter, .brand, .footer__top');
  const count = await targets.count();
  expect(count).toBeGreaterThanOrEqual(9);
  for (let i = 0; i < count; i++) {
    const t = targets.nth(i);
    if (!(await t.isVisible())) continue;
    const b = await box(t);
    expect(b.width, await t.evaluate(el => el.outerHTML.slice(0, 60))).toBeGreaterThanOrEqual(44);
    expect(b.height, await t.evaluate(el => el.outerHTML.slice(0, 60))).toBeGreaterThanOrEqual(44);
  }
});

test('focus ring stays clearly visible on navy backgrounds', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'fokus keyboard diuji di desktop');
  const ring = el => getComputedStyle(el).outlineColor;
  const email = page.locator('.contact__actions a').first();
  await email.focus();
  expect(await email.evaluate(ring)).toBe('rgb(224, 161, 132)');
  await page.locator('.gallery__item[data-id="g01"] .gallery__thumb').focus();
  await page.keyboard.press('Enter');
  const close = page.locator('.lightbox__close');
  await expect(close).toBeFocused();
  expect(await close.evaluate(ring)).toBe('rgb(224, 161, 132)');
});
