/* ==========================================================================
   Freedom OS — the bedroom PC screen as a small Aero-style desktop.
   Builds itself inside .monitor-content-viewport; the old editorial view stays
   in the DOM (hidden) so the existing page script keeps working.
   ========================================================================== */
(function () {
  'use strict';

  var viewport = document.querySelector('.monitor-content-viewport');
  if (!viewport) return;

  var R = '../reading/img/';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mqPhone = window.matchMedia ? window.matchMedia('(max-width: 900px)') : { matches: false };

  // ----------------------------------------------------------------- data
  var LINKS = {
    linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/harsh-pal-42b174205/', icon: 'linkedin' },
    artstation: { label: 'ArtStation', url: 'https://www.artstation.com/harshpal', icon: 'artstation' },
    instagram: { label: 'Instagram', url: 'https://www.instagram.com/harshpal_13/', icon: 'instagram' },
    github: { label: 'GitHub', url: 'https://github.com/HarshPal2', icon: 'github' },
    email: { label: 'Email', url: 'mailto:pal.harsh13@gmail.com', icon: 'email', note: 'pal.harsh13@gmail.com' }
  };

  var FOLDERS = {
    cabin: {
      title: 'Cabin in the Woods', meta: 'Architectural CGI · 2026 · Blender Cycles & Substance',
      text: 'An architectural visualization study exploring how a small woodland retreat can feel integrated with its surrounding landscape rather than placed within it, through stillness, materiality and light.',
      video: { src: 'Media/TreeHouseWithout.mp4', name: 'Cabin film.mp4' },
      items: [
        ['cabin-cabin-hero.webp', 'Master Perspective', 'The full view of the cabin set among tall trees. Filtered morning sunlight establishes a quiet relationship between the building and the forest.'],
        ['cabin-cabin-detail-canopy.webp', 'Morning Light Through the Canopy', 'Diffuse morning sunlight filtered through layered maple leaves, casting soft shadows across the weathered timber siding and the pitched roof.'],
        ['cabin-cabin-detail-gable.webp', 'Gable and Floral Frieze', 'A steep timber gable with a decorative floral frieze, adding character and a handcrafted feel to the facade.'],
        ['cabin-cabin-detail-windows.webp', 'Windows and Entrance', 'Diamond-patterned glazing and a timber entrance door with a scalloped opening, framed within the weathered facade.'],
        ['cabin-cabin-detail-porch.webp', 'Porch and Forest Floor', 'Weathered timber porch railing and steps, where the building meets the plants and the forest floor.']
      ]
    },
    product: {
      title: 'Product Renders', meta: '3D LookDev & Lighting · 2025–2026 · Blender Cycles & Substance',
      text: 'A collection of 3D look-development, hard-surface detailing and material studies, exploring industrial form, the behaviour of light and tactile material response through shader construction and studio lighting.',
      video: { src: 'Media/Product Renders/vid.mp4', name: 'Motion breakdown.mp4' },
      items: [
        ['product-renders-1psed.webp', 'Lighthouse Candleholder', 'A lighthouse-shaped candleholder with a lit flame, placed against a wall with dappled leaf shadows. The study looks at translucent materials and the warmth of a small flame.'],
        ['product-renders-harsh-pal-finalrender.webp', 'Olive Green Instant Camera', 'High-fidelity look-development of an olive green instant camera resting on weathered wet ground, with soft foliage behind it.'],
        ['product-renders-harsh-pal-image0001.webp', 'Two Armchairs', 'Two wooden armchairs with green swirl-patterned cushions in a pink room with monstera leaves, studying fabric pattern, timber and a glossy floor under soft light.'],
        ['product-renders-img-11.webp', 'Tree of Houses', 'A vertical study of a small tree whose branches carry a cluster of colourful houses with lit windows, set against a muted backdrop.'],
        ['product-renders-img-3.webp', 'Brass Gramophone', 'A sculptural study of an aged brass gramophone on a wooden base, looking at curvature, patina and directional highlights.'],
        ['product-renders-img-9.webp', 'Vases and Wildflowers', 'A still life of three ceramic vases with blue wildflowers on a wooden shelf, lit by dappled window light.']
      ]
    },
    biophilic: {
      title: 'Biophilic Interior', meta: 'Spatial & Interior CGI · 2025 · Blender Cycles & Substance 3D',
      text: 'An interior exploration of biophilic living: how natural light, cedar textures, reflective water and courtyard planting can soften a contemporary space.',
      items: [
        ['biophilic-environment-img.webp', 'Emerald Pool and Cedar Screen', 'The master perspective: a reflective indoor emerald pool, a vertical cedar slat screen and an open garden terrace.'],
        ['biophilic-environment-img-8.webp', 'Lounge and Garden Veranda', 'An elevated view of the lounge, with seating and a hanging swing opening straight onto the garden through the glass.'],
        ['biophilic-environment-img-3.webp', 'Armchair and Tea Table', 'A quiet sitting corner with a timber armchair, a slatted tea table and a ceramic tea set.'],
        ['biophilic-environment-img-4.webp', 'Hanging Daybed', 'A suspended timber daybed with botanical-print cushions, catching dappled sunlight.'],
        ['biophilic-environment-img-6.webp', 'Curved Oak Credenza', 'A custom low credenza with curved corners, slatted sliding fronts and warm backlighting.']
      ]
    },
    posters: {
      title: 'Poster Collection', meta: 'Poster & Art Direction · 2025–2026 · Digital Collage & Vector Art',
      text: 'A collection exploring speculative cinema, lucid dreamscapes and playful character typography: the SOMNIUM sci-fi series about dream-recording technology, and a series of warm, witty character prints.',
      items: [
        ['posters-harsh-590028088-4-5.webp', 'SOMNIUM Dreams', 'An atmospheric digital painting of the transition between deep sleep and a vivid cosmic imagination.'],
        ['posters-poster-1iteration-1.webp', 'SOMNIA', 'A speculative sci-fi poster about cinematic neural recording, combining a recording camera eye, a dreamer and a vast surreal landscape.'],
        ['posters-poster-4somnium4.webp', 'SOMNIUM Dreamplay', 'A surreal inverted cityscape with floating elements and a camera recording interface.'],
        ['posters-poster-1-harsh.webp', 'You Make My Heart Go Quack', 'A character poster built on bold flat colour and cheerful lettering.'],
        ['posters-poster-2-harsh.webp', 'Cat-itude Is Everything', 'A minimal cat silhouette with a heart-shaped tail on a chocolate-brown ground.'],
        ['posters-poster-3-harsh.webp', 'Too Cool to Fall', 'A tongue-in-cheek character illustration in denim blue tones with a rose accent.']
      ]
    }
  };

  var ABOUT_TXT = [
    "I'm Harsh, a visual designer and 3D artist.",
    '',
    'I create experiences through emotions, motion, and storytelling.',
    'Curious by nature. Experimental by choice.',
    '',
    'This desktop holds my projects:',
    '  - GluSight_CaseStudy.ai   a medical UX/UI design concept',
    '  - Four folders of renders and posters',
    '',
    'Say hello:',
    '  pal.harsh13@gmail.com',
    '  linkedin.com/in/harsh-pal-42b174205',
    '  artstation.com/harshpal',
    '  instagram.com/harshpal_13',
    '  github.com/HarshPal2'
  ].join('\n');

  var BIN_TXT = [
    'first_idea_v1_FINAL_final2.txt',
    '',
    'Every project starts in here.',
    '',
    'Version 1 is always "final". Then comes final2, final_really,',
    'and final_this_one. The drafts in this bin taught me what',
    'not to do, which is most of what design is.',
    '',
    'Nothing else to see. Go open a folder.'
  ].join('\n');

  // GluSight artboards (copy taken from the case study already on the site)
  var ARTBOARDS = [
    { name: 'Cover', html:
      '<p class="ab-kicker">Case study · Medical UX/UI · 2026</p><h1>GluSight</h1>' +
      '<p class="ab-lead">What if your glucose monitor could tell you what happens next?</p>' +
      '<img src="' + R + 'glusight-ref-01-hero-phone.webp" alt="GluSight concept: the current reading with a prediction graph on a phone">' +
      '<p class="ab-note">GluSight is an independent design concept. It has not been clinically validated or tested with users.</p>' },
    { name: 'The idea', html:
      '<p class="ab-kicker">02 · Introducing GluSight</p><h2>The idea</h2>' +
      '<p>Instead of focusing only on the current reading, GluSight explores how a possible future glucose trend could help people anticipate changes and better understand their glucose information.</p>' +
      '<ol class="ab-list"><li><b>Current glucose.</b> A clear view of the current reading and its trend.</li>' +
      '<li><b>Predicted glucose trend.</b> A visual projection of a possible future trend.</li>' +
      '<li><b>Communicating uncertainty.</b> Observed readings kept apart from estimated future values.</li>' +
      '<li><b>Contextual information.</b> Meals, activity, medication, stress and sleep to help make sense of changing patterns.</li></ol>' },
    { name: 'Early sketches', html:
      '<p class="ab-kicker">03 · A closer look</p><h2>Where the screens started</h2>' +
      '<p>Three rough pencil sketches, shown as drawn, in the order I drew them.</p>' +
      '<div class="ab-row3"><figure><img src="' + R + 'glusight-sketch-1.webp" alt="Pencil sketch 1: reading with direction arrow, suggested actions and a graph"><figcaption>Sketch 1</figcaption></figure>' +
      '<figure><img src="' + R + 'glusight-sketch-2.webp" alt="Pencil sketch 2: low-glucose alert at night"><figcaption>Sketch 2</figcaption></figure>' +
      '<figure><img src="' + R + 'glusight-sketch-3.webp" alt="Pencil sketch 3: reading with an expected range ahead"><figcaption>Sketch 3</figcaption></figure></div>' },
    { name: 'Screens', html:
      '<p class="ab-kicker">03 · A closer look</p><h2>Home, Log Meal and Settings</h2>' +
      '<p>Concept screens with sample data. Recorded glucose is a solid line and the predicted continuation a dashed line, so what is measured stays separate from what is estimated.</p>' +
      '<div class="ab-row3"><figure><img src="' + R + 'glusight-screen-home.webp" alt="Home screen with reading, trend and prediction graph"><figcaption>Home</figcaption></figure>' +
      '<figure><img src="' + R + 'glusight-screen-log-meal.webp" alt="Log Meal screen with quick categories"><figcaption>Log Meal</figcaption></figure>' +
      '<figure><img src="' + R + 'glusight-screen-settings.webp" alt="Settings screen with health setup and alert controls"><figcaption>Settings</figcaption></figure></div>' },
    { name: 'Research', html:
      '<p class="ab-kicker">04 · Research & insights</p><h2>Type 1, Type 2 and Prediabetes</h2>' +
      '<p>Three consenting, anonymised interviews. A very small sample that shaped my thinking but does not validate the concept.</p>' +
      '<ol class="ab-list"><li>Highs cause stress, and worrying seems to make it worse.</li><li>Lows cause panic, especially outdoors.</li>' +
      '<li>Night checking varies.</li><li>Re-checking to see the direction.</li><li>Distrust of accuracy.</li></ol>' },
    { name: 'Next steps', html:
      '<p class="ab-kicker">05 · Future plans & reflection</p><h2>What comes next</h2>' +
      '<ol class="ab-list"><li>Testing whether people understand the predictions.</li><li>Communicating uncertainty.</li><li>Understanding context.</li>' +
      '<li>Evaluating the experience with usability research.</li><li>Recognising the limitations of predictions.</li></ol>' +
      '<p>The next step is to understand whether people can interpret these predictions clearly, trust them appropriately, and find them useful in everyday life.</p>' +
      '<button type="button" class="ab-cta" data-fos-action="kitchen">Read the full case study in the Kitchen &rarr;</button>' }
  ];

  // Desktop icons in Windows column order
  var DESKTOP = [
    { id: 'bin', label: 'Recycle Bin', icon: 'bin', open: function () { openExplorer('bin'); } },
    { id: 'glusight', label: 'GluSight Case Study.ai', icon: 'artfile', open: function () { openArtboard(); } },
    { id: 'cabin', label: 'Cabin in the Woods', icon: 'folder', folder: 'cabin', open: function () { openExplorer('cabin'); } },
    { id: 'product', label: 'Product Renders', icon: 'folder', folder: 'product', open: function () { openExplorer('product'); } },
    { id: 'biophilic', label: 'Biophilic Interior', icon: 'folder', folder: 'biophilic', open: function () { openExplorer('biophilic'); } },
    { id: 'posters', label: 'Poster Collection', icon: 'folder', folder: 'posters', open: function () { openExplorer('posters'); } },
    { id: 'about', label: 'About Me.txt', icon: 'txt', open: function () { openNotepad('About Me.txt', ABOUT_TXT); } }
  ];

  // ----------------------------------------------------------------- icons
  function svgIcon(kind) {
    switch (kind) {
      case 'folder':
      case 'folder-socials':
        return '<svg viewBox="0 0 48 40" aria-hidden="true"><defs><linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d97a"/><stop offset="1" stop-color="#e2a92f"/></linearGradient><linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe79c"/><stop offset="1" stop-color="#f1bb3c"/></linearGradient></defs>' +
          '<path d="M2 6a3 3 0 0 1 3-3h12l4 4h22a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="url(#fg1)"/>' +
          (kind === 'folder-socials' ? '<circle cx="24" cy="21" r="7" fill="#4c8fd6" opacity=".9"/><path d="M20 21h8M24 17v8" stroke="#fff" stroke-width="2"/>' : '') +
          '<path d="M2 14a3 3 0 0 1 3-3h38a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="url(#fg2)" opacity=".92"/><path d="M3 14.5h42" stroke="#fff6cf" stroke-width="1.2" opacity=".8"/></svg>';
      case 'artfile':
        return '<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M4 2h22l10 10v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="#9aa6b2"/><path d="M26 2v10h10" fill="#e4e9ef" stroke="#9aa6b2"/>' +
          '<rect x="7" y="17" width="26" height="22" rx="4" fill="#2b2140"/><path d="M14 33l6-12 6 12M16.5 29h7" stroke="#ff9a3d" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'txt':
        return '<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M4 2h22l10 10v32a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="#9aa6b2"/><path d="M26 2v10h10" fill="#e4e9ef" stroke="#9aa6b2"/><path d="M9 20h22M9 25h22M9 30h22M9 35h14" stroke="#7d8a99" stroke-width="1.6"/></svg>';
      case 'bin':
        return '<svg viewBox="0 0 40 48" aria-hidden="true"><defs><linearGradient id="bg1" x1="0" x2="1"><stop offset="0" stop-color="#cfe6f7" stop-opacity=".9"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".7"/><stop offset="1" stop-color="#a9cbe6" stop-opacity=".9"/></linearGradient></defs><path d="M6 10h28l-3 34a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3z" fill="url(#bg1)" stroke="#7aa0bf"/><ellipse cx="20" cy="10" rx="15" ry="4" fill="#e9f4fc" stroke="#7aa0bf"/><path d="M14 20l2 20M20 20v20M26 20l-2 20" stroke="#8fb3cf" stroke-width="1.4"/><path d="M15 14l4-3 3 4 4-2" stroke="#6d8fa8" fill="none"/></svg>';
      case 'image':
        return '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="5" width="36" height="30" rx="3" fill="#dfeaf5" stroke="#8aa1b8"/><circle cx="13" cy="15" r="4" fill="#f4c542"/><path d="M4 32l11-11 8 8 5-5 10 10" fill="#5f9e6e"/></svg>';
      case 'video':
        return '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="6" width="36" height="28" rx="3" fill="#2b3442"/><path d="M2 11h36M2 29h36" stroke="#55657a"/><path d="M16 14v12l10-6z" fill="#fff"/></svg>';
      case 'shortcut':
        return '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="3" y="3" width="34" height="34" rx="7" fill="#e9eef4" stroke="#9aa6b2"/><path d="M14 26l12-12M17 14h9v9" stroke="#2a6fb8" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>';
      case 'linkedin':
        return '<img src="../Media/LinkedinLogo.png" alt="">';
      case 'artstation':
        return '<img src="../Media/ArtstationLogo.jpg" alt="">';
      case 'instagram':
        return '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="ig1" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#f9a43a"/><stop offset=".5" stop-color="#e1306c"/><stop offset="1" stop-color="#7b3fe4"/></linearGradient></defs><rect x="3" y="3" width="34" height="34" rx="10" fill="url(#ig1)"/><rect x="10" y="10" width="20" height="20" rx="6" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="20" cy="20" r="4.6" fill="none" stroke="#fff" stroke-width="2.4"/><circle cx="26.5" cy="13.5" r="1.5" fill="#fff"/></svg>';
      case 'github':
        return '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="#ffffff" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';
      case 'email':
        return '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="3" y="7" width="34" height="26" rx="4" fill="#fff" stroke="#8aa1b8"/><path d="M4 9l16 13L36 9" stroke="#2a6fb8" stroke-width="2.2" fill="none"/></svg>';
      case 'house':
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5M6 10v9h12v-9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'power':
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v8M6.3 7.3a8 8 0 1 0 11.4 0" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
      case 'sound-on':
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
      case 'sound-off':
        return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    }
    return '';
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, cls, parent, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }

  // ----------------------------------------------------------------- sound
  var soundOn = false;
  try { soundOn = localStorage.getItem('fosSound') === '1'; } catch (e) {}
  var actx = null;
  function sound(kind) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      var f = { click: [880, 660], open: [520, 880], close: [700, 380], boot: [392, 784] }[kind] || [600, 600];
      var d = kind === 'boot' ? 0.5 : kind === 'click' ? 0.05 : 0.14;
      o.type = 'sine'; o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(kind === 'click' ? 0.05 : 0.08, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
    } catch (e) {}
  }

  // ----------------------------------------------------------------- shell
  // Look: 'w10' (flat, default) or 'w7' (Aero glass). Preview the older look with ?os=7 in the address.
  var THEME = 'w10';
  try { if (/(^|[?&])os=7(&|$)/.test(window.location.search)) THEME = 'w7'; } catch (e) {}
  viewport.classList.add('fos-active');
  var root = el('div', 'fos fos-' + THEME, viewport);
  root.id = 'fos';
  root.setAttribute('role', 'application');
  root.setAttribute('aria-label', 'Freedom OS desktop: Harsh Pal projects');

  el('div', 'fos-wallpaper', root);
  var desk = el('div', 'fos-desktop', root);
  desk.setAttribute('role', 'list');
  desk.setAttribute('aria-label', 'Desktop');
  var winLayer = el('div', 'fos-windows', root);
  var startMenu = el('div', 'fos-start', root);
  startMenu.hidden = true;
  startMenu.setAttribute('role', 'dialog');
  startMenu.setAttribute('aria-label', 'Start menu');
  var bar = el('div', 'fos-taskbar', root);
  var live = el('div', 'fos-sr', root);
  live.setAttribute('aria-live', 'polite');

  // Desktop icons
  var iconBtns = [];
  DESKTOP.forEach(function (d) {
    var b = el('button', 'fos-icon', desk);
    b.type = 'button';
    b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', d.label + ' (open)');
    var art = el('span', 'fos-icon-art fos-ic-' + d.icon, b, svgIcon(d.icon));
    if (d.folder) {
      // Aero folders show a peek of what is inside
      var f = FOLDERS[d.folder];
      var peek = el('span', 'fos-peek', art);
      f.items.slice(0, 2).forEach(function (it) { var i = el('img', '', peek); i.src = R + it[0]; i.alt = ''; i.loading = 'lazy'; });
      art.appendChild(art.querySelector('svg')); // svg front layer over the peek
    }
    el('span', 'fos-icon-label', b, esc(d.label));
    b.addEventListener('click', function () {
      if (mqPhone.matches || b.classList.contains('is-selected')) { sound('click'); d.open(b); return; }
      iconBtns.forEach(function (x) { x.classList.remove('is-selected'); });
      b.classList.add('is-selected'); sound('click');
    });
    b.addEventListener('dblclick', function (e) { e.preventDefault(); d.open(b); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); d.open(b); }
      var i = iconBtns.indexOf(b), rows = iconRows();
      var map = { ArrowDown: 1, ArrowUp: -1, ArrowRight: rows, ArrowLeft: -rows };
      if (map[e.key] != null) {
        e.preventDefault();
        var n = iconBtns[i + map[e.key]];
        if (n) n.focus();
      }
    });
    b._fos = d;
    iconBtns.push(b);
  });
  function iconRows() {
    var t = iconBtns.map(function (b) { return b.offsetLeft; });
    var c = 0; for (var i = 0; i < t.length && t[i] === t[0]; i++) c++;
    return Math.max(1, c);
  }
  desk.addEventListener('click', function (e) {
    if (e.target === desk) iconBtns.forEach(function (x) { x.classList.remove('is-selected'); });
    closeStart();
  });

  // Taskbar
  var startBtn = el('button', 'fos-startbtn', bar, '<span class="fos-orb">' + svgIcon('house') + '</span><span class="fos-sr">Start</span>');
  startBtn.type = 'button';
  startBtn.setAttribute('aria-haspopup', 'dialog');
  startBtn.setAttribute('aria-expanded', 'false');
  var tbSearch = el('button', 'fos-tbsearch', bar, '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15 15l6 6" stroke="currentColor" stroke-width="1.8"/></svg><span>Search projects</span>');
  tbSearch.type = 'button';
  tbSearch.addEventListener('click', function (e) { e.stopPropagation(); startMenu.hidden ? openStart() : closeStart(); });
  var tasks = el('div', 'fos-tasks', bar);
  tasks.setAttribute('role', 'toolbar');
  tasks.setAttribute('aria-label', 'Open windows');
  var tray = el('div', 'fos-tray', bar);
  var soundBtn = el('button', 'fos-trayicon fos-sound', tray);
  soundBtn.type = 'button';
  function paintSound() {
    soundBtn.innerHTML = svgIcon(soundOn ? 'sound-on' : 'sound-off');
    soundBtn.setAttribute('aria-label', soundOn ? 'Sound on. Turn sounds off' : 'Sound off. Turn sounds on');
    soundBtn.title = soundOn ? 'Sounds on' : 'Sounds off';
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
  }
  paintSound();
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn; paintSound();
    try { localStorage.setItem('fosSound', soundOn ? '1' : '0'); } catch (e) {}
    sound('click');
  });
  var clock = el('div', 'fos-clock', tray);
  clock.setAttribute('aria-hidden', 'true');
  function tick() {
    var d = new Date();
    clock.innerHTML = '<span>' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '</span><span>' + d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + '</span>';
  }
  tick(); setInterval(tick, 15000);
  var showDesk = el('button', 'fos-showdesk', bar);
  showDesk.type = 'button';
  showDesk.setAttribute('aria-label', 'Show desktop');
  showDesk.title = 'Show desktop';
  showDesk.addEventListener('click', function () {
    var anyOpen = wins.some(function (w) { return !w.min; });
    wins.forEach(function (w) { anyOpen ? minimize(w) : restore(w); });
  });

  // Start menu
  function buildStart() {
    if (THEME === 'w10') return buildStart10();
    startMenu.innerHTML = '';
    var left = el('div', 'fos-start-left', startMenu);
    var search = el('input', 'fos-start-search', left);
    search.type = 'search'; search.placeholder = 'Search projects'; search.setAttribute('aria-label', 'Search projects');
    var list = el('ul', 'fos-start-list', left);
    var entries = [
      ['GluSight case study', 'artfile', openArtboard],
      ['Cabin in the Woods', 'folder', function () { openExplorer('cabin'); }],
      ['Product Renders', 'folder', function () { openExplorer('product'); }],
      ['Biophilic Interior', 'folder', function () { openExplorer('biophilic'); }],
      ['Poster Collection', 'folder', function () { openExplorer('posters'); }],
      ['About Me', 'txt', function () { openNotepad('About Me.txt', ABOUT_TXT); }]
    ];
    entries.forEach(function (en) {
      var li = el('li', '', list);
      var b = el('button', 'fos-start-item', li, '<span class="fos-mini">' + svgIcon(en[1]) + '</span><span>' + esc(en[0]) + '</span>');
      b.type = 'button';
      b.addEventListener('click', function () { closeStart(); en[2](); });
    });
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      [].forEach.call(list.children, function (li) { li.hidden = q && li.textContent.toLowerCase().indexOf(q) < 0; });
    });
    var right = el('div', 'fos-start-right', startMenu);
    el('div', 'fos-start-user', right, '<span class="fos-avatar">H</span><span>Harsh Pal</span>');
    Object.keys(LINKS).forEach(function (k) {
      var a = el('a', 'fos-start-link', right, '<span class="fos-mini">' + svgIcon(LINKS[k].icon) + '</span><span>' + esc(LINKS[k].label) + '</span>');
      a.href = LINKS[k].url;
      if (k !== 'email') { a.target = '_blank'; a.rel = 'noopener'; }
    });
    var home = el('button', 'fos-start-link fos-start-home', right, '<span class="fos-mini fos-glyph">' + svgIcon('house') + '</span><span>Back to the house</span>');
    home.type = 'button';
    home.addEventListener('click', leave);
    var sd = el('button', 'fos-shutdown', right, svgIcon('power') + '<span>Shut down</span>');
    sd.type = 'button';
    sd.addEventListener('click', shutdown);
  }
  // Windows 10 style Start: icon rail, app list, picture tiles
  function buildStart10() {
    startMenu.innerHTML = '';
    var rail = el('div', 'fos10-rail', startMenu);
    var railItems = [
      ['<span class="fos-avatar">H</span>', 'About Me', function () { openNotepad('About Me.txt', ABOUT_TXT); }],
      [svgIcon('power'), 'Shut down', shutdown]
    ];
    railItems.forEach(function (r, i) {
      var b = el('button', 'fos10-railbtn' + (i === 0 ? ' is-user' : ''), rail, r[0] + '<span class="fos10-tip">' + esc(r[1]) + '</span>');
      b.type = 'button'; b.setAttribute('aria-label', r[1]);
      b.addEventListener('click', function () { closeStart(); r[2](); });
    });
    var apps = el('div', 'fos10-apps', startMenu);
    var search = el('input', 'fos-start-search', apps);
    search.type = 'search'; search.placeholder = 'Type here to search'; search.setAttribute('aria-label', 'Search projects');
    var list = el('ul', 'fos-start-list', apps);
    var groups = [
      ['Projects', [
        ['GluSight case study', 'artfile', openArtboard],
        ['Cabin in the Woods', 'folder', function () { openExplorer('cabin'); }],
        ['Product Renders', 'folder', function () { openExplorer('product'); }],
        ['Biophilic Interior', 'folder', function () { openExplorer('biophilic'); }],
        ['Poster Collection', 'folder', function () { openExplorer('posters'); }]
      ]],
      ['Socials', Object.keys(LINKS).map(function (k) { return [LINKS[k].label, LINKS[k].icon, null, LINKS[k].url, k]; })]
    ];
    groups.forEach(function (g) {
      el('li', 'fos10-group', list, esc(g[0]));
      g[1].forEach(function (en) {
        var li = el('li', '', list);
        var b;
        if (en[3]) {
          b = el('a', 'fos-start-item', li, '<span class="fos-mini">' + svgIcon(en[1]) + '</span><span>' + esc(en[0]) + '</span>');
          b.href = en[3]; if (en[4] !== 'email') { b.target = '_blank'; b.rel = 'noopener'; }
        } else {
          b = el('button', 'fos-start-item', li, '<span class="fos-mini">' + svgIcon(en[1]) + '</span><span>' + esc(en[0]) + '</span>');
          b.type = 'button';
          b.addEventListener('click', function () { closeStart(); en[2](); });
        }
      });
    });
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      [].forEach.call(list.children, function (li) { li.hidden = !!q && (li.classList.contains('fos10-group') || li.textContent.toLowerCase().indexOf(q) < 0); });
    });
    var tiles = el('div', 'fos10-tiles', startMenu);
    el('div', 'fos10-tilehead', tiles, 'Projects');
    var grid = el('div', 'fos10-grid', tiles);
    [['GluSight', 'glusight-ref-01-hero-phone.webp', openArtboard, 'wide'],
     ['Cabin in the Woods', 'cabin-cabin-hero.webp', function () { openExplorer('cabin'); }],
     ['Product Renders', 'product-renders-harsh-pal-finalrender.webp', function () { openExplorer('product'); }],
     ['Biophilic Interior', 'biophilic-environment-img.webp', function () { openExplorer('biophilic'); }],
     ['Posters', 'posters-poster-4somnium4.webp', function () { openExplorer('posters'); }]
    ].forEach(function (t) {
      var b = el('button', 'fos10-tile' + (t[3] ? ' is-wide' : ''), grid, '<img src="' + R + t[1] + '" alt="" loading="lazy"><span>' + esc(t[0]) + '</span>');
      b.type = 'button';
      b.addEventListener('click', function () { closeStart(); t[2](); });
    });
    el('div', 'fos10-tilehead', tiles, 'Socials');
    var sg = el('div', 'fos10-sgrid', tiles);
    Object.keys(LINKS).forEach(function (k) {
      var a = el('a', 'fos10-stile', sg, svgIcon(LINKS[k].icon) + '<span class="fos-sr">' + esc(LINKS[k].label) + '</span>');
      a.href = LINKS[k].url; a.title = LINKS[k].label;
      if (k !== 'email') { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }
  buildStart();
  function openStart() {
    startMenu.hidden = false; startBtn.setAttribute('aria-expanded', 'true'); startBtn.classList.add('is-on');
    var s = startMenu.querySelector('.fos-start-search'); if (s && !mqPhone.matches) s.focus();
    sound('click');
  }
  function closeStart() {
    if (startMenu.hidden) return;
    startMenu.hidden = true; startBtn.setAttribute('aria-expanded', 'false'); startBtn.classList.remove('is-on');
  }
  startBtn.addEventListener('click', function (e) { e.stopPropagation(); startMenu.hidden ? openStart() : closeStart(); });
  // Clicks inside the OS never reach the room's "click outside the monitor = leave" handler.
  // (A button that re-renders its own window is detached by the time the click bubbles up,
  // so that handler could not tell it came from inside the screen.)
  root.addEventListener('click', function (e) { e.stopPropagation(); });
  root.addEventListener('pointerdown', function (e) {
    if (!startMenu.hidden && !startMenu.contains(e.target) && !startBtn.contains(e.target)) closeStart();
  });

  // ----------------------------------------------------------------- windows
  var wins = [], zTop = 10, cascade = 0;

  function makeWindow(opts) {
    // Reuse an open window with the same key
    var existing = wins.filter(function (w) { return w.key === opts.key; })[0];
    if (existing) { restore(existing); focusWin(existing); return existing; }

    var w = { key: opts.key, title: opts.title, icon: opts.icon, min: false, max: false };
    var node = el('section', 'fos-win ' + (opts.cls || ''), winLayer);
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-label', opts.title);
    node.tabIndex = -1;
    var tb = el('header', 'fos-titlebar', node);
    el('span', 'fos-title-ic', tb, svgIcon(opts.icon));
    el('span', 'fos-title', tb, esc(opts.title));
    var ctr = el('div', 'fos-caption', tb);
    var bMin = el('button', 'fos-cap fos-cap-min', ctr, '<span aria-hidden="true"></span>'); bMin.type = 'button'; bMin.setAttribute('aria-label', 'Minimise ' + opts.title);
    var bMax = el('button', 'fos-cap fos-cap-max', ctr, '<span aria-hidden="true"></span>'); bMax.type = 'button'; bMax.setAttribute('aria-label', 'Maximise ' + opts.title);
    var bClose = el('button', 'fos-cap fos-cap-close', ctr, '<span aria-hidden="true"></span>'); bClose.type = 'button'; bClose.setAttribute('aria-label', 'Close ' + opts.title);
    var body = el('div', 'fos-body', node);
    var grip = el('span', 'fos-grip', node);
    grip.setAttribute('aria-hidden', 'true');
    w.node = node; w.body = body; w.titleEl = tb.querySelector('.fos-title');

    // Size + cascade position inside the desktop area
    var area = winLayer.getBoundingClientRect();
    var ww = Math.min(opts.w || 0.72 * area.width, area.width - 24);
    var wh = Math.min(opts.h || 0.8 * area.height, area.height - 16);
    var x = Math.max(8, (area.width - ww) / 2 - 60 + (cascade % 5) * 28);
    var y = Math.max(6, (area.height - wh) / 2 - 30 + (cascade % 5) * 24);
    cascade++;
    setRect(w, x, y, ww, wh);

    // Taskbar button
    var tbtn = el('button', 'fos-task', tasks, '<span class="fos-mini">' + svgIcon(opts.icon) + '</span><span class="fos-task-label">' + esc(opts.title) + '</span>');
    tbtn.type = 'button';
    tbtn.title = opts.title;
    tbtn.addEventListener('click', function () {
      if (w.min) { restore(w); focusWin(w); }
      else if (node.classList.contains('is-active')) minimize(w);
      else focusWin(w);
    });
    w.task = tbtn;

    bMin.addEventListener('click', function (e) { e.stopPropagation(); minimize(w); });
    bMax.addEventListener('click', function (e) { e.stopPropagation(); toggleMax(w); });
    bClose.addEventListener('click', function (e) { e.stopPropagation(); closeWin(w); });
    tb.addEventListener('dblclick', function (e) { if (!e.target.closest('.fos-cap')) toggleMax(w); });
    node.addEventListener('pointerdown', function () { focusWin(w); }, true);
    dragify(w, tb);
    resizify(w, grip);

    wins.push(w);
    if (mqPhone.matches) { w.max = true; node.classList.add('is-max'); wins.forEach(function (o) { if (o !== w && !o.min) minimize(o, true); }); }

    // Open from where it was launched
    if (!reduceMotion && opts.from) {
      var fr = opts.from.getBoundingClientRect(), nr = node.getBoundingClientRect();
      node.style.transformOrigin = (fr.left + fr.width / 2 - nr.left) + 'px ' + (fr.top + fr.height / 2 - nr.top) + 'px';
      node.classList.add('is-opening');
      requestAnimationFrame(function () { requestAnimationFrame(function () { node.classList.remove('is-opening'); }); });
    }
    focusWin(w);
    sound('open');
    live.textContent = opts.title + ' opened';
    return w;
  }

  function setRect(w, x, y, ww, wh) {
    w.x = x; w.y = y; w.w = ww; w.h = wh;
    var s = w.node.style;
    s.left = x + 'px'; s.top = y + 'px'; s.width = ww + 'px'; s.height = wh + 'px';
  }
  function focusWin(w) {
    wins.forEach(function (o) { o.node.classList.toggle('is-active', o === w); o.task.classList.toggle('is-active', o === w); });
    w.node.style.zIndex = ++zTop;
    closeStart();
    if (document.activeElement && !w.node.contains(document.activeElement)) { try { w.node.focus({ preventScroll: true }); } catch (e) { w.node.focus(); } }
  }
  function topWin() {
    var vis = wins.filter(function (o) { return !o.min; });
    vis.sort(function (a, b) { return (+b.node.style.zIndex) - (+a.node.style.zIndex); });
    return vis[0];
  }
  function minimize(w, quiet) {
    if (w.min) return;
    w.min = true;
    var tr = w.task.getBoundingClientRect(), nr = w.node.getBoundingClientRect();
    w.node.style.transformOrigin = (tr.left + tr.width / 2 - nr.left) + 'px ' + (tr.bottom - nr.top) + 'px';
    w.node.classList.add('is-min');
    w.node.classList.remove('is-active'); w.task.classList.remove('is-active');
    if (!quiet) { sound('close'); var t = topWin(); if (t) focusWin(t); }
  }
  function restore(w) {
    if (!w.min) return;
    w.min = false;
    w.node.classList.remove('is-min');
    if (mqPhone.matches) wins.forEach(function (o) { if (o !== w && !o.min) minimize(o, true); });
    sound('open');
  }
  function toggleMax(w) {
    if (mqPhone.matches) return;
    w.max = !w.max;
    w.node.classList.toggle('is-max', w.max);
    w.node.querySelector('.fos-cap-max').setAttribute('aria-label', (w.max ? 'Restore ' : 'Maximise ') + w.title);
    sound('click');
  }
  function closeWin(w) {
    var i = wins.indexOf(w); if (i < 0) return;
    wins.splice(i, 1);
    if (w.onClose) w.onClose();
    w.task.remove();
    if (reduceMotion) w.node.remove();
    else { w.node.classList.add('is-closing'); setTimeout(function () { w.node.remove(); }, 180); }
    sound('close');
    live.textContent = w.title + ' closed';
    var t = topWin(); if (t) focusWin(t);
    else { var ic = iconBtns.filter(function (b) { return b.classList.contains('is-selected'); })[0] || iconBtns[0]; if (ic) ic.focus({ preventScroll: true }); }
  }
  function dragify(w, handle) {
    handle.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('.fos-cap') || w.max || mqPhone.matches) return;
      var sx = e.clientX, sy = e.clientY, ox = w.x, oy = w.y;
      var area = winLayer.getBoundingClientRect();
      handle.setPointerCapture(e.pointerId);
      w.node.classList.add('is-dragging');
      function mv(ev) {
        var nx = Math.min(Math.max(ox + ev.clientX - sx, 60 - w.w), area.width - 60);
        var ny = Math.min(Math.max(oy + ev.clientY - sy, 0), area.height - 30);
        setRect(w, nx, ny, w.w, w.h);
      }
      function up() { handle.removeEventListener('pointermove', mv); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', up); w.node.classList.remove('is-dragging'); }
      handle.addEventListener('pointermove', mv); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
    });
  }
  function resizify(w, grip) {
    grip.addEventListener('pointerdown', function (e) {
      if (w.max || mqPhone.matches) return;
      e.preventDefault();
      var sx = e.clientX, sy = e.clientY, ow = w.w, oh = w.h;
      grip.setPointerCapture(e.pointerId);
      function mv(ev) { setRect(w, w.x, w.y, Math.max(320, ow + ev.clientX - sx), Math.max(220, oh + ev.clientY - sy)); }
      function up() { grip.removeEventListener('pointermove', mv); grip.removeEventListener('pointerup', up); }
      grip.addEventListener('pointermove', mv); grip.addEventListener('pointerup', up);
    });
  }

  function iconFor(key) { return iconBtns.filter(function (b) { return b._fos.id === key; })[0]; }

  // ----------------------------------------------------------------- explorer
  // Desktop folders open a window; the folder list inside a window switches that same window.
  function openExplorer(key) {
    var w = makeWindow({ key: 'ex-' + key, title: folderTitle(key), icon: key === 'bin' ? 'bin' : 'folder', cls: 'fos-explorer', from: iconFor(key) });
    if (!w.built) { w.built = true; renderExplorer(w, key); }
  }
  function folderTitle(key) { return key === 'bin' ? 'Recycle Bin' : FOLDERS[key].title; }
  function renderExplorer(w, key) {
    var f = FOLDERS[key], isBin = key === 'bin';
    var title = folderTitle(key);
    w.key = 'ex-' + key; w.title = title;
    w.titleEl.textContent = title;
    w.node.setAttribute('aria-label', title);
    w.task.title = title;
    w.task.querySelector('.fos-task-label').textContent = title;
    w.task.querySelector('.fos-mini').innerHTML = svgIcon(isBin ? 'bin' : 'folder');
    w.node.querySelector('.fos-title-ic').innerHTML = svgIcon(isBin ? 'bin' : 'folder');
    var b = w.body;
    b.innerHTML = '';
    var bar1 = el('div', 'fos-ex-bar', b);
    el('div', 'fos-ex-path', bar1, '<span>Freedom</span><span class="fos-sep">&rsaquo;</span><span>Desktop</span><span class="fos-sep">&rsaquo;</span><span>' + esc(title) + '</span>');
    var wrap = el('div', 'fos-ex-wrap', b);
    var nav = el('nav', 'fos-ex-nav', wrap);
    nav.setAttribute('aria-label', 'Folders');
    el('div', 'fos-ex-navhead', nav, 'Desktop');
    ['cabin', 'product', 'biophilic', 'posters'].forEach(function (k) {
      var nb = el('button', 'fos-ex-navitem' + (k === key ? ' is-on' : ''), nav, '<span class="fos-mini">' + svgIcon('folder') + '</span><span>' + esc(FOLDERS[k].title) + '</span>');
      nb.type = 'button';
      if (k === key) nb.setAttribute('aria-current', 'page');
      nb.addEventListener('click', function () { if (k !== key) { sound('click'); renderExplorer(w, k); } });
    });
    var main = el('div', 'fos-ex-main', wrap);
    var count = 0;
    if (f) {
      var head = el('div', 'fos-ex-head', main);
      el('h2', '', head, esc(f.title));
      el('p', 'fos-ex-meta', head, esc(f.meta));
      el('p', 'fos-ex-text', head, esc(f.text));
    }
    var grid = el('div', 'fos-ex-grid', main);
    grid.setAttribute('role', 'list');
    function tile(iconHtml, name, onOpen, isThumb) {
      var t = el('button', 'fos-tile' + (isThumb ? ' is-thumb' : ''), grid);
      t.type = 'button';
      t.setAttribute('role', 'listitem');
      el('span', 'fos-tile-art', t, iconHtml);
      el('span', 'fos-tile-name', t, esc(name));
      t.addEventListener('click', function () {
        if (mqPhone.matches || t.classList.contains('is-selected')) { onOpen(t); return; }
        [].forEach.call(grid.children, function (x) { x.classList.remove('is-selected'); });
        t.classList.add('is-selected'); sound('click');
      });
      t.addEventListener('dblclick', function (e) { e.preventDefault(); onOpen(t); });
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); onOpen(t); } });
      count++;
      return t;
    }
    if (f) {
      f.items.forEach(function (it, i) {
        tile('<img src="' + R + it[0] + '" alt="" loading="lazy">', it[1] + '.jpg', function (t) { openViewer(key, i, t); }, true);
      });
      if (f.video) tile(svgIcon('video'), f.video.name, function (t) { openVideo(f.video, t); });
    } else if (isBin) {
      el('p', 'fos-ex-empty', main, 'This folder is empty.');
    }
    el('div', 'fos-ex-status', b, count + (count === 1 ? ' item' : ' items'));
    main.scrollTop = 0;
  }

  // ----------------------------------------------------------------- image viewer (Artboard Studio)
  // Images open in the design-app window: whole image fitted on a black canvas,
  // so tall posters get black bars at the sides and wide renders fill the frame.
  function openViewer(key, index, from) {
    var f = FOLDERS[key];
    var w = makeWindow({ key: 'iv-' + key, title: f.items[index][1] + '.jpg · Artboard Studio', icon: 'artfile', cls: 'fos-art fos-imgview', from: from });
    if (!w.built) {
      w.built = true;
      var b = w.body;
      el('div', 'fos-art-menu', b, '<span>File</span><span>Edit</span><span>Object</span><span>Type</span><span>Select</span><span>View</span><span>Window</span><span>Help</span>');
      var wrap = el('div', 'fos-art-wrap', b);
      artTools(wrap);
      w.stage = el('div', 'fos-iv-stage', wrap);
      w.img = el('img', 'fos-iv-img', w.stage);
      var panel = el('aside', 'fos-art-panel', wrap);
      el('div', 'fos-art-panelhead', panel, 'Artboards');
      w.rows = f.items.map(function (it, i) {
        var r = el('button', 'fos-art-row', panel, '<span class="fos-art-num">' + (i + 1) + '</span><span>' + esc(it[1]) + '</span>');
        r.type = 'button';
        r.addEventListener('click', function () { show(i); });
        return r;
      });
      el('div', 'fos-art-panelhead', panel, 'Properties');
      w.prop = el('div', 'fos-art-prop', panel);
      var status = el('div', 'fos-art-status fos-iv-status', b);
      w.prev = el('button', 'fos-iv-btn', status, '&lsaquo;<span class="fos-sr"> Previous image</span>'); w.prev.type = 'button';
      w.count = el('span', 'fos-iv-count', status);
      w.next = el('button', 'fos-iv-btn', status, '&rsaquo;<span class="fos-sr"> Next image</span>'); w.next.type = 'button';
      w.zoom = el('button', 'fos-iv-btn fos-iv-zoom', status, 'Fit'); w.zoom.type = 'button';
      w.prev.addEventListener('click', function () { show(w.i - 1); });
      w.next.addEventListener('click', function () { show(w.i + 1); });
      w.zoom.addEventListener('click', function () {
        var z = w.stage.classList.toggle('is-zoom');
        w.zoom.textContent = z ? '100%' : 'Fit';
        w.zoom.setAttribute('aria-pressed', z ? 'true' : 'false');
      });
      w.stage.addEventListener('dblclick', function () { w.zoom.click(); });
      // Landscape images: size the window to the image so there are no bars.
      // Portrait images keep the window and sit on black bars.
      w.img.addEventListener('load', function () { fitLandscape(w); });
      w.node.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(w.i - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(w.i + 1); }
      });
    }
    function show(i) {
      var n = f.items.length; w.i = (i + n) % n;
      var it = f.items[w.i];
      w.stage.classList.remove('is-zoom'); w.zoom.textContent = 'Fit';
      w.stage.scrollTop = 0; w.stage.scrollLeft = 0;
      w.img.src = R + it[0]; w.img.alt = it[1];
      w.prop.innerHTML = '<b>' + esc(it[1]) + '</b><span>' + esc(it[2]) + '</span>';
      w.rows.forEach(function (r, k) { r.classList.toggle('is-on', k === w.i); });
      // keep the current row visible without scrolling anything outside the panel
      var row = w.rows[w.i], pan = row.parentNode;
      if (row.offsetTop < pan.scrollTop) pan.scrollTop = row.offsetTop;
      else if (row.offsetTop + row.offsetHeight > pan.scrollTop + pan.clientHeight) pan.scrollTop = row.offsetTop + row.offsetHeight - pan.clientHeight;
      w.count.textContent = 'Artboard ' + (w.i + 1) + ' of ' + n;
      w.title = it[1] + '.jpg · Artboard Studio';
      w.titleEl.textContent = w.title;
      w.task.title = w.title;
      w.task.querySelector('.fos-task-label').textContent = w.title;
    }
    show(index);
  }

  function fitLandscape(w) {
    var img = w.img;
    if (!img.naturalWidth || w.max || w.min || mqPhone.matches) return;
    var ar = img.naturalWidth / img.naturalHeight;
    if (ar < 1) return;
    var s = w.stage.getBoundingClientRect();
    if (!s.width || !s.height) return;
    var area = winLayer.getBoundingClientRect();
    var chromeH = w.h - s.height, chromeW = w.w - s.width;
    var maxH = area.height - 12, maxW = area.width - 16;
    var sw = s.width, sh = sw / ar;
    if (sh + chromeH > maxH) { sh = maxH - chromeH; sw = sh * ar; }
    if (sw + chromeW > maxW) { sw = maxW - chromeW; sh = sw / ar; }
    var nw = Math.round(sw + chromeW), nh = Math.round(sh + chromeH);
    var x = Math.min(w.x, area.width - nw - 8), y = Math.min(w.y, area.height - nh - 6);
    setRect(w, Math.max(8, x), Math.max(6, y), nw, nh);
  }

  function artTools(wrap) {
    var tools = el('div', 'fos-art-tools', wrap);
    tools.setAttribute('aria-hidden', 'true');
    ['M6 3l12 9-5 1 3 7-2 1-3-7-4 4z', 'M4 20L20 4M8 4h12v12', 'M5 19c3-8 7-12 14-14-2 7-6 11-14 14zM5 19l4-4', 'M6 5h12M12 5v14M9 19h6', 'M4 6h16v12H4z', 'M8 13V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v8c0 4-3 7-6 7s-5-2-7-5l-1.5-3a1.5 1.5 0 0 1 2.5-1.5z', 'M10 10m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M15 15l6 6']
      .forEach(function (d, i) { el('span', 'fos-art-tool' + (i === 5 ? ' is-on' : ''), tools, '<svg viewBox="0 0 24 24"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>'); });
    return tools;
  }

  // ----------------------------------------------------------------- video
  function openVideo(v, from) {
    var w = makeWindow({ key: 'vid-' + v.src, title: v.name + ' · Media Player', icon: 'video', cls: 'fos-player', from: from });
    if (w.built) return;
    w.built = true;
    var vid = el('video', 'fos-video', w.body);
    vid.controls = true; vid.preload = 'metadata'; vid.playsInline = true;
    vid.src = v.src;
    w.onClose = function () { try { vid.pause(); vid.removeAttribute('src'); vid.load(); } catch (e) {} };
    try { vid.play().catch(function () {}); } catch (e) {}
  }

  // ----------------------------------------------------------------- notepad
  function openNotepad(name, text, from) {
    var w = makeWindow({ key: 'np-' + name, title: name + ' · Notepad', icon: 'txt', cls: 'fos-notepad', from: from || iconFor('about'), w: 640, h: 440 });
    if (w.built) return;
    w.built = true;
    el('div', 'fos-np-menu', w.body, '<span>File</span><span>Edit</span><span>Format</span><span>View</span><span>Help</span>');
    var ta = el('textarea', 'fos-np-text', w.body);
    ta.readOnly = true; ta.value = text; ta.setAttribute('aria-label', name);
    ta.spellcheck = false;
  }

  // ----------------------------------------------------------------- artboard app
  function openArtboard() {
    var w = makeWindow({ key: 'art', title: 'GluSight_CaseStudy.ai · Artboard Studio', icon: 'artfile', cls: 'fos-art', from: iconFor('glusight') });
    if (w.built) return;
    w.built = true;
    var b = w.body;
    el('div', 'fos-art-menu', b, '<span>File</span><span>Edit</span><span>Object</span><span>Type</span><span>Select</span><span>View</span><span>Window</span><span>Help</span>');
    var wrap = el('div', 'fos-art-wrap', b);
    artTools(wrap);
    var canvas = el('div', 'fos-art-canvas', wrap);
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', 'GluSight case study artboards');
    var boards = ARTBOARDS.map(function (a, i) {
      var bo = el('article', 'fos-artboard', canvas);
      el('span', 'fos-art-boardname', bo, (i + 1) + ' · ' + esc(a.name));
      el('div', 'fos-art-page', bo, a.html);
      return bo;
    });
    var panel = el('aside', 'fos-art-panel', wrap);
    el('div', 'fos-art-panelhead', panel, 'Artboards');
    var picker = el('select', 'fos-art-picker', b);
    picker.setAttribute('aria-label', 'Go to artboard');
    var rows = ARTBOARDS.map(function (a, i) {
      var r = el('button', 'fos-art-row', panel, '<span class="fos-art-num">' + (i + 1) + '</span><span>' + esc(a.name) + '</span>');
      r.type = 'button';
      r.addEventListener('click', function () { go(i); });
      var op = el('option', '', picker, (i + 1) + ' · ' + esc(a.name)); op.value = i;
      return r;
    });
    picker.addEventListener('change', function () { go(+picker.value); });
    el('div', 'fos-art-panelhead', panel, 'Properties');
    el('p', 'fos-art-prop', panel, 'Concept · not clinically validated');
    var kb = el('button', 'fos-art-kitchen', panel, 'Open full case study'); kb.type = 'button';
    kb.addEventListener('click', toKitchen);
    var status = el('div', 'fos-art-status', b);
    function go(i) {
      var t = boards[i].offsetTop - 16;
      try { canvas.scrollTo({ top: t, behavior: reduceMotion ? 'auto' : 'smooth' }); } catch (e) { canvas.scrollTop = t; }
    }
    function spy() {
      var cur = 0;
      boards.forEach(function (bo, i) { if (bo.offsetTop - canvas.scrollTop <= canvas.clientHeight * 0.4) cur = i; });
      rows.forEach(function (r, i) { r.classList.toggle('is-on', i === cur); });
      picker.value = cur;
      status.textContent = '100%   ·   Artboard ' + (cur + 1) + ' of ' + boards.length;
    }
    canvas.addEventListener('scroll', spy, { passive: true });
    spy();
    b.addEventListener('click', function (e) { if (e.target.closest('[data-fos-action="kitchen"]')) toKitchen(); });
  }

  function toKitchen() {
    var a = document.getElementById('bedroom-to-kitchen-blog-btn');
    if (a) a.click(); else window.location.href = '../index.html#blog';
  }

  // ----------------------------------------------------------------- leaving
  function leave() {
    closeStart();
    var r = document.getElementById('nav-return-btn');
    if (r) r.click();
  }
  function shutdown() {
    closeStart();
    sound('close');
    root.classList.add('is-shutting');
    setTimeout(leave, reduceMotion ? 0 : 650);
  }

  // Escape closes the start menu or the front window first; only an empty desktop lets it exit.
  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    if (mqPhone.matches) return;
    if (!startMenu.hidden) { closeStart(); startBtn.focus(); e.stopImmediatePropagation(); return; }
    var t = topWin();
    if (t) { e.stopImmediatePropagation(); e.preventDefault(); closeWin(t); }
  }, true);

  // Keep windows inside the screen when the page is resized
  window.addEventListener('resize', function () {
    var area = winLayer.getBoundingClientRect();
    wins.forEach(function (w) {
      if (mqPhone.matches) { w.max = true; w.node.classList.add('is-max'); return; }
      setRect(w, Math.min(w.x, Math.max(0, area.width - 80)), Math.min(w.y, Math.max(0, area.height - 40)), Math.min(w.w, area.width), Math.min(w.h, area.height));
    });
  });

  // ----------------------------------------------------------------- boot
  var booted = false;
  try { booted = sessionStorage.getItem('fosBooted') === '1'; } catch (e) {}
  if (!booted && !reduceMotion && !mqPhone.matches) {
    var boot = el('div', 'fos-boot', root, '<div class="fos-boot-inner"><span class="fos-boot-spin" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="fos-boot-name">Freedom OS</span><span class="fos-boot-sub">Starting&hellip;</span></div>');
    var begin = function () {
      sound('boot');
      setTimeout(function () { boot.classList.add('is-done'); setTimeout(function () { boot.remove(); }, 450); }, 1100);
      try { sessionStorage.setItem('fosBooted', '1'); } catch (e) {}
    };
    if (document.body.classList.contains('is-loading')) {
      var mo = new MutationObserver(function () { if (!document.body.classList.contains('is-loading')) { mo.disconnect(); begin(); } });
      mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    } else begin();
  }

  window.freedomOS = { openExplorer: openExplorer, openArtboard: openArtboard, openNotepad: openNotepad, windows: function () { return wins.slice(); } };
})();
