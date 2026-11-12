/* Maxim Café & Bar · Seite
   Abschnitte: Preloader, Navigation, Hero Video, Laufband, Manifest, Der Tag (gepinnte Uhr 08:00 bis 02:00),
   Frühstück Baukasten, Kaffee Labor, Karte, Galerie, Film, Besuch mit Live Status.
   Produkte und Preise kommen nur aus data/menu.js, Texte über i18n.js (MAXIM_t). */
(function () {
  "use strict";

  var doc = document.documentElement;
  var LANG = window.MAXIM_LANG || doc.lang || "de";
  var t = window.MAXIM_t || function (k) { return k; };
  var MENU = window.MAXIM_MENU;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var small = function () { return window.innerWidth < 861; };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (reduce || !hasGsap) doc.classList.add("no-motion");
  if (hasGsap) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }

  /* ---------- Hilfen: Preise, Namen ---------- */
  var LOCALE = { de: "de-DE", en: "en-GB", tr: "tr-TR", ru: "ru-RU", ar: "ar-u-nu-latn" }[LANG] || "de-DE";
  var money = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR" });
  var plain = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var eur = function (v) { return money.format(v); };
  var ITEMS = {};
  MENU.cats.forEach(function (c) { c.items.forEach(function (i) { i.cat = c.id; ITEMS[i.id] = i; }); });
  var nm = function (o) { return (o.n && (o.n[LANG] || (LANG !== "de" && o.n.en) || o.n.de)) || o.id; };
  var first = function (i) { for (var k = 0; k < i.p.length; k++) if (i.p[k] != null) return i.p[k]; return 0; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- Live Status (Berliner Zeit) ---------- */
  function berlin() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
    return { d: d, h: parseInt(o.hour, 10) % 24, m: parseInt(o.minute, 10) };
  }
  function status() {
    var b = berlin(), open = false, until = "";
    var lateNight = b.d === 6 || b.d === 0; /* Fr und Sa bis 02:00, also Sa und So früh */
    if (b.h < 2 && lateNight) { open = true; until = "02:00"; }
    else if (b.h >= 8) { open = true; until = (b.d === 5 || b.d === 6) ? "02:00" : "00:00"; }
    doc.classList.toggle("is-open", open);
    var txt = open ? t("js.openUntil", { t: until }) : t("js.closed");
    $$("[data-status-text]").forEach(function (el) { el.textContent = txt; });
    var today = (b.h < 2 && lateNight) ? (b.d + 6) % 7 : b.d;
    $$("[data-hours] li").forEach(function (li) { li.classList.toggle("is-today", +li.getAttribute("data-day") === today); });
    return b;
  }
  var NOW = status();
  setInterval(function () { NOW = status(); }, 60000);

  /* ---------- Lenis (nur Maus) ---------- */
  var lenis = null;
  if (!reduce && !touch && window.Lenis && hasGsap) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var el = $(id); if (!el) return;
      e.preventDefault(); closeMenu();
      if (lenis) lenis.scrollTo(el, { offset: id === "#top" ? 0 : -10 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  /* ---------- Navigation ---------- */
  var nav = $("[data-nav]"), lastY = 0;
  function onScroll() {
    var y = window.pageYOffset;
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", y > 500 && y > lastY + 4 && !doc.classList.contains("menu-open"));
    if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $(".burger"), mm = $("#mobile-menu");
  function closeMenu() { if (!mm || mm.hidden) return; mm.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", t("js.menuOpen")); doc.classList.remove("menu-open"); if (lenis) lenis.start(); }
  burger.addEventListener("click", function () {
    var open = mm.hidden; mm.hidden = !open; burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", t(open ? "js.menuClose" : "js.menuOpen")); doc.classList.toggle("menu-open", open);
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    if (open && hasGsap && !reduce) gsap.from($$("#mobile-menu nav a"), { y: 30, opacity: 0, stagger: .05, duration: .6, ease: "power3.out" });
  });
  /* Aktiver Abschnitt in der Navigation */
  if ("IntersectionObserver" in window) {
    var links = $$(".nav-links a");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["tag", "fruehstueck", "labor", "karte", "ort", "besuch"].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Hero Video ---------- */
  var hv = $(".hero-video");
  function heroVideo() {
    if (!hv || reduce || (navigator.connection && navigator.connection.saveData)) return;
    hv.src = hv.getAttribute(small() ? "data-src-sm" : "data-src");
    var p = hv.play(); if (p && p.catch) p.catch(function () {});
  }

  /* ---------- Preloader ---------- */
  var loader = $(".loader");
  function intro() {
    heroVideo();
    if (!hasGsap || reduce) { if (loader) loader.remove(); return; }
    gsap.from(".hero-title .ht-line", { yPercent: 60, opacity: 0, duration: 1.3, stagger: .12, ease: "expo.out" });
    gsap.from([".hero-kicker", ".hero-sub", ".hero-cta", ".hero-badge"], { y: 24, opacity: 0, duration: 1, stagger: .1, delay: .35, ease: "power3.out" });
  }
  if (loader && hasGsap && !reduce) {
    var ring = $(".loader-logo");
    var tl = gsap.timeline();
    var cnt = { v: 0 }, out = $(".loader-count span");
    tl.set(ring, { opacity: 1 })
      .from(ring, { scale: .8, opacity: 0, duration: .8, ease: "power3.out" })
      .to(cnt, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: function () { out.textContent = String(Math.round(cnt.v)).padStart(2, "0"); } }, 0)
      .to(ring, { y: -14, duration: .5, ease: "power2.in" }, 1.1)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: .9, ease: "expo.inOut", onStart: intro }, 1.3)
      .add(function () { loader.remove(); ScrollTrigger.refresh(); });
  } else { if (loader) loader.remove(); intro(); }

  /* ---------- Scroll Animationen ---------- */
  if (hasGsap && !reduce) {
    /* Hero fährt in einen Rahmen zurück */
    gsap.to(".hero-frame", { clipPath: "inset(7% 5% 9% 5% round 28px)", ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-inner", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    /* Laufband: Grundtempo plus Scrolltempo */
    var track = $(".marquee-track");
    if (track) {
      track.innerHTML += track.innerHTML;
      var half = function () { return track.scrollWidth / 2; };
      var x = 0, boost = 0;
      ScrollTrigger.create({ trigger: ".marquee", start: "top bottom", end: "bottom top", onUpdate: function (s) { boost = Math.min(Math.abs(s.getVelocity()) / 140, 14); } });
      gsap.ticker.add(function () { x -= .6 + boost; boost *= .92; if (-x >= half()) x += half(); track.style.transform = "translate3d(" + x + "px,0,0)"; });
    }

    /* Manifest Wort für Wort */
    $$("[data-split]").forEach(function (el) {
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.nodeValue.split(/(\s+)/).forEach(function (w) {
              if (!w) return;
              if (/^\s+$/.test(w)) frag.appendChild(document.createTextNode(w));
              else { var s = document.createElement("span"); s.className = "w"; s.textContent = w; frag.appendChild(s); }
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1 && !n.classList.contains("pill")) walk(n);
        });
      };
      walk(el);
      var parts = $$(".w, .pill", el);
      gsap.fromTo(parts, { opacity: .16 }, { opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } });
      $$(".pill", el).forEach(function (p) { gsap.from(p, { width: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 82%" } }); });
    });

    /* Zähler */
    $$("[data-count]").forEach(function (el) {
      var o = { v: 0 }, to = +el.getAttribute("data-count");
      gsap.to(o, { v: to, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" }, onUpdate: function () { el.textContent = Math.round(o.v); } });
    });

    /* Überschriften und Bilder */
    $$(".sec-title").forEach(function (h) { gsap.from(h, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: h, start: "top 88%" } }); });
    gsap.fromTo(".place-hero img", { yPercent: -9 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".place-hero", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".g-item", { y: 60, opacity: 0, duration: 1, stagger: .06, ease: "power3.out", scrollTrigger: { trigger: ".gallery", start: "top 85%" } });
    gsap.from(".foot-mark img", { yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".foot", start: "top 90%" } });
  } else {
    $$("[data-count]").forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---------- Der Tag im Maxim ---------- */
  (function day() {
    var sec = $("[data-day]"); if (!sec) return;
    var ticks = $(".dc-ticks"), NS = "http://www.w3.org/2000/svg";
    /* Zifferblatt: feine Minutenstriche, Messingpunkte je Stunde, roemische Ziffern auf den Vierteln */
    var ROM = { 0: "XII", 15: "III", 30: "VI", 45: "IX" };
    for (var i = 0; i < 60; i++) {
      var an = i * 6 * Math.PI / 180, sx = Math.sin(an), cy = Math.cos(an), el;
      if (ROM[i]) {
        el = document.createElementNS(NS, "text"); el.textContent = ROM[i];
        el.setAttribute("x", (100 + sx * 74).toFixed(2)); el.setAttribute("y", (100 - cy * 74).toFixed(2));
      } else if (i % 5 === 0) {
        el = document.createElementNS(NS, "circle"); el.setAttribute("r", "1.9");
        el.setAttribute("cx", (100 + sx * 80).toFixed(2)); el.setAttribute("cy", (100 - cy * 80).toFixed(2));
      } else {
        el = document.createElementNS(NS, "line");
        el.setAttribute("x1", (100 + sx * 82.5).toFixed(2)); el.setAttribute("y1", (100 - cy * 82.5).toFixed(2));
        el.setAttribute("x2", (100 + sx * 85.5).toFixed(2)); el.setAttribute("y2", (100 - cy * 85.5).toFixed(2));
      }
      ticks.appendChild(el);
    }
    var scenes = $$(".scene", sec), hourH = $(".dc-hour"), minH = $(".dc-min"), prog = $(".dc-progress"), timeEl = $("[data-day-time]"), nowEl = $("[data-day-now]"), bar = $(".day-bar span"), photos = $$(".day-photo", sec);
    var START = 8, END = 26, active = -1;
    var nowH = NOW.h + NOW.m / 60; if (nowH < 2) nowH += 24;
    function setScene(idx) {
      if (idx === active) return;
      var prev = active; active = idx;
      scenes.forEach(function (s, k) { s.classList.toggle("is-on", k === idx || k === prev); });
      var inS = scenes[idx], outS = prev > -1 ? scenes[prev] : null;
      if (hasGsap && !reduce) {
        if (outS) gsap.to(outS, { opacity: 0, y: -30, duration: .45, ease: "power2.in", onComplete: function () { if (active !== prev) outS.classList.remove("is-on"); } });
        gsap.fromTo(inS, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .7, delay: outS ? .2 : 0, ease: "power3.out" });
        photos.forEach(function (ph, k) { gsap.to(ph, { opacity: k === idx ? 1 : 0, duration: 1.1, ease: "power2.inOut", overwrite: true }); });
      } else {
        scenes.forEach(function (s, k) { s.style.opacity = k === idx ? 1 : 0; });
        photos.forEach(function (ph, k) { ph.style.opacity = k === idx ? 1 : 0; });
      }
      var from = +inS.getAttribute("data-from"), to = +inS.getAttribute("data-to");
      nowEl.hidden = !(nowH >= from && nowH < to);
    }
    function render(p) {
      var h = START + (END - START) * p, hh = Math.floor(h), mm = Math.floor((h - hh) * 60 / 5) * 5;
      hourH.style.transform = "rotate(" + ((hh % 12) * 30 + mm * .5) + "deg)";
      minH.style.transform = "rotate(" + (mm * 6) + "deg)";
      prog.style.strokeDashoffset = 100 - p * 100;
      timeEl.textContent = String(hh % 24).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
      if (bar) bar.style.transform = "scaleX(" + p + ")";
      var idx = 0; scenes.forEach(function (s, k) { if (h >= +s.getAttribute("data-from")) idx = k; });
      /* Bild faehrt ganz langsam heran, solange seine Tageszeit laeuft */
      var sc = scenes[idx], f0 = +sc.getAttribute("data-from"), f1 = Math.min(+sc.getAttribute("data-to"), END), q = Math.min(1, Math.max(0, (h - f0) / (f1 - f0)));
      var im = photos[idx] && photos[idx].firstElementChild; if (im) im.style.transform = "scale(" + (1.04 + q * .08).toFixed(4) + ")";
      setScene(idx);
    }
    if (!hasGsap || reduce) { scenes.forEach(function (s) { s.style.opacity = 1; }); return; }
    render(0);
    ScrollTrigger.create({ trigger: sec, pin: ".day-pin", start: "top top", end: function () { return "+=" + window.innerHeight * 3.2; }, scrub: true, anticipatePin: 1, onUpdate: function (s) { render(s.progress); } });
  })();

  /* ---------- Frühstück Baukasten: die ganze Sektion ist die Marmorplatte ---------- */
  (function breakfast() {
    var root = $("[data-bf]"); if (!root) return;
    var DRINKS = ["cappuccino", "espresso", "matcha", "hotchocolate", "latterocks", "osaft"];
    var FOOD = ["croissant", "oats", "chia", "avocado", "laugenstange", "caesar"];
    /* Tischordnung wie beim echten Eindecken, Blick vom Gast: Getränke oben rechts, Gebäck und Dessert links,
       Hauptgericht in der Mitte (weitere gestaffelt drumherum). Bei Arabisch nicht gespiegelt. [x %, y %] der Platte */
    var GROUP = { croissant: "left" }; DRINKS.forEach(function (id) { GROUP[id] = "drink"; });
    var SLOTS = {
      drink: [[83, 15], [67, 12], [91, 37], [75, 33], [56, 18], [88, 60]],
      left: [[14, 47], [15, 75], [17, 21]],
      main: [[44, 52], [65, 66], [40, 81], [27, 27], [62, 40]]
    };
    /* Breite in % der Platte nach echtem Maß (Platte rund 90 cm breit) */
    var SIZE = { cappuccino: 16, espresso: 12, matcha: 16, hotchocolate: 16, latterocks: 9.5, osaft: 9.5, croissant: 19, oats: 10.5, chia: 10.5, avocado: 28, laugenstange: 27, caesar: 27 };
    var FLAT = window.MAXIM_FLAT || [];
    function src(id) { return FLAT.indexOf(id) > -1 ? "assets/img/flat/" + id + ".webp" : "assets/img/cut/sm/" + ITEMS[id].img + ".webp"; }
    var picked = [], table = $("[data-bf-table]"), box = $("[data-bf-items]"), sumEl = $("[data-bf-sum]"), shown = { v: 0 };
    function group(id) { return GROUP[id] || "main"; }

    function opt(id, g) {
      var i = ITEMS[id], b = document.createElement("button");
      b.type = "button"; b.className = "bf-opt"; b.setAttribute("aria-pressed", "false"); b.dataset.id = id; b.dataset.group = g;
      b.innerHTML = '<img src="' + src(id) + '" alt="" loading="lazy"><span class="bf-opt-n">' + esc(nm(i)) + '</span><span class="bf-opt-p" dir="ltr">' + eur(first(i)) + "</span>";
      b.addEventListener("click", function () { toggle(id); });
      return b;
    }
    DRINKS.forEach(function (id) { $('[data-bf-group="drink"]').appendChild(opt(id, "drink")); });
    FOOD.forEach(function (id) { $('[data-bf-group="food"]').appendChild(opt(id, "food")); });

    function total() { return picked.reduce(function (s, id) { return s + first(ITEMS[id]); }, 0); }
    function updateSum() {
      var to = total();
      if (hasGsap && !reduce) gsap.to(shown, { v: to, duration: .7, ease: "power2.out", onUpdate: function () { sumEl.textContent = eur(shown.v); } });
      else sumEl.textContent = eur(to);
      table.classList.toggle("has-items", picked.length > 0);
      /* Serviette mit Besteck liegt neben dem Hauptgericht, sobald eins auf dem Tisch steht */
      var hasMain = picked.some(function (id) { return group(id) === "main"; });
      if (deco) { deco.classList.toggle("on", hasMain); }
    }
    var deco = null;
    if (FLAT.indexOf("deko_besteck") > -1) {
      deco = document.createElement("img"); deco.className = "bf-deco"; deco.alt = ""; deco.src = "assets/img/flat/deko_besteck.webp";
      box.appendChild(deco);
    }
    function freeSlot(g) {
      var used = $$(".bf-item", box).filter(function (e) { return e.dataset.g === g; }).map(function (e) { return +e.dataset.slot; });
      var list = SLOTS[g];
      for (var k = 0; k < list.length; k++) if (used.indexOf(k) < 0) return k;
      return used.length % list.length;
    }
    function place(id, fromEl) {
      var g = group(id), k = freeSlot(g), slot = SLOTS[g][k];
      var el = document.createElement("div");
      el.className = "bf-item"; el.dataset.id = id; el.dataset.g = g; el.dataset.slot = k;
      el.setAttribute("role", "button"); el.setAttribute("tabindex", "0"); el.setAttribute("aria-label", nm(ITEMS[id]));
      el.style.left = slot[0] + "%"; el.style.top = slot[1] + "%"; el.style.width = SIZE[id] + "%";
      el.style.setProperty("--r", (((id.charCodeAt(0) * 37 + id.length * 11) % 15) - 7) + "deg");
      var img = document.createElement("img"); img.alt = ""; img.src = src(id); el.appendChild(img);
      box.appendChild(el); drag(el);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); toggle(id); } });
      if (!hasGsap || reduce) return;
      /* Flug vom Platz rechts auf den Tisch: groß, leicht im Bogen, setzt mit Schatten auf */
      var srcImg = fromEl && $("img", fromEl);
      if (srcImg) {
        var r0 = srcImg.getBoundingClientRect(), tr = table.getBoundingClientRect();
        var w1 = tr.width * SIZE[id] / 100, cx = tr.left + tr.width * slot[0] / 100, cy = tr.top + tr.height * slot[1] / 100;
        var f = document.createElement("img"); f.className = "bf-fly"; f.src = src(id); f.alt = "";
        f.style.left = r0.left + "px"; f.style.top = r0.top + "px"; f.style.width = r0.width + "px";
        document.body.appendChild(f);
        gsap.set(el, { opacity: 0 });
        var h1 = w1 * (r0.height / r0.width);
        gsap.timeline({ onComplete: function () { f.remove(); } })
          .to(f, { left: cx - w1 / 2, width: w1, duration: .8, ease: "power3.inOut" }, 0)
          .to(f, { top: cy - h1 / 2, duration: .8, ease: "back.in(1.1)" }, 0)
          .to(f, { rotation: 8, duration: .4, ease: "sine.out", yoyo: true, repeat: 1 }, 0)
          .set(f, { opacity: 0 }, .8)
          .set(el, { opacity: 1 }, .8)
          .fromTo(img, { scale: 1.08 }, { scale: 1, duration: .45, ease: "power3.out" }, .8);
      } else {
        gsap.fromTo(img, { y: -30, scale: 1.15, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .7, ease: "power3.out" });
      }
    }
    function remove(id) {
      var el = $('.bf-item[data-id="' + id + '"]', box); if (!el) return;
      if (hasGsap && !reduce) gsap.to(el, { opacity: 0, scale: .8, duration: .35, ease: "power2.in", onComplete: function () { el.remove(); } });
      else el.remove();
    }
    function toggle(id, fromEl) {
      var k = picked.indexOf(id), b = $('.bf-opt[data-id="' + id + '"]', root);
      if (k > -1) { picked.splice(k, 1); remove(id); b.setAttribute("aria-pressed", "false"); }
      else { picked.push(id); place(id, fromEl || b); b.setAttribute("aria-pressed", "true"); }
      updateSum();
    }
    /* Ziehen: Tisch so einrichten, wie man möchte. Kurzes Tippen oder Wegziehen von der Platte nimmt es wieder weg */
    function drag(el) {
      var sx, sy, ox, oy, moved = false, on = false;
      el.addEventListener("pointerdown", function (e) {
        if (e.button > 0) return;
        on = true; moved = false; sx = e.clientX; sy = e.clientY; ox = parseFloat(el.style.left); oy = parseFloat(el.style.top);
        el.setPointerCapture(e.pointerId); e.preventDefault();
      });
      el.addEventListener("pointermove", function (e) {
        if (!on) return;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) < 6) return;
        if (!moved) { moved = true; el.classList.add("is-drag"); box.appendChild(el); }
        var r = table.getBoundingClientRect();
        el.style.left = (ox + dx / r.width * 100) + "%"; el.style.top = (oy + dy / r.height * 100) + "%";
      });
      function end(e) {
        if (!on) return; on = false; el.classList.remove("is-drag");
        var id = el.dataset.id;
        if (!moved) { toggle(id); return; }
        var x = parseFloat(el.style.left), y = parseFloat(el.style.top);
        if (x < -6 || x > 106 || y < -8 || y > 108) toggle(id);
      }
      el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
    }
    function clear() { picked.slice().forEach(function (id) { toggle(id); }); }
    $("[data-bf-clear]").addEventListener("click", clear);
    $("[data-bf-random]").addEventListener("click", function () {
      clear();
      var pick = function (arr, n) { return arr.slice().sort(function () { return Math.random() - .5; }).slice(0, n); };
      var mains = FOOD.filter(function (id) { return group(id) === "main"; });
      var m2 = pick(mains, 2), sel = pick(DRINKS, 2).concat([m2[0]], Math.random() < .7 ? ["croissant"] : [m2[1]]);
      sel.forEach(function (id, k) { setTimeout(function () { if (picked.indexOf(id) < 0) toggle(id); }, 200 + k * 260); });
    });
    sumEl.textContent = eur(0);

    /* Licht: der Glanz auf dem polierten Marmor folgt der Maus, am Handy dem Scrollen */
    var marble = $(".bf-marble", root);
    if (marble && !reduce) {
      root.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = root.getBoundingClientRect();
        marble.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        marble.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
      window.addEventListener("scroll", function () {
        if (!touch) return;
        var r = root.getBoundingClientRect(), q = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
        marble.style.setProperty("--my", (10 + q * 70).toFixed(1) + "%");
      }, { passive: true });
    }
  })();

  /* ---------- Kaffee Labor ---------- */
  (function lab() {
    var root = $("[data-lab]"); if (!root) return;
    var C = { espresso: "#3a1b10", crema: "#b9783f", milk: "#ece0cb", foam: "#fbf6ee", choc: "#4e2414", water: "#5e3219", matcha: "#79a847", matchamilk: "#bcd58d", chai: "#c2915e", cocoa: "#6b3a26", ice: "rgba(220,240,250,.55)" };
    /* Schichten von unten nach oben, Anteile der Füllhöhe */
    var D = [
      { id: "espresso", cup: "small", L: [["espresso", .82], ["crema", .18]] },
      { id: "macchiato", cup: "small", L: [["espresso", .62], ["crema", .1], ["foam", .28]] },
      { id: "cappuccino", L: [["espresso", .3], ["milk", .34], ["foam", .36]] },
      { id: "latte", L: [["espresso", .2], ["milk", .62], ["foam", .18]] },
      { id: "flatwhite", L: [["espresso", .34], ["milk", .58], ["foam", .08]] },
      { id: "mocha", L: [["choc", .18], ["espresso", .22], ["milk", .44], ["foam", .16]] },
      { id: "americano", L: [["water", .78], ["espresso", .1], ["crema", .12]] },
      { id: "latterocks", glass: true, L: [["milk", .58], ["espresso", .42]] },
      { id: "icedmocha", glass: true, L: [["choc", .2], ["milk", .5], ["espresso", .3]] },
      { id: "matcha", L: [["matcha", .3], ["matchamilk", .5], ["foam", .2]] },
      { id: "chai", L: [["chai", .72], ["foam", .28]] },
      { id: "hotchocolate", L: [["cocoa", .8], ["foam", .2]] }
    ];
    var EXTRAS = ["shot", "sirup", "sahne", "hafer", "soja", "mandel"], MILK = ["hafer", "soja", "mandel"];
    var cur = null, size = 0, extras = [];
    var drinksEl = $("[data-lab-drinks]"), layersEl = $("[data-lab-layers]"), iceEl = $("[data-lab-ice]"), NS = "http://www.w3.org/2000/svg";
    var TOP = 46, BOTTOM = 232, H = BOTTOM - TOP, FILL = [.6, .76, .9];
    /* feste Ebenen, damit GSAP weich zwischen den Getränken blenden kann */
    var rects = [];
    for (var r = 0; r < 4; r++) { var rc = document.createElementNS(NS, "rect"); rc.setAttribute("x", 30); rc.setAttribute("width", 180); rc.setAttribute("y", BOTTOM); rc.setAttribute("height", 0); layersEl.appendChild(rc); rects.push(rc); }
    D.forEach(function (d) {
      var i = ITEMS[d.id], b = document.createElement("button");
      b.type = "button"; b.className = "lab-drink"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", "false"); b.dataset.id = d.id;
      if (i.img) b.dataset.img = "assets/img/cut/sm/" + i.img + ".webp";
      b.innerHTML = '<span>' + esc(nm(i)) + '</span><small dir="ltr">' + t("lab.from") + " " + eur(first(i)) + "</small>";
      b.addEventListener("click", function () { select(d.id); });
      drinksEl.appendChild(b);
    });
    var sizesEl = $("[data-lab-sizes]"), sizeBtns = [];
    [0, 1, 2].forEach(function (k) {
      var b = document.createElement("button"); b.type = "button"; b.className = "lab-size"; b.setAttribute("role", "radio");
      b.innerHTML = '<b dir="ltr"></b><small>' + esc(MENU.sizes[LANG] ? MENU.sizes[LANG][k] : MENU.sizes.de[k]) + "</small>";
      b.addEventListener("click", function () { size = k; update(true); });
      sizesEl.appendChild(b); sizeBtns.push(b);
    });
    var exEl = $("[data-lab-extras]");
    EXTRAS.forEach(function (id) {
      var i = ITEMS[id], b = document.createElement("button"); b.type = "button"; b.className = "lab-extra"; b.setAttribute("aria-pressed", "false"); b.dataset.id = id;
      b.innerHTML = esc(nm(i)) + '<small dir="ltr">+' + plain.format(first(i)) + "</small>";
      b.addEventListener("click", function () {
        var k = extras.indexOf(id);
        if (k > -1) extras.splice(k, 1);
        else { if (MILK.indexOf(id) > -1) extras = extras.filter(function (e) { return MILK.indexOf(e) < 0; }); extras.push(id); }
        update(true);
      });
      exEl.appendChild(b);
    });
    function select(id) {
      cur = D.filter(function (d) { return d.id === id; })[0];
      var p = ITEMS[id].p; if (p[size] == null) { size = 0; while (p[size] == null) size++; }
      $$(".lab-drink", drinksEl).forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.id === id)); });
      $("[data-lab-name]").textContent = nm(ITEMS[id]);
      $("[data-lab-desc]").textContent = t("lab.d." + id);
      update(true);
    }
    function update(anim) {
      var item = ITEMS[cur.id], p = item.p;
      sizeBtns.forEach(function (b, k) { b.disabled = p[k] == null; b.setAttribute("aria-checked", String(k === size)); b.firstChild.textContent = p[k] == null ? "–" : plain.format(p[k]); });
      $$(".lab-extra", exEl).forEach(function (b) { b.setAttribute("aria-pressed", String(extras.indexOf(b.dataset.id) > -1)); });
      var price = p[size] + extras.reduce(function (s, e) { return s + first(ITEMS[e]); }, 0);
      $("[data-lab-price]").textContent = eur(price);
      var fill = (cur.cup === "small" ? .34 + size * .08 : FILL[size]) * H, y = BOTTOM;
      var legend = [];
      rects.forEach(function (rc, k) {
        var L = cur.L[k], h = L ? L[1] * fill : 0; y -= h;
        var milkish = L && (L[0] === "milk" || L[0] === "foam") && extras.some(function (e) { return MILK.indexOf(e) > -1; });
        var col = L ? C[L[0]] : C.foam; if (milkish) col = L[0] === "milk" ? "#e6d6b8" : "#f5eddc";
        if (hasGsap && anim && !reduce) gsap.to(rc, { attr: { y: y, height: h }, fill: col, duration: .9, ease: "expo.out", delay: k * .05 });
        else { rc.setAttribute("y", y); rc.setAttribute("height", h); rc.setAttribute("fill", col); }
        if (L) legend.push('<li><i style="background:' + col + '"></i>' + esc(t("lab.l." + L[0])) + "</li>");
      });
      if (extras.indexOf("sahne") > -1) legend.push('<li><i style="background:#fff"></i>' + esc(nm(ITEMS.sahne)) + "</li>");
      if (extras.indexOf("shot") > -1) legend.push('<li><i style="background:' + C.espresso + '"></i>+1 ' + esc(nm(ITEMS.shot)) + "</li>");
      $("[data-lab-legend]").innerHTML = legend.join("");
      /* Eis für die kalten Getränke, Sahnehaube als Extra */
      iceEl.innerHTML = "";
      if (cur.glass) {
        for (var k = 0; k < 5; k++) {
          var cube = document.createElementNS(NS, "rect");
          cube.setAttribute("x", 70 + (k % 3) * 36 + (k > 2 ? 18 : 0)); cube.setAttribute("y", BOTTOM - fill + 8 + Math.floor(k / 3) * 34);
          cube.setAttribute("width", 30); cube.setAttribute("height", 28); cube.setAttribute("rx", 6); cube.setAttribute("fill", C.ice); cube.setAttribute("stroke", "rgba(255,255,255,.6)");
          iceEl.appendChild(cube);
        }
      }
      if (extras.indexOf("sahne") > -1) {
        var top = BOTTOM - fill, cream = document.createElementNS(NS, "path");
        cream.setAttribute("d", "M70 " + top + " Q80 " + (top - 30) + " 100 " + (top - 22) + " Q120 " + (top - 46) + " 140 " + (top - 22) + " Q160 " + (top - 30) + " 170 " + top + " Z");
        cream.setAttribute("fill", "#fffaf2"); iceEl.appendChild(cream);
      }
      $("[data-lab-handle]").style.opacity = cur.glass ? 0 : 1;
    }
    select("cappuccino");
  })();

  /* ---------- Karte ---------- */
  (function menu() {
    var tabs = $("[data-menu-tabs]"), body = $("[data-menu-body]"); if (!tabs) return;
    var sz = MENU.sizes[LANG] || MENU.sizes.de;
    MENU.cats.forEach(function (c, k) {
      var b = document.createElement("button"); b.type = "button"; b.className = "menu-tab"; b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(k === 0)); b.textContent = nm(c); b.dataset.cat = c.id;
      b.addEventListener("click", function () { show(c.id); });
      tabs.appendChild(b);
      var p = document.createElement("div"); p.className = "menu-panel" + (k === 0 ? " is-on" : ""); p.dataset.cat = c.id; p.setAttribute("role", "tabpanel");
      var html = "";
      if (c.sized) html += '<div class="menu-cols" aria-hidden="true"><span></span><span>' + esc(sz[0]) + "</span><span>" + esc(sz[1]) + "</span><span>" + esc(sz[2]) + "</span></div>";
      c.items.forEach(function (i) {
        var img = i.img ? ' data-img="assets/img/cut/sm/' + i.img + '.webp"' : "";
        var thumb = i.img ? '<img class="thumb" src="assets/img/cut/sm/' + i.img + '.webp" alt="" loading="lazy">' : "";
        var vol = i.vol ? " <small dir=\"ltr\">" + esc(i.vol) + "</small>" : "";
        html += '<div class="menu-row' + (c.sized ? "" : " single") + (i.img ? " has-img" : "") + '"' + img + '><span class="menu-row-n">' + thumb + "<span>" + esc(nm(i)) + vol + "</span></span>";
        if (c.sized) i.p.forEach(function (v) { html += '<span class="menu-row-p' + (v == null ? " na" : "") + '" dir="ltr">' + (v == null ? "–" : plain.format(v)) + "</span>"; });
        else html += '<span class="menu-row-p" dir="ltr">' + i.p.map(function (v) { return plain.format(v); }).join(" / ") + " €</span>";
        html += "</div>";
      });
      p.innerHTML = html; body.appendChild(p);
    });
    function show(id) {
      $$(".menu-tab", tabs).forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.cat === id)); });
      $$(".menu-panel", body).forEach(function (p) {
        var on = p.dataset.cat === id; p.classList.toggle("is-on", on);
        if (on && hasGsap && !reduce) gsap.from($$(".menu-row", p), { y: 18, opacity: 0, duration: .5, stagger: .03, ease: "power2.out" });
      });
    }
    /* Bild folgt dem Cursor (nur Maus) */
    var cursor = $("[data-menu-cursor]"), cimg = cursor && cursor.firstChild;
    if (!touch && hasGsap && cursor) {
      /* direkt an body hängen: in einem verschobenen Abschnitt würde position: fixed sonst falsch messen */
      document.body.appendChild(cursor);
      gsap.set(cursor, { xPercent: 0, yPercent: -50, x: -400, y: -400, scale: .6, opacity: 0, transformOrigin: "0% 50%" });
      var xTo = gsap.quickTo(cursor, "x", { duration: .45, ease: "power3" }), yTo = gsap.quickTo(cursor, "y", { duration: .45, ease: "power3" });
      var rTo = gsap.quickTo(cursor, "rotation", { duration: .8, ease: "power3" }), lastX = 0;
      var mx = -1, my = -1, cOn = false;
      function cShow(row) {
        if (row && row.dataset && row.dataset.img) {
          if (cimg.getAttribute("src") !== row.dataset.img) cimg.src = row.dataset.img;
          if (!cOn) { cOn = true; gsap.to(cursor, { opacity: 1, scale: 1, duration: .4, ease: "back.out(1.6)", overwrite: "auto" }); }
        } else if (cOn) { cOn = false; gsap.to(cursor, { opacity: 0, scale: .6, duration: .3, overwrite: "auto" }); }
      }
      /* gilt für die Karte und die Getränke im Kaffee Labor */
      var HOV = ".menu-row, .lab-drink";
      document.addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        /* Bild sitzt direkt am Zeiger, leicht rechts daneben, und neigt sich mit der Bewegung */
        xTo(mx + 28); yTo(my);
        rTo(gsap.utils.clamp(-14, 14, (mx - lastX) * .7)); lastX = mx;
      }, { passive: true });
      document.addEventListener("mouseover", function (e) { cShow(e.target.closest ? e.target.closest(HOV) : null); });
      document.addEventListener("mouseleave", function () { cShow(null); });
      /* Beim Scrollen ohne Mausbewegung feuert kein mouseleave: prüfen, was jetzt unter dem Zeiger liegt */
      window.addEventListener("scroll", function () {
        if (!cOn) return;
        var el = mx < 0 ? null : document.elementFromPoint(mx, my);
        cShow(el ? el.closest(HOV) : null);
      }, { passive: true });
    }
  })();

  /* ---------- Galerie Lightbox ---------- */
  (function gallery() {
    var items = $$("[data-gallery] .g-item"), lb = $("[data-lightbox]"); if (!lb || !lb.showModal) return;
    var img = $("img", lb), cur = 0;
    function open(k) { cur = (k + items.length) % items.length; var s = $("img", items[cur]); img.src = s.dataset.full || s.currentSrc || s.src; img.alt = s.alt; if (!lb.open) { lb.showModal(); if (lenis) lenis.stop(); } }
    items.forEach(function (b, k) { b.addEventListener("click", function () { open(k); }); });
    $(".lb-close", lb).addEventListener("click", function () { lb.close(); });
    $(".lb-prev", lb).addEventListener("click", function () { open(cur - 1); });
    $(".lb-next", lb).addEventListener("click", function () { open(cur + 1); });
    lb.addEventListener("close", function () { if (lenis) lenis.start(); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === img) lb.close(); });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") open(cur + (doc.dir === "rtl" ? -1 : 1)); if (e.key === "ArrowLeft") open(cur + (doc.dir === "rtl" ? 1 : -1)); });
    var sx = 0; lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) open(cur + (dx < 0 ? 1 : -1)); });
  })();

  /* ---------- Imagefilm ---------- */
  (function film() {
    var secs = $$("[data-film]"); if (!secs.length) return;
    /* Imagefilm: Deutsch mit Naders Stimme, alle anderen Sprachen englisch. Ambiente Film gibt es auf Deutsch. */
    var de = LANG === "de", F = "assets/video/film/";
    var SRC = {
      image: { poster: de ? ["poster-de.jpg", "poster-de-9x16.jpg"] : ["poster.jpg", "poster-9x16.jpg"], video: de ? ["maxim-de-16x9.mp4", "maxim-de-9x16.mp4"] : ["maxim-16x9.mp4", "maxim-9x16.mp4"] },
      amb: { poster: ["poster-ambiente.jpg", "poster-ambiente-9x16.jpg"], video: ["maxim-ambiente-16x9.mp4", "maxim-ambiente-9x16.mp4"] }
    };
    $$("[data-film-player]").forEach(function (player) {
      /* Imagefilm immer im breiten 16:9 Format über die ganze Breite, nie als Handy Hochformat */
      var s = SRC[player.dataset.kind] || SRC.image, k = (small() && player.dataset.kind !== "image") ? 1 : 0, poster = $(".film-poster", player);
      poster.addEventListener("error", function () { var f = player.closest(".film-item"); if (f) f.hidden = true; });
      poster.src = F + s.poster[k];
      $(".film-play", player).addEventListener("click", function () {
        var v = document.createElement("video");
        v.src = F + s.video[k]; v.controls = true; v.playsInline = true; v.autoplay = true; v.poster = poster.src;
        player.innerHTML = ""; player.appendChild(v); v.play().catch(function () {});
      });
    });
  })();

  /* ---------- PDF Karte: Hauptknopf und Titelbild folgen der Sprache ---------- */
  (function pdf() {
    var L = LANG.toUpperCase(), main = $("[data-dl-main]"), cov = $("[data-dl-cover]"); if (!main) return;
    main.href = "assets/menu/Maxim-Karte-" + L + ".pdf"; cov.src = "assets/menu/cover-" + LANG + ".webp";
    $$(".menu-dl-langs a").forEach(function (a) { if (a.textContent === L) a.setAttribute("aria-current", "true"); });
  })();

  /* ---------- Karte erst nach Klick (DSGVO) ---------- */
  var mapBtn = $("[data-map-load]");
  if (mapBtn) mapBtn.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "https://www.openstreetmap.org/export/embed.html?bbox=13.3700%2C52.5065%2C13.3830%2C52.5125&layer=mapnik&marker=52.50945%2C13.37625";
    f.title = "Karte Potsdamer Platz 11"; f.loading = "lazy";
    $("[data-map]").innerHTML = ""; $("[data-map]").appendChild(f);
  });

  /* Position nach Sprachwechsel halten */
  try { var y = sessionStorage.getItem("maxim-scroll"); if (y) { sessionStorage.removeItem("maxim-scroll"); window.addEventListener("load", function () { window.scrollTo(0, +y); }); } } catch (e) { /* privat */ }
  window.addEventListener("load", function () { if (hasGsap) ScrollTrigger.refresh(); });
})();
