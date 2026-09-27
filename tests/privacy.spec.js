// Keputusan privasi (spec §6): nomor HP tidak boleh muncul di website, dalam format apa pun.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { walk } = require('./helpers/files');

const SITE = path.join(__dirname, '..', 'site');
const PHONE = /(\+?62|0)[\s.-]?8[\s.-]?21[\s.-]?xxxx[\s.-]?xxxx/;
const PHONE_DIGITS = '821xxxxxxxx';
const TEXT_FILE = /\.(html|css|js|svg|json|txt|xml|webmanifest)$/;

test('no phone number or WhatsApp link in any site text file', ({}, info) => {
  test.skip(info.project.name !== 'desktop', 'pemeriksaan file cukup sekali');
  const files = walk(SITE).filter(f => TEXT_FILE.test(f));
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8');
    expect(text, f).not.toMatch(PHONE);
    expect(text.replace(/\D/g, ''), f).not.toContain(PHONE_DIGITS);
    expect(text, f).not.toMatch(/wa\.me|api\.whatsapp\.com/);
  }
});

test('rendered page shows no phone number', async ({ page }) => {
  await page.goto('/');
  expect((await page.content()).replace(/\D/g, '')).not.toContain(PHONE_DIGITS);
});
