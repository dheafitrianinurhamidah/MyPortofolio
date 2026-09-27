// tools/optimize_images.py harus aman dipakai pemilik website: tidak crash tanpa foto asli,
// tidak menimpa CV yang sudah diganti, dan memotong foto profil dari tengah.
// Setiap tes menjalankan skrip di salinan proyek sementara, bukan di folder asli.
const { test, expect } = require('@playwright/test');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CV_SOURCE = 'CV Dhea Fitriani N.H. 2025.pdf';
const CV_SITE = path.join('site', 'assets', 'CV-Dhea-Fitriani-Nur-Hamidah.pdf');
const PROFILE_SOURCE = 'WhatsApp Image 2026-09-27 at 22.23.24.jpeg';

test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'skrip cukup diuji sekali'));

function tempProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portofolio-'));
  fs.mkdirSync(path.join(dir, 'tools'));
  fs.copyFileSync(path.join(ROOT, 'tools', 'optimize_images.py'), path.join(dir, 'tools', 'optimize_images.py'));
  return dir;
}

const runScript = dir => spawnSync('python3', [path.join(dir, 'tools', 'optimize_images.py')], { encoding: 'utf8' });
const python = code => spawnSync('python3', ['-c', code], { encoding: 'utf8' });

test('image script skips missing originals instead of crashing', () => {
  const dir = tempProject();
  const result = runScript(dir);
  expect(result.stderr).not.toContain('Traceback');
  expect(result.status).toBe(0);
  expect(result.stdout).toContain('dilewati');
});

test('image script never overwrites a CV that is already in site/assets', () => {
  const dir = tempProject();
  fs.writeFileSync(path.join(dir, CV_SOURCE), '%PDF-lama');
  fs.mkdirSync(path.join(dir, 'site', 'assets'), { recursive: true });
  fs.writeFileSync(path.join(dir, CV_SITE), '%PDF-baru');
  const result = runScript(dir);
  expect(result.status, result.stderr).toBe(0);
  expect(fs.readFileSync(path.join(dir, CV_SITE), 'utf8')).toBe('%PDF-baru');
});

test('image script copies the CV when site/assets has none yet', () => {
  const dir = tempProject();
  fs.writeFileSync(path.join(dir, CV_SOURCE), '%PDF-lama');
  const result = runScript(dir);
  expect(result.status, result.stderr).toBe(0);
  expect(fs.readFileSync(path.join(dir, CV_SITE), 'utf8')).toBe('%PDF-lama');
});

test('image script centres the profile crop of a landscape photo', () => {
  const dir = tempProject();
  const source = path.join(dir, PROFILE_SOURCE);
  // 300×100: sepertiga kiri merah, tengah hijau, kanan biru → potongan bujur sangkar yang benar = hijau semua
  const made = python(`from PIL import Image
im = Image.new('RGB', (300, 100), (220, 0, 0))
im.paste((0, 170, 0), (100, 0, 200, 100))
im.paste((0, 0, 220), (200, 0, 300, 100))
im.save(${JSON.stringify(source)})`);
  expect(made.status, made.stderr).toBe(0);
  const result = runScript(dir);
  expect(result.status, result.stderr).toBe(0);
  const read = python(`import json
from PIL import Image
im = Image.open(${JSON.stringify(path.join(dir, 'site', 'assets', 'img', 'profile.jpg'))}).convert('RGB')
print(json.dumps({'size': im.size, 'left': im.getpixel((20, 400)), 'right': im.getpixel((780, 400))}))`);
  const out = JSON.parse(read.stdout);
  expect(out.size).toEqual([800, 800]);
  for (const [r, g, b] of [out.left, out.right]) {
    expect(g).toBeGreaterThan(120);
    expect(r).toBeLessThan(80);
    expect(b).toBeLessThan(80);
  }
});
