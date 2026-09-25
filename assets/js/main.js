/* Zach Perkins — portfolio behavior.
   Everything here is progressive enhancement: the page reads fine without it.
   Anything animated checks prefers-reduced-motion first. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- theme ---------- */
  // The pre-paint bootstrap in <head> already set data-theme; this handles the
  // toggle and persistence. Storage throws in private windows, so it is guarded.
  var toggle = document.getElementById('themeToggle');

  function syncToggleLabel() {
    if (!toggle) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* no-op */ }
      syncToggleLabel();
    });
    syncToggleLabel();
  }

  /* ---------- nav: masthead handoff, scroll progress, active section ---------- */
  var nav = document.getElementById('nav');
  var masthead = document.getElementById('top');
  var progress = document.getElementById('navProgress');

  function onScroll() {
    // Once the nameplate scrolls away, the sticky nav carries the name.
    if (nav && masthead) nav.classList.toggle('is-stuck', masthead.getBoundingClientRect().bottom <= 0);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {}, sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = link;
      sections.push(section);
    });

    // Bias toward the upper third of the viewport so a section reads as
    // "current" while you are in it, not only once it hits the very top.
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = byId[entry.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-56px 0px -62% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- scroll reveal ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  function revealAll() {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (!revealables.length) {
    /* nothing to do */
  } else if (reduced.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target); // reveal once, then stop watching
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      // Stagger siblings slightly so a grid arrives as a wave, not a slab.
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      revealer.observe(el);
    });
  }

  /* ---------- dateline ---------- */
  var today = document.getElementById('today');
  if (today) {
    today.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ---------- "Latest" ticker ---------- */
  var ticker = document.getElementById('ticker');
  if (ticker) {
    var items = Array.prototype.slice.call(ticker.querySelectorAll('.ticker__item'));
    if (items.length > 1 && !reduced.matches) {
      var at = 0;
      setInterval(function () {
        items[at].classList.remove('is-in');
        at = (at + 1) % items.length;
        items[at].classList.add('is-in');
      }, 4200);
    }
  }

  /* ---------- stat counters ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('.counter'));

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduced.matches) { el.textContent = String(target); return; }
    var start = null, duration = 1100, done = false;
    function settle() {
      if (done) return;
      done = true;
      el.textContent = String(target);
    }
    function step(now) {
      if (done) return;
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step); else settle();
    }
    requestAnimationFrame(step);
    // rAF does not tick in a background tab, and a throttled or interrupted
    // run would otherwise leave a half-counted number on screen forever.
    // This guarantees the real value lands regardless.
    setTimeout(settle, duration + 400);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
    } else {
      var countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countUp(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { countObs.observe(c); });
    }
  }

  /* ---------- secondary projects ---------- */
  var moreToggle = document.getElementById('moreToggle');
  var more = document.getElementById('moreProjects');
  if (moreToggle && more) {
    var label = moreToggle.querySelector('.more-toggle__label');
    moreToggle.addEventListener('click', function () {
      var open = moreToggle.getAttribute('aria-expanded') === 'true';
      moreToggle.setAttribute('aria-expanded', String(!open));
      more.hidden = open;
      if (label) label.textContent = open ? 'More projects' : 'Show fewer';
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
