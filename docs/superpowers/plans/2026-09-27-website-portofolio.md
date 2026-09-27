# Website Portofolio Dhea — Rencana Implementasi

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun website portofolio satu halaman dua bahasa (ID/EN) untuk Dhea Fitriani Nur Hamidah, siap dipublikasikan ke GitHub Pages.

**Architecture:**
- HTML statis (`site/index.html`) memuat semua teks Indonesia dan penanda `data-i18n*`.
- `site/css/styles.css` berisi gaya B1.
- `site/js/i18n-en.js` berisi kamus Inggris (`window.I18N_EN`).
- `site/js/main.js` berisi empat fungsi: `initMenu`, `initReveal`, `initLanguage`, `initGallery`.
- Foto diolah sekali oleh skrip Python.
- Tes Playwright berjalan di Chrome yang sudah terpasang.

**Tech Stack:** HTML5, CSS (custom properties, grid), JavaScript ES2020 (script `defer` biasa), Python 3 + Pillow, `@playwright/test` 1.63.0, GitHub Actions (`checkout@v7`, `configure-pages@v6`, `upload-pages-artifact@v5`, `deploy-pages@v5`).

**Spec:** `docs/superpowers/specs/2026-09-27-website-portofolio-design.md`. Semua teks Indonesia persis mengikuti §3 spec.

## Global Constraints

- Alamat akhir: `https://dheafitrianinurhamidah.github.io/MyPortofolio/`. Semua `src`/`href` internal **relatif**, tanpa awalan `/`.
- Token warna persis:

  | Token | Nilai |
  |---|---|
  | `--bg` | `#FFF8F2` |
  | `--surface` | `#FFFFFF` |
  | `--ink` | `#1F2A44` |
  | `--muted` | `#5B6475` |
  | `--accent` | `#B5502F` |
  | `--accent-ink` | `#9A4226` |
  | `--accent-soft` | `#F7DFD2` |
  | `--ring` | `#E0A184` |
  | `--gold` | `#E3A857` |
  | `--line` | `#EADFD6` |

- Font Plus Jakarta Sans 400/500/600/700/800 dari Google Fonts (`display=swap`), cadangan `system-ui, sans-serif`.
- Titik ubah 640 px dan 960 px. Kontainer maks 1120 px, jarak tepi 20 px / 32 px (≥ 640).
- Email `fitriani.dhea29@gmail.com`, LinkedIn `https://www.linkedin.com/in/dheafitrianinurhamidah/`, CV `assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf`.
- Tidak ada nomor HP dalam format apa pun dan tidak ada `wa.me` / `api.whatsapp.com` di `site/`.
- Tanpa framework, tanpa build, tanpa ES module. Skrip memakai `<script defer>`.
- Bahasa bawaan `id`. Prioritas: `?lang=en|id`, lalu `localStorage["lang"]` (dibungkus try/catch), lalu `id`.
- Batas ukuran file:

  | File | Batas |
  |---|---|
  | `profile.jpg` | ≤ 200 KB |
  | foto kecil | ≤ 150 KB |
  | foto besar | ≤ 450 KB |
  | `og-image.jpg` | ≤ 300 KB |
  | `styles.css` | < 25 KB |
  | `main.js` | < 12 KB |
  | `i18n-en.js` (isi, bukan logika) | < 20 KB |

- Tes: Playwright `channel: 'chrome'`, proyek `desktop` 1280×800 dan `mobile` 390×844 (sentuh). Server `python3 -m http.server 4173 --bind 127.0.0.1 --directory site`. Perintah `npm test`.

## Review Focus

1. **Dihosting di subfolder `/MyPortofolio/`:** tautan berawalan `/` akan rusak di GitHub Pages. Semua URL internal harus relatif (tes di Task 7).
2. **`index.html` dibuka langsung dari folder (`file://`):** menu dan tombol bahasa harus tetap berfungsi (tes di Task 4 dan Task 5).
3. **`localStorage` diblokir** (Safari mode privat): tombol bahasa tetap berfungsi tanpa error (tes di Task 5).
4. **Teks Inggris yang lebih panjang di layar 360 px:** tidak boleh ada geser horizontal saat mode EN (tes di Task 5).
5. **Nilai `?lang` asing** (misalnya `?lang=fr` atau `?lang=EN`): kembali ke Indonesia dan tidak error, sedangkan `EN` diperlakukan sama dengan `en` (tes di Task 5).

---

## File Structure

| File | Tanggung jawab |
|---|---|
| `package.json`, `playwright.config.js` | alat tes (Task 1) |
| `tests/helpers/jpeg.js` | `readJpegInfo(file) → { width, height, hasExif }` (Task 1) |
| `tests/fixtures/gallery.js` | data 11 foto `{ id, slug, category, caption }` (Task 1) |
| `tools/optimize_images.py` | pengolah foto & penyalin CV (Task 1) |
| `site/assets/**` | aset hasil olahan (Task 1, Task 7) |
| `site/index.html` | isi & struktur (Task 2, dilengkapi Task 3–7) |
| `site/css/styles.css` | gaya (Task 3, dilengkapi Task 4 & 6) |
| `site/js/main.js` | perilaku (Task 4–6) |
| `site/js/i18n-en.js` | kamus EN (Task 5) |
| `tools/og-image.html`, `tools/render-og.mjs` | render `og-image.jpg` & `apple-touch-icon.png` (Task 7) |
| `.github/workflows/deploy.yml`, `README.md` | deploy & panduan (Task 8) |

### Kontrak HTML (dipakai Task 2–7)

Kelas & ID berikut dibuat di Task 2. Task berikutnya **memakai nama yang sama**.

- `<html lang="id">` dan skrip kecil `document.documentElement.classList.add('js')` di `<head>` (Task 4).
- Tautan lewati: `a.skip-link[href="#konten"]`.
- Header:
  - `header.site-header` → `a.brand[href="#beranda"]`
  - tombol menu: `button.menu-toggle[aria-expanded="false"][aria-controls="site-nav"]`
  - menu: `nav#site-nav.site-nav` → `ul` → `a[href="#tentang|#pengalaman|#keahlian|#prestasi|#galeri|#kontak"]`
  - tombol bahasa: `div.lang-switch[role="group"]` → `button[data-lang="id"][aria-pressed="true"]` dan `button[data-lang="en"][aria-pressed="false"]`
- `main#konten`:
  - **`section#beranda.hero`**
    - `.hero__text` → `.pill`, `h1` (satu-satunya), `.hero__name`, `.hero__role`, `.hero__summary`, `.hero__actions`
    - `.hero__actions` → `a.btn.btn--primary[href="#kontak"]`, `a.btn.btn--ghost[download]`, `a.btn-icon.btn-icon--linkedin`
    - `.hero__media` → `.avatar` → `img.avatar__img[width=800][height=800]` + 2× `span.avatar__dot[aria-hidden]`
  - **`section.stats`** → `ul.stats__list` → 4× `li.stat` → `strong.stat__value` + `span.stat__label`
  - **`section#tentang.section`** → `.eyebrow`, `h2#tentang-title`, `.about__text`, `ul.chips`, `h3` Pendidikan, `ul.edu` → 2× `li.edu__item`
  - **`section#pengalaman.section`** → `ol.timeline` → 3× `li.job` → `h3.job__role`, `p.job__meta` (`span.job__company`, `span.job__period`), `ul.job__points`
  - **`section#keahlian.section`** → `.skills` → 4× `article.skill-group` (`h3` + `ul.chips` → `li.chip`) + `article.cert`
  - **`section#prestasi.section`** → `ul.awards` → 6× `li.award` → `span.award__icon[aria-hidden]`, `span.award__period`, `h3.award__title`, `p.award__detail`
  - **`section#galeri.section`**
    - filter: `div.gallery__filters[role="group"]` → 3× `button.filter[data-filter="semua|profesional|budaya"][aria-pressed]` → `span.filter__count`
    - foto: `ul.gallery` → 11× `li.gallery__item[data-category][data-id="gNN"]` → `a.gallery__thumb[href="assets/img/gallery/full/<slug>.jpg"]` → `img[src="assets/img/gallery/thumb/<slug>.jpg"][alt][width][height][loading="lazy"]` + `p.gallery__caption`
  - **`section#kontak.contact`** → `.contact__card` → `h2#kontak-title`, `.contact__text`, `.contact__actions` → `a.btn[href^="mailto:"]`, `a.btn[href*="linkedin"]`, `a.btn[download]`; `p.contact__email`, `p.contact__location`
- `footer.site-footer` → `p.footer__copy`, `a.footer__top[href="#beranda"]`
- Setiap `section` di `main` punya `aria-labelledby` (Kecuali `stats`, yang memakai `aria-label`.)
- Semua bagian di bawah Pembuka diberi kelas `reveal`.
- **Kunci terjemahan** (`data-i18n`, `data-i18n-html`, `data-i18n-attr="attr:kunci;attr2:kunci2"`) memakai pola `bagian.elemen`.
  - Contoh: `nav.about`, `hero.title`, `exp.telkom.p1`, `gallery.g01`, `gallery.g01.alt`, `meta.title`.
  - Semua teks yang terlihat, `alt`, `aria-label`, `<title>`, dan meta description punya kunci.
  - Yang **tidak** diberi kunci: nama diri, nama perusahaan, angka, email.

---

### Task 1: Alat tes + pengolahan foto & CV

**Files:**
- Create: `package.json`, `package-lock.json`, `playwright.config.js`, `tests/helpers/jpeg.js`, `tests/fixtures/gallery.js`, `tests/assets.spec.js`, `tools/optimize_images.py`
- Generate: `site/assets/img/profile.jpg`, `site/assets/img/gallery/{thumb,full}/<slug>.jpg` (22 file), `site/assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf`

**Interfaces:**
- Produces:
  - `readJpegInfo(filePath: string) → { width: number, height: number, hasExif: boolean }`
  - `tests/fixtures/gallery.js` mengekspor array 11 `{ id: 'g01', slug: 'g01-telkom-forum-expert-q2-2026', category: 'profesional' | 'budaya', caption: '<teks ID §3.8>' }` dengan urutan g01–g11 sesuai spec §3.8
  - skrip `python3 tools/optimize_images.py` tanpa argumen

- [ ] **Step 1: Siapkan alat**
  - `npm init -y`, lalu `npm i -D @playwright/test@1.63.0`.
  - Script npm:
    - `"test": "playwright test"`
    - `"serve": "python3 -m http.server 4173 --bind 127.0.0.1 --directory site"`
    - `"images": "python3 tools/optimize_images.py"`
    - `"og": "node tools/render-og.mjs"`
  - `playwright.config.js` (CommonJS):
    - `testDir: 'tests'`, `use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome' }`
    - proyek `desktop` (viewport 1280×800) dan `mobile` (390×844, `isMobile: true`, `hasTouch: true`)
    - `webServer` = perintah server Global Constraints, `url: 'http://127.0.0.1:4173/'`, `reuseExistingServer: true`
  - Buat `site/.gitkeep` supaya server bisa berjalan.

- [ ] **Step 2: Tulis tes yang gagal** — `tests/assets.spec.js` (hanya proyek desktop, lewat `test.beforeEach(({}, info) => test.skip(info.project.name !== 'desktop'))`)

```js
test('profile photo is an 800x800 JPEG without EXIF within 200 KB', () => {
  expect(readJpegInfo(img('profile.jpg'))).toEqual({ width: 800, height: 800, hasExif: false });
  expect(size(img('profile.jpg'))).toBeLessThanOrEqual(200 * 1024);
});
test('gallery thumbnails are 800px wide JPEGs without EXIF within 150 KB', () => {
  for (const g of GALLERY) { const f = img(`gallery/thumb/${g.slug}.jpg`), i = readJpegInfo(f);
    expect(i.width, g.slug).toBe(800); expect(i.hasExif, g.slug).toBe(false);
    expect(size(f), g.slug).toBeLessThanOrEqual(150 * 1024); }
});
test('gallery full images have a long edge between 1000 and 1600px, no EXIF, within 450 KB', () => {
  for (const g of GALLERY) { const f = img(`gallery/full/${g.slug}.jpg`), i = readJpegInfo(f), edge = Math.max(i.width, i.height);
    expect(edge, g.slug).toBeLessThanOrEqual(1600); expect(edge, g.slug).toBeGreaterThanOrEqual(1000);
    expect(i.hasExif, g.slug).toBe(false); expect(size(f), g.slug).toBeLessThanOrEqual(450 * 1024); }
});
test('CV copy is a PDF', () => {
  expect(fs.readFileSync(site('assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf')).subarray(0, 5).toString()).toBe('%PDF-');
});
test('gallery fixture lists 3 professional and 8 cultural photos', () => {
  expect(GALLERY.map(g => g.id)).toEqual(['g01','g02','g03','g04','g05','g06','g07','g08','g09','g10','g11']);
  expect(GALLERY.filter(g => g.category === 'profesional')).toHaveLength(3);
});
```

- [ ] **Step 3: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/assets.spec.js`
  - Expected: FAIL, karena `readJpegInfo` belum ada dan file foto belum ada.

- [ ] **Step 4: Implementasi**
  - `tests/helpers/jpeg.js`: `readJpegInfo` membaca penanda JPEG. APP1 yang diawali `Exif\0\0` berarti `hasExif`. Lebar dan tinggi diambil dari SOF0–SOF15 (kecuali C4, C8, CC). Pembacaan berhenti di SOS.
  - `tests/fixtures/gallery.js`: isi dari tabel §3.8.
  - `tools/optimize_images.py`:
    - Tabel `id → (file asli, slug)` diambil dari §3.8. Sumber foto profil: `WhatsApp Image 2026-09-27 at 22.23.24.jpeg`.
    - Per foto: `ImageOps.exif_transpose`. Jika ada `icc_profile` selain sRGB, konversi ke sRGB lewat `ImageCms`. Lalu `convert('RGB')` dan simpan dengan `save(..., 'JPEG', quality=Q, optimize=True, progressive=True)` **tanpa** argumen `exif` / `icc_profile`.
    - Foto profil: potong bujur sangkar menempel tepi atas `(0, 0, W, W)`, lalu ubah ke 800×800 dengan LANCZOS, q82.
    - Foto kecil: lebar 800, q78. Jika hasilnya > 150 KB, turunkan q per 4 sampai muat.
    - Foto besar: sisi terpanjang `min(1600, asli)`, q82, dengan aturan turun kualitas yang sama sampai ≤ 450 KB.
    - Salin CV ke `site/assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf`.
  - Jalankan `npm run images`.

- [ ] **Step 5: Jalankan hingga lulus**
  - Run: `npx playwright test tests/assets.spec.js`
  - Expected: PASS (5 tes; proyek mobile di-skip).

- [ ] **Step 6: Periksa hasil potongan foto profil secara visual**
  - Buka `site/assets/img/profile.jpg`.
  - Expected: hijab utuh dengan ruang di atas kepala, wajah di tengah, bahu terlihat.

- [ ] **Step 7: Commit**
  - `git add package.json package-lock.json playwright.config.js tests tools/optimize_images.py site/assets`
  - `git commit -m "feat: alat tes dan aset foto yang dioptimalkan"`

### Task 2: Isi halaman (HTML, bahasa Indonesia)

**Files:**
- Create: `site/index.html`, `tests/content.spec.js`, `tests/privacy.spec.js`, `tests/helpers/files.js`
- Delete: `site/.gitkeep`

**Interfaces:**
- Consumes: aset dan `tests/fixtures/gallery.js` dari Task 1.
- Produces:
  - seluruh Kontrak HTML di atas, termasuk semua penanda `data-i18n*` (tag `<link>` CSS dan skrip belum dipasang; itu dilakukan di Task 3–5)
  - `walk(dir: string) → string[]` (semua path file di bawah `dir`, rekursif)

- [ ] **Step 1: Tulis tes yang gagal** — `tests/content.spec.js` (nilai persis dari spec §3)

```js
test('hero shows greeting, full name, role and summary', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Halo, saya Dhea');
  await expect(page.locator('h1 em')).toHaveText('Dhea');
  await expect(page.locator('.hero__name')).toHaveText('Dhea Fitriani Nur Hamidah');
  await expect(page.locator('.hero__role')).toHaveText('Payment Officer di PT Telkom Indonesia – Telkom Corporate University');
  await expect(page.locator('.hero__summary')).toHaveText('Profesional administrasi & keuangan yang teliti dan rapi, berpengalaman di event, MC, dan marketing.');
  await expect(page.locator('.pill')).toHaveText('Bandung, Indonesia');
});
test('hero actions link to contact, CV and LinkedIn', ...)
  // .btn--primary href '#kontak'; .btn--ghost href 'assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf' + download attribute;
  // .btn-icon--linkedin href 'https://www.linkedin.com/in/dheafitrianinurhamidah/', target '_blank', rel contains 'noopener'
test('stats show the four highlight numbers', ...)
  // .stat__value → ['3.91','975/1000','100','850']
  // .stat__label → ['IPK S1 Manajemen','Skor MOS Excel 2019','Dokumen perjalanan dinas per triwulan','Penonton dari 5 sekolah lewat kampanye film']
test('about section has the CV paragraph, three focus chips and two schools', ...)
  // .about__text contains 'Terampil menyusun RAB'
  // #tentang ul.chips li → ['Administrasi & Keuangan','Event & MC','Marketing & Konten']
  // .edu__item count 2; first contains 'STIE' and 'IPK 3.91/4.00' and '2019 – 2023'; second contains 'SMA Negeri 3 Bandung' and '2016 – 2019'
test('experience lists three jobs, newest first, with 6, 3 and 4 points', ...)
  // .job__role → ['Payment Officer','Marketing and Distribution Officer','Staf Divisi Program (Kontrak) & Staf Sekretaris & HRGA (Magang)']
  // .job__period → ['2024 – Sekarang','2023 – 2024','2023']
  // count of '.job__points li' per job → [6,3,4]
  // first job text contains 'Memproses hingga 15 dokumen keuangan per bulan dan 100 dokumen perjalanan dinas setiap triwulan.'
test('skills section has four groups and the MOS certificate', ...)
  // .skill-group h3 → ['Administrasi & Keuangan','Event & Komunikasi','Marketing & SDM','Aplikasi & Sistem']
  // .cert contains 'Microsoft Office Specialist (MOS) Excel 2019' and 'Skor 975/1000'
test('awards section lists six cards in spec order', ...)
  // .award__title → the 6 titles in §3.7; .award__period → ['2024 – 2025','Jul – Agu 2024','2023','Jul – Agu 2022','2021','2020']
test('gallery lists 11 photos in spec order with captions, categories and full-size links', ...)
  // for each fixture item i:
  //   li.gallery__item nth(i) has data-id g.id and data-category g.category;
  //   caption === g.caption; thumb img src ends with `thumb/${g.slug}.jpg`; link href ends with `full/${g.slug}.jpg`;
  //   img has non-empty alt and loading="lazy"
test('contact section exposes email, LinkedIn and CV', ...)
  // a[href="mailto:fitriani.dhea29@gmail.com"] visible; .contact__email text 'fitriani.dhea29@gmail.com'; h2#kontak-title 'Mari Terhubung'
test('CV link downloads a PDF', async ({ request }) => {
  const res = await request.get('/assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});
test('page has one h1 and every main section is labelled', ...)
  // count h1 === 1; for each main section[aria-labelledby], the referenced element exists and has text
test('section eyebrows and footer follow the spec', ...)
  // .eyebrow → ['Tentang','Perjalanan Karier','Kemampuan','Pencapaian','Dokumentasi','Kontak']
  // .footer__copy '© 2026 Dhea Fitriani Nur Hamidah'; .footer__top href '#beranda' and text 'Kembali ke atas ↑'
```

`tests/privacy.spec.js`:

```js
const PHONE = /(\+?62|0)[\s.-]?8[\s.-]?21[\s.-]?xxxx[\s.-]?xxxx/;
test('no phone number or WhatsApp link in any site text file', () => {
  for (const f of walk('site').filter(f => /\.(html|css|js|svg|json|txt|xml|webmanifest)$/.test(f))) {
    const t = fs.readFileSync(f, 'utf8');
    expect(t, f).not.toMatch(PHONE);
    expect(t.replace(/\D/g, ''), f).not.toContain('821xxxxxxxx');
    expect(t, f).not.toMatch(/wa\.me|api\.whatsapp\.com/);
  }
});
test('rendered page shows no phone number', async ({ page }) => {
  await page.goto('/');
  expect((await page.content()).replace(/\D/g, '')).not.toContain('821xxxxxxxx');
});
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/content.spec.js tests/privacy.spec.js --project=desktop`
  - Expected: tes content FAIL, karena belum ada `index.html` dan server menampilkan daftar folder. Tes privasi **boleh** sudah PASS pada tahap ini; itu wajar, karena tes privasi adalah pengaman untuk perubahan di kemudian hari.

- [ ] **Step 3: Implementasi `site/index.html`**
  - Ikuti Kontrak HTML dan teks persis dari spec §3.
  - `<head>` berisi `<meta charset>`, viewport, `<title>` dan meta description dari §3.11 (keduanya ber-`data-i18n`).
  - Ikon SVG ditulis langsung di HTML (LinkedIn, mail, download, map-pin, mic, globe, trophy) dengan `aria-hidden="true"`.
  - Atribut `width`/`height` foto galeri = ukuran asli foto kecil (baca dengan `readJpegInfo`).

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npx playwright test tests/content.spec.js tests/privacy.spec.js`
  - Expected: PASS di kedua proyek.

- [ ] **Step 5: Commit**
  - `git add site/index.html tests/content.spec.js tests/privacy.spec.js && git rm -q site/.gitkeep`
  - `git commit -m "feat: isi halaman portofolio (bahasa Indonesia)"`

### Task 3: Gaya B1 (CSS responsif)

**Files:**
- Create: `site/css/styles.css`, `tests/layout.spec.js`
- Modify: `site/index.html` (`<head>`: `preconnect` + Google Fonts + `css/styles.css`)

**Interfaces:**
- Consumes: kelas dari Kontrak HTML.
- Produces: kelas keadaan yang dipakai Task 4 dan 6:
  - `.site-nav.is-open` (menu HP terbuka)
  - `.reveal` / `.reveal.is-visible`
  - `.gallery__item[hidden]`

- [ ] **Step 1: Tulis tes yang gagal** — `tests/layout.spec.js`

```js
test('design tokens match the B1 palette', async ({ page }) => {
  await page.goto('/');
  const v = n => page.evaluate(n => getComputedStyle(document.documentElement).getPropertyValue(n).trim().toUpperCase(), n);
  expect(await v('--bg')).toBe('#FFF8F2'); expect(await v('--ink')).toBe('#1F2A44');
  expect(await v('--accent')).toBe('#B5502F'); expect(await v('--accent-soft')).toBe('#F7DFD2');
});
test('body text uses Plus Jakarta Sans', ...)          // computed font-family of body starts with '"Plus Jakarta Sans"'
test('no horizontal overflow at 360, 390 and 1280px', ...)
  // for w of [360,390,1280]: setViewportSize({width:w,height:800}); scrollWidth <= clientWidth
test('profile photo renders as a circle inside a square box', ...)
  // box of .avatar__img: |width-height| <= 1; getComputedStyle(img).borderRadius === '50%'; objectFit 'cover'
test('hero is two columns on desktop and stacked with photo first on mobile', ...)
  // desktop: media.x > text.x + text.width - 1 ; mobile: media.y + media.height <= text.y + 1
test('stats are 4 across on desktop and 2x2 on mobile', ...)
  // desktop: all 4 .stat share the same y ; mobile: stat[0].y === stat[1].y and stat[2].y > stat[0].y
test('header stays at the top after scrolling to contact', ...)
  // scrollIntoView #kontak; header boundingBox().y === 0
test('keyboard focus shows a 3px accent outline', ...)
  // desktop: press Tab → skip-link focused; computed outlineWidth '3px'; outlineColor 'rgb(181, 80, 47)'
test('touch targets are at least 44px on mobile', ...)
  // mobile: every visible .menu-toggle, .lang-switch button, .hero__actions a, .filter has box width >= 44 and height >= 44
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/layout.spec.js`
  - Expected: FAIL, karena token dan font belum ada, foto belum lingkaran, dan tata letak belum dibuat.

- [ ] **Step 3: Implementasi `site/css/styles.css`**
  - Ikuti spec §4:
    - token di `:root`, tipografi, kontainer, dan titik ubah (mobile-first);
    - Pembuka (grid `1.2fr 1fr` ≥ 960), avatar dengan `::before` halo `inset: -7%` dan `::after` cincin putus-putus `inset: -12%`;
    - kisi angka, garis waktu, chip, kartu, galeri 2/3/4 kolom (foto kecil `aspect-ratio: 4/3`), dan kartu Kontak navy.
  - `:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px }`.
  - `section[id] { scroll-margin-top: 80px }`, header `position: sticky; top: 0`.
  - Tambahkan `<link>` di `<head>`.
  - Titik fokus foto galeri memakai `style="object-position: …"` per foto, hanya bila potongan 4:3 memotong kepala. Periksa di Step 5.

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npx playwright test tests/layout.spec.js`
  - Expected: PASS di kedua proyek.

- [ ] **Step 5: Periksa tampilan secara visual**
  - Ambil screenshot satu halaman penuh (desktop 1280 dan mobile 390) dengan `page.screenshot({ fullPage: true })` ke folder sementara.
  - Expected: sesuai contoh B1 yang disetujui: lingkaran foto proporsional, warna terakota & navy, tidak ada teks yang saling menimpa.

- [ ] **Step 6: Commit**
  - `git add site/css/styles.css site/index.html tests/layout.spec.js`
  - `git commit -m "feat: gaya B1 terakota & navy yang responsif"`

### Task 4: Menu HP & animasi muncul

**Files:**
- Create: `site/js/main.js`, `tests/interactions.spec.js`
- Modify: `site/index.html` (skrip kelas `js` di `<head>`, `<script src="js/main.js" defer>` di akhir `body`), `site/css/styles.css`

**Interfaces:**
- Produces di `main.js`:
  - `initMenu(): void`, `initReveal(): void`, dipanggil dari `document.addEventListener('DOMContentLoaded', …)`, atau langsung bila DOM sudah siap
  - Pola IIFE tanpa variabel global kecuali `window.I18N_EN`, yang datang dari Task 5
  - Task 5 dan 6 menambah `initLanguage()` dan `initGallery()` di file yang sama

- [ ] **Step 1: Tulis tes yang gagal** — `tests/interactions.spec.js`

```js
test('mobile menu opens, closes on link click and on Escape', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await expect(toggle).toHaveAttribute('aria-label', 'Buka menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Tutup menu');
  await expect(page.locator('#site-nav a[href="#pengalaman"]')).toBeVisible();
  await page.locator('#site-nav a[href="#pengalaman"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click(); await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});
test('desktop shows nav links and hides the menu toggle', ...)   // desktop only
test('sections fade in once scrolled into view', ...)            // #prestasi has .is-visible after scrollIntoView; opacity '1'
test('reduced motion shows every section immediately', ...)
  // page.emulateMedia({ reducedMotion: 'reduce' }); every .reveal has opacity '1' without scrolling
test('content stays visible without JavaScript', ...)
  // browser.newContext({ javaScriptEnabled: false }); every .reveal has opacity '1'
test('page works when opened straight from the file system', ...)
  // goto pathToFileURL('site/index.html'); html has class 'js'; (mobile) menu toggle flips aria-expanded
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/interactions.spec.js`
  - Expected: FAIL, karena belum ada `main.js`, `aria-expanded` tidak berubah, dan `.is-visible` tidak pernah dipasang.

- [ ] **Step 3: Implementasi**
  - **`initMenu`:** mengubah `aria-expanded`, kelas `.is-open`, dan label (`menu.open` / `menu.close`). Menu ditutup saat tautan diklik dan saat Esc ditekan.
  - **`initReveal`:** IntersectionObserver `threshold: 0.12` memasang `.is-visible` sekali. Jika `matchMedia('(prefers-reduced-motion: reduce)')` aktif atau `IntersectionObserver` tidak ada, langsung pasang semuanya.
  - **CSS:**
    - `.js .reveal { opacity: 0; transform: translateY(16px); transition: opacity .6s ease-out, transform .6s ease-out }` dan `.reveal.is-visible { opacity: 1; transform: none }`
    - blok `@media (prefers-reduced-motion: reduce)` mematikan transisi dan `scroll-behavior`
    - `.site-nav` di < 960 px disembunyikan kecuali `.is-open`

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npx playwright test tests/interactions.spec.js tests/layout.spec.js`
  - Expected: PASS.

- [ ] **Step 5: Commit**
  - `git add site/js/main.js site/index.html site/css/styles.css tests/interactions.spec.js`
  - `git commit -m "feat: menu HP dan animasi muncul"`

### Task 5: Dua bahasa (ID · EN)

**Files:**
- Create: `site/js/i18n-en.js`, `tests/i18n.spec.js`
- Modify: `site/js/main.js` (`initLanguage`), `site/index.html` (`<script src="js/i18n-en.js" defer>` sebelum `main.js`, dan kunci yang terlewat bila ada)

**Interfaces:**
- Consumes: penanda `data-i18n*` dari Task 2, `.lang-switch button[data-lang]`.
- Produces:
  - `window.I18N_EN: Record<string, string>`
  - `setLanguage(lang: 'id' | 'en'): void` (internal `main.js`)
  - Setelah `setLanguage`, semua `.gallery__caption` di DOM sudah berbahasa aktif, sehingga Task 6 cukup membaca teks DOM.

- [ ] **Step 1: Tulis tes yang gagal** — `tests/i18n.spec.js`

```js
const keysInPage = page => page.evaluate(() => {
  const k = new Set();
  document.querySelectorAll('[data-i18n]').forEach(e => k.add(e.dataset.i18n));
  document.querySelectorAll('[data-i18n-html]').forEach(e => k.add(e.dataset.i18nHtml));
  document.querySelectorAll('[data-i18n-attr]').forEach(e => e.dataset.i18nAttr.split(';').forEach(p => k.add(p.split(':')[1])));
  return [...k].sort();
});
test('default language is Indonesian', ...)          // html lang 'id'; button[data-lang=id] aria-pressed 'true'
test('page keys and English dictionary match exactly', async ({ page }) => {
  await page.goto('/');
  expect(await keysInPage(page)).toEqual((await page.evaluate(() => Object.keys(window.I18N_EN))).sort());
});
test('switching to EN translates every tagged element and the document metadata', ...)
  // click EN → html lang 'en'; each [data-i18n] textContent === I18N_EN[key]; each [data-i18n-html] innerHTML === I18N_EN[key];
  // each data-i18n-attr attribute === I18N_EN[key]; document.title === I18N_EN['meta.title'];
  // meta[name=description] content === I18N_EN['meta.description']; EN button aria-pressed 'true'
test('English mode leaves no common Indonesian words on screen', ...)
  // after EN: document.body.innerText does not match /\b(dan|yang|untuk|dengan|dari|Sekarang|Unduh|Hubungi|Tentang|bersama)\b/
test('switching back to ID restores the original Indonesian text', ...)
  // capture body.innerText in ID; EN; ID; innerText equal to the capture
test('language choice survives a reload', ...)         // EN, reload → html lang 'en'
test('?lang=en opens English; ?lang=id beats a saved EN choice; ?lang=EN works; ?lang=fr falls back to ID', ...)
test('language switch still works when storage is blocked', ...)
  // page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); });
  // collect pageerror events; click EN → html lang 'en'; no page errors
test('English mode has no horizontal overflow at 360px', ...)  // setViewportSize 360×800, EN, scrollWidth <= clientWidth
test('language switch works from the file system', ...)       // file:// URL, click EN → html lang 'en'
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/i18n.spec.js`
  - Expected: FAIL, karena `window.I18N_EN` belum terdefinisi dan tombol EN belum berfungsi.

- [ ] **Step 3: Implementasi**
  - **`i18n-en.js`:**
    - Terjemahan setia semua kunci.
    - Nama diri, nama perusahaan, nama sistem, dan singkatan tetap (aturan spec §12). "Sekarang" menjadi "Present", "Jul – Agu" menjadi "Jul – Aug".
    - Kunci `hero.title` bernilai `Hi, I'm <em>Dhea</em>`.
  - **`initLanguage`:**
    - Baca bahasa dari `?lang` (huruf kecil, hanya `id` atau `en`), lalu dari `localStorage` (try/catch), lalu `id`.
    - Simpan teks ID asli dari DOM (`WeakMap` per elemen per atribut) sebelum mengganti pertama kali.
    - Perbarui `html[lang]`, `document.title` (kunci `meta.title` pada `<title>`), meta description, `aria-pressed`, dan label tombol menu sesuai keadaan.
    - Simpan pilihan ke `localStorage` (try/catch). Jika bahasa dari URL berbeda, perbarui URL dengan `history.replaceState` tanpa memuat ulang halaman.

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npx playwright test tests/i18n.spec.js tests/content.spec.js tests/interactions.spec.js`
  - Expected: PASS. Content tetap lulus karena bawaannya ID.

- [ ] **Step 5: Commit**
  - `git add site/js/i18n-en.js site/js/main.js site/index.html tests/i18n.spec.js`
  - `git commit -m "feat: dua bahasa ID dan EN"`

### Task 6: Filter galeri & tampilan besar (lightbox)

**Files:**
- Create: `tests/gallery.spec.js`
- Modify:
  - `site/index.html`: tambah `<dialog class="lightbox">` di akhir `main`, berisi:
    - `button.lightbox__close`, `button.lightbox__prev`, `button.lightbox__next` (masing-masing ber-`data-i18n-attr` untuk `aria-label`)
    - `figure` → `img.lightbox__img` + `figcaption.lightbox__caption` + `p.lightbox__counter`
  - `site/js/i18n-en.js`: kunci label dialog
  - `site/js/main.js`: `initGallery`
  - `site/css/styles.css`

**Interfaces:**
- Consumes:
  - `.gallery__filters .filter[data-filter]`, `.gallery__item[data-category][data-id]`, `a.gallery__thumb[href]`, `.gallery__caption` (Task 2)
  - teks `.gallery__caption` yang sudah diterjemahkan oleh `setLanguage` (Task 5)
- Produces: `initGallery(): void`. `.lightbox__caption` dan `.lightbox__img[alt]` diisi dari DOM dan **tidak** diberi `data-i18n`.

- [ ] **Step 1: Tulis tes yang gagal** — `tests/gallery.spec.js`

```js
test('filters show 11, 3 and 8 photos and mark the active filter', async ({ page }) => {
  await page.goto('/#galeri');
  const visible = () => page.locator('.gallery__item:not([hidden])').count();
  await page.click('.filter[data-filter="profesional"]'); expect(await visible()).toBe(3);
  await expect(page.locator('.filter[data-filter="profesional"]')).toHaveAttribute('aria-pressed', 'true');
  await page.click('.filter[data-filter="budaya"]'); expect(await visible()).toBe(8);
  await page.click('.filter[data-filter="semua"]'); expect(await visible()).toBe(11);
});
test('clicking a thumbnail opens the full photo with its caption and counter', ...)
  // click [data-id=g02] .gallery__thumb → dialog.lightbox[open]; .lightbox__img src ends 'full/g02-telkom-forum-expert-tim.jpg';
  // caption = fixture g02 caption; counter '2 / 11'
test('next and previous wrap around within the active filter', ...)
  // 'semua': open g11, next → g01 ('1 / 11'); prev → g11
  // 'profesional': open g03, next → g01 and counter '1 / 3'
test('arrow keys move between photos and Escape closes, returning focus to the thumbnail', ...)
  // open g05; ArrowRight → g06; ArrowLeft → g05; Escape → dialog closed; focused element is [data-id=g05] .gallery__thumb
test('clicking the dark backdrop closes the lightbox', ...)   // click at (5,5) of viewport → dialog not open
test('lightbox caption follows the active language', ...)     // click EN, open g01 → caption === I18N_EN['gallery.g01']
test('without JavaScript a thumbnail links to the full-size photo', ...)
  // javaScriptEnabled:false; href of [data-id=g01] a ends 'full/g01-telkom-forum-expert-q2-2026.jpg'
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/gallery.spec.js`
  - Expected: FAIL. Filter belum menyembunyikan apa pun, dan klik foto kecil masih membuka file gambar, bukan dialog.

- [ ] **Step 3: Implementasi `initGallery`**
  - **Filter:** memasang `hidden` pada item yang tidak cocok dan memperbarui `aria-pressed`.
  - **Klik foto kecil:**
    - `preventDefault`, lalu `dialog.showModal()` dengan gambar dari `href`, `alt` dari foto kecil, dan keterangan dari `.gallery__caption` (sudah mengikuti bahasa aktif).
    - Penghitung `n / total` dihitung dari item yang terlihat.
  - **Navigasi:**
    - ‹ › dan ←/→ berputar di dalam item yang terlihat.
    - Klik di luar area `figure` menutup dialog.
    - Saat event `close`, fokus dikembalikan ke foto kecil yang tadi dibuka.
  - **CSS lightbox:**
    - `::backdrop` `rgba(31,42,68,.85)`
    - gambar `max-width: 90vw; max-height: 78vh; object-fit: contain`
    - tombol bulat ≥ 44 px

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npx playwright test tests/gallery.spec.js tests/i18n.spec.js`
  - Expected: PASS. Tes kunci i18n tetap cocok karena label dialog sudah ditambahkan ke kamus.

- [ ] **Step 5: Commit**
  - `git add site/index.html site/js/main.js site/js/i18n-en.js site/css/styles.css tests/gallery.spec.js`
  - `git commit -m "feat: filter galeri dan tampilan foto besar"`

### Task 7: Meta, pratinjau tautan, ikon & kualitas

**Files:**
- Create:
  - `tools/og-image.html`, `tools/render-og.mjs`
  - `site/assets/og-image.jpg`, `site/favicon.svg`, `site/apple-touch-icon.png`
  - `tests/quality.spec.js`
- Modify: `site/index.html` (`<head>`: canonical, Open Graph, twitter, favicon, apple-touch-icon)

**Interfaces:**
- Consumes: `readJpegInfo` (Task 1), `site/assets/img/profile.jpg`.
- Produces: `npm run og` → menulis `site/assets/og-image.jpg` (1200×630) dan `site/apple-touch-icon.png` (180×180).

- [ ] **Step 1: Tulis tes yang gagal** — `tests/quality.spec.js`

```js
const URL = 'https://dheafitrianinurhamidah.github.io/MyPortofolio/';
test('head has canonical, Open Graph and Twitter tags with absolute URLs', async ({ page }) => {
  await page.goto('/');
  const meta = (sel, attr = 'content') => page.locator(sel).getAttribute(attr);
  expect(await meta('link[rel=canonical]', 'href')).toBe(URL);
  expect(await meta('meta[property="og:url"]')).toBe(URL);
  expect(await meta('meta[property="og:image"]')).toBe(URL + 'assets/og-image.jpg');
  expect(await meta('meta[property="og:title"]')).toBe('Dhea Fitriani Nur Hamidah · Portofolio');
  expect(await meta('meta[property="og:locale"]')).toBe('id_ID');
  expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
  await expect(page).toHaveTitle('Dhea Fitriani Nur Hamidah · Portofolio');
  expect(await meta('meta[name="description"]')).toBe('Portofolio Dhea Fitriani Nur Hamidah, Payment Officer di Telkom Corporate University. Administrasi, keuangan, event, dan marketing.');
});
test('og-image is a 1200x630 JPEG within 300 KB', ...)        // readJpegInfo → 1200×630, no EXIF; size ≤ 300*1024
test('favicon and apple-touch-icon are served', ...)          // request.get('/favicon.svg') 200 image/svg+xml; '/apple-touch-icon.png' 200
test('all internal links and sources are relative', ...)
  // every [src],[href] in index.html that is not http(s):/mailto:/# does not start with '/'
test('page loads without console errors', ...)
  // collect console 'error' + pageerror; goto; scroll to bottom in steps; expect []
test('every image has alt text and loads', ...)
  // scroll each img into view; all imgs: alt.trim() !== '' && complete && naturalWidth > 0
test('stylesheet and scripts stay within their size budgets', ...)
  // styles.css < 25*1024; main.js < 12*1024; i18n-en.js < 20*1024
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/quality.spec.js`
  - Expected: FAIL, karena belum ada meta Open Graph, `og-image.jpg`, maupun favicon.

- [ ] **Step 3: Implementasi**
  - **`tools/og-image.html`:** kanvas 1200×630 berlatar `--bg`. Isinya foto lingkaran (sama gayanya dengan avatar), "Dhea Fitriani Nur Hamidah", jabatan, dan `dheafitrianinurhamidah.github.io/MyPortofolio`, dengan font Plus Jakarta Sans.
  - **`tools/render-og.mjs`:**
    - `chromium.launch({ channel: 'chrome' })` dari `@playwright/test`.
    - Render `og-image.html` dari `file://`, tunggu `document.fonts.ready`, lalu screenshot JPEG kualitas 85.
    - Render monogram 180×180 ke PNG.
  - **`site/favicon.svg`:** lingkaran `--accent` dengan huruf "d" putih dan titik `--gold`.
  - **Tag `<head>`:** isi sesuai spec §3.11, termasuk `og:locale:alternate` en_US dan deskripsi Open Graph.

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npm test` (seluruh rangkaian)
  - Expected: semua PASS di kedua proyek.

- [ ] **Step 5: Commit**
  - `git add tools/og-image.html tools/render-og.mjs site tests/quality.spec.js`
  - `git commit -m "feat: meta pratinjau tautan, ikon, dan tes kualitas"`

### Task 8: Deploy otomatis & panduan

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`, `tests/repo.spec.js`

**Interfaces:**
- Consumes: folder `site/`.

- [ ] **Step 1: Tulis tes yang gagal** — `tests/repo.spec.js` (hanya proyek desktop)

```js
test('deploy workflow publishes only the site folder from main', () => {
  const y = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
  expect(y).toMatch(/branches:\s*\[\s*main\s*\]/);
  expect(y).toContain('actions/upload-pages-artifact@v5');
  expect(y).toMatch(/path:\s*site\b/);
  expect(y).toContain('actions/deploy-pages@v5');
  expect(y).toMatch(/pages:\s*write/); expect(y).toMatch(/id-token:\s*write/);
});
test('README explains editing, photos, tests and deployment', () => {
  const r = fs.readFileSync('README.md', 'utf8');
  for (const h of ['## Mengubah isi', '## Menambah foto', '## Menjalankan tes', '## Deploy']) expect(r).toContain(h);
});
```

- [ ] **Step 2: Jalankan untuk memastikan gagal**
  - Run: `npx playwright test tests/repo.spec.js`
  - Expected: FAIL (ENOENT).

- [ ] **Step 3: Implementasi**
  - **`deploy.yml`:**
    - `on: push: branches: [main]` + `workflow_dispatch`
    - `permissions` (`contents: read`, `pages: write`, `id-token: write`), `concurrency: { group: pages, cancel-in-progress: false }`
    - satu job `deploy` di `ubuntu-latest` dengan `environment: github-pages`
    - langkah: `checkout@v7` → `configure-pages@v6` → `upload-pages-artifact@v5` (`path: site`) → `deploy-pages@v5`
  - **`README.md` (bahasa Indonesia):**
    - pengantar singkat dan alamat website
    - **Mengubah isi:** teks ID di `site/index.html`, teks EN di `site/js/i18n-en.js` dengan kunci yang sama
    - **Menambah foto:** taruh foto asli, tambah baris di `tools/optimize_images.py`, jalankan `npm run images`, tambah item galeri + kunci EN
    - **Melihat di komputer:** `npm run serve`
    - **Menjalankan tes:** `npm install`, lalu `npm test`, memakai Google Chrome
    - **Deploy:** push ke `main` memicu GitHub Actions; pengaturan Pages memakai Source: GitHub Actions

- [ ] **Step 4: Jalankan hingga lulus**
  - Run: `npm test`
  - Expected: semua PASS.

- [ ] **Step 5: Commit**
  - `git add .github/workflows/deploy.yml README.md tests/repo.spec.js`
  - `git commit -m "ci: deploy GitHub Pages dan panduan README"`

---

**Setelah Task 8:**
1. Tinjauan menyeluruh atas seluruh branch.
2. `superpowers:finishing-a-development-branch`: merge ke `main`, lalu push ke `dheafitrianinurhamidah/MyPortofolio` dan aktifkan Pages, **hanya dengan konfirmasi eksplisit** dan cara login yang dipilih pengguna (spec §10).
