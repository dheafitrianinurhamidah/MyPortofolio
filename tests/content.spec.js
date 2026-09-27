// Isi halaman bahasa Indonesia sesuai spec §3.
const { test, expect } = require('@playwright/test');
const GALLERY = require('./fixtures/gallery');

const LINKEDIN = 'https://www.linkedin.com/in/dheafitrianinurhamidah/';
const CV = 'assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('hero shows greeting, full name, role and summary', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Halo, saya Dhea');
  await expect(page.locator('h1 em')).toHaveText('Dhea');
  await expect(page.locator('.hero__name')).toHaveText('Dhea Fitriani Nur Hamidah');
  await expect(page.locator('.hero__role')).toHaveText('Payment Officer di PT Telkom Indonesia – Telkom Corporate University');
  await expect(page.locator('.hero__summary')).toHaveText('Profesional administrasi & keuangan yang teliti dan rapi, berpengalaman di event, MC, dan marketing.');
  await expect(page.locator('.pill')).toHaveText('Bandung, Indonesia');
});

test('hero actions link to contact, CV and LinkedIn', async ({ page }) => {
  const actions = page.locator('.hero__actions');
  await expect(actions.locator('.btn--primary')).toHaveAttribute('href', '#kontak');
  await expect(actions.locator('.btn--primary')).toHaveText('Hubungi Saya');
  await expect(actions.locator('.btn--ghost')).toHaveAttribute('href', CV);
  await expect(actions.locator('.btn--ghost')).toHaveAttribute('download', /.+/);
  await expect(actions.locator('.btn--ghost')).toHaveText('Unduh CV');
  const linkedin = actions.locator('.btn-icon--linkedin');
  await expect(linkedin).toHaveAttribute('href', LINKEDIN);
  await expect(linkedin).toHaveAttribute('target', '_blank');
  await expect(linkedin).toHaveAttribute('rel', /noopener/);
});

test('stats show the four highlight numbers', async ({ page }) => {
  await expect(page.locator('.stat__value')).toHaveText(['3.91', '975/1000', '100', '850']);
  await expect(page.locator('.stat__label')).toHaveText([
    'IPK S1 Manajemen',
    'Skor MOS Excel 2019',
    'Dokumen perjalanan dinas per triwulan',
    'Penonton dari 5 sekolah lewat kampanye film',
  ]);
});

test('about section has the CV paragraph, three focus chips and two schools', async ({ page }) => {
  await expect(page.locator('.about__text')).toContainText('Terampil menyusun RAB, mengelola data, serta memastikan kelancaran proses administrasi harian.');
  await expect(page.locator('#tentang ul.chips li')).toHaveText(['Administrasi & Keuangan', 'Event & MC', 'Marketing & Konten']);
  const edu = page.locator('.edu__item');
  await expect(edu).toHaveCount(2);
  for (const text of ['Sekolah Tinggi Ilmu Ekonomi (STIE) Ekuitas', 'S1 Manajemen', 'IPK 3.91/4.00', '2019 – 2023']) {
    await expect(edu.nth(0)).toContainText(text);
  }
  await expect(edu.nth(1)).toContainText('SMA Negeri 3 Bandung');
  await expect(edu.nth(1)).toContainText('2016 – 2019');
});

test('experience lists three jobs, newest first, with 6, 3 and 4 points', async ({ page }) => {
  await expect(page.locator('.job__role')).toHaveText([
    'Payment Officer',
    'Marketing and Distribution Officer',
    'Staf Divisi Program (Kontrak) & Staf Sekretaris & HRGA (Magang)',
  ]);
  await expect(page.locator('.job__company')).toHaveText([
    'PT Telkom Indonesia – Telkom Corporate University',
    'PT Amacon Mitra Guna',
    'PT Menara Fatih Indonesia – Muda Movement Indonesia',
  ]);
  await expect(page.locator('.job__period')).toHaveText(['2024 – Sekarang', '2023 – 2024', '2023']);
  const jobs = page.locator('.job');
  for (const [i, count] of [6, 3, 4].entries()) {
    await expect(jobs.nth(i).locator('.job__points li')).toHaveCount(count);
  }
  await expect(jobs.nth(0)).toContainText('Memproses hingga 15 dokumen keuangan per bulan dan 100 dokumen perjalanan dinas setiap triwulan.');
  await expect(jobs.nth(1)).toContainText('berhasil menarik 850 penonton dari 5 sekolah, dan memimpin 6 campaigner');
});

test('skills section has four groups and the MOS certificate', async ({ page }) => {
  await expect(page.locator('.skill-group h3')).toHaveText(['Administrasi & Keuangan', 'Event & Komunikasi', 'Marketing & SDM', 'Aplikasi & Sistem']);
  await expect(page.locator('.cert')).toContainText('Microsoft Office Specialist (MOS) Excel 2019');
  await expect(page.locator('.cert')).toContainText('Skor 975/1000');
  await expect(page.locator('.skill-group').nth(3).locator('.chip')).toHaveCount(10);
});

test('awards section lists six cards in spec order', async ({ page }) => {
  await expect(page.locator('.award__title')).toHaveText([
    'MC Agenda Expert Management',
    'Misi Budaya ke Eropa & Timur Tengah',
    '40 Proposal Terbaik & Terdanai',
    'Misi Budaya ke Amerika Serikat',
    'Juara 2 Lomba Lagu Islami Nasional',
    'Juara 3 Lomba Paduan Suara',
  ]);
  await expect(page.locator('.award__period')).toHaveText(['2024 – 2025', 'Jul – Agu 2024', '2023', 'Jul – Agu 2022', '2021', '2020']);
});

test('gallery lists 11 photos in spec order with captions, categories and full-size links', async ({ page }) => {
  const items = page.locator('.gallery__item');
  await expect(items).toHaveCount(GALLERY.length);
  for (const [i, g] of GALLERY.entries()) {
    const item = items.nth(i);
    await expect(item).toHaveAttribute('data-id', g.id);
    await expect(item).toHaveAttribute('data-category', g.category);
    await expect(item.locator('.gallery__caption')).toHaveText(g.caption);
    await expect(item.locator('a.gallery__thumb')).toHaveAttribute('href', `assets/img/gallery/full/${g.slug}.jpg`);
    const img = item.locator('img');
    await expect(img).toHaveAttribute('src', `assets/img/gallery/thumb/${g.slug}.jpg`);
    await expect(img).toHaveAttribute('alt', /\S/);
    await expect(img).toHaveAttribute('loading', 'lazy');
  }
  await expect(page.locator('.filter')).toHaveText(['Semua (11)', 'Profesional (3)', 'Misi Budaya (8)']);
});

test('contact section exposes email, LinkedIn and CV', async ({ page }) => {
  await expect(page.locator('#kontak-title')).toHaveText('Mari Terhubung');
  await expect(page.locator('.contact__text')).toHaveText('Terbuka untuk berdiskusi dan berkolaborasi. Cara tercepat menghubungi saya adalah lewat email atau LinkedIn.');
  const actions = page.locator('.contact__actions');
  await expect(actions.locator('a[href="mailto:fitriani.dhea29@gmail.com"]')).toBeVisible();
  await expect(actions.locator(`a[href="${LINKEDIN}"]`)).toBeVisible();
  await expect(actions.locator(`a[href="${CV}"][download]`)).toBeVisible();
  await expect(page.locator('.contact__email')).toHaveText('fitriani.dhea29@gmail.com');
  await expect(page.locator('.contact__location')).toHaveText('Bandung, Indonesia');
});

test('CV link downloads a PDF', async ({ request }) => {
  const res = await request.get('/' + CV);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});

test('page has one h1 and every main section is labelled', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  const sections = page.locator('main section');
  await expect(sections).toHaveCount(8);
  for (let i = 0; i < 8; i++) {
    const section = sections.nth(i);
    const labelledBy = await section.getAttribute('aria-labelledby');
    if (labelledBy) await expect(page.locator(`#${labelledBy}`)).toHaveText(/\S/);
    else expect(await section.getAttribute('aria-label')).toBeTruthy();
  }
});

test('section eyebrows and footer follow the spec', async ({ page }) => {
  await expect(page.locator('.eyebrow')).toHaveText(['Tentang', 'Perjalanan Karier', 'Kemampuan', 'Pencapaian', 'Dokumentasi', 'Kontak']);
  await expect(page.locator('.footer__copy')).toHaveText('© 2026 Dhea Fitriani Nur Hamidah');
  await expect(page.locator('.footer__top')).toHaveAttribute('href', '#beranda');
  await expect(page.locator('.footer__top')).toHaveText('Kembali ke atas ↑');
});
