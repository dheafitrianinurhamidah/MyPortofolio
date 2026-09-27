// Berkas pendukung repo (spec §10): workflow deploy GitHub Pages dan panduan README.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop', 'pemeriksaan file cukup sekali'));

test('deploy workflow publishes only the site folder from main', () => {
  const y = read('.github/workflows/deploy.yml');
  expect(y).toMatch(/branches:\s*\[\s*main\s*\]/);
  expect(y).toContain('workflow_dispatch');
  expect(y).toContain('actions/checkout@v7');
  expect(y).toContain('actions/configure-pages@v6');
  expect(y).toContain('actions/upload-pages-artifact@v5');
  expect(y).toMatch(/path:\s*site\s*$/m);
  expect(y).toContain('actions/deploy-pages@v5');
  expect(y).toMatch(/pages:\s*write/);
  expect(y).toMatch(/id-token:\s*write/);
  expect(y).toMatch(/contents:\s*read/);
});

test('README explains editing, photos, tests and deployment', () => {
  const r = read('README.md');
  for (const heading of ['## Mengubah isi', '## Menambah foto', '## Melihat di komputer', '## Menjalankan tes', '## Deploy']) {
    expect(r).toContain(heading);
  }
  expect(r).toContain('https://dheafitrianinurhamidah.github.io/MyPortofolio/');
  expect(r).toContain('npm run serve');
});
