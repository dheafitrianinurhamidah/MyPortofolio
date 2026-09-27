// Keputusan privasi (spec §6): nomor HP tidak boleh muncul di website, dalam format apa pun.
// Nomornya sendiri sengaja tidak ditulis di repo publik ini. Tes mencari potongan 11 digit
// (tanpa 0 atau +62 di depan) yang sidik jari SHA-256-nya sama dengan nomor tersebut.
const { test, expect } = require('@playwright/test');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { walk } = require('./helpers/files');

const SITE = path.join(__dirname, '..', 'site');
const PHONE_SHA256 = '7cc564bbc24746ebb4e8612eae9a55ecf141ec80586de9a3687cb7953f955bd2';
const TEXT_FILE = /\.(html|css|js|svg|json|txt|xml|webmanifest)$/;

const sha256 = text => crypto.createHash('sha256').update(text).digest('hex');

/** true bila `text` memuat nomor ber-hash `hash` (`length` digit), dengan pemisah apa pun di antara digitnya. */
function containsNumber(text, hash = PHONE_SHA256, length = 11) {
  const digits = text.replace(/\D/g, '');
  for (let i = 0; i + length <= digits.length; i++) {
    if (sha256(digits.slice(i, i + length)) === hash) return true;
  }
  return false;
}

test('number detector finds a number written with separators or +62', ({}, info) => {
  test.skip(info.project.name !== 'desktop', 'pemeriksaan logika cukup sekali');
  const fake = sha256('81234567890');
  expect(containsNumber('Hubungi +62 812-3456-7890 ya', fake)).toBe(true);
  expect(containsNumber('0812 3456 7890', fake)).toBe(true);
  expect(containsNumber('2024 – 2025 · 975/1000 · 3.91', fake)).toBe(false);
});

test('no phone number or WhatsApp link in any site text file', ({}, info) => {
  test.skip(info.project.name !== 'desktop', 'pemeriksaan file cukup sekali');
  const files = walk(SITE).filter(f => TEXT_FILE.test(f));
  expect(files.length).toBeGreaterThan(3);
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    expect(containsNumber(text), f).toBe(false);
    expect(text, f).not.toMatch(/wa\.me|api\.whatsapp\.com/);
  }
});

test('rendered page shows no phone number', async ({ page }) => {
  await page.goto('/');
  expect(containsNumber(await page.content())).toBe(false);
});
