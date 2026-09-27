# Website Portofolio Dhea Fitriani Nur Hamidah — Desain

- **Tanggal:** 2026-09-27
- **Proses:** superpowers `brainstorming` (jalur arsitektural). Bagian 1–3 disetujui di percakapan.
- **Sumber isi:** `CV Dhea Fitriani N.H. 2025.pdf`, foto profil, 11 foto di `Foto Kegiatan/`, LinkedIn.
- **Alamat akhir:** https://dheafitrianinurhamidah.github.io/MyPortofolio/

## 1. Tujuan, pengunjung, ukuran berhasil

- **Tujuan:** *personal branding* profesional. Website menampilkan profil, pengalaman, dan pencapaian Dhea tanpa sinyal "sedang mencari kerja" (tidak ada label *Open to work*), sehingga aman dibagikan ke rekan dan atasan.
- **Pengunjung:** HR/rekruter, rekan kerja, dan mitra, baik dari dalam maupun luar negeri.
- **Berhasil jika:** dalam < 1 menit pengunjung paham siapa Dhea, pengalaman utamanya, dan cara menghubunginya, serta tampilannya baik di HP mulai lebar 360 px.
- **Aturan isi:** semua fakta berasal dari CV. Tidak ada klaim baru. Teks CV hanya dirapikan ejaannya (misalnya "filling" → "filing", "surat menyurat" → "surat-menyurat").

## 2. Keputusan

| Topik | Keputusan |
|---|---|
| Tujuan | Personal branding |
| Bahasa | Bahasa Indonesia (bawaan) + English lewat tombol **ID · EN** |
| Kontak | Email, LinkedIn, tombol **Unduh CV**. Nomor HP **tidak** tampil di halaman (hanya ada di PDF CV). Tanpa WhatsApp. |
| Gaya | **B1 · Modern hangat "Terakota & Navy"** |
| Foto profil | Lingkaran sempurna, kepala & bahu utuh di tengah, lingkaran latar sepusat |
| Teknologi | HTML + CSS + JavaScript biasa. Tanpa framework dan tanpa proses build. |
| Hosting | GitHub Pages lewat GitHub Actions. Hanya folder `site/` yang dipublikasikan. |
| Repo tujuan | `dheafitrianinurhamidah/MyPortofolio` (publik, masih kosong, branch `main`) |

## 3. Struktur halaman & isi (teks bahasa Indonesia)

Satu halaman yang di-scroll. Penanda bagian: `#beranda`, `#tentang`, `#pengalaman`, `#keahlian`, `#prestasi`, `#galeri`, `#kontak`.

Setiap bagian (kecuali Pembuka) punya label kecil (*eyebrow*) di atas judulnya.

### 3.1 Menu atas (menempel saat di-scroll)

- Merek: **dhea.** (menuju `#beranda`)
- Tautan: Tentang · Pengalaman · Keahlian · Prestasi · Galeri · Kontak
- Tombol bahasa: **ID · EN**
- Di layar < 960 px, tautan disembunyikan di balik tombol ☰ (label "Buka menu" / "Tutup menu").
- Tautan "Lewati ke konten" muncul saat ditekan Tab pertama kali.

### 3.2 Pembuka (`#beranda`)

- Label lokasi: **Bandung, Indonesia**
- Judul (h1): **Halo, saya *Dhea*** ("Dhea" berwarna terakota)
- Nama lengkap: **Dhea Fitriani Nur Hamidah**
- Jabatan: **Payment Officer di PT Telkom Indonesia – Telkom Corporate University**
- Ringkasan: "Profesional administrasi & keuangan yang teliti dan rapi, berpengalaman di event, MC, dan marketing."
- Tombol:
  - **Hubungi Saya** → `#kontak`
  - **Unduh CV** → `assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf` (atribut `download`)
  - Ikon **LinkedIn** → https://www.linkedin.com/in/dheafitrianinurhamidah/ (tab baru, label "Profil LinkedIn")
- Foto profil lingkaran (lihat §4.4).

### 3.3 Angka sorotan (di bawah Pembuka)

| Angka | Keterangan |
|---|---|
| 3.91 | IPK S1 Manajemen |
| 975/1000 | Skor MOS Excel 2019 |
| 100 | Dokumen perjalanan dinas per triwulan |
| 850 | Penonton dari 5 sekolah lewat kampanye film |

### 3.4 Tentang Saya + Pendidikan (`#tentang`, eyebrow "Tentang")

- Judul: **Tentang Saya**
- Paragraf (dari CV): "Profesional administrasi dan keuangan dengan pengalaman dalam pengelolaan anggaran, pertanggungjawaban keuangan, dan dokumentasi operasional yang tepat dan rapi. Terampil menyusun RAB, mengelola data, serta memastikan kelancaran proses administrasi harian. Memiliki pengalaman di bidang marketing, termasuk pengelolaan campaign dan konten. Siap mendukung perusahaan melalui ketelitian, koordinasi yang efektif, dan pemahaman strategis terhadap kebutuhan operasional dan pemasaran."
- Bidang fokus (chip): Administrasi & Keuangan · Event & MC · Marketing & Konten
- Subjudul **Pendidikan**:
  - **Sekolah Tinggi Ilmu Ekonomi (STIE) Ekuitas**, S1 Manajemen · IPK 3.91/4.00 · 2019 – 2023
  - **SMA Negeri 3 Bandung** · 2016 – 2019

### 3.5 Pengalaman Kerja (`#pengalaman`, eyebrow "Perjalanan Karier")

Ditampilkan sebagai garis waktu, dari yang terbaru.

**Payment Officer**, PT Telkom Indonesia – Telkom Corporate University · 2024 – Sekarang
1. Mengelola administrasi keuangan unit, termasuk penyusunan RAB, FK/JK, kontrak peserta, nota pesanan vendor, pengarsipan dokumen, serta memastikan akurasi pertanggungan di MyDX, monitoring anggaran, pencatatan kas kecil, dan verifikasi transaksi harian (termasuk PPh/PPN).
2. Memproses hingga 15 dokumen keuangan per bulan dan 100 dokumen perjalanan dinas setiap triwulan.
3. Mengoperasikan sistem internal (MyDX, PADi UMKM, Microsoft Teams, Privy, Telkom Sign Peruri, Travel Management, dan MyDigiLearn) untuk approval berkas, administrasi perjalanan dinas, pelaporan keuangan, dan pembaruan kegiatan unit.
4. Mendukung koordinasi lintas unit (internal & eksternal) dan vendor terkait kebutuhan operasional, kegiatan, dan pemenuhan dokumen.
5. Melaksanakan dukungan event dan workshop, termasuk koordinasi peserta/narasumber, admin teknis, logistik, dan berperan sebagai MC.
6. Mengembangkan content plan bulanan dan mendukung komunikasi Expert Telkom Group melalui kanal WA TeXpert dan Microsoft Teams.

**Marketing and Distribution Officer**, PT Amacon Mitra Guna · 2023 – 2024
1. Mengelola strategi dan operasional marketing film "The Journey: Angklung Goes To Europe (FTJ)", termasuk pemetaan sekolah dan hubungan dengan bioskop.
2. Melakukan visit sosialisasi kepada 80 top management sekolah, berhasil menarik 850 penonton dari 5 sekolah, dan memimpin 6 campaigner dalam kegiatan kampanye.
3. Menangani administrasi seperti input data (Excel/Spreadsheet), notulensi, surat-menyurat, serta merekrut campaigner.

**Staf Divisi Program (Kontrak) & Staf Sekretaris & HRGA (Magang)**, PT Menara Fatih Indonesia – Muda Movement Indonesia · 2023
1. Menyosialisasikan program kepada mitra, melakukan negosiasi dan pitching, serta menjalankan tugas strategis dan teknis program, termasuk telemarketing dan layanan customer service.
2. Membuat strategi dan konten marketing (online & offline), melakukan quality control konten, serta melakukan screening kandidat beasiswa.
3. Menangani administrasi kesekretariatan seperti surat-menyurat, data entry, filing, pengelolaan dokumen digital/non-digital, serta notulensi rapat.
4. Melakukan stok opname ATK bulanan, perekrutan karyawan baru, menjadi contact person calon karyawan, dan memonitor kinerja office boy.

### 3.6 Keahlian & Sertifikasi (`#keahlian`, eyebrow "Kemampuan")

- Judul: **Keahlian & Sertifikasi**
- Empat kelompok chip:
  - **Administrasi & Keuangan:** Penyusunan RAB · Pertanggungjawaban keuangan · Monitoring anggaran · Verifikasi transaksi (PPh/PPN) · Administrasi dokumen & data management
  - **Event & Komunikasi:** Koordinasi event & rapat (rundown, logistik, MoM) · MC & public speaking · Content plan
  - **Marketing & SDM:** Marketing & campaign (konten, pitching, telemarketing) · Customer handling · Recruitment support
  - **Aplikasi & Sistem:** Google Workspace (Docs, Sheets, Slides, Forms, Drive) · Microsoft Office (Excel, Word) · MyDX · SharePoint · Privy · Telkom Sign Peruri · Travel Management · PADi UMKM · Microsoft Teams · MyDigiLearn
- Kartu sertifikasi (ditonjolkan): **Microsoft Office Specialist (MOS) Excel 2019**, Skor 975/1000

### 3.7 Penghargaan & Kegiatan (`#prestasi`, eyebrow "Pencapaian")

Enam kartu. Setiap kartu berisi ikon, periode, judul, dan detail.

| Ikon | Periode | Judul | Detail |
|---|---|---|---|
| mikrofon | 2024 – 2025 | MC Agenda Expert Management | Menjadi MC untuk berbagai agenda di unit Expert Management Telkom CorpU. |
| globe | Jul – Agu 2024 | Misi Budaya ke Eropa & Timur Tengah | Portugal, Spanyol, UAE, dan Arab Saudi bersama Tim Muhibah Angklung. |
| piala | 2023 | 40 Proposal Terbaik & Terdanai | Kategori start-up, kompetisi inovasi proyek sosial PFmuda Pertamina Foundation, bersama Tim Muda Movement. |
| globe | Jul – Agu 2022 | Misi Budaya ke Amerika Serikat | Bersama Tim Muhibah Angklung. |
| piala | 2021 | Juara 2 Lomba Lagu Islami Nasional | PERAK 2021, HIMA Pendidikan Kimia UIN SGD. |
| piala | 2020 | Juara 3 Lomba Paduan Suara | The 14th National Folklore Festival Chayavika Samadhi, Universitas Indonesia. |

### 3.8 Galeri Kegiatan (`#galeri`, eyebrow "Dokumentasi")

- Judul: **Galeri Kegiatan**
- Tombol filter: **Semua (11)** · **Profesional (3)** · **Misi Budaya (8)**
- Urutan, sumber, dan keterangan (disetujui di percakapan):

| Kode | Nama file (tanpa `.jpg`) | File asli | Kategori | Keterangan |
|---|---|---|---|---|
| g01 | `g01-telkom-forum-expert-q2-2026` | `WhatsApp Image 2026-09-27 at 22.27.46.jpeg` | profesional | Expert Insight Leadership & Forum Expert Telkom Group Q2 2026 |
| g02 | `g02-telkom-forum-expert-tim` | `WhatsApp Image 2026-09-27 at 22.26.00.jpeg` | profesional | Bersama tim di Expert Insight Leadership & Forum Expert Telkom Group |
| g03 | `g03-pelatihan-iso-bsi-2026` | `WhatsApp Image 2026-09-27 at 22.30.41.jpeg` | profesional | Pelatihan ISO/IEC 27001 & 20000-1 bersama bsi Training Academy, Mei 2026 |
| g04 | `g04-angklung-festival-2024` | `WhatsApp Image 2026-09-27 at 22.32.13 (1).jpeg` | budaya | Tampil bersama Tim Muhibah Angklung di festival folklor internasional, 2024 |
| g05 | `g05-angklung-vokal-2024` | `WhatsApp Image 2026-09-27 at 22.32.13.jpeg` | budaya | Bernyanyi diiringi angklung di festival internasional, 2024 |
| g06 | `g06-angklung-portugal-malam-2024` | `WhatsApp Image 2026-09-27 at 22.32.13 (5).jpeg` | budaya | Pertunjukan malam di Portugal, 2024 |
| g07 | `g07-angklung-panggung` | `WhatsApp Image 2026-09-27 at 22.32.13 (7).jpeg` | budaya | Tampil di panggung bersama Tim Muhibah Angklung |
| g08 | `g08-angklung-parade-portugal-2024` | `WhatsApp Image 2026-09-27 at 22.32.13 (2).jpeg` | budaya | Parade angklung di Portugal, 2024 |
| g09 | `g09-angklung-bersiap` | `WhatsApp Image 2026-09-27 at 22.32.13 (3).jpeg` | budaya | Tim Muhibah Angklung bersiap tampil |
| g10 | `g10-angklung-foto-bersama` | `WhatsApp Image 2026-09-27 at 22.32.13 (4).jpeg` | budaya | Foto bersama Tim Muhibah Angklung |
| g11 | `g11-angklung-busana-nusantara` | `WhatsApp Image 2026-09-27 at 22.32.13 (6).jpeg` | budaya | Kebersamaan tim dalam busana adat Nusantara |

- Setiap foto juga punya teks alternatif (`alt`) yang menjelaskan isi foto, dalam dua bahasa.

### 3.9 Kontak (`#kontak`, eyebrow "Kontak")

- Judul: **Mari Terhubung**
- Teks: "Terbuka untuk berdiskusi dan berkolaborasi. Cara tercepat menghubungi saya adalah lewat email atau LinkedIn."
- Tombol:
  - **Email**: `mailto:fitriani.dhea29@gmail.com`, alamat email juga ditampilkan sebagai teks
  - **LinkedIn**: tab baru
  - **Unduh CV**
- Lokasi: Bandung, Indonesia

### 3.10 Kaki halaman

"© 2026 Dhea Fitriani Nur Hamidah" dan tautan "Kembali ke atas ↑".

### 3.11 Meta & pratinjau tautan

- Judul tab: "Dhea Fitriani Nur Hamidah · Portofolio"
- Deskripsi: "Portofolio Dhea Fitriani Nur Hamidah, Payment Officer di Telkom Corporate University. Administrasi, keuangan, event, dan marketing."
- Open Graph:
  - `og:type=website`, `og:locale=id_ID`, `og:locale:alternate=en_US`
  - `og:title` dan `og:description` sama dengan judul dan deskripsi di atas
  - `og:url` = alamat akhir
  - `og:image` = `https://dheafitrianinurhamidah.github.io/MyPortofolio/assets/og-image.jpg` (1200×630)
- `twitter:card=summary_large_image`, `<link rel="canonical">` = alamat akhir.

## 4. Tampilan (gaya B1 · Terakota & Navy)

### 4.1 Warna (CSS custom properties di `:root`)

| Token | Nilai | Kegunaan |
|---|---|---|
| `--bg` | `#FFF8F2` | latar halaman (krem hangat) |
| `--surface` | `#FFFFFF` | kartu |
| `--ink` | `#1F2A44` | teks utama, latar bagian Kontak (navy) |
| `--muted` | `#5B6475` | teks sekunder |
| `--accent` | `#B5502F` | tombol utama, "Dhea", angka, ikon (terakota) |
| `--accent-ink` | `#9A4226` | teks kecil di atas `--accent-soft` |
| `--accent-soft` | `#F7DFD2` | chip, lingkaran latar foto, latar ikon (peach) |
| `--ring` | `#E0A184` | garis putus-putus di sekitar foto |
| `--gold` | `#E3A857` | titik dekoratif (emas bambu) |
| `--line` | `#EADFD6` | garis batas halus |

Kontras yang sudah dihitung (WCAG AA):
- `--ink` di `--bg`: 13.5:1
- `--muted` di `--bg`: 5.7:1
- `--accent` di `--bg`: 4.8:1
- putih di `--accent`: 5.1:1
- `--accent-ink` di `--accent-soft`: 5.2:1

`--accent` **tidak** dipakai untuk teks kecil di atas `--accent-soft`, karena kontrasnya hanya 4.0:1.

### 4.2 Tipografi

- Font: **Plus Jakarta Sans** (Google Fonts, berat 400/500/600/700/800, `display=swap`). Cadangannya: `system-ui, sans-serif`.
- Teks isi 16 px, tinggi baris 1.65.
- h1: `clamp(2.4rem, 1.6rem + 3.2vw, 3.6rem)`, berat 800, `letter-spacing: -0.02em`.
- h2: `clamp(1.75rem, 1.3rem + 1.6vw, 2.4rem)`, berat 800.
- Eyebrow: 0.8rem, berat 700, huruf kapital, `letter-spacing: 0.12em`, warna `--accent`.

### 4.3 Tata letak

- Kontainer: maks 1120 px, jarak tepi 20 px (HP) / 32 px (≥ 640 px).
- Jarak antarbagian: 72 px (HP) / 104 px (≥ 960 px).
- Titik ubah: 640 px dan 960 px. Dirancang mulai dari HP (*mobile-first*).
- Sudut: kartu 18 px, gambar 14 px, tombol & chip berbentuk pil.
- Bayangan kartu: `0 8px 24px rgba(31, 42, 68, 0.08)`.
- **Pembuka:**
  - HP: foto di atas, teks di bawah, rata tengah.
  - ≥ 960 px: dua kolom, teks kiri dan foto kanan (`1.2fr 1fr`).
- **Angka sorotan:** kisi 2×2 di HP, 4 kolom di ≥ 960 px. Angka berwarna `--accent`, berat 800.
- **Pengalaman:** garis waktu vertikal (garis `--accent-soft`, titik `--accent`). Tiap posisi berisi jabatan (h3), perusahaan · periode, dan daftar poin.
- **Keahlian:** 4 kartu kelompok (1 kolom HP, 2 kolom ≥ 640 px) + kartu sertifikasi dengan tepi `--accent`.
- **Prestasi:** kartu 1 / 2 / 3 kolom. Ikon dalam lingkaran `--accent-soft`.
- **Galeri:** kisi 2 / 3 / 4 kolom (HP / ≥ 640 / ≥ 960). Foto kecil berasio 4:3 (`object-fit: cover` dengan titik fokus per foto), keterangan kecil di bawahnya.
- **Kontak:** kartu besar berlatar `--ink` dengan teks `--bg`. Tombol utama terakota, tombol lain bergaris krem.

### 4.4 Foto profil (sesuai revisi yang disetujui)

- File `profile.jpg` berbentuk bujur sangkar 800×800, dipotong dari foto asli sehingga kepala (hijab utuh) dan bahu berada di tengah.
- Ditampilkan sebagai lingkaran sempurna: `aspect-ratio: 1`, `border-radius: 50%`, bingkai 6 px warna `--surface`, dan bayangan halus.
- Lingkaran latar peach sepusat (`inset: -7%`, `--accent-soft`), cincin garis putus-putus sepusat (`inset: -12%`, 1.5 px `--ring`), dan 2 titik `--gold`. Semua hiasan ini `aria-hidden`.
- Lebar foto: 240 px (HP) hingga 360 px (desktop).

### 4.5 Gerak

- Tiap bagian muncul perlahan: opacity 0 → 1 dan geser 16 px → 0, selama 600 ms, saat masuk layar (IntersectionObserver).
- Efek hanya aktif jika JavaScript berjalan (kelas `js` di `<html>`). Tanpa JS, semua isi tetap terlihat.
- Jika perangkat diatur `prefers-reduced-motion: reduce`, semua animasi dan *smooth scroll* dimatikan.

## 5. Interaksi

- **Navigasi:** tautan menu menggulir ke bagian terkait (`scroll-behavior: smooth`, `scroll-margin-top: 80px`).
- **Menu HP:** tombol ☰ memakai `aria-expanded` dan `aria-controls`. Menu tertutup saat tautan diklik atau Esc ditekan.
- **Bahasa:**
  - Bawaannya selalu `id`, tidak mengikuti bahasa browser.
  - Urutan prioritas: parameter URL `?lang=en|id`, lalu pilihan tersimpan (`localStorage` kunci `lang`, dibungkus try/catch), lalu `id`.
  - Tombol ID dan EN berada dalam grup berlabel dan memakai `aria-pressed`.
  - Saat berganti bahasa: `<html lang>`, judul tab, dan meta description ikut berubah.
- **Mekanisme terjemahan:**
  - Teks Indonesia hanya ditulis di `index.html`. Teks Inggris hanya ditulis di `js/i18n-en.js` (`window.I18N_EN = { "kunci": "teks" }`).
  - `data-i18n="kunci"` mengganti teks, `data-i18n-html="kunci"` mengganti HTML (untuk teks bertanda seperti `<em>`), dan `data-i18n-attr="alt:kunci;aria-label:kunci2"` mengganti atribut.
  - Teks Indonesia asli disimpan dari DOM saat pertama kali berganti, lalu dipulihkan saat kembali ke ID.
- **Skrip:** memakai `<script defer>` biasa, bukan ES module, supaya tetap berjalan jika `index.html` dibuka langsung dari folder (`file://`).
- **Galeri:**
  - Filter memakai `aria-pressed`. Item yang tidak cocok diberi atribut `hidden`.
  - Klik foto kecil membuka `<dialog>` (tampilan besar) berisi foto versi besar, keterangan, dan penghitung "n / total".
  - Tombol ‹ › dan panah ←/→ berpindah di antara foto yang sedang terlihat saja, dan berputar dari foto terakhir ke pertama.
  - Esc, tombol ×, atau klik area gelap menutup tampilan besar. Fokus keyboard kembali ke foto kecil yang tadi dibuka.
- **Tautan luar** (LinkedIn): `target="_blank" rel="noopener noreferrer"`.

## 6. Aset & privasi

- **Pengolahan foto:** `tools/optimize_images.py` (Python 3 + Pillow) membaca foto asli dan menulis hasilnya ke `site/assets/img/`.
  - Langkah per foto: terapkan orientasi EXIF, ubah ke sRGB, **hapus semua metadata** (termasuk GPS), lalu simpan sebagai JPEG progresif.
  - `profile.jpg`: 800×800, kualitas 82.
  - `gallery/thumb/<nama file §3.8>.jpg`: lebar 800 px, kualitas 78.
  - `gallery/full/<nama file §3.8>.jpg`: sisi terpanjang ≤ 1600 px (tidak diperbesar), kualitas 82.
- **Batas ukuran file:**

  | File | Batas |
  |---|---|
  | `profile.jpg` | ≤ 200 KB |
  | foto kecil | ≤ 150 KB |
  | foto besar | ≤ 450 KB |
  | `og-image.jpg` | ≤ 300 KB |

- **Gambar pratinjau tautan:** `site/assets/og-image.jpg` (1200×630) dirender dari `tools/og-image.html` lewat Chrome. Isinya latar krem, foto lingkaran, nama, jabatan, dan alamat website.
- **Ikon tab:** `site/favicon.svg` (monogram "d." terakota) dan `site/apple-touch-icon.png` (180×180).
- **CV:** salinan PDF asli di `site/assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf`.
- **Tidak dipublikasikan:** foto asli dan CV asli (sudah di `.gitignore`).
- **Aturan privasi (diuji):**
  - Tidak ada nomor HP dalam format apa pun (`0821…`, `+62 821…`, `821-xxxx-xxxx`, dan sejenisnya) di file teks mana pun di `site/`.
  - Tidak ada tautan `wa.me` / `api.whatsapp.com`.

## 7. Aksesibilitas & kinerja

- Struktur semantik: `header`, `nav`, `main`, dan `section` berlabel judul (`aria-labelledby`), serta `footer`. Hanya satu `h1`.
- Semua gambar isi punya `alt` yang bermakna, dalam dua bahasa. Hiasan diberi `aria-hidden="true"`.
- Fokus keyboard terlihat jelas: garis 3 px `--accent` dengan jarak 2 px.
- Area sentuh minimal 44×44 px.
- Tanpa framework:
  - CSS < 25 KB dan JS < 12 KB, tanpa minifikasi.
  - Foto galeri memakai `loading="lazy"` dan atribut `width`/`height`, supaya tata letak tidak meloncat saat foto dimuat.
  - Google Fonts memakai `preconnect`.

## 8. Struktur file

```
site/                       ← dipublikasikan
  index.html
  css/styles.css
  js/i18n-en.js             ← window.I18N_EN
  js/main.js                ← menu, bahasa, galeri, animasi muncul
  assets/img/profile.jpg
  assets/img/gallery/thumb/<nama file §3.8>.jpg   (11 file)
  assets/img/gallery/full/<nama file §3.8>.jpg    (11 file)
  assets/og-image.jpg
  assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf
  favicon.svg
  apple-touch-icon.png
tests/                      ← Playwright
playwright.config.js
package.json, package-lock.json
tools/optimize_images.py, tools/og-image.html, tools/render-og.mjs
.github/workflows/deploy.yml
README.md                   ← cara mengubah isi, menambah foto, menjalankan tes, deploy
docs/superpowers/specs/, docs/superpowers/plans/
```

## 9. Pengujian (TDD)

- **Alat:**
  - `@playwright/test` memakai Google Chrome yang terpasang (`channel: 'chrome'`).
  - Dua profil: **desktop** 1280×800 dan **mobile** 390×844 (layar sentuh).
  - Server lokal: `python3 -m http.server 4173 --bind 127.0.0.1 --directory site`.
  - Perintah: `npm test`.
- **Cakupan minimal:**
  - **Isi:**
    - nama, jabatan, 4 angka sorotan, paragraf Tentang, 2 pendidikan;
    - 3 pengalaman dengan jumlah poin 6 / 3 / 4;
    - 4 kelompok keahlian + kartu MOS, 6 kartu prestasi;
    - email & LinkedIn persis sama dengan §3.9, dan tautan CV mengembalikan PDF (HTTP 200, `application/pdf`).
  - **Privasi:** aturan §6 berlaku di semua file teks `site/` dan di halaman yang dirender.
  - **Bahasa:**
    - bawaannya `lang="id"`, dan EN mengganti semua elemen `data-i18n*` sesuai kamus;
    - pilihan tersimpan setelah halaman dimuat ulang, dan `?lang=en` langsung berbahasa Inggris;
    - kembali ke ID memulihkan teks asli;
    - setiap kunci di HTML ada di kamus, dan tidak ada kunci kamus yang tidak terpakai.
  - **Galeri:**
    - total 11 foto, dan filter menampilkan 3 / 8 / 11;
    - tampilan besar menampilkan foto dan keterangan yang benar;
    - ‹ › dan panah bekerja serta berputar;
    - Esc menutup dan fokus kembali.
  - **Tata letak:**
    - tidak ada geser horizontal di lebar 360, 390, dan 1280 px;
    - menu HP bekerja;
    - foto profil berbentuk bujur sangkar yang dirender sebagai lingkaran (lebar = tinggi, `border-radius` 50%).
  - **Kualitas:**
    - tidak ada error di console;
    - semua `<img>` punya `alt` dan berhasil dimuat;
    - meta Open Graph lengkap dengan URL absolut alamat akhir;
    - batas ukuran file §6 terpenuhi, dan favicon ada.
- **Otomatisasi:** tes dijalankan di komputer lokal. Alur deploy di GitHub **tidak** menjalankan tes, supaya perubahan isi oleh Dhea tidak terhambat.

## 10. Deploy

- Berkas `.github/workflows/deploy.yml` berjalan saat ada push ke `main` (dan bisa dijalankan manual).
  - Urutannya: `actions/checkout` → `actions/configure-pages` → `actions/upload-pages-artifact` (`path: site`) → `actions/deploy-pages`.
  - Versi mayor terbaru diperiksa saat implementasi.
  - Izin: `pages: write`, `id-token: write`, `contents: read`.
- **Pengaturan repo:** GitHub Pages → Source: *GitHub Actions*.
- **Hak akses:** akun yang login di komputer ini (`rizkyasepsutrisna`) berbeda dari pemilik repo. Cara push (login akun Dhea di `gh`, menjadikan akun ini kolaborator, atau push manual) dipilih bersama di tahap akhir.
- **Push dan pengaktifan Pages hanya dilakukan setelah ada konfirmasi eksplisit.**

## 11. Di luar cakupan

Mode gelap, formulir kontak, blog / banyak halaman, analitik / pelacakan, domain khusus, dan CMS.

## 12. Asumsi & risiko

- Keterangan foto adalah dugaan dari isi foto dan CV, dan sudah disetujui. Bisa diubah di `index.html` (ID) dan `js/i18n-en.js` (EN).
- Terjemahan Inggris dibuat oleh Claude. Nama diri, nama perusahaan, nama sistem, dan singkatan (RAB, FK/JK, PPh/PPN, MoM) tidak diterjemahkan. "FK/JK" dibiarkan apa adanya karena kepanjangannya tidak ada di CV.
- Jika Google Fonts tidak bisa dimuat, website memakai font sistem. Tampilan sedikit berbeda, tetapi isi tetap utuh.
- Nama repo `MyPortofolio` peka huruf besar/kecil di alamat website.
