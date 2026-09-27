/* Portofolio Dhea — perilaku halaman: menu HP dan animasi muncul.
   Script biasa (bukan ES module) agar tetap jalan saat index.html dibuka langsung dari folder. */
(function () {
  'use strict';

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
    initMenu();
    initReveal();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
