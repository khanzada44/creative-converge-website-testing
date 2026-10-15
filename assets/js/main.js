/* =========================================================
   Creative Converge — interactions
   No dependencies. Safe to drop into any static site.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Preloader ---------- */
  var preloader = $('#preloader');
  var started = false;
  function startPage() {
    if (started) return;
    started = true;
    if (preloader) preloader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    observeReveals();
  }
  // Let the logo intro play (~2.6s), but never block longer than 4s.
  var minTime = reduceMotion ? 0 : 2600;
  var t0 = Date.now();
  window.addEventListener('load', function () {
    setTimeout(startPage, Math.max(0, minTime - (Date.now() - t0)));
  });
  setTimeout(startPage, 4000);

  /* ---------- Year ---------- */
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state, hide on scroll down ---------- */
  var header = $('#header');
  var progress = $('#scrollProgress');
  var toTop = $('#toTop');
  var toTopRing = $('#toTopProgress');
  var lastY = 0;
  var ticking = false;
  function onScroll() {
    var sy = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? sy / max : 0;
    header.classList.toggle('is-scrolled', sy > 20);
    if (!document.body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', sy > lastY && sy > 400);
    }
    lastY = sy;
    if (progress) progress.style.transform = 'scaleX(' + p + ')';
    if (toTop) {
      toTop.classList.toggle('is-visible', sy > 600);
      if (toTopRing) toTopRing.style.strokeDashoffset = (138.2 * (1 - p)).toFixed(1);
    }
    updateStepsLine();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- Mobile menu ---------- */
  var burger = $('#burger');
  var nav = $('#nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
    });
    $$('.nav__link').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(); });
  }

  /* ---------- Active nav link ---------- */
  var links = $$('.nav__link');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ---------- Reveal on scroll + counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var k = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function observeReveals() {
    var items = $$('.reveal, .stats, .step');
    var counters = $$('[data-count]');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      counters.forEach(animateCount);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { obs.observe(el); });
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cObs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------- White-label steps progress line ---------- */
  var steps = $('.wl__steps');
  var stepsBar = $('#wlProgress');
  function updateStepsLine() {
    if (!steps || !stepsBar) return;
    var r = steps.getBoundingClientRect();
    var vh = window.innerHeight;
    var k = (vh * 0.6 - r.top) / r.height;
    stepsBar.style.height = (Math.max(0, Math.min(1, k)) * 100).toFixed(1) + '%';
  }

  /* ---------- Rotating hero word ---------- */
  var rotWord = $('#rotWord');
  var words = ['credit.', 'applause.', 'spotlight.', 'credit.'];
  var wi = 0;
  if (rotWord && !reduceMotion) {
    setInterval(function () {
      rotWord.classList.add('is-swapping');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        rotWord.textContent = words[wi];
        rotWord.classList.remove('is-swapping');
      }, 380);
    }, 3200);
  }

  /* ---------- Custom cursor ---------- */
  var cursor = $('#cursor');
  if (cursor && finePointer && !reduceMotion) {
    var dot = $('.cursor__dot', cursor), ring = $('.cursor__ring', cursor);
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, input, textarea, label, .work'));
    });
  } else if (cursor) {
    cursor.remove();
  }

  /* ---------- Hero: spotlight + 3D parallax ---------- */
  var hero = $('#hero');
  var spot = $('#heroSpot');
  var visual = $('#heroVisual');
  if (hero && finePointer && !reduceMotion) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (spot) { spot.style.left = x + 'px'; spot.style.top = y + 'px'; }
      if (visual) {
        var px = x / r.width - 0.5, py = y / r.height - 0.5;
        visual.style.transform = 'perspective(1000px) rotateY(' + (px * 12).toFixed(2) + 'deg) rotateX(' + (-py * 10).toFixed(2) + 'deg) translate3d(' + (px * -18).toFixed(1) + 'px,' + (py * -18).toFixed(1) + 'px,0)';
      }
    });
    hero.addEventListener('mouseleave', function () {
      if (visual) visual.style.transform = '';
    });
    if (visual) visual.style.transition = 'transform .6s cubic-bezier(.2,.9,.2,1)';
  }

  /* ---------- Spotlight cards ---------- */
  $$('.spot-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.18).toFixed(1) + 'px,' + (y * 0.28).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Portfolio filter ---------- */
  var filters = $$('.filter');
  var works = $$('.work');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var cat = f.getAttribute('data-filter');
      filters.forEach(function (x) { x.classList.toggle('is-active', x === f); x.setAttribute('aria-pressed', String(x === f)); });
      works.forEach(function (w, i) {
        var show = cat === 'all' || w.getAttribute('data-cat') === cat;
        if (show) {
          w.classList.remove('is-hidden');
          w.classList.remove('is-in');
          w.style.setProperty('--d', (i % 3) * 0.06 + 's');
          requestAnimationFrame(function () { requestAnimationFrame(function () { w.classList.add('is-in'); }); });
        } else {
          w.classList.add('is-hidden');
        }
      });
    });
  });

  /* ---------- Accordions (one open at a time per list) ---------- */
  $$('.accordion').forEach(function (list) {
    $$('.acc__head', list).forEach(function (head) {
      head.addEventListener('click', function () {
        var item = head.parentElement;
        var willOpen = !item.classList.contains('is-open');
        $$('.acc', list).forEach(function (a) {
          a.classList.remove('is-open');
          $('.acc__head', a).setAttribute('aria-expanded', 'false');
        });
        if (willOpen) { item.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
      });
    });
  });

  /* ---------- Contact form validation ----------
     Hook up your form handler (Formspree, Netlify Forms, PHP mailer...)
     inside the "valid" branch below. */
  var form = $('#contactForm');
  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function check(field) {
      var input = $('input, textarea', field);
      if (!input || !input.required) return true;
      var ok = input.value.trim() !== '' && (input.type !== 'email' || emailRe.test(input.value.trim()));
      field.classList.toggle('has-error', !ok);
      return ok;
    }
    $$('.field', form).forEach(function (field) {
      var input = $('input, textarea', field);
      if (input) input.addEventListener('input', function () { if (field.classList.contains('has-error')) check(field); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = $$('.field', form).map(check).every(Boolean);
      if (!ok) { var first = $('.has-error input, .has-error textarea', form); if (first) first.focus(); return; }
      // TODO: send the data, e.g. fetch('https://formspree.io/f/XXXX', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      form.reset();
      var s = $('#formSuccess');
      if (s) { s.hidden = false; setTimeout(function () { s.hidden = true; }, 6000); }
    });
  }

  var nl = $('#newsletter');
  if (nl) {
    nl.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = $('input', nl);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) { inp.focus(); inp.placeholder = 'Enter a valid email'; inp.value = ''; return; }
      inp.value = ''; inp.placeholder = 'Subscribed. Thank you!';
    });
  }

  onScroll();
})();
