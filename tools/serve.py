#!/usr/bin/env python3
"""Server lokal untuk melihat website dan menjalankan tes: http://127.0.0.1:4173/

Pemakaian:  python3 tools/serve.py   (atau: npm run serve)

Sama dengan `python3 -m http.server`, tetapi antrean koneksinya diperbesar.
Antrean bawaan (5) membuat koneksi sesekali diputus (ERR_CONNECTION_RESET)
saat banyak tes memuat halaman bersamaan.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
HOST, PORT = "127.0.0.1", 4173


class Server(ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):  # noqa: A002 — tanda tangan dari SimpleHTTPRequestHandler
        pass


if __name__ == "__main__":
    print(f"Website: http://{HOST}:{PORT}/  (Ctrl+C untuk berhenti)")
    Server((HOST, PORT), partial(QuietHandler, directory=str(SITE))).serve_forever()
