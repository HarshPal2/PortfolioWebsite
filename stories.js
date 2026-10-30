/* Kitchen Blog: visual-project slides.
   Each slide pairs a visual with a short plain description of what it shows.
   Descriptions are based on the project copy already on the site (reading/ pages). */
(function () {
  'use strict';
  var IMG = 'reading/img/';

  var PROJECTS = [
    {
      id: 'cabin', label: 'Cabin in the Woods',
      meta: 'Architectural CGI · 2026 · Blender Cycles & Substance',
      overview: { title: 'Cabin in the Woods', text: 'An architectural visualization study exploring how a small woodland retreat can feel integrated with its surrounding landscape rather than placed within it, through stillness, materiality and light.' },
      slides: [
        { img: 'cabin-cabin-hero.webp', alt: 'A timber cabin among tall trees in soft woodland light', title: 'Master Perspective', text: 'The full view of the cabin set among tall trees. Filtered morning sunlight establishes a quiet relationship between the building and the forest.' },
        { img: 'cabin-cabin-detail-canopy.webp', alt: 'A tree trunk in the foreground with the cabin roof behind it', title: 'Morning Light Through the Canopy', text: 'Diffuse morning sunlight filtered through layered maple leaves, casting soft shadows across the weathered timber siding and the pitched roof.' },
        { img: 'cabin-cabin-detail-gable.webp', alt: 'The cabin gable with a painted band of small flowers', title: 'Gable and Floral Frieze', text: 'A steep timber gable with a decorative floral frieze, adding character and a handcrafted feel to the facade.' },
        { img: 'cabin-cabin-detail-windows.webp', alt: 'Four windows on the cabin, one with a scalloped edge, in dappled light', title: 'Windows and Entrance', text: 'Diamond-patterned glazing and a timber entrance door with a scalloped opening, framed within the weathered facade.' },
        { img: 'cabin-cabin-detail-porch.webp', alt: 'The cabin porch rail and steps with green plants growing close', title: 'Porch and Forest Floor', text: 'Weathered timber porch railing and steps, where the building meets the plants and the forest floor.' }
      ]
    },
    {
      id: 'product', label: 'Product Renders',
      meta: '3D LookDev & Lighting · 2025–2026 · Blender Cycles & Substance',
      overview: { title: 'Product Renders', text: 'A collection of 3D look-development, hard-surface detailing and material studies, exploring industrial form, the behaviour of light and tactile material response through shader construction and studio lighting.' },
      slides: [
        { img: 'product-renders-1psed.webp', alt: 'A glowing lighthouse-shaped candleholder against an ivy-shadowed wall', title: 'Lighthouse Candleholder', text: 'A lighthouse-shaped candleholder with a lit flame, placed against a wall with dappled leaf shadows. The study looks at translucent materials and the warmth of a small flame.' },
        { img: 'product-renders-harsh-pal-finalrender.webp', alt: 'An olive green instant camera resting on wet stone among ferns', title: 'Olive Green Instant Camera', text: 'High-fidelity look-development of an olive green instant camera resting on weathered wet ground, with soft foliage behind it.' },
        { img: 'product-renders-harsh-pal-image0001.webp', alt: 'Two wooden armchairs with green patterned cushions in a pink room with monstera leaves', title: 'Two Armchairs', text: 'Two wooden armchairs with green swirl-patterned cushions in a pink room with monstera leaves, studying fabric pattern, timber and a glossy floor under soft light.' },
        { img: 'product-renders-img-11.webp', alt: 'A small tree whose branches carry a cluster of colourful lit houses', title: 'Tree of Houses', text: 'A vertical study of a small tree whose branches carry a cluster of colourful houses with lit windows, set against a muted backdrop.' },
        { img: 'product-renders-img-3.webp', alt: 'A weathered brass gramophone on a wooden base', title: 'Brass Gramophone', text: 'A sculptural study of an aged brass gramophone on a wooden base, looking at curvature, patina and directional highlights.' },
        { img: 'product-renders-img-9.webp', alt: 'Three cream vases with blue wildflowers in dappled window light', title: 'Vases and Wildflowers', text: 'A still life of three ceramic vases with blue wildflowers on a wooden shelf, lit by dappled window light.' }
      ]
    },
    {
      id: 'biophilic', label: 'Biophilic Interior',
      meta: 'Spatial & Interior CGI · 2025 · Blender Cycles & Substance 3D',
      overview: { title: 'Biophilic Interior', text: 'An interior exploration of biophilic living: how natural light, cedar textures, reflective water and courtyard planting can soften a contemporary space.' },
      slides: [
        { img: 'biophilic-environment-img-8.webp', alt: 'A living space with an armchair, tea table and hanging swing seat facing a garden', title: 'Lounge and Garden Veranda', text: 'An elevated view of the lounge, with seating and a hanging swing opening straight onto the garden through the glass.' },
        { img: 'biophilic-environment-img-3.webp', alt: 'A wooden armchair beside a glass-topped tea table with a teapot and cups', title: 'Armchair and Tea Table', text: 'A quiet sitting corner with a timber armchair, a slatted tea table and a ceramic tea set.' },
        { img: 'biophilic-environment-img-4.webp', alt: 'A hanging swing sofa with green and blue cushions beside the garden', title: 'Hanging Daybed', text: 'A suspended timber daybed with botanical-print cushions, catching dappled sunlight.' },
        { img: 'biophilic-environment-img-6.webp', alt: 'A curved honey-wood media console with two small lanterns and a slatted screen', title: 'Curved Oak Credenza', text: 'A custom low credenza with curved corners, slatted sliding fronts and warm backlighting.' },
        { img: 'biophilic-environment-img.webp', alt: 'A cedar slat screen above a calm emerald indoor pool beside a garden terrace', title: 'Emerald Pool and Cedar Screen', text: 'The master perspective: a reflective indoor emerald pool, a vertical cedar slat screen and an open garden terrace.' }
      ]
    },
    {
      id: 'posters', label: 'Poster Collection',
      meta: 'Poster & Art Direction · 2025–2026 · Digital Collage & Vector Art',
      overview: { title: 'Poster Collection', text: 'A collection exploring speculative cinema, lucid dreamscapes and playful character typography: the SOMNIUM sci-fi series about dream-recording technology, and a series of warm, witty character prints.' },
      slides: [
        { img: 'posters-harsh-590028088-4-5.webp', alt: 'SOMNIUM Dreams poster: a night sky of purple clouds, mountains and a comet', title: 'SOMNIUM Dreams', text: 'An atmospheric digital painting of the transition between deep sleep and a vivid cosmic imagination.' },
        { img: 'posters-poster-1iteration-1.webp', alt: 'SOMNIA poster: a recording camera eye above a sleeper, and a traveller walking toward a wreck on a green horizon', title: 'SOMNIA', text: 'A speculative sci-fi poster about cinematic neural recording, combining a recording camera eye, a dreamer and a vast surreal landscape.' },
        { img: 'posters-poster-4somnium4.webp', alt: 'SOMNIUM Dreamplay poster: an upside-down city, a falling figure, and a REC frame', title: 'SOMNIUM Dreamplay', text: 'A surreal inverted cityscape with floating elements and a camera recording interface.' },
        { img: 'posters-poster-1-harsh.webp', alt: 'A yellow duckling with three pink hearts on a purple background and a pun about quacking', title: 'You Make My Heart Go Quack', text: 'A character poster built on bold flat colour and cheerful lettering.' },
        { img: 'posters-poster-2-harsh.webp', alt: 'An orange cat curled up with a heart-shaped tail on a deep maroon background', title: 'Cat-itude Is Everything', text: 'A minimal cat silhouette with a heart-shaped tail on a chocolate-brown ground.' },
        { img: 'posters-poster-3-harsh.webp', alt: 'A yellow character in round sunglasses holding a red rose on a blue background', title: 'Too Cool to Fall', text: 'A tongue-in-cheek character illustration in denim blue tones with a rose accent.' }
      ]
    }
  ];

  var stage = document.getElementById('kitchen-blog-stage');
  var body = document.getElementById('kb-window-body');
  var main = document.getElementById('kb-story-main');
  var rail = document.getElementById('kb-story-rail');
  var railTabs = document.getElementById('kb-story-tabs');
  var tabsRow = document.getElementById('kb-project-tabs');
  var headerTitle = document.getElementById('kb-header-title');
  var headerCenter = headerTitle && headerTitle.parentNode;
  var railInner = document.querySelector('.kb-rail-left .kb-rail-inner');
  var counter = document.getElementById('kitchen-sec-counter');
  var counterTag = document.querySelector('#kitchen-header-sections .kb-sec-tag');
  var pagerCount = document.getElementById('kb-pager-count');
  var prevBtn = document.getElementById('kb-prev');
  var nextBtn = document.getElementById('kb-next');
  if (!stage || !body || !main || !tabsRow || !prevBtn || !nextBtn) return;

  // The left rail is hidden on small screens, so the picker sits in the header there.
  var mq = window.matchMedia ? window.matchMedia('(max-width: 900px)') : null;
  function placeTabs() {
    if (!railInner || !headerCenter) return;
    if (mq && mq.matches) { headerCenter.appendChild(tabsRow); headerCenter.classList.add('has-nav'); }
    else { railInner.appendChild(tabsRow); headerCenter.classList.remove('has-nav'); }
  }
  placeTabs();
  if (mq && mq.addEventListener) mq.addEventListener('change', placeTabs);
  function setTitle(id) {
    if (!headerTitle) return;
    var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
    headerTitle.textContent = 'Case Study \u2022 ' + (p ? p.label : 'GluSight');
  }

  var current = 'glusight';
  var built = {};     // project id -> { slides: [el], tabs: [el] }
  var idx = 0;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function bodyHtml(s) { return '<p class="kb-st-desc">' + esc(s.text) + '</p>'; }

  function build(p) {
    var slides = [{ over: true }].concat(p.slides);
    var els = slides.map(function (s, i) {
      var el = document.createElement('section');
      el.className = 'kb-story-slide';
      el.setAttribute('data-project', p.id);
      el.hidden = true;
      var data = s.over ? p.overview : s;
      var visual;
      if (s.over) {
        visual = '<div class="kb-st-visual kb-st-mosaic">' + p.slides.map(function (x) {
          return '<img src="' + IMG + x.img + '" alt="" decoding="async">'; }).join('') + '</div>';
      } else {
        visual = '<div class="kb-st-visual"><img src="' + IMG + s.img + '" alt="' + esc(s.alt) + '" loading="lazy" decoding="async"></div>';
      }
      el.innerHTML = visual + '<div class="kb-st-text">' +
        '<span class="kb-st-eyebrow">' + esc(p.label) + ' · ' + pad(i + 1) + '</span>' +
        '<h3 class="kb-st-title">' + esc(data.title) + '</h3>' +
        bodyHtml(data) +
        (s.over ? '<span class="kb-st-meta">' + esc(p.meta) + '</span>' : '') +
        '</div>';
      var vi = el.querySelector('.kb-st-visual:not(.kb-st-mosaic) img');
      if (vi) {
        var mark = function () { if (vi.naturalHeight && vi.naturalWidth / vi.naturalHeight > 1.25) el.classList.add('kb-st-wide'); };
        if (vi.complete) mark(); else vi.addEventListener('load', mark);
      }
      main.appendChild(el);
      return el;
    });
    var tabs = slides.map(function (s, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'kb-st-tab'; b.setAttribute('data-i', i);
      b.innerHTML = '<span class="kb-st-tab-num">' + pad(i + 1) + '.</span> ' + esc(s.over ? 'Overview' : s.title);
      b.addEventListener('click', function () { go(i, true); });
      return b;
    });
    built[p.id] = { slides: els, tabs: tabs, project: p };
  }

  function counterText() { var b = built[current]; return pad(idx + 1) + ' / ' + pad(b.slides.length); }

  function go(i, animate) {
    var b = built[current]; if (!b) return;
    i = Math.max(0, Math.min(b.slides.length - 1, i));
    idx = i;
    b.slides.forEach(function (el, k) {
      var on = k === i;
      el.hidden = !on;
      if (on && animate) { el.classList.remove('kb-page-enter'); void el.offsetWidth; el.classList.add('kb-page-enter'); }
    });
    b.tabs.forEach(function (t, k) { t.classList.toggle('active', k === i); });
    if (counter) counter.textContent = counterText();
    if (pagerCount) pagerCount.textContent = counterText();
    prevBtn.disabled = i <= 0;
    nextBtn.disabled = i >= b.slides.length - 1;
  }

  function setProject(id, animate) {
    if (!id || (id !== 'glusight' && !PROJECTS.some(function (p) { return p.id === id; }))) return;
    var was = current;
    current = id;
    [].forEach.call(tabsRow.querySelectorAll('.kb-project-tab'), function (t) {
      var on = t.getAttribute('data-project') === id;
      t.classList.toggle('active', on); t.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    setTitle(id);
    var story = id !== 'glusight';
    body.classList.toggle('kb-mode-story', story);
    if (story) {
      if (!built[id]) build(PROJECTS.filter(function (p) { return p.id === id; })[0]);
      [].forEach.call(main.children, function (el) { el.hidden = true; });
      railTabs.innerHTML = '';
      built[id].tabs.forEach(function (t) { railTabs.appendChild(t); });
      if (counterTag) counterTag.textContent = 'SLIDE';
      go(0, animate !== false);
    } else {
      [].forEach.call(main.children, function (el) { el.hidden = true; });
      if (counterTag) counterTag.textContent = 'SECTIONS';
      if (typeof window.setKitchenDial === 'function') window.setKitchenDial(0);
      if (was !== 'glusight') { var sp = document.getElementById('kb-sec-01'); if (sp) { sp.classList.remove('kb-page-enter'); void sp.offsetWidth; sp.classList.add('kb-page-enter'); } }
    }
  }

  tabsRow.addEventListener('click', function (e) {
    var t = e.target.closest('.kb-project-tab'); if (!t) return;
    e.preventDefault();
    setProject(t.getAttribute('data-project'), true);
  });

  // Route pager buttons and arrow keys to the story while a story project is showing.
  document.addEventListener('click', function (e) {
    if (current === 'glusight') return;
    var btn = e.target.closest && e.target.closest('#kb-prev, #kb-next');
    if (!btn) return;
    e.stopImmediatePropagation(); e.preventDefault();
    go(idx + (btn.id === 'kb-next' ? 1 : -1), true);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (current === 'glusight' || !stage.classList.contains('is-open')) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var d = (e.key === 'ArrowRight' || e.key === 'PageDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'PageUp') ? -1 : 0;
    if (!d) return;
    e.stopImmediatePropagation(); e.preventDefault();
    go(idx + d, true);
  }, true);
  var sx = 0, sy = 0, tracking = false;
  main.addEventListener('touchstart', function (e) { tracking = e.touches.length === 1; if (tracking) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, { passive: true });
  main.addEventListener('touchend', function (e) {
    if (!tracking) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) go(idx + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  // Always start on GluSight when the blog is (re)opened.
  new MutationObserver(function () {
    if (!stage.classList.contains('is-open') && current !== 'glusight') {
      current = 'glusight';
      setTitle('glusight');
      body.classList.remove('kb-mode-story');
      [].forEach.call(tabsRow.querySelectorAll('.kb-project-tab'), function (t) {
        var on = t.getAttribute('data-project') === 'glusight'; t.classList.toggle('active', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      if (counterTag) counterTag.textContent = 'SECTIONS';
      [].forEach.call(main.children, function (el) { el.hidden = true; });
    }
  }).observe(stage, { attributes: true, attributeFilter: ['class'] });

  window.kbOpenProject = setProject;   // e.g. kbOpenProject('cabin') from the kitchen scene later
})();
