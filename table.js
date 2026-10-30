/* ==========================================================================
   Kitchen case study: marble-table mode (desktop, GluSight only)
   - The top-down kitchen table (Media/KitchenScene_clear.avif) fills the screen.
   - The case-study text scrolls inside the middle of the marble, with no panel behind it.
   - Ordinary visuals are lifted out of the text and shown as cards beside the
     cups (left) and the jars (right), with a line drawn from the object.
   - "Centre" visuals (the three interview groups) bring the three jars into the
     middle of the text area in a stop-motion step, with the data shown above them.

   STOP-MOTION FRAMES (to drop in later)
   The jar move is a placeholder that steps cut-out jars across the table.
   When the rendered frames are ready, set before this file loads:
     window.KB_JAR_FRAMES = {
       out:  ['Media/KitchenJars/out_01.webp', ...],   // jars leaving their spot -> centre
       back: ['Media/KitchenJars/back_01.webp', ...],  // centre -> back home
       fps: 10,
       // where each jar ends up, in % of the 1920x1920 scene (centre of the jar)
       targets: [[x1, y1], [x2, y2], [x3, y3]]
     };
   Each frame is a full 1920x1920 image with transparency (the table is drawn
   underneath). When frames are present the cut-out jars are hidden while they play.
   ========================================================================== */
(function () {
  'use strict';

  var stage = document.getElementById('kitchen-blog-stage');
  var win = document.getElementById('floating-project-window');
  var body = document.getElementById('kb-window-body');
  var main = document.getElementById('content-body-scrollable');
  var article = document.getElementById('kitchen-article-canvas');
  if (!stage || !win || !body || !main || !article) return;

  var mq = window.matchMedia ? window.matchMedia('(min-width: 901px)') : { matches: true, addListener: function () {} };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene geometry, in % of the square 1920x1920 render
  var MARBLE = { l: 0, t: 22.9, r: 89.9, b: 77.0 };
  var COL = { l: 22.0, r: 63.4 };                    // text column (inside the marble)
  var CUPS = { x: 13.0, y: 48.5 };                   // line origin for the left cards
  var JARS_ORIGIN = { x: 79.0, y: 40.0 };            // line origin for the right cards
  // Each jar: 'home' = cut-out with its cast shadow (sits exactly on the render),
  // 'body' = round jar only, used while it moves (shadow added in CSS).
  var JARS = [
    { home: { src: 'Media/KitchenTable/kitchen_jar1.webp', l: 74.688, t: 25.521, w: 15.417, h: 8.75 },
      src: 'Media/KitchenTable/kitchen_jar1_body.webp', l: 78.646, t: 24.896, w: 9.375, h: 9.375 },
    { home: { src: 'Media/KitchenTable/kitchen_jar2.webp', l: 70.833, t: 33.646, w: 19.271, h: 12.812 },
      src: 'Media/KitchenTable/kitchen_jar2_body.webp', l: 74.583, t: 34.167, w: 9.583, h: 9.583 },
    { home: { src: 'Media/KitchenTable/kitchen_jar3.webp', l: 80.938, t: 44.844, w: 8.385, h: 7.812 },
      src: 'Media/KitchenTable/kitchen_jar3_body.webp', l: 80.521, t: 44.375, w: 8.958, h: 8.958 }
  ];
  var CUPS_IMG = { src: 'Media/KitchenTable/kitchen_cups.webp', l: 0.833, t: 40.365, w: 25.417, h: 16.406 };

  // What the jars carry when they come to the middle (from the three interviews)
  var JAR_DATA = [
    { title: 'Type 1', lines: ['Stress when glucose runs high', 'Panic during lows, especially outdoors', 'Checks every night', 'Re-checks to see the direction'] },
    { title: 'Type 2', lines: ['Worrying seemed to push sugar up', 'Dizziness from lows, keeps a toffee', 'Trusts the lab over the meter'] },
    { title: 'Prediabetes', lines: ['Used to worry, less so now', 'Has never checked at night'] }
  ];

  // Visual blocks that move out of the text into the side cards (document order)
  var VISUAL_SELECTOR = [
    '.kb-hero-img-wrap', '.kb-system-hero-wrap', '.kb-feature-asset-wrap', '.kb-sketch-row',
    '.kb-process-visual-col', '.kb-banner-full-wrap', '.kb-themes-canvas-art', '.kb-reflection-visual-col'
  ].join(',');

  var active = false, built = false;
  var scene, square, topSq, film, svg, lineL, lineR, panelL, panelR, labelsWrap, jarEls = [], jarHomeEls = [], cupsEl, frameImg;
  var anchorY = null;          // screen y of the jar row while the jars travel with the text
  var groups = [], markers = [], jarStage = null;
  var geo = null;
  var jarState = 'home', jarBusy = false, jarQueued = null, jarTimer = null;
  var shownL = -1, shownR = -1;
  var tabsHome = null;

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------- build once ----------
  function build() {
    if (built) return;
    built = true;

    scene = el('div', 'kb-table-scene');
    scene.setAttribute('aria-hidden', 'true');
    square = el('div', 'kb-table-square', scene);
    var base = el('img', 'kb-table-base', square);
    base.src = 'Media/KitchenScene_clear.avif';
    base.alt = '';
    base.decoding = 'async';

    // Layer above the text film: moving jars and the connector lines
    topSq = el('div', 'kb-table-square kb-table-top');
    topSq.setAttribute('aria-hidden', 'true');

    cupsEl = el('img', 'kb-table-obj', square);
    cupsEl.src = CUPS_IMG.src; cupsEl.alt = '';
    place(cupsEl, CUPS_IMG);

    JARS.forEach(function (j) {
      var hm = el('img', 'kb-table-obj', square);
      hm.src = j.home.src; hm.alt = '';
      place(hm, j.home);
      jarHomeEls.push(hm);
      var im = el('img', 'kb-table-obj kb-table-jar', topSq);
      im.src = j.src; im.alt = '';
      place(im, j);
      im.hidden = true;
      jarEls.push(im);
    });

    frameImg = el('img', 'kb-table-frame', square);
    frameImg.alt = '';
    frameImg.hidden = true;

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'kb-table-lines');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    function connector() {
      var g = document.createElementNS(svg.namespaceURI, 'g');
      g.setAttribute('class', 'kb-conn');
      var halo = document.createElementNS(svg.namespaceURI, 'path');
      halo.setAttribute('class', 'kb-conn-halo');
      var path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('class', 'kb-conn-path');
      path.setAttribute('pathLength', '1');
      var a = document.createElementNS(svg.namespaceURI, 'circle');
      a.setAttribute('class', 'kb-conn-start');
      var b = document.createElementNS(svg.namespaceURI, 'circle');
      b.setAttribute('class', 'kb-conn-end');
      g.appendChild(halo); g.appendChild(path); g.appendChild(a); g.appendChild(b);
      svg.appendChild(g);
      return g;
    }
    lineL = connector();
    lineR = connector();
    topSq.appendChild(svg);

    win.insertBefore(scene, win.firstChild);

    film = el('div', 'kb-table-film');
    film.setAttribute('aria-hidden', 'true');
    body.insertBefore(film, body.firstChild);
    win.appendChild(topSq);

    // Text that is dark in the normal layout turns light on the film (accents stay orange)
    [].forEach.call(article.querySelectorAll('*'), function (n) {
      var c = getComputedStyle(n).color.match(/\d+(\.\d+)?/g);
      if (!c) return;
      var r = +c[0], g2 = +c[1], b2 = +c[2];
      var orange = r > 190 && g2 < 175 && b2 < 120 && r - b2 > 90;
      if (!orange) n.classList.add('kb-ink');
    });

    panelL = el('div', 'kb-table-panel kb-table-panel-left', win);
    panelR = el('div', 'kb-table-panel kb-table-panel-right', win);
    [panelL, panelR].forEach(function (p) { p.setAttribute('aria-hidden', 'true'); });

    labelsWrap = el('div', 'kb-jar-labels', win);
    labelsWrap.setAttribute('aria-hidden', 'true');
    JAR_DATA.forEach(function (d) {
      var c = el('div', 'kb-jar-label', labelsWrap);
      el('div', 'kb-jar-label-title', c).textContent = d.title;
      var ul = el('ul', '', c);
      d.lines.forEach(function (t) { el('li', '', ul).textContent = t; });
    });

    // Visual groups -> markers in the text flow
    var found = article.querySelectorAll(VISUAL_SELECTOR);
    [].forEach.call(found, function (g) {
      if (g.closest('.kb-tv-src') && g.closest('.kb-tv-src') !== g) return;
      var imgs = g.tagName === 'IMG' ? [g] : [].slice.call(g.querySelectorAll('img'));
      if (!imgs.length) return;
      var caps = [].slice.call(g.querySelectorAll('.kb-caption-sub, figcaption'));
      var items = imgs.map(function (im, k) {
        var fig = im.closest('figure');
        var cap = fig ? fig.querySelector('figcaption') : null;
        return { src: im.getAttribute('src'), alt: im.getAttribute('alt') || '', cap: cap ? cap.textContent.trim() : (imgs.length === 1 && caps[0] ? caps[0].textContent.trim() : '') };
      });
      g.classList.add('kb-tv-src');
      var m = document.createElement('span');
      m.className = 'kb-tv-marker';
      m.setAttribute('aria-hidden', 'true');
      g.parentNode.insertBefore(m, g);
      var idx = groups.length;
      groups.push({ items: items, side: idx % 2 === 0 ? 'R' : 'L', marker: m });
      markers.push(m);
    });

    // Centre visual: the three interview groups on the jars
    var list = article.querySelector('.kb-interview-block .kb-int-list');
    if (list) {
      jarStage = document.createElement('div');
      jarStage.className = 'kb-jar-stage';
      var sr = el('div', 'kb-sr-only', jarStage);
      sr.textContent = JAR_DATA.map(function (d) { return d.title + ': ' + d.lines.join('; ') + '.'; }).join(' ');
      list.parentNode.insertBefore(jarStage, list);
    }

    main.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { if (active) { layout(); onScroll(); } });
  }

  function place(img, b) {
    img.style.left = b.l + '%'; img.style.top = b.t + '%';
    img.style.width = b.w + '%'; img.style.height = b.h + '%';
  }

  // ---------- layout ----------
  function layout() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.max(vw, vh), ox = (vw - s) / 2, oy = (vh - s) / 2;
    [square, topSq].forEach(function (q) {
      q.style.width = s + 'px'; q.style.height = s + 'px';
      q.style.left = ox + 'px'; q.style.top = oy + 'px';
    });

    var header = win.querySelector('.kb-header-bar');
    var hb = header ? header.getBoundingClientRect().bottom : 0;
    function X(p) { return ox + s * p / 100; }
    function Y(p) { return oy + s * p / 100; }

    var pad = Math.max(18, s * 0.012);
    var colTop = Math.max(Y(MARBLE.t) + pad, hb + 14);
    var colBot = Math.min(Y(MARBLE.b) - pad, vh - 14);
    var colL = X(COL.l), colR = X(COL.r);
    // The dark film covers the whole screen (CSS); the text column sits on it
    var inX = Math.max(24, (colR - colL) * 0.055), inY = 10;
    var tL = colL + inX, tR = colR - inX * 0.6, tT = colTop + inY, tB = colBot - inY;
    main.style.left = tL + 'px';
    main.style.top = tT + 'px';
    main.style.width = (tR - tL) + 'px';
    main.style.height = Math.max(200, tB - tT) + 'px';

    // Side cards
    var lL = Math.max(14, X(1.4)), lR = colL - Math.max(22, s * 0.014);
    var lT = Math.max(Y(57.5), hb + 14), lB = Math.min(Y(78), vh - 18);
    setBox(panelL, lL, lT, lR - lL, lB - lT);
    var rL = colR + Math.max(26, s * 0.016), rR = Math.min(vw - 16, X(96.5));
    var rT = Math.max(Y(56), hb + 14), rB = Math.min(Y(78), vh - 18);
    setBox(panelR, rL, rT, rR - rL, rB - rT);
    panelL.style.setProperty('--ph', Math.max(0, lB - lT) + 'px');
    panelR.style.setProperty('--ph', Math.max(0, rB - rT) + 'px');

    // Sections rail on the floor to the right of the marble
    var rail = win.querySelector('.kb-rail-right[aria-label="Section Tabs"]');
    if (rail) {
      var railL = Math.min(X(MARBLE.r) + 12, vw - 64);
      rail.style.left = railL + 'px';
      rail.style.top = colTop + 'px';
      rail.style.width = Math.max(52, vw - railL - 12) + 'px';
      rail.classList.toggle('kb-rail-narrow', vw - railL < 150);
    }

    geo = { s: s, ox: ox, oy: oy, vw: vw, vh: vh, colL: tL, colR: tR, colTop: colTop, colBot: colBot,
            lBox: [lL, lT, lR - lL, lB - lT], rBox: [rL, rT, rR - rL, rB - rT] };

    if (jarStage) jarStage.style.height = Math.round((colBot - colTop) * 0.62) + 'px';
    drawLine(lineL, panelL.classList.contains('is-on') ? 'L' : null);
    drawLine(lineR, panelR.classList.contains('is-on') ? 'R' : null);
    if (jarState === 'centre' && !jarBusy) { setJarsAt(1, false); placeLabels(); }
  }

  function setBox(e, l, t, w, h) {
    e.style.left = l + 'px'; e.style.top = t + 'px';
    e.style.width = Math.max(0, w) + 'px'; e.style.height = Math.max(0, h) + 'px';
  }

  function toSq(px, py) { return [(px - geo.ox) / geo.s * 100, (py - geo.oy) / geo.s * 100]; }

  // Curved connector from the object to the top edge of its card, with a dot at each end
  function drawLine(g, side, cardRect) {
    if (!geo) return;
    if (!side) { g.classList.remove('is-on'); return; }
    var o = side === 'L' ? CUPS : JARS_ORIGIN;
    var box = side === 'L' ? geo.lBox : geo.rBox;
    var ex = cardRect ? cardRect.left + cardRect.width / 2 : box[0] + box[2] / 2;
    var ey = cardRect ? cardRect.top - 4 : box[1];
    var end = toSq(ex, ey);
    var dy = end[1] - o.y;
    var d = 'M' + o.x + ' ' + o.y + ' C' + o.x + ' ' + (o.y + dy * 0.6) + ' ' + end[0] + ' ' + (end[1] - dy * 0.55) + ' ' + end[0] + ' ' + end[1];
    var parts = g.childNodes;
    parts[0].setAttribute('d', d); parts[1].setAttribute('d', d);
    parts[2].setAttribute('cx', o.x); parts[2].setAttribute('cy', o.y);
    parts[3].setAttribute('cx', end[0]); parts[3].setAttribute('cy', end[1]);
    g.classList.remove('is-on'); void g.getBoundingClientRect();
    requestAnimationFrame(function () { requestAnimationFrame(function () { g.classList.add('is-on'); }); });
  }

  // ---------- side cards ----------
  function fillPanel(panel, g) {
    panel.innerHTML = '';
    if (!g) return;
    var n = g.items.length;
    var gi = groups.indexOf(g);
    var row = el('div', 'kb-magnet-row' + (n > 1 ? ' is-stack' : ''), panel);
    var pw = parseFloat(panel.style.width) || 300, ph = parseFloat(panel.style.height) || 300;
    var capH = 0;
    g.items.forEach(function (it, k) {
      var card = el('figure', 'kb-magnet', row);
      card.style.setProperty('--tilt', (n > 1 ? [-2.5, 1.5, -1][k % 3] : [-0.8, 0.9, -0.4][gi % 3]) + 'deg');
      card.style.setProperty('--delay', (k * 90) + 'ms');
      var im = el('img', '', card);
      im.alt = '';
      // Fit the picture inside the space left for it, keeping its shape
      var availW = (n > 1 ? pw / n + 6 : pw) - 16, availH = ph - 16 - (n === 1 && it.cap ? 58 : 0);
      im.onload = function () {
        var r = im.naturalWidth / im.naturalHeight || 1;
        var w = Math.min(availW, availH * r);
        im.style.width = Math.round(w) + 'px';
        im.style.height = Math.round(w / r) + 'px';
        var cap = card.querySelector('figcaption'); if (cap) cap.style.maxWidth = Math.max(140, Math.round(w)) + 'px';
        if (panel._line) panel._line();
      };
      im.src = it.src;
      if (it.cap && n === 1) { var fc = el('figcaption', '', card); fc.textContent = it.cap; fc.style.maxWidth = '160px'; }
    });
    if (n > 1) el('p', 'kb-magnet-note', panel).textContent = 'Sketches 1–' + n + ', in the order I drew them';
  }

  function showGroup(side, gi) {
    var panel = side === 'L' ? panelL : panelR;
    var cur = side === 'L' ? shownL : shownR;
    if (cur === gi) return;
    if (side === 'L') shownL = gi; else shownR = gi;
    if (gi < 0) { clearTimeout(panel._t); panel.classList.remove('is-on'); drawLine(side === 'L' ? lineL : lineR, null); return; }
    panel.classList.remove('is-on');
    clearTimeout(panel._t);
    panel._t = setTimeout(function () {
      var line = side === 'L' ? lineL : lineR;
      panel._line = function () {
        var row = panel.querySelector('.kb-magnet-row');
        drawLine(line, side, row ? row.getBoundingClientRect() : null);
      };
      fillPanel(panel, groups[gi]);
      panel.classList.add('is-on');
      panel._line();
    }, reduceMotion ? 0 : 160);
  }

  // ---------- scroll ----------
  var ticking = false;
  function onScroll() {
    if (!active || ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }

  function update() {
    if (!geo) return;
    var mr = main.getBoundingClientRect();
    var line = mr.top + mr.height * 0.55;

    // Current visual on each side = the latest marker above the reading line
    var lastL = -1, lastR = -1, sec = null;
    for (var i = 0; i < groups.length; i++) {
      var t = groups[i].marker.getBoundingClientRect().top;
      if (t > line) break;
      if (groups[i].side === 'L') lastL = i; else lastR = i;
    }
    // Only keep a card while its section is the one being read
    var secs = article.querySelectorAll('.kb-spread');
    var curSec = 0;
    for (var k = 0; k < secs.length; k++) { if (secs[k].getBoundingClientRect().top <= mr.top + mr.height * 0.35) curSec = k; }
    function inSec(gi) { return gi >= 0 && secs[curSec] && secs[curSec].contains(groups[gi].marker); }
    if (!inSec(lastL)) lastL = -1;
    if (!inSec(lastR)) lastR = -1;

    // Jar centre stage: the jars come out when their spot in the text is on screen,
    // travel with the text, and go home just before it reaches the top of the column.
    var wantCentre = false;
    if (jarStage) {
      var jr = jarStage.getBoundingClientRect();
      var y = jr.top + jr.height * 0.74;
      var out = jarState === 'centre' || (jarBusy && jarQueued !== 'home');
      var topLimit = mr.top + mr.height * (out ? 0.2 : 0.28);
      var botLimit = mr.bottom - mr.height * (out ? 0.03 : 0.12);
      wantCentre = y > topLimit && y < botLimit;
      anchorY = y;
    }
    if (wantCentre || jarState === 'centre' || jarBusy) lastR = -1;   // the jars have left the right side
    if (jarState === 'centre' && !jarBusy && wantCentre) { setJarsAt(1, false); placeLabels(); }

    showGroup('L', lastL);
    showGroup('R', lastR);
    moveJars(wantCentre ? 'centre' : 'home');

    if (typeof window.kbSetActiveSection === 'function') window.kbSetActiveSection(curSec);
  }

  // ---------- jars ----------
  function homeOf(i) { var j = JARS[i]; return [j.l + j.w / 2, j.t + j.h / 2]; }
  function targetOf(i) {
    var F = window.KB_JAR_FRAMES;
    if (F && F.targets && F.targets[i]) return F.targets[i];
    var yPx = anchorY != null ? anchorY : (geo.colTop + geo.colBot) / 2;
    var y = toSq(0, yPx)[1];
    var xs = [1 / 6, 0.5, 5 / 6].map(function (f) { return toSq(geo.colL + (geo.colR - geo.colL) * f, 0)[0]; });
    return [xs[i], y];
  }

  function setJarsAt(p, jitter) {
    jarEls.forEach(function (im, i) {
      var h = homeOf(i), t = targetOf(i), j = JARS[i];
      var cx = h[0] + (t[0] - h[0]) * p, cy = h[1] + (t[1] - h[1]) * p;
      im.style.left = (cx - j.w / 2) + '%';
      im.style.top = (cy - j.h / 2) + '%';
      var rot = jitter ? (Math.random() * 8 - 4) : 0;
      var dx = jitter ? (Math.random() * 0.4 - 0.2) : 0;
      im.style.transform = 'translate(' + dx + '%, 0) rotate(' + rot.toFixed(1) + 'deg)';
    });
  }

  function setJarsHome(atHome) {
    jarHomeEls.forEach(function (h) { h.hidden = !atHome; });
    jarEls.forEach(function (b) { b.hidden = atHome; });
  }

  function moveJars(to) {
    if (to === jarState && !jarBusy) return;
    if (jarBusy) { jarQueued = to; return; }
    if (to === jarState) return;
    jarBusy = true;
    if (to === 'home') labelsWrap.classList.remove('is-on');
    var F = window.KB_JAR_FRAMES;
    var frames = F && (to === 'centre' ? F.out : F.back);
    var done = function () {
      jarState = to; jarBusy = false;
      if (to === 'centre') { placeLabels(); labelsWrap.classList.add('is-on'); }
      if (jarQueued && jarQueued !== jarState) { var q = jarQueued; jarQueued = null; moveJars(q); }
      else jarQueued = null;
    };
    if (reduceMotion) { setJarsAt(to === 'centre' ? 1 : 0, false); setJarsHome(to === 'home'); done(); return; }

    if (frames && frames.length) {
      // Rendered stop-motion frames
      var fps = F.fps || 10, i = 0;
      jarEls.forEach(function (im) { im.style.visibility = 'hidden'; });
      jarHomeEls.forEach(function (im) { im.style.visibility = 'hidden'; });
      frameImg.hidden = false;
      (function step() {
        frameImg.src = frames[i];
        i++;
        if (i < frames.length) { jarTimer = setTimeout(step, 1000 / fps); return; }
        if (to === 'home') { frameImg.hidden = true; setJarsAt(0, false); setJarsHome(true); jarEls.concat(jarHomeEls).forEach(function (im) { im.style.visibility = ''; }); }
        done();
      })();
      return;
    }

    // Placeholder: cut-out jars stepped across the table, about 9 frames per second
    var STEPS = 9, k = 0;
    setJarsHome(false);
    (function step() {
      k++;
      var f = k / STEPS;
      var e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      var p = to === 'centre' ? e : 1 - e;
      setJarsAt(p, k < STEPS);
      if (k < STEPS) { jarTimer = setTimeout(step, 110); return; }
      if (to === 'home') setJarsHome(true);
      done();
    })();
  }

  function placeLabels() {
    if (!geo || !labelsWrap) return;
    var labels = labelsWrap.children;
    var w = (geo.colR - geo.colL) / 3 - 18;
    var topJar = Infinity;
    for (var q = 0; q < labels.length; q++) topJar = Math.min(topJar, geo.oy + geo.s * (targetOf(q)[1] - JARS[q].h / 2) / 100);
    for (var i = 0; i < labels.length; i++) {
      var t = targetOf(i);
      var px = geo.ox + geo.s * t[0] / 100;
      var lab = labels[i];
      lab.style.width = w + 'px';
      lab.style.left = (px - w / 2) + 'px';
      lab.style.bottom = (geo.vh - topJar + 8) + 'px';
    }
  }

  // ---------- project tabs into the header ----------
  function moveTabs(intoHeader) {
    var tabs = document.getElementById('kb-project-tabs');
    var hc = win.querySelector('.kb-header-center');
    if (!tabs || !hc) return;
    if (!tabsHome) tabsHome = tabs.parentNode;
    if (intoHeader) { if (tabs.parentNode !== hc) hc.appendChild(tabs); hc.classList.add('kb-table-nav'); }
    else { hc.classList.remove('kb-table-nav'); if (tabs.parentNode === hc && !hc.classList.contains('has-nav')) tabsHome.appendChild(tabs); }
  }

  // ---------- on / off ----------
  function shouldBeActive() {
    return mq.matches && !body.classList.contains('kb-mode-story');
  }

  function sync() {
    var want = shouldBeActive();
    if (want === active) { if (active) { layout(); onScroll(); } return; }
    active = want;
    if (active) {
      build();
      stage.classList.add('kb-table-mode');
      moveTabs(true);
      layout();
      main.scrollTop = 0;
      update();
    } else {
      stage.classList.remove('kb-table-mode');
      moveTabs(false);
      ['left', 'top', 'width', 'height'].forEach(function (p) { main.style[p] = ''; });
      var rail = win.querySelector('.kb-rail-right[aria-label="Section Tabs"]');
      if (rail) ['left', 'top', 'width'].forEach(function (p) { rail.style[p] = ''; });
      clearTimeout(jarTimer); jarBusy = false; jarQueued = null; jarState = 'home';
      if (built) { setJarsAt(0, false); setJarsHome(true); labelsWrap.classList.remove('is-on'); frameImg.hidden = true; jarEls.concat(jarHomeEls).forEach(function (im) { im.style.visibility = ''; }); }
      showGroup('L', -1); showGroup('R', -1);
      if (typeof window.setKitchenDial === 'function' && !body.classList.contains('kb-mode-story')) window.setKitchenDial(0);
    }
  }

  if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
  new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['class'] });
  var wasOpen = false;
  new MutationObserver(function () {
    var open = stage.classList.contains('is-open');
    if (open && !wasOpen) {
      sync();
      if (active) { anchorY = null; main.scrollTop = 0; showGroup('L', -1); showGroup('R', -1); moveJars('home'); setTimeout(function () { layout(); update(); }, 60); }
    }
    wasOpen = open;
  }).observe(stage, { attributes: true, attributeFilter: ['class'] });
  sync();

  window.kbTable = { sync: sync, layout: layout, isActive: function () { return active; } };
})();
