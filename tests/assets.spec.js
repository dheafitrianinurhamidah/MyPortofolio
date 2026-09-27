// Aset hasil tools/optimize_images.py: ukuran, format, batas file, dan tanpa metadata EXIF.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { readJpegInfo } = require('./helpers/jpeg');
const GALLERY = require('./fixtures/gallery');

const SITE = path.join(__dirname, '..', 'site');
const site = rel => path.join(SITE, rel);
const img = rel => site(path.join('assets', 'img', rel));
const size = file => fs.statSync(file).size;

test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'pemeriksaan file cukup sekali'));

test('profile photo is an 800x800 JPEG without EXIF within 200 KB', () => {
  expect(readJpegInfo(img('profile.jpg'))).toEqual({ width: 800, height: 800, hasExif: false });
  expect(size(img('profile.jpg'))).toBeLessThanOrEqual(200 * 1024);
});

test('gallery thumbnails are 800px wide JPEGs without EXIF within 150 KB', () => {
  for (const g of GALLERY) {
    const f = img(`gallery/thumb/${g.slug}.jpg`);
    const i = readJpegInfo(f);
    expect(i.width, g.slug).toBe(800);
    expect(i.hasExif, g.slug).toBe(false);
    expect(size(f), g.slug).toBeLessThanOrEqual(150 * 1024);
  }
});

test('gallery full images have a long edge between 1000 and 1600px, no EXIF, within 450 KB', () => {
  for (const g of GALLERY) {
    const f = img(`gallery/full/${g.slug}.jpg`);
    const i = readJpegInfo(f);
    const edge = Math.max(i.width, i.height);
    expect(edge, g.slug).toBeLessThanOrEqual(1600);
    expect(edge, g.slug).toBeGreaterThanOrEqual(1000);
    expect(i.hasExif, g.slug).toBe(false);
    expect(size(f), g.slug).toBeLessThanOrEqual(450 * 1024);
  }
});

test('CV copy is a PDF', () => {
  expect(fs.readFileSync(site('assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf')).subarray(0, 5).toString()).toBe('%PDF-');
});

test('gallery fixture lists 3 professional and 8 cultural photos', () => {
  expect(GALLERY.map(g => g.id)).toEqual(['g01', 'g02', 'g03', 'g04', 'g05', 'g06', 'g07', 'g08', 'g09', 'g10', 'g11']);
  expect(GALLERY.filter(g => g.category === 'profesional')).toHaveLength(3);
  expect(GALLERY.filter(g => g.category === 'budaya')).toHaveLength(8);
});
