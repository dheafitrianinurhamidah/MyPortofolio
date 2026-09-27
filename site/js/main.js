/* Portofolio Dhea — perilaku halaman: menu HP, dua bahasa, dan animasi muncul.
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
      setOpen(!isOpen());
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
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  function init() {
    initMenu(); // sebelum initLanguage: menu mendengarkan "langchange" untuk labelnya
    initLanguage();
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
