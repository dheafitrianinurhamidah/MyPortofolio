// Membaca ukuran dan keberadaan EXIF dari file JPEG tanpa dependensi tambahan.
const fs = require('fs');

// Penanda SOF (Start Of Frame) yang menyimpan ukuran gambar; C4, C8, dan CC bukan SOF.
const SOF = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function readJpegInfo(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error(`${filePath} bukan file JPEG`);

  let off = 2;
  let width = 0;
  let height = 0;
  let hasExif = false;
  while (off + 4 <= buf.length) {
    if (buf[off] !== 0xff) throw new Error(`penanda JPEG rusak di byte ${off} (${filePath})`);
    const marker = buf[off + 1];
    if (marker === 0xff) { off += 1; continue; } // byte pengisi
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) { off += 2; continue; } // penanda tanpa panjang
    if (marker === 0xda) break; // SOS: data gambar dimulai, tidak ada header lagi
    const len = buf.readUInt16BE(off + 2);
    if (marker === 0xe1 && buf.toString('latin1', off + 4, off + 10) === 'Exif\0\0') hasExif = true;
    if (SOF.has(marker)) {
      height = buf.readUInt16BE(off + 5);
      width = buf.readUInt16BE(off + 7);
    }
    off += 2 + len;
  }
  return { width, height, hasExif };
}

module.exports = { readJpegInfo };
