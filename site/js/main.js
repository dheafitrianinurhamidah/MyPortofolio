/* Portofolio Dhea — perilaku halaman: menu HP, dua bahasa, animasi muncul, dan galeri.
   Script biasa (bukan ES module) agar tetap jalan saat index.html dibuka langsung dari folder. */
(function () {
  'use strict';

  var LANGS = ['id', 'en'];
  var STORAGE_KEY = 'lang';

  /* Teks Indonesia asli per elemen, dicatat dari DOM sebelum pertama kali diganti:
     { text, html, attrs: { namaAtribut: nilai } }. */
  var originals = new WeakMap();

  function readStoredLang() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function storeLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* penyimpanan diblokir: pilihan tidak diingat */ }
  }

  function langFromUrl() {
    var value = (new URLSearchParams(window.location.search).get('lang') || '').toLowerCase();
    return LANGS.indexOf(value) >= 0 ? value : null;
  }

  function saved(el) {
    var entry = originals.get(el);
    if (!entry) {
      entry = { attrs: {} };
      originals.set(el, entry);
    }
    return entry;
  }

  /* Ganti semua teks bertanda data-i18n* ke bahasa `lang`, lalu umumkan lewat event "langchange". */
  function setLanguage(lang) {
    var dict = window.I18N_EN;
    if (lang === 'en' && !dict) return; // kamus gagal dimuat: tetap berbahasa Indonesia
    var en = lang === 'en';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var entry = saved(el);
      if (entry.text === undefined) entry.text = el.textContent;
      var value = en ? dict[el.getAttribute('data-i18n')] : entry.text;
      if (value !== undefined) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var entry = saved(el);
      if (entry.html === undefined) entry.html = el.innerHTML;
      var value = en ? dict[el.getAttribute('data-i18n-html')] : entry.html;
      if (value !== undefined) el.innerHTML = value;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var entry = saved(el);
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var name = parts[0];
        if (!(name in entry.attrs)) entry.attrs[name] = el.getAttribute(name);
        var value = en ? dict[parts[1]] : entry.attrs[name];
        if (value !== undefined && value !== null) el.setAttribute(name, value);
      });
    });

    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch [data-lang]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-lang') === lang));
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  /* Bila halaman dibuka dengan ?lang=…, samakan parameternya dengan pilihan baru agar muat ulang tetap konsisten. */
  function syncUrl(lang) {
    var params = new URLSearchParams(window.location.search);
    if (!params.has('lang')) return;
    params.set('lang', lang);
    try {
      window.history.replaceState(null, '', window.location.pathname + '?' + params.toString() + window.location.hash);
    } catch (e) { /* mis. dibuka dari file:// — abaikan */ }
  }

  /* Urutan: ?lang=en|id → pilihan tersimpan → Indonesia. */
  function initLanguage() {
    var fromUrl = langFromUrl();
    var stored = readStoredLang();
    var initial = fromUrl || (LANGS.indexOf(stored) >= 0 ? stored : 'id');
    if (fromUrl) storeLang(fromUrl);
    if (initial !== 'id') setLanguage(initial);

    document.querySelectorAll('.lang-switch [data-lang]').forEach(function (button) {
      button.addEventListener('click', function () {
        var lang = button.getAttribute('data-lang');
        setLanguage(lang);
        storeLang(lang);
        syncUrl(lang);
      });
    });
  }

  /* Menu ☰ di HP. Label tombol diambil dari dua span tersembunyi (.menu-toggle__label: buka, tutup)
     yang ikut diterjemahkan, lalu disegarkan saat bahasa berganti (event "langchange"). */
  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;
    var labels = toggle.querySelectorAll('.menu-toggle__label');

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', labels[open ? 1 : 0].textContent);
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      var open = !isOpen();
      setOpen(open);
      // Tautan menu berada sebelum tombol ☰ di urutan halaman: pindahkan fokus ke sana agar
      // pengguna keyboard dan pembaca layar langsung masuk ke menu yang baru dibuka.
      if (open) nav.querySelector('a').focus();
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('langchange', function () {
      setOpen(isOpen());
    });
  }

  /* Bagian muncul perlahan saat masuk layar; langsung tampil bila pengguna memilih "kurangi gerakan". */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' }); // ambang 0: bagian yang lebih tinggi dari layar (mis. saat di-zoom) tetap muncul
    items.forEach(function (el) { observer.observe(el); });
  }

  /* Galeri: filter kategori dan tampilan foto besar (<dialog>). Tanpa JS, foto kecil tetap
     menautkan ke foto besar. Keterangan dibaca dari DOM, jadi otomatis mengikuti bahasa aktif. */
  function initGallery() {
    var filters = document.querySelectorAll('.gallery__filters .filter');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));

    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var category = button.getAttribute('data-filter');
        filters.forEach(function (other) { other.setAttribute('aria-pressed', String(other === button)); });
        items.forEach(function (item) {
          item.hidden = category !== 'semua' && item.getAttribute('data-category') !== category;
        });
      });
    });

    var dialog = document.querySelector('.lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') return;

    var figure = dialog.querySelector('.lightbox__figure');
    var caption = dialog.querySelector('.lightbox__caption');
    var counter = dialog.querySelector('.lightbox__counter');
    var image = document.createElement('img'); // dibuat saat dibutuhkan agar tidak ada <img> tanpa src di halaman
    image.className = 'lightbox__img';
    var current = null;
    var opener = null;

    function visibleItems() {
      return items.filter(function (item) { return !item.hidden; });
    }

    function show(item) {
      var link = item.querySelector('.gallery__thumb');
      var list = visibleItems();
      current = item;
      if (!image.parentNode) figure.insertBefore(image, caption);
      image.src = link.getAttribute('href');
      image.alt = link.querySelector('img').alt;
      caption.textContent = item.querySelector('.gallery__caption').textContent;
      counter.textContent = (list.indexOf(item) + 1) + ' / ' + list.length;
    }

    function step(delta) {
      var list = visibleItems();
      show(list[(list.indexOf(current) + delta + list.length) % list.length]);
    }

    items.forEach(function (item) {
      item.querySelector('.gallery__thumb').addEventListener('click', function (event) {
        event.preventDefault();
        opener = event.currentTarget;
        show(item);
        dialog.showModal();
      });
    });

    dialog.querySelector('.lightbox__prev').addEventListener('click', function () { step(-1); });
    dialog.querySelector('.lightbox__next').addEventListener('click', function () { step(1); });
    dialog.querySelector('.lightbox__close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') step(1);
      else if (event.key === 'ArrowLeft') step(-1);
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) dialog.close(); // klik di area gelap, di luar foto dan tombol
    });
    dialog.addEventListener('close', function () {
      if (opener) opener.focus();
    });
  }

  function init() {
    try {
      initMenu(); // sebelum initLanguage: menu mendengarkan "langchange" untuk labelnya
      initLanguage();
      initReveal();
      initGallery();
    } catch (error) {
      // Jangan biarkan bagian yang menunggu animasi tetap tersembunyi bila skrip gagal di tengah jalan.
      document.documentElement.classList.remove('js');
      throw error;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
