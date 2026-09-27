// Filter galeri dan tampilan foto besar (spec §5).
const { test, expect } = require('@playwright/test');
const GALLERY = require('./fixtures/gallery');

const byId = id => GALLERY.find(g => g.id === id);
const thumb = (page, id) => page.locator(`.gallery__item[data-id="${id}"] .gallery__thumb`);

async function expectShowing(page, id, counter) {
  const g = byId(id);
  await expect(page.locator('.lightbox__img')).toHaveAttribute('src', new RegExp(`full/${g.slug}\\.jpg$`));
  await expect(page.locator('.lightbox__counter')).toHaveText(counter);
}

test('filters show 11, 3 and 8 photos and mark the active filter', async ({ page }) => {
  await page.goto('/#galeri');
  const visible = () => page.locator('.gallery__item:not([hidden])').count();
  await page.click('.filter[data-filter="profesional"]');
  expect(await visible()).toBe(3);
  await expect(page.locator('.filter[data-filter="profesional"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.filter[data-filter="semua"]')).toHaveAttribute('aria-pressed', 'false');
  await page.click('.filter[data-filter="budaya"]');
  expect(await visible()).toBe(8);
  await page.click('.filter[data-filter="semua"]');
  expect(await visible()).toBe(11);
});

test('clicking a thumbnail opens the full photo with its caption and counter', async ({ page }) => {
  await page.goto('/#galeri');
  await thumb(page, 'g02').click();
  await expect(page.locator('dialog.lightbox')).toHaveAttribute('open', '');
  await expectShowing(page, 'g02', '2 / 11');
  await expect(page.locator('.lightbox__caption')).toHaveText(byId('g02').caption);
  await expect(page.locator('.lightbox__img')).toHaveAttribute('alt', /\S/);
  expect(page.url()).not.toContain('/full/');
});

test('next and previous wrap around within the active filter', async ({ page }) => {
  await page.goto('/#galeri');
  await thumb(page, 'g11').click();
  await expectShowing(page, 'g11', '11 / 11');
  await page.click('.lightbox__next');
  await expectShowing(page, 'g01', '1 / 11');
  await page.click('.lightbox__prev');
  await expectShowing(page, 'g11', '11 / 11');
  await page.keyboard.press('Escape');
  await page.click('.filter[data-filter="profesional"]');
  await thumb(page, 'g03').click();
  await expectShowing(page, 'g03', '3 / 3');
  await page.click('.lightbox__next');
  await expectShowing(page, 'g01', '1 / 3');
});

test('arrow keys move between photos and Escape closes, returning focus to the thumbnail', async ({ page }) => {
  await page.goto('/#galeri');
  await thumb(page, 'g05').click();
  await expectShowing(page, 'g05', '5 / 11');
  await page.keyboard.press('ArrowRight');
  await expectShowing(page, 'g06', '6 / 11');
  await page.keyboard.press('ArrowLeft');
  await expectShowing(page, 'g05', '5 / 11');
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog.lightbox')).not.toHaveAttribute('open', '');
  await expect(thumb(page, 'g05')).toBeFocused();
});

test('clicking the dark backdrop closes the lightbox', async ({ page }) => {
  await page.goto('/#galeri');
  await thumb(page, 'g01').click();
  await expect(page.locator('dialog.lightbox')).toHaveAttribute('open', '');
  await page.mouse.click(5, 5);
  await expect(page.locator('dialog.lightbox')).not.toHaveAttribute('open', '');
});

test('lightbox caption follows the active language', async ({ page }) => {
  await page.goto('/#galeri');
  await page.locator('.lang-switch [data-lang="en"]').click();
  await thumb(page, 'g01').click();
  const english = await page.evaluate(() => window.I18N_EN['gallery.g01']);
  await expect(page.locator('.lightbox__caption')).toHaveText(english);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('a thumbnail links to the full-size photo', async ({ page }) => {
    await page.goto('/');
    await expect(thumb(page, 'g01')).toHaveAttribute('href', 'assets/img/gallery/full/g01-telkom-forum-expert-q2-2026.jpg');
  });
});
