/**
 * Harsh Portfolio — /projects Page Script
 * 3D PC Monitor Canvas Renderer, Loading Intro, Parallax Controller, & Editorial Project Navigation
 */

(function () {
  'use strict';

  let projectLoading = true;

  const canvas = document.getElementById('project-canvas');
  const stage = document.getElementById('monitor-screen-stage');
  const scene = document.getElementById('parallax-scene');
  const loadingOverlay = document.getElementById('project-loading-overlay');
  const viewport = document.querySelector('.monitor-content-viewport');

  // Prevent any wheel, touch, or keyboard scrolling while loader is active
  window.addEventListener('wheel', (e) => {
    if (projectLoading) {
      e.preventDefault();
      if (viewport) viewport.scrollTop = 0;
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (projectLoading) {
      e.preventDefault();
      if (viewport) viewport.scrollTop = 0;
    }
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (projectLoading) {
      const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', ' ', 'Home', 'End'];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault();
        if (viewport) viewport.scrollTop = 0;
      }
    }
  });

  if (viewport) {
    viewport.addEventListener('scroll', () => {
      if (projectLoading) {
        viewport.scrollTop = 0;
      }
    });

    // Touch event containment: prevent scrolling inside project window from triggering background parallax/gestures
    viewport.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });

    viewport.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: true });
  }

  const pcImage = new Image();
  const pcBaseSrc = (window.location.protocol === 'file:')
    ? '../Media/BedroomToPCScreen/BedroomtoPc0562.avif'
    : '/Media/BedroomToPCScreen/BedroomtoPc0562.avif';
  pcImage.src = pcBaseSrc;

  // --- Forward PC animation for history arrivals ---------------------------------
  // Clicking the PC plays Bedroom -> PC on the HOUSE page and then navigates here. Browser
  // Forward (or Back from a later page) skips that step, so this page replays the same frames
  // itself when it is reached through history from a house that was showing the Bedroom.
  const PC_FRAME_START = 539;
  const PC_FRAME_COUNT = 24;
  const pcFrameBase = (window.location.protocol === 'file:')
    ? '../Media/BedroomToPCScreen/'
    : '/Media/BedroomToPCScreen/';
  let introActive = false;   // true while the forward animation owns the canvas
  let introCancel = null;    // finishes an in-flight intro immediately (once)

  // The house records the room it last settled on; the first page shown afterwards consumes it.
  function consumeHouseExitRoom() {
    let room = null;
    try {
      room = sessionStorage.getItem('houseRoomSettled');
      sessionStorage.removeItem('houseRoomSettled');
    } catch (err) { }
    return room;
  }

  // The house plays the reverse animation only when a return flag is present, and consumes it
  // after doing so. Browser Back/Forward never set it, so every time this page is shown from
  // the house it re-arms the flag (unless an Escape/Return flag is already pending).
  function armHouseReturn() {
    if (!cameFromHouse()) return;
    try {
      if (sessionStorage.getItem('returnFromProjects') === 'true' ||
          sessionStorage.getItem('returnFromProjectsToLiving') === 'true') return;
      sessionStorage.setItem('returnFromProjects', 'true');
    } catch (err) { }
  }

  function shouldPlayForwardIntro(viaHistory) {
    const room = consumeHouseExitRoom();   // always consume, whatever the outcome
    return viaHistory && room === 'bedroom' && cameFromHouse();
  }

  function drawCover(img) {
    if (!canvas || !img || img.naturalWidth === 0) return;
    const width = canvas.clientWidth || Math.round(window.innerWidth * 1.1);
    const height = canvas.clientHeight || Math.round(window.innerHeight * 1.1);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let dw, dh, ox, oy;
    if (width / height > imgRatio) {
      dw = width; dh = width / imgRatio; ox = 0; oy = (height - dh) / 2;
    } else {
      dw = height * imgRatio; dh = height; ox = (width - dw) / 2; oy = 0;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, ox, oy, dw, dh);
  }

  function playForwardIntro(onDone) {
    if (introCancel) introCancel();   // an interrupted earlier run must not leave the stage hidden

    introActive = true;
    projectLoading = true;
    if (stage) stage.style.visibility = 'hidden';
    const exitEl = document.getElementById('exit-projects-btn');
    if (exitEl) exitEl.classList.add('is-loading-hidden');

    const frames = [];
    for (let i = 0; i < PC_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${pcFrameBase}BedroomtoPc${String(PC_FRAME_START + i).padStart(4, '0')}.avif`;
      frames.push(img);
    }

    let finished = false;
    let raf = null;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (raf !== null) cancelAnimationFrame(raf);
      introCancel = null;
      introActive = false;
      renderScene();                                  // last frame + monitor geometry
      if (stage) stage.style.visibility = '';
      onDone();
    };
    introCancel = finish;

    const settle = (img) => new Promise((resolve) => {
      if (img.complete) { resolve(); return; }
      if (typeof img.decode === 'function') { img.decode().then(resolve, resolve); return; }
      img.onload = img.onerror = () => resolve();
    });

    // Start once the frames are available; if they are not within 1.5 s, skip the animation
    // rather than hold a blank screen.
    Promise.race([
      Promise.all(frames.map(settle)),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]).then(() => {
      if (finished) return;
      if (!(frames[0].complete && frames[0].naturalWidth > 0)) { finish(); return; }
      const interval = 1000 / 24;   // same 24 fps as the house sequences
      let idx = 0;
      let last = performance.now();
      const tick = (now) => {
        if (finished) return;
        if (now - last >= interval) {
          last = now - ((now - last) % interval);
          const img = frames[idx];
          if (img.complete && img.naturalWidth > 0) drawCover(img);
          if (idx === frames.length - 1) { finish(); return; }
          idx++;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
  }

  // Decided before the first paint of the canvas so the final frame never flashes first.
  const navType = (performance.getEntriesByType('navigation')[0] || {}).type;
  armHouseReturn();
  const forwardIntroPlanned = shouldPlayForwardIntro(navType === 'back_forward');
  if (forwardIntroPlanned) {
    introActive = true;
    if (stage) stage.style.visibility = 'hidden';
    const earlyExit = document.getElementById('exit-projects-btn');
    if (earlyExit) earlyExit.classList.add('is-loading-hidden');
  }

  let parallaxInstance = null;

  function initParallax() {
    if (!scene || typeof Parallax === 'undefined') return;
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      if (parallaxInstance) {
        try { parallaxInstance.destroy(); } catch (e) {}
        parallaxInstance = null;
      }
      return;
    }
    if (!parallaxInstance) {
      parallaxInstance = new Parallax(scene, {
        relativeInput: true,
        hoverOnly: true,
        frictionX: 0.08,
        frictionY: 0.08,
        scalarX: 8.0,
        scalarY: 8.0
      });
    }
  }

  function renderScene() {
    if (introActive) return;
    if (!canvas || !pcImage || pcImage.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth || Math.round(window.innerWidth * 1.1);
    const height = canvas.height = canvas.clientHeight || Math.round(window.innerHeight * 1.1);

    const imgRatio = pcImage.naturalWidth / pcImage.naturalHeight;
    const canvasRatio = width / height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      drawHeight = height;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(pcImage, offsetX, offsetY, drawWidth, drawHeight);

    if (stage) {
      if (window.innerWidth <= 900) {
        stage.style.left = '';
        stage.style.top = '';
        stage.style.width = '';
        stage.style.height = '';
        stage.style.transform = '';
      } else {
        stage.style.left = `${offsetX}px`;
        stage.style.top = `${offsetY}px`;
        stage.style.width = `${drawWidth}px`;
        stage.style.height = `${drawHeight}px`;
      }
    }
  }

  // --- Editorial Project Data Dictionary ---
  const projectsData = {
    'glusight': {
      category: 'Case Study',
      title: 'GluSight',
      discipline: 'Medical UX &amp; Industrial 3D',
      timeline: '2026 — Present',
      role: 'Product Designer &amp; 3D Artist',
      medium: 'Non-Invasive Biosensing System',
      lead: 'A non-invasive continuous glucose monitoring system combining ergonomic industrial form with real-time biometric visualization.',
      p1: 'Developed to empower diabetic patients through seamless spatial tracking and zero-friction daily monitoring. The tactile form factor is sculpted from medical-grade bio-ceramics.',
      p2: 'The accompanying interface translates complex blood glucose telemetry into clear, immediate optical feedback without cognitive burden.'
    },
    'cabin-in-woods': {
      category: 'Visuals',
      title: 'Cabin in Woods',
      discipline: 'Atmospheric Architectural 3D',
      timeline: '2026',
      role: 'Environment Artist &amp; Lighting',
      medium: 'Cycles Render  Blender &amp; Adobe Substance Painter',
      lead: 'An architectural visualization study exploring how a small woodland retreat can feel integrated with its surrounding landscape rather than placed within it.',
      p1: 'The design focuses on the relationship between built form and nature, using weathered timber, a steep pitched roof, handcrafted detailing, and a restrained material palette to give the cabin a sense of character and permanence.',
      p2: 'Lighting and environmental composition were used to reinforce this relationship. Filtered morning sunlight, layered vegetation, soft shadows, and atmospheric depth frame the cabin as a quiet refuge within the forest.'
    },
    'product-renders': {
      category: 'Visuals',
      title: 'Product Renders',
      discipline: '3D LookDev &amp; Materiality',
      timeline: '2025 — 2026',
      role: '3D Artist &amp; Material Stylist',
      medium: 'Blender Cycles &amp; Adobe Substance 3D',
      lead: 'A curated collection of 3D look-development, hard-surface detailing, and photorealistic material studies.',
      p1: 'Exploring the intersection of industrial form, physical light behavior, and tactile material response across synthetic polymers, metals, and optical glass.',
      p2: 'Each piece investigates how digital surfaces communicate weight, texture, and emotional presence through precise shader construction and studio lighting choreography.'
    },
    'biophilic-interior': {
      category: 'Visuals',
      title: 'Biophilic Interior',
      discipline: 'Spatial &amp; Interior Architecture',
      timeline: '2025',
      role: 'Spatial Designer',
      medium: 'Photorealistic Interior CGI',
      lead: 'Integrating living botanical elements into minimalist brutalist concrete architecture to foster emotional well-being.',
      p1: 'Raw exposed concrete and expansive glass curtain walls are balanced by lush indoor flora and natural streaming daylight.',
      p2: 'The spatial choreography guides sightlines toward contemplative greenery, blurring the line between indoor living and nature.'
    },
    'contemporary-aipan': {
      category: 'Graphics',
      title: 'Contemporary Aipan',
      discipline: 'Cultural Graphic Heritage',
      timeline: '2026',
      role: 'Visual Researcher &amp; Typographer',
      medium: 'Digital Vector &amp; Print Typography',
      lead: 'Reimagining the traditional folk art of Kumaon through modern geometric abstraction and clean editorial typography.',
      p1: 'Preserving the sacred geometry, rhythmic dots, and linear motifs of red ochre and white rice paste in a refined contemporary context.',
      p2: 'The series translates ancestral ritual motifs into scalable vector systems and minimalist museum exhibition prints.'
    },
    'poster': {
      category: 'Graphics',
      title: 'Poster Collection',
      discipline: 'Editorial Poster Series',
      timeline: '2025 — 2026',
      role: 'Graphic Designer',
      medium: 'Silkscreen &amp; Large-Format Print',
      lead: 'A series of typographic and brutalist graphic posters exploring spatial rhythm, negative space, and Swiss grid systems.',
      p1: 'Constrained palettes of deep black, warm parchment, and vibrant international orange amplify structural typographic hierarchy.',
      p2: 'Each piece explores a singular typographic hypothesis, testing tension between structural alignment and kinetic asymmetry.'
    },
    'bookmark': {
      category: 'Graphics',
      title: 'Bookmark Series',
      discipline: 'Tactile Print Artifacts',
      timeline: '2025',
      role: 'Art Director',
      medium: 'Letterpress &amp; Foil Stamping',
      lead: 'Minimalist physical reading artifacts featuring debossed geometric patterns and bespoke literary excerpts.',
      p1: 'Printed on heavy cotton rag paper stock with metallic copper edge-gilding and blind deboss textures for a rich tactile experience.',
      p2: 'Designed to elevate the physical reading ritual through subtle tactile moments and precise typographic proportions.'
    }
  };

  function initProjectNavigation() {
    const projectButtons = document.querySelectorAll('.nav-project-btn');
    const mainContent = document.querySelector('.editorial-main-content');
    const glusightCaseStudy = document.getElementById('glusight-case-study');
    const cabinCaseStudy = document.getElementById('cabin-case-study');
    const productRendersCaseStudy = document.getElementById('product-renders-case-study');
    const biophilicCaseStudy = document.getElementById('biophilic-case-study');
    const posterCaseStudy = document.getElementById('poster-case-study');
    const standardProjectView = document.getElementById('standard-project-view');
    const viewport = document.querySelector('.monitor-content-viewport');
    const sectionLabelEl = document.getElementById('project-section-label');
    const titleEl = document.getElementById('project-title');
    const disciplineEl = document.getElementById('project-discipline');
    const timelineEl = document.getElementById('project-timeline');
    const roleEl = document.getElementById('project-role');
    const mediumEl = document.getElementById('project-medium');
    const leadEl = document.getElementById('project-lead');
    const p1El = document.getElementById('project-p1');
    const p2El = document.getElementById('project-p2');

    projectButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = btn.getAttribute('data-project');
        const data = projectsData[projectId];
        if (!data) return;

        projectButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        if (mainContent) {
          mainContent.classList.add('content-updating');
          setTimeout(() => {
            if (glusightCaseStudy) glusightCaseStudy.style.display = 'none';
            if (cabinCaseStudy) cabinCaseStudy.style.display = 'none';
            if (productRendersCaseStudy) productRendersCaseStudy.style.display = 'none';
            if (biophilicCaseStudy) biophilicCaseStudy.style.display = 'none';
            if (posterCaseStudy) posterCaseStudy.style.display = 'none';
            if (standardProjectView) standardProjectView.style.display = 'none';

            if (projectId === 'glusight') {
              if (glusightCaseStudy) glusightCaseStudy.style.display = 'flex';
            } else if (projectId === 'cabin-in-woods') {
              if (cabinCaseStudy) cabinCaseStudy.style.display = 'flex';
            } else if (projectId === 'product-renders') {
              if (productRendersCaseStudy) productRendersCaseStudy.style.display = 'flex';
            } else if (projectId === 'biophilic-interior') {
              if (biophilicCaseStudy) biophilicCaseStudy.style.display = 'flex';
            } else if (projectId === 'poster') {
              if (posterCaseStudy) posterCaseStudy.style.display = 'flex';
            } else {
              if (standardProjectView) standardProjectView.style.display = 'flex';

              if (sectionLabelEl) sectionLabelEl.textContent = data.category;
              if (titleEl) titleEl.textContent = data.title;
              if (disciplineEl) disciplineEl.innerHTML = data.discipline;
              if (timelineEl) timelineEl.textContent = data.timeline;
              if (roleEl) roleEl.innerHTML = data.role;
              if (mediumEl) mediumEl.innerHTML = data.medium;
              if (leadEl) leadEl.textContent = data.lead;
              if (p1El) p1El.textContent = data.p1;
              if (p2El) p2El.textContent = data.p2;
            }

            if (viewport) {
              viewport.scrollTo({ top: 0, behavior: 'smooth' });
            }

            mainContent.classList.remove('content-updating');
          }, 150);
        }
      });
    });
  }

  // --- Fullscreen Cinematic Video Experience Controller ---
  let isCinematicActive = false;
  let isCinematicTransitioning = false;
  let savedScrollPosition = 0;

  function initCinematicVideo() {
    const cabinFilmBtn = document.getElementById('cabin-film-btn');
    const productFilmBtn = document.getElementById('product-film-btn');
    const modal = document.getElementById('cinematic-video-modal');
    const video = document.getElementById('cinematic-video-element');
    const closeBtn = document.getElementById('cinematic-close-btn');

    if (!modal || !video) return;

    function openCinematic(videoSrc) {
      if (isCinematicActive || isCinematicTransitioning) return;
      isCinematicActive = true;
      isCinematicTransitioning = true;

      // 1. Record current scroll position on the project page
      if (viewport) {
        savedScrollPosition = viewport.scrollTop;
      }

      // 2. Set video source if specified
      if (videoSrc) {
        if (!video.src.endsWith(videoSrc) && !video.currentSrc.endsWith(videoSrc)) {
          video.src = videoSrc;
          video.load();
        }
      }

      // 3. Prep video and activate stage (transparent modal becomes visible)
      video.pause();
      video.currentTime = 0;
      modal.classList.remove('is-video-visible');
      modal.classList.add('is-active-stage');
      modal.setAttribute('aria-hidden', 'false');

      // 4. Force reflow and start slow screen fade to black (1.1s)
      void modal.offsetWidth;
      modal.classList.add('is-screen-black');

      // 5. Once screen reaches solid black (1.1s) -> start video & slowly fade video in from black (1.0s)
      setTimeout(() => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Cinematic autoplay prevented, awaiting user gesture:', err);
          });
        }

        // Fade in video layer from black
        modal.classList.add('is-video-visible');

        setTimeout(() => {
          isCinematicTransitioning = false;
        }, 1000);
      }, 1100);
    }

    function closeCinematic() {
      if (!isCinematicActive || isCinematicTransitioning) return;
      isCinematicTransitioning = true;

      // 1. Pause video on final frame & slowly dissolve video layer into black (1.0s)
      video.pause();
      modal.classList.remove('is-video-visible');

      setTimeout(() => {
        // 2. Screen is now completely solid BLACK -> Hold on pure black (350ms pause)
        video.currentTime = 0;

        setTimeout(() => {
          // Restore exact scroll position underneath the solid black curtain
          if (viewport) {
            viewport.scrollTop = savedScrollPosition;
          }

          // 3. Slowly fade project page back in from black (1.1s)
          modal.classList.remove('is-screen-black');

          setTimeout(() => {
            modal.classList.remove('is-active-stage');
            modal.setAttribute('aria-hidden', 'true');
            isCinematicActive = false;
            isCinematicTransitioning = false;
          }, 1100);
        }, 350);
      }, 1000);
    }

    if (cabinFilmBtn) {
      cabinFilmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCinematic('Media/TreeHouseWithout.mp4');
      });
    }

    if (productFilmBtn) {
      productFilmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCinematic('Media/Product Renders/vid.mp4');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeCinematic();
      });
    }

    video.addEventListener('ended', () => {
      closeCinematic();
    });

    // Also listen for timeupdate near end of video as a safeguard
    video.addEventListener('timeupdate', () => {
      if (isCinematicActive && !isCinematicTransitioning && video.duration > 0) {
        if (video.duration - video.currentTime <= 0.08) {
          closeCinematic();
        }
      }
    });

    // Handle Escape key: close cinematic video first if open
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && isCinematicActive) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeCinematic();
      }
    }, true);
  }

  // --- Loading Intro Dismissal Controller ---
  // Optimized for seamless continuous handoff from the bedroom zoom animation
  const PROGRESS_START_DELAY_MS = 0;
  const PROGRESS_ANIM_DURATION_MS = 200;
  const TOTAL_LOADING_DURATION_MS = 200;
  let loadingDismissTimer = null;

  function startLoadingSequence() {
    if (loadingDismissTimer) return;

    if (viewport) {
      viewport.scrollTop = 0;
    }

    const progressBar = document.querySelector('.loading-line-bar');
    if (progressBar) {
      progressBar.classList.add('is-animating');
    }

    loadingDismissTimer = setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          projectLoading = false;
          document.body.classList.remove('is-loading');
          if (viewport) {
            viewport.classList.remove('is-loading');
            viewport.scrollTop = 0;
          }
        }, 300);
      } else {
        projectLoading = false;
        document.body.classList.remove('is-loading');
        if (viewport) {
          viewport.classList.remove('is-loading');
          viewport.scrollTop = 0;
        }
      }
    }, TOTAL_LOADING_DURATION_MS);
  }

  pcImage.onload = () => {
    renderScene();
    initParallax();
  };

  if (pcImage.complete && pcImage.naturalWidth > 0) {
    renderScene();
    initParallax();
  }

  window.addEventListener('resize', () => {
    renderScene();
  });

  // --- Leaving Projects (shared by Escape, the exit hit-area and the Return to Room button) ---
  // The house is entered from here via browser history whenever Projects was opened from it,
  // so Back/Forward stay symmetrical and no extra entry is pushed. When Projects was opened
  // directly (no house entry behind it) the entry is replaced with the house instead.
  // The return flag is written BEFORE history.back(): the house page consumes it only once
  // its restoration animation has finished, whether it comes back from the bfcache or reloads.
  let isLeavingProjects = false;
  let leaveFallbackTimer = null;

  function cameFromHouse() {
    try {
      if (!document.referrer || window.history.length < 2) return false;
      const ref = new URL(document.referrer);
      return ref.origin === window.location.origin && /^\/(index\.html)?$/.test(ref.pathname);
    } catch (err) {
      return false;
    }
  }

  function leaveProjects(toLiving) {
    if (isLeavingProjects) return;
    isLeavingProjects = true;

    try {
      // Exactly one flag: Return to Room -> Bedroom, Escape -> Living.
      sessionStorage.setItem(toLiving ? 'returnFromProjectsToLiving' : 'returnFromProjects', 'true');
      sessionStorage.removeItem(toLiving ? 'returnFromProjects' : 'returnFromProjectsToLiving');
    } catch (err) {
      console.warn('Unable to access sessionStorage:', err);
    }

    const houseUrl = (window.location.protocol === 'file:') ? '../index.html' : '/';

    if (cameFromHouse()) {
      // history.back() is asynchronous. If it has not left this page after a generous delay
      // (nothing to go back to), fall back to replacing this entry with the house.
      const cancelFallback = () => {
        if (leaveFallbackTimer) { clearTimeout(leaveFallbackTimer); leaveFallbackTimer = null; }
      };
      window.addEventListener('pagehide', cancelFallback, { once: true });
      leaveFallbackTimer = setTimeout(() => {
        leaveFallbackTimer = null;
        window.removeEventListener('pagehide', cancelFallback);
        window.location.replace(houseUrl);
      }, 2500);
      window.history.back();
    } else {
      window.location.replace(houseUrl);
    }
  }

  // The case-study "Kitchen Blog" link goes straight to the Kitchen. The return flags would make the
  // house replay PC -> Bedroom and land in the Bedroom instead, so drop them before leaving.
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('#bedroom-to-kitchen-blog-btn')) return;
    try {
      sessionStorage.removeItem('returnFromProjects');
      sessionStorage.removeItem('returnFromProjectsToLiving');
    } catch (err) { }
  }, true);

  // If the browser restores this page from the bfcache (Forward from the house), it comes back
  // frozen mid-exit; re-arm the exit controls.
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    isLeavingProjects = false;
    if (leaveFallbackTimer) { clearTimeout(leaveFallbackTimer); leaveFallbackTimer = null; }

    // Restored from the bfcache: no startup code runs, so re-arm the house's reverse animation
    // and replay the forward zoom when coming from the Bedroom (a bfcache restore is always a
    // history traversal).
    armHouseReturn();
    if (shouldPlayForwardIntro(true)) {
      playForwardIntro(() => {
        projectLoading = false;
        const exitEl = document.getElementById('exit-projects-btn');
        if (exitEl) exitEl.classList.remove('is-loading-hidden');
      });
    } else if (introCancel) {
      introCancel();
    }
  });

  // Leaving mid-intro (e.g. Back during the zoom): settle into the finished state so a later
  // bfcache restore never shows a hidden stage.
  window.addEventListener('pagehide', () => {
    if (introCancel) introCancel();
  });

  // --- Escape Key: Return to Living Room (Continuous Rollback: PC -> Bedroom -> Living) ---
  window.addEventListener('keydown', (e) => {
    if (isCinematicActive) return; // Handled by cinematic video controller
    if (e.key === 'Escape' || e.key === 'Esc') {
      leaveProjects(true);
    }
  });

  // --- Exit Projects Interactive Overlay Controller ---
  function initExitInteraction() {
    const exitBtn = document.getElementById('exit-projects-btn');
    if (!exitBtn) return;

    // Create a tooltip element (same style as home page .interaction-tooltip)
    let tooltipEl = document.getElementById('projects-exit-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'projects-exit-tooltip';
      tooltipEl.className = 'interaction-tooltip';
      document.body.appendChild(tooltipEl);
    }

    function showTooltip(x, y) {
      tooltipEl.textContent = 'Exit Projects';
      tooltipEl.classList.add('visible');
      updateTooltipPos(x, y);
    }

    function hideTooltip() {
      tooltipEl.classList.remove('visible');
    }

    function updateTooltipPos(x, y) {
      const offset = 14;
      const tw = tooltipEl.offsetWidth || 100;
      const th = tooltipEl.offsetHeight || 28;
      let px = x + offset;
      let py = y + offset;
      if (px + tw + 12 > window.innerWidth) px = x - tw - offset;
      if (py + th + 12 > window.innerHeight) py = y - th - offset;
      px = Math.max(8, Math.min(px, window.innerWidth - tw - 8));
      py = Math.max(8, Math.min(py, window.innerHeight - th - 8));
      tooltipEl.style.transform = `translate3d(${Math.round(px)}px, ${Math.round(py)}px, 0)`;
    }

    exitBtn.addEventListener('mouseenter', (e) => {
      if (projectLoading) return;
      showTooltip(e.clientX, e.clientY);
    });

    exitBtn.addEventListener('mousemove', (e) => {
      if (projectLoading) return;
      updateTooltipPos(e.clientX, e.clientY);
    });

    exitBtn.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    const triggerExit = () => {
      if (projectLoading || isCinematicActive) return;
      hideTooltip();
      // Home plays the reverse bedroom_pc animation (returnFromProjects flag set by leaveProjects)
      leaveProjects(false);
    };

    exitBtn.addEventListener('click', triggerExit);

    exitBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerExit();
      }
    });

    const returnBtn = document.getElementById('nav-return-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerExit();
      });
    }

    // Clicking outside the monitor viewport returns to bedroom
    if (scene) {
      scene.addEventListener('click', (e) => {
        if (projectLoading || isCinematicActive) return;
        if (window.innerWidth <= 900) return; // On mobile, use dedicated Return button
        if (e.target.closest('.monitor-content-viewport') || e.target.closest('#cinematic-video-modal')) return;
        triggerExit();
      });
    }

    // Keep the exit button hidden/disabled while loading is still in progress
    exitBtn.classList.add('is-loading-hidden');

    // Reveal once startLoadingSequence completes (hook into loadingOverlay fade-out)
    const revealOnLoad = () => {
      exitBtn.classList.remove('is-loading-hidden');
    };

    // Watch for the loading overlay to be hidden
    const loObs = new MutationObserver(() => {
      if (loadingOverlay && loadingOverlay.style.display === 'none') {
        revealOnLoad();
        loObs.disconnect();
      }
    });
    if (loadingOverlay) {
      loObs.observe(loadingOverlay, { attributes: true, attributeFilter: ['style', 'class'] });
    } else {
      revealOnLoad();
    }
  }

  function beginPage() {
    if (forwardIntroPlanned) {
      playForwardIntro(startLoadingSequence);   // zoom first, then the usual "Loading Projects" intro
    } else {
      startLoadingSequence();
    }
  }

  // Start sequence & navigation on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderScene();
      initParallax();
      initProjectNavigation();
      initCinematicVideo();
      initExitInteraction();
      beginPage();
    });
  } else {
    renderScene();
    initParallax();
    initProjectNavigation();
    initCinematicVideo();
    initExitInteraction();
    beginPage();
  }
})();
