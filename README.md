# Portofolio Dhea Fitriani Nur Hamidah

Website portofolio satu halaman, dalam dua bahasa: Bahasa Indonesia dan English.

🌐 **https://dheafitrianinurhamidah.github.io/MyPortofolio/**

Dibuat dengan HTML, CSS, dan JavaScript biasa, tanpa framework dan tanpa proses build, lalu dipublikasikan gratis lewat GitHub Pages.

## Isi folder

| Folder / file | Isi |
|---|---|
| `site/` | Website yang dipublikasikan: `index.html`, gaya (`css/`), skrip (`js/`), foto dan CV (`assets/`) |
| `tools/` | Pengolah foto, server lokal, dan pembuat gambar pratinjau tautan |
| `tests/` | Tes otomatis (Playwright) |
| `docs/superpowers/` | Dokumen desain (spec) dan rencana implementasi |
| `.github/workflows/deploy.yml` | Deploy otomatis ke GitHub Pages |

Foto asli (`Foto Kegiatan/`, foto profil WhatsApp) dan CV asli **tidak** ikut diunggah ke GitHub (lihat `.gitignore`). Yang dipublikasikan hanya versi yang sudah diperkecil dan dibersihkan dari metadata.

## Mengubah isi

- **Teks bahasa Indonesia** ada di `site/index.html`.
- **Teks bahasa Inggris** ada di `site/js/i18n-en.js`.

Setiap teks yang punya terjemahan diberi kunci di HTML, lalu terjemahannya ditulis di `i18n-en.js` dengan kunci yang sama. Contoh:

```html
<!-- site/index.html -->
<h2 id="kontak-title" data-i18n="contact.title">Mari Terhubung</h2>
```

```js
// site/js/i18n-en.js
"contact.title": "Let’s Connect",
```

Jadi kalau mengubah satu kalimat, ubah di **kedua** file. Tes `npm test` akan memberi tahu jika ada kunci yang terlewat.

Di `i18n-en.js`, tulis teks **di antara tanda kutip ganda** `"…"`. Apostrof seperti `Let's` aman dipakai. Kalau teks perlu tanda kutip di dalamnya, pakai kutip miring “…”, karena satu tanda kutip ganda lurus di dalam teks membuat seluruh mode EN berhenti bekerja.

Perubahan lain:

- **Mengganti CV:** timpa `site/assets/CV-Dhea-Fitriani-Nur-Hamidah.pdf` dengan file baru. Nama filenya harus tetap sama. File di `site/assets` inilah CV yang berlaku: `npm run images` tidak akan menimpanya.
- **Mengganti foto profil:** simpan foto baru di folder proyek dengan nama `WhatsApp Image 2026-09-27 at 22.23.24.jpeg` (atau ubah `PROFILE_SRC` di `tools/optimize_images.py`), lalu jalankan `npm run images`.
  - Hasilnya `site/assets/img/profile.jpg`, berukuran 800×800.
  - Foto dipotong persegi dari bagian atas-tengah. Gunakan foto potret dengan kepala di bagian atas.
- **Mengganti nama atau jabatan:** ubah juga `tools/og-image.html`, lalu jalankan `npm run og` untuk memperbarui gambar pratinjau tautan (yang muncul saat link dibagikan di LinkedIn/WhatsApp).

Tentang bahasa: tautan `…/MyPortofolio/?lang=en` langsung membuka versi Inggris, dan browser pengunjung akan mengingat pilihan itu. Untuk kembali ke Bahasa Indonesia, tekan tombol **ID**.

## Menambah foto

1. Taruh foto asli di folder `Foto Kegiatan/`.
2. Di `tools/optimize_images.py`, tambahkan satu baris ke daftar `GALLERY`: nama file asli dan nama baru, misalnya `g12-nama-kegiatan`.
3. Jalankan `npm run images`. Foto kecil dan foto besar akan dibuat di `site/assets/img/gallery/`. Foto asli yang tidak ada di komputer ini (misalnya di komputer lain) akan dilewati, dan hasil lamanya tetap dipakai.
4. Di `site/index.html`, salin satu blok `<li class="gallery__item" …>`, lalu ganti:
   - `data-id`;
   - `data-category` (`profesional` atau `budaya`);
   - nama file;
   - `alt`;
   - keterangan fotonya.

   Perbarui juga angka di tombol filter, misalnya `(11)` menjadi `(12)`.
5. Di `site/js/i18n-en.js`, tambahkan terjemahan `gallery.g12` dan `gallery.g12.alt`.
6. Tambahkan foto yang sama ke `tests/fixtures/gallery.js`, lalu jalankan `npm test`. Beberapa tes memeriksa jumlah foto, jadi sesuaikan angkanya bila ada yang gagal.

## Melihat di komputer

```bash
npm run serve
```

Lalu buka http://127.0.0.1:4173/ di browser. Cara lain: klik dua kali `site/index.html`.

## Menjalankan tes

Dibutuhkan Node.js, Python 3 (dengan Pillow, untuk `npm run images`), Google Chrome, dan koneksi internet (halaman memuat font dari Google Fonts; tanpa internet, tes "tanpa error console" akan gagal).

```bash
npm install
npm test
```

Tes memeriksa beberapa hal:
- isi dan tombol ID · EN;
- galeri dan tampilan foto besar;
- tampilan HP dan desktop;
- tidak adanya nomor HP di website;
- ukuran file.

## Deploy

Setiap push ke branch `main` otomatis mempublikasikan folder `site/` lewat GitHub Actions (`.github/workflows/deploy.yml`). Status deploy bisa dilihat di tab **Actions** repo.

Pengaturan ini cukup dilakukan **sekali**: di GitHub, buka **Settings → Pages → Build and deployment**, lalu pilih **Source: GitHub Actions**.
