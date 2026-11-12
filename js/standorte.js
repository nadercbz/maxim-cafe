/* Maxim · Seite Standorte
   Daten nur aus data/standorte.js, Karte aus data/berlin-karte.js (tools/karte_bauen.py).
   Ablauf: Karte zeichnet sich (Bezirke, Spree, Ring), Pins fallen nacheinander, Linien ziehen sich vom Potsdamer Platz zu den anderen Häusern.
   Desktop: beim Scrollen fliegt die Kamera von Haus zu Haus (gepinnt). Handy: Karte oben, Häuser als wischbare Karten darunter.
   Klick auf Pin oder Karte fliegt hin. Die Karte wird bei Arabisch nicht gespiegelt. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var LANG = window.MAXIM_LANG || doc.lang || "de";
  var t = window.MAXIM_t || function (k) { return k; };
  var D = window.MAXIM_STANDORTE, K = window.MAXIM_KARTE;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var small = function () { return window.innerWidth < 861; };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (reduce || !hasGsap) doc.classList.add("no-motion");
  var L = function (o) { return o ? (o[LANG] || o.en || o.de) : ""; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Navigation (wie Startseite) ---------- */
  var burger = $(".burger"), mm = $("#mobile-menu");
  if (burger && mm) burger.addEventListener("click", function () {
    var open = mm.hidden; mm.hidden = !open; burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", t(open ? "js.menuClose" : "js.menuOpen")); doc.classList.toggle("menu-open", open);
  });
  var lenis = null;
  if (!reduce && !touch && window.Lenis && hasGsap) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Zeit in Berlin, Live Status nur bei belegten Zeiten ---------- */
  function berlin() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    return { d: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday), min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  var hhmm = function (m) { m = m % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  function state(o) {
    if (!o.belegt || !o.zeiten) return null;
    var b = berlin(), z = o.zeiten[b.d], y = o.zeiten[(b.d + 6) % 7];
    if (y && y[1] > 1440 && b.min < y[1] - 1440) return { open: true, until: hhmm(y[1]) };
    if (z && b.min >= z[0] && b.min < z[1]) return { open: true, until: hhmm(z[1]) };
    return { open: false, opens: z ? hhmm(z[0]) : "" };
  }
  function hoursHtml(o) {
    if (o.belegt && o.zeiten) {
      /* gleiche Zeiten zusammenfassen: Mo bis Do, So / Fr und Sa */
      var order = [1, 2, 3, 4, 5, 6, 0], rows = [], cur = null;
      order.forEach(function (d) {
        var z = o.zeiten[d], key = z ? z.join("-") : "x";
        if (cur && cur.key === key) cur.days.push(d); else { cur = { key: key, z: z, days: [d] }; rows.push(cur); }
      });
      return '<ul class="loc-hours">' + rows.map(function (r) {
        var a = t("d." + r.days[0]).slice(0, 2), e = t("d." + r.days[r.days.length - 1]).slice(0, 2);
        var to = " " + t("loc.to") + " ", dd = r.days.length > 1 ? a + to + e : a;
        return "<li><span>" + esc(dd) + "</span><b>" + (r.z ? '<bdi dir="ltr">' + hhmm(r.z[0]) + "</bdi>" + esc(to) + '<bdi dir="ltr">' + hhmm(r.z[1]) + "</bdi>" : "×") + "</b></li>";
      }).join("") + "</ul>";
    }
    if (o.text_zeiten) return '<p class="loc-hours-txt">' + esc(L(o.text_zeiten)) + "</p>";
    return '<p class="loc-hours-txt is-pending">' + esc(t("loc.pending")) + "</p>";
  }
  function badge(o) {
    var s = state(o);
    if (!s) return "";
    return '<span class="loc-live' + (s.open ? " is-open" : "") + '"><i></i>' + esc(s.open ? t("js.openUntil", { t: s.until }) : t("js.closed")) + "</span>";
  }
  function routeLinks(o) {
    var q = encodeURIComponent("Maxim Café " + o.adresse + ", " + o.ort);
    return '<div class="loc-route"><span>' + esc(t("loc.route")) + '</span><a href="https://www.google.com/maps/dir/?api=1&destination=' + q + '" target="_blank" rel="noopener">Google Maps</a><a href="https://maps.apple.com/?daddr=' + q + '" target="_blank" rel="noopener">Apple Karten</a></div>';
  }
  function since(o) {
    if (!o.seit) return "";
    var d = new Date(o.seit + "T12:00:00");
    var txt = new Intl.DateTimeFormat({ de: "de-DE", en: "en-GB", tr: "tr-TR", ru: "ru-RU", ar: "ar-u-nu-latn" }[LANG] || "de-DE", { month: "long", year: "numeric" }).format(d);
    return '<span class="loc-since">' + esc(t("loc.since", { d: txt })) + "</span>";
  }
  function card(o, k, isOut) {
    return '<li class="loc-card' + (o.zentrale ? " is-main" : "") + '" data-k="' + k + '"' + (isOut ? "" : ' tabindex="0" role="button" aria-label="' + esc(o.name) + '"') + ">" +
      '<figure class="loc-photo"><img src="' + o.foto + '" alt="" loading="lazy">' + (o.eigenes_foto ? "" : '<figcaption>' + esc(t("loc.photo")) + "</figcaption>") + "</figure>" +
      '<div class="loc-body">' +
        '<p class="loc-num" dir="ltr">' + (isOut ? "" : String(k + 1).padStart(2, "0")) + (o.zentrale ? ' <em>' + esc(t("loc.main")) + "</em>" : "") + since(o) + "</p>" +
        "<h3>" + esc(o.name) + "</h3>" +
        '<p class="loc-lage">' + esc(L(o.lage)) + "</p>" +
        '<address dir="ltr">' + esc(o.adresse) + "<br>" + esc(o.ort) + "</address>" +
        badge(o) + hoursHtml(o) + routeLinks(o) +
      "</div></li>";
  }

  /* ---------- Karte zeichnen ---------- */
  var svg = $("[data-loc-svg]"), cam = $("[data-loc-cam]"), list = $("[data-loc-list]");
  if (!svg || !D || !K) return;
  svg.setAttribute("viewBox", "0 0 " + K.w + " " + K.h);
  var P = function (lat, lng) { return [(lng * K.proj.k - K.proj.minx) * K.proj.s, (K.proj.maxy - lat) * K.proj.s]; };
  var bez = $("[data-loc-bezirke]");
  K.bezirke.forEach(function (b) { var p = document.createElementNS(NS, "path"); p.setAttribute("d", b.d); p.setAttribute("data-name", b.name); bez.appendChild(p); });
  $("[data-loc-fluss]").setAttribute("d", K.fluesse);
  $("[data-loc-ring]").setAttribute("d", K.ring);
  var orte = D.orte, pts = orte.map(function (o) { return P(o.lat, o.lng); });
  $("[data-loc-count]").textContent = orte.length;

  /* Linien vom Potsdamer Platz (Zentrale) zu den anderen Häusern, leicht gebogen */
  var hq = orte.findIndex(function (o) { return o.zentrale; }); if (hq < 0) hq = 0;
  var lines = $("[data-loc-lines]");
  pts.forEach(function (p, k) {
    if (k === hq) return;
    var a = pts[hq], mx = (a[0] + p[0]) / 2, my = (a[1] + p[1]) / 2, dx = p[0] - a[0], dy = p[1] - a[1];
    var c = [mx - dy * .22, my + dx * .22];
    var l = document.createElementNS(NS, "path");
    l.setAttribute("d", "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " Q" + c[0].toFixed(1) + " " + c[1].toFixed(1) + " " + p[0].toFixed(1) + " " + p[1].toFixed(1));
    l.setAttribute("pathLength", "100"); l.setAttribute("data-k", k);
    lines.appendChild(l);
  });
  /* Pins: Glühen, Ring, Kopf mit Nummer, Name */
  var pinsG = $("[data-loc-pins]");
  pts.forEach(function (p, k) {
    var o = orte[k], g = document.createElementNS(NS, "g");
    g.setAttribute("class", "loc-pinmark" + (o.zentrale ? " is-main" : ""));
    g.setAttribute("data-k", k); g.setAttribute("transform", "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ")");
    g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", o.name);
    g.innerHTML = '<circle class="pm-glow" r="46" fill="url(#locGlow)"/><circle class="pm-pulse" r="10"/>' +
      '<g class="pm-drop"><path class="pm-body" d="M0 0 C-4 -9 -13 -15 -13 -26 A13 13 0 1 1 13 -26 C13 -15 4 -9 0 0Z"/>' +
      '<text class="pm-num" y="-22" text-anchor="middle">' + (k + 1) + "</text></g>" +
      /* Namen westlich der Zentrale stehen links vom Pin, damit sich nichts überlappt */
      (p[0] < pts[hq][0] - 2 ? '<text class="pm-name" x="-18" y="-30" text-anchor="end">' : '<text class="pm-name" x="18" y="-30">') + esc(o.name) + "</text>";
    pinsG.appendChild(g);
  });

  /* Liste und Karten außerhalb */
  list.innerHTML = orte.map(function (o, k) { return card(o, k, false); }).join("");
  var out = $("[data-loc-out]");
  if (out) out.innerHTML = '<ul class="loc-out-list">' + (D.ausserhalb || []).map(function (o, k) { return card(o, k, true); }).join("") + "</ul>";

  /* ---------- Kamera ---------- */
  var camState = { x: 0, y: 0, s: 1 }, active = -1;
  var pinEls = null;
  function applyCam() {
    cam.setAttribute("transform", "translate(" + camState.x.toFixed(2) + " " + camState.y.toFixed(2) + ") scale(" + camState.s.toFixed(4) + ")");
    /* Pins und Namen bleiben beim Heranfliegen gleich groß */
    pinEls = pinEls || $$(".loc-pinmark", pinsG);
    var inv = (1 / camState.s).toFixed(4);
    pinEls.forEach(function (g, k) { g.setAttribute("transform", "translate(" + pts[k][0].toFixed(1) + " " + pts[k][1].toFixed(1) + ") scale(" + inv + ")"); });
  }
  /* Übersicht: alle Häuser mit Luft drumherum im Bild */
  var bx = pts.map(function (p) { return p[0]; }), by = pts.map(function (p) { return p[1]; });
  var ov = (function () {
    var x0 = Math.min.apply(0, bx), x1 = Math.max.apply(0, bx), y0 = Math.min.apply(0, by), y1 = Math.max.apply(0, by);
    var padX = 170, padY = 150, s = Math.min(K.w / (x1 - x0 + padX * 2), K.h / (y1 - y0 + padY * 2), 2.2);
    return { x: K.w / 2 - (x0 + x1) / 2 * s, y: K.h / 2 - (y0 + y1) / 2 * s, s: s };
  })();
  function target(k) {
    if (k === -2) return { x: 0, y: 0, s: 1 };
    if (k < 0) return ov;
    var s = small() ? 2.3 : 2.6, p = pts[k];
    /* Punkt in die Mitte, auf Desktop etwas nach links, damit die Info Karte daneben Platz hat */
    return { x: K.w * .5 - p[0] * s, y: K.h * .52 - p[1] * s, s: s };
  }
  function fly(k, instant) {
    var tg = target(k);
    if (!hasGsap || reduce || instant) { camState.x = tg.x; camState.y = tg.y; camState.s = tg.s; applyCam(); return; }
    gsap.to(camState, { x: tg.x, y: tg.y, s: tg.s, duration: 1.3, ease: "power3.inOut", overwrite: true, onUpdate: applyCam });
  }
  function setActive(k, from) {
    if (k === active) return;
    active = k;
    $$(".loc-pinmark", pinsG).forEach(function (g) { g.classList.toggle("is-active", +g.getAttribute("data-k") === k); });
    $$(".loc-lines path").forEach(function (l) { l.classList.toggle("is-active", +l.getAttribute("data-k") === k); });
    $$(".loc-card", list).forEach(function (c) { c.classList.toggle("is-active", +c.getAttribute("data-k") === k); });
    fly(k);
    if (from !== "scroll" && small()) {
      var c = $('.loc-card[data-k="' + k + '"]', list);
      if (c && from !== "swipe") list.scrollTo({ left: c.offsetLeft - list.offsetLeft - 16, behavior: reduce ? "auto" : "smooth" });
    }
  }
  /* Start: ganz Berlin, nach dem Einstieg Flug auf die Übersicht der Häuser */
  var t0 = (hasGsap && !reduce) ? target(-2) : ov;
  camState.x = t0.x; camState.y = t0.y; camState.s = t0.s;
  applyCam();

  /* Klick auf Pin oder Karte */
  function go(k) {
    if (!small() && st) {
      /* auf Desktop zur passenden Scroll Stelle springen, die Kamera folgt */
      var y = st.start + (st.end - st.start) * ((k + 1) / (orte.length + 1)) + 2;
      if (lenis) lenis.scrollTo(y, { duration: 1.2 }); else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    }
    setActive(k, "click");
  }
  $$(".loc-pinmark", pinsG).forEach(function (g) {
    var k = +g.getAttribute("data-k");
    g.addEventListener("click", function () { go(k); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(k); } });
  });
  $$(".loc-card", list).forEach(function (c) {
    var k = +c.getAttribute("data-k");
    c.addEventListener("click", function (e) { if (e.target.closest("a")) return; go(k); });
    c.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && !e.target.closest("a")) { e.preventDefault(); go(k); } });
  });

  /* ---------- Einstieg: Karte zeichnet sich, Pins fallen, Linien ziehen sich ---------- */
  function intro() {
    if (!hasGsap || reduce) return;
    var tl = gsap.timeline({ scrollTrigger: { trigger: "[data-loc]", start: "top 75%", once: true } });
    var bz = $$("[data-loc-bezirke] path");
    bz.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    tl.to(bz, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: .06 })
      .fromTo(bz, { fillOpacity: 0 }, { fillOpacity: 1, duration: .8, stagger: .04 }, "-=.8");
    ["[data-loc-fluss]", "[data-loc-ring]"].forEach(function (s, i) {
      var p = $(s), l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l;
      tl.to(p, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, i ? "-=1.1" : "-=1.0");
    });
    $$(".loc-pinmark", pinsG).forEach(function (g, i) {
      var d = $(".pm-drop", g), n = $(".pm-name", g), gl = $(".pm-glow", g);
      tl.fromTo(d, { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: "bounce.out" }, i ? "-=.45" : "-=.3")
        .fromTo(gl, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: .6, ease: "power2.out" }, "<.2")
        .fromTo(n, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: .4 }, "<.1");
    });
    var ls = $$("[data-loc-lines] path");
    ls.forEach(function (l) { l.style.strokeDasharray = 100; l.style.strokeDashoffset = 100; });
    tl.to(ls, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: .18 }, "-=.3");
    tl.fromTo($$(".loc-card", list), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: "power3.out" }, .4);
    /* danach von ganz Berlin auf die Häuser heranfliegen */
    tl.add(function () { if (active < 0) fly(-1); }, "-=.2");
  }
  intro();
  if (hasGsap && !reduce) {
    gsap.from(".loc-head > *", { opacity: 0, y: 30, duration: 1, stagger: .12, ease: "expo.out", delay: .15 });
  }

  /* ---------- Desktop: Kamerafahrt beim Scrollen ---------- */
  var st = null;
  function desktopTour() {
    if (!hasGsap || reduce || small()) return;
    st = ScrollTrigger.create({
      trigger: "[data-loc]", pin: ".loc-pin", start: "top top", end: function () { return "+=" + window.innerHeight * (orte.length + .6); },
      onUpdate: function (s) {
        var k = Math.floor(s.progress * (orte.length + 1)) - 1;
        setActive(Math.min(orte.length - 1, k), "scroll");
      }
    });
  }
  /* ---------- Handy: Karten wischen, Karte folgt ---------- */
  function mobileSwipe() {
    if (!small() || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > .6) setActive(+e.target.getAttribute("data-k"), "swipe"); });
    }, { root: list, threshold: [.6] });
    $$(".loc-card", list).forEach(function (c) { io.observe(c); });
    setTimeout(function () { setActive(hq, "swipe"); }, reduce ? 0 : 2600);
  }
  desktopTour(); mobileSwipe();
  if (reduce || !hasGsap) setActive(hq, "init");

  /* Live Status jede Minute neu */
  setInterval(function () {
    $$(".loc-card").forEach(function (c) {
      var isOut = !!c.closest("[data-loc-out]"), k = +c.getAttribute("data-k"), o = isOut ? D.ausserhalb[k] : orte[k];
      var old = $(".loc-live", c); if (!old) return;
      var tmp = document.createElement("div"); tmp.innerHTML = badge(o); old.replaceWith(tmp.firstChild);
    });
  }, 60000);
})();
