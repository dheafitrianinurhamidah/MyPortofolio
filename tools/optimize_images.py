#!/usr/bin/env python3
"""Mengolah foto asli menjadi aset web di site/assets (spec §6).

Pemakaian:  python3 tools/optimize_images.py   (atau: npm run images)

Foto dan CV asli dibaca dari folder proyek. File asli itu tidak ikut
di-commit (.gitignore); hanya hasil olahannya yang dipublikasikan.
Semua metadata (EXIF, termasuk lokasi GPS) dibuang.

Menambah foto galeri: taruh foto asli di "Foto Kegiatan/", tambahkan satu
baris di GALLERY di bawah, jalankan skrip ini, lalu tambahkan item galeri
di site/index.html dan kunci terjemahannya di site/js/i18n-en.js.
"""
from io import BytesIO
from pathlib import Path
import shutil

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "Foto Kegiatan"
ASSETS = ROOT / "site" / "assets"
IMG = ASSETS / "img"

PROFILE_SRC = ROOT / "WhatsApp Image 2026-09-27 at 22.23.24.jpeg"
CV_SRC = ROOT / "CV Dhea Fitriani N.H. 2025.pdf"
CV_OUT = ASSETS / "CV-Dhea-Fitriani-Nur-Hamidah.pdf"

# (file asli di "Foto Kegiatan/", nama file hasil tanpa .jpg) — urutan = urutan galeri
GALLERY = [
    ("WhatsApp Image 2026-09-27 at 22.27.46.jpeg", "g01-telkom-forum-expert-q2-2026"),
    ("WhatsApp Image 2026-09-27 at 22.26.00.jpeg", "g02-telkom-forum-expert-tim"),
    ("WhatsApp Image 2026-09-27 at 22.30.41.jpeg", "g03-pelatihan-iso-bsi-2026"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (1).jpeg", "g04-angklung-festival-2024"),
    ("WhatsApp Image 2026-09-27 at 22.32.13.jpeg", "g05-angklung-vokal-2024"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (5).jpeg", "g06-angklung-portugal-malam-2024"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (7).jpeg", "g07-angklung-panggung"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (2).jpeg", "g08-angklung-parade-portugal-2024"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (3).jpeg", "g09-angklung-bersiap"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (4).jpeg", "g10-angklung-foto-bersama"),
    ("WhatsApp Image 2026-09-27 at 22.32.13 (6).jpeg", "g11-angklung-busana-nusantara"),
]

KB = 1024
PROFILE_SIZE, PROFILE_Q, PROFILE_MAX = 800, 82, 200 * KB
THUMB_WIDTH, THUMB_Q, THUMB_MAX = 800, 78, 150 * KB
FULL_EDGE, FULL_Q, FULL_MAX = 1600, 82, 450 * KB
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))


def load(path):
    """Buka foto, terapkan orientasi EXIF, ubah ke RGB sRGB, dan buang semua metadata."""
    im = ImageOps.exif_transpose(Image.open(path))
    icc = im.info.get("icc_profile")
    if icc:
        src = ImageCms.ImageCmsProfile(BytesIO(icc))
        if "srgb" not in (ImageCms.getProfileDescription(src) or "").lower():
            im = ImageCms.profileToProfile(im, src, SRGB, outputMode="RGB")
    im = im.convert("RGB")
    im.info.clear()
    return im


def save(im, path, quality, max_bytes):
    """Simpan JPEG progresif tanpa metadata; turunkan kualitas per 4 sampai ukurannya muat."""
    path.parent.mkdir(parents=True, exist_ok=True)
    while True:
        buf = BytesIO()
        im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
        if buf.tell() <= max_bytes or quality <= 40:
            break
        quality -= 4
    path.write_bytes(buf.getvalue())
    print(f"  {path.relative_to(ROOT)}  {im.width}x{im.height}  q{quality}  {buf.tell() // KB} KB")


def resize_to_width(im, width):
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def resize_long_edge(im, edge):
    scale = min(1.0, edge / max(im.size))  # tidak pernah diperbesar
    return im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)


def skipped(path):
    """Foto asli tidak ada (mis. di komputer lain): lewati tanpa menghentikan skrip; hasil lama tetap dipakai."""
    print(f"  dilewati (file asli tidak ditemukan): {path.relative_to(ROOT)}")


def main():
    print("Foto profil:")
    if PROFILE_SRC.exists():
        im = load(PROFILE_SRC)
        side = min(im.size)
        left = (im.width - side) // 2
        # bujur sangkar menempel tepi atas (hijab utuh, wajah di tengah) dan di tengah secara horizontal
        square = im.crop((left, 0, left + side, side))
        save(square.resize((PROFILE_SIZE, PROFILE_SIZE), Image.LANCZOS), IMG / "profile.jpg", PROFILE_Q, PROFILE_MAX)
    else:
        skipped(PROFILE_SRC)

    print("Galeri:")
    for src_name, slug in GALLERY:
        source = PHOTOS / src_name
        if not source.exists():
            skipped(source)
            continue
        im = load(source)
        save(resize_to_width(im, THUMB_WIDTH), IMG / "gallery" / "thumb" / f"{slug}.jpg", THUMB_Q, THUMB_MAX)
        save(resize_long_edge(im, FULL_EDGE), IMG / "gallery" / "full" / f"{slug}.jpg", FULL_Q, FULL_MAX)

    # CV hanya disalin sekali. Setelah itu site/assets adalah tempat CV yang berlaku,
    # jadi CV yang sudah diganti di sana tidak pernah ditimpa oleh CV lama.
    if CV_OUT.exists():
        print(f"CV: {CV_OUT.relative_to(ROOT)} sudah ada, tidak ditimpa")
    elif CV_SRC.exists():
        CV_OUT.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(CV_SRC, CV_OUT)
        print(f"CV: disalin ke {CV_OUT.relative_to(ROOT)}")
    else:
        skipped(CV_SRC)


if __name__ == "__main__":
    main()
