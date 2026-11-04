// House controller: room-to-room transitions, the first-visit entrance, hotspots, the Contact window,
// returning from /projects/, and Back/Forward handling. Ported from the original script.js; timings,
// storage keys and URL behaviour are unchanged. React renders the markup; this module choreographs it.
import {
  ROOM_TO_NAV, NAV_TO_ROOM, ROOM_TITLES, ALL_ROOMS, ROOM_CONNECTIONS, SCROLL_CIRCLE,
  ROOM_ADJACENCY, ROOM_PRIORITY, HOTSPOTS,
} from './data';
import { createFrameStore, pad4 } from './frameStore';
import { createBackgroundQueue } from './backgroundQueue';
import { createCriticalLoader, loadImage } from './criticalLoader';
import { createSequencePlayer } from '../frames/player';
import { drawCover } from '../frames/renderer';
import { createKitchenBlog } from './kitchenBlog';

// --- Entrance timing ---
const FREEDOM_FADE_DURATION = 500;                       // Freedom title fade-out (ms)
const ENTRANCE_START_DELAY = FREEDOM_FADE_DURATION + 150; // walkthrough starts just after the fade
// Desktop only: if the first frames are not ready within this time the intro is skipped.
const SLOW_CONNECTION_BUFFER_MS = 2500;
// After the intro, hotspots and navigation stay locked until the main transitions out of the room
// are loaded enough to play without stalling (capped so the page never dead-ends).
const ROOM_READY_MIN_FRACTION = 0.85;
const ROOM_READY_MAX_WAIT_MS = 10000;
// A transition starts as soon as its first SEQUENCE_HEAD_FRAMES frames are ready; otherwise it cuts.
const SEQUENCE_HEAD_FRAMES = 16;
const SEQUENCE_READY_TIMEOUT_MS = 2000;
const WHEEL_THRESHOLD = 50;

/**
 * @param dom    element refs: canvasA, canvasB, ui, splash, backdrop, scene, stage, tooltip,
 *               indicator, percent, contactModal, kitchen (see KitchenBlog)
 * @param bridge React callbacks: setRoomState({ room, nav }), setHotspots({ room, epoch }),
 *               setContactOpen(bool)
 */
export function createHouseController(dom, bridge) {
  const { canvasA, canvasB, ui: uiContainer, splash: freedomSplash, backdrop: backdropRect, stage } = dom;

  let hasRevealed = false;
  let isScrollLocked = false;
  let interactionGateClosed = false; // true while the first room's transitions are still loading
  let currentRoom = 'living';
  let currentActiveFrameImg = null;
  let parallaxInstance = null;
  let hotspotEpoch = 0;
  let contactOpen = false;
  const cleanups = [];

  const listen = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  };

  const store = createFrameStore(() => currentRoom);
  const queue = createBackgroundQueue(store, () => interactionGateClosed);
  const loader = createCriticalLoader(store, dom.indicator, dom.percent);
  const { initSequenceFrames, preloadSequence, getRoomBaseFrame, transitionHeadIndices } = store;

  function getActiveCanvas() {
    return canvasA && canvasA.classList.contains('active-video') ? canvasA : canvasB;
  }

  // --- Frame drawing (three.js, 2D fallback) ---
  function drawFrameToCanvas(canvas, img) {
    if (!canvas || !img) return;
    currentActiveFrameImg = img;
    if (img.naturalWidth === 0) return;
    const rect = drawCover(canvas, img);
    if (rect) hotspots.updateStageBounds(rect);
  }

  const player = createSequencePlayer(drawFrameToCanvas);
  const playImageSequence = player.play;
  const stopCurrentAnimation = player.stop;

  // --- Room title, navigation and URL ---
  function getRoomFromHash() {
    try {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
      if (!hash) return null;
      if (NAV_TO_ROOM[hash]) return NAV_TO_ROOM[hash];
      if (ALL_ROOMS.includes(hash)) return hash;
    } catch (e) {}
    return null;
  }

  let roomTitle = currentRoom;
  let activeNav = 'home';
  const pushRoomState = () => bridge.setRoomState({ title: ROOM_TITLES[roomTitle], nav: activeNav });

  function updateRoomTitle(roomKey) {
    if (ROOM_TITLES[roomKey]) {
      roomTitle = roomKey;
      pushRoomState();
    }
  }

  // Records the room the house last settled on. /projects/ reads (and removes) it to know whether a
  // Back/Forward arrival comes from the Bedroom, in which case it replays the PC zoom itself.
  function rememberHouseRoom() {
    try { sessionStorage.setItem('houseRoomSettled', currentRoom); } catch (e) {}
  }

  function updateActiveNav(targetNavKey) {
    rememberHouseRoom(); // always called after currentRoom is set
    activeNav = targetNavKey;
    pushRoomState();
  }

  // --- Backdrop and UI fades ---
  function fadeClass(el, { add, remove, skip, onDone, after, timeout }) {
    if (!el) { if (onDone) onDone(); return; }
    if (skip && skip()) { if (after) after(); if (onDone) onDone(); return; }
    let hasCompleted = false;
    const finish = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      el.removeEventListener('transitionend', handle);
      if (after) after();
      if (onDone) onDone();
    };
    const handle = (e) => { if (e.target === el && e.propertyName === 'opacity') finish(); };
    el.addEventListener('transitionend', handle);
    setTimeout(finish, timeout);
    if (add) el.classList.add(add);
    if (remove) el.classList.remove(remove);
  }

  // 25% black backdrop
  function fadeBackdropOut(onComplete) {
    fadeClass(backdropRect, {
      add: 'backdrop-hidden', timeout: 600, onDone: onComplete,
      skip: () => parseFloat(getComputedStyle(backdropRect).opacity) < 0.05 || backdropRect.classList.contains('backdrop-hidden'),
    });
  }
  function fadeBackdropIn(onComplete) {
    fadeClass(backdropRect, {
      remove: 'backdrop-hidden', timeout: 600, onDone: onComplete,
      skip: () => parseFloat(getComputedStyle(backdropRect).opacity) > 0.95 && !backdropRect.classList.contains('backdrop-hidden'),
    });
  }

  function fadeUIOut(onComplete) {
    fadeClass(uiContainer, {
      add: 'ui-hidden', timeout: 550, onDone: onComplete,
      skip: () => parseFloat(getComputedStyle(uiContainer).opacity) < 0.05 || uiContainer.classList.contains('ui-hidden'),
      after: () => uiContainer.classList.remove('visible', 'revealed'),
    });
  }

  function updateUIRoomState(room) {
    if (!uiContainer) return;
    ALL_ROOMS.forEach((r) => uiContainer.classList.remove(`room-${r}`));
    uiContainer.classList.add(`room-${room}`);
    if (room === 'living') uiContainer.classList.remove('projects-mode');
    else uiContainer.classList.add('projects-mode');
  }

  function fadeUIIn(onComplete) {
    if (!uiContainer) { if (onComplete) onComplete(); return; }
    updateUIRoomState(currentRoom);
    uiContainer.classList.remove('ui-hidden');
    uiContainer.classList.add('visible');
    uiContainer.classList.add('revealed');
    fadeClass(uiContainer, { timeout: 550, onDone: onComplete });
  }

  // --- Sequence readiness ---
  // Resolves true once the first `count` frames of a playback (in playback order) have loaded,
  // or false if they have not within maxWaitMs.
  function awaitSequenceHead(frames, startIdx, endIdx, count, maxWaitMs) {
    return new Promise((resolve) => {
      const step = startIdx <= endIdx ? 1 : -1;
      const head = [];
      for (let i = startIdx, n = 0; n < count && (step > 0 ? i <= endIdx : i >= endIdx); i += step, n++) {
        head.push(frames[i]);
      }
      const start = performance.now();
      const check = () => {
        if (head.every((img) => img && img.complete && img.naturalWidth > 0)) { resolve(true); return; }
        if (performance.now() - start >= maxWaitMs) { resolve(false); return; }
        setTimeout(check, 30);
      };
      check();
    });
  }

  // Decodes the first few frames of a transition while the old room's UI fades out.
  function warmSequenceHead(frames, reverse, count) {
    const ordered = reverse ? frames.slice().reverse() : frames;
    ordered.slice(0, count).forEach((img) => {
      if (img && typeof img.decode === 'function') img.decode().catch(() => {});
    });
  }

  // --- Room-to-room transition ---
  function navigateToRoom(destRoom, onComplete) {
    if (isScrollLocked || interactionGateClosed) return;
    if (currentRoom === destRoom) return;

    const connKey = `${currentRoom}-${destRoom}`;
    const conn = ROOM_CONNECTIONS[connKey];
    if (!conn) {
      console.warn(`No connection defined for: ${connKey}`);
      return;
    }

    isScrollLocked = true;
    hotspots.setInteractiveEnabled(false);

    // Start fetching this transition's frames now (they download while the UI fades out) and stop
    // background prefetch from competing with them.
    queue.pause();
    warmSequenceHead(preloadSequence(conn.seq), conn.reverse, 4);

    let hasCompletedTransition = false;
    let safetyTimer = null;

    const completeTransition = () => {
      if (hasCompletedTransition) return;
      hasCompletedTransition = true;
      if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }

      currentRoom = destRoom;

      const baseFrame = getRoomBaseFrame(destRoom);
      const activeCanvas = getActiveCanvas();
      if (baseFrame && activeCanvas) {
        if (baseFrame.complete && baseFrame.naturalWidth > 0) {
          drawFrameToCanvas(activeCanvas, baseFrame);
        } else {
          baseFrame.addEventListener('load', () => drawFrameToCanvas(activeCanvas, baseFrame), { once: true });
        }
      }

      updateRoomTitle(destRoom);
      const destNav = ROOM_TO_NAV[destRoom];
      updateActiveNav(destNav);

      try {
        if (destNav && window.location.hash !== `#${destNav}`) {
          window.history.replaceState(null, '', `#${destNav}`);
        }
      } catch (e) {}

      updateUIRoomState(destRoom);
      hotspots.renderObjects();
      fadeBackdropIn();

      fadeUIIn(() => {
        hotspots.setInteractiveEnabled(true);
        isScrollLocked = false;
        queue.reprioritize(destRoom);
        queue.resume();
        if (destRoom === 'bedroom') preloadSequence('bedroom_pc');
        if (onComplete) onComplete();
      });
    };

    // Safety timeout: a transition must never leave the visitor locked.
    safetyTimer = setTimeout(() => {
      if (!hasCompletedTransition) {
        console.warn(`[Transition] Safety timeout fired for ${connKey} — completing room state`);
        stopCurrentAnimation();
        completeTransition();
      }
    }, 6000);

    let uiDone = false;
    let backdropDone = false;
    let animationStarted = false;
    const startAnimation = () => {
      if (!uiDone || !backdropDone) return;
      if (hasCompletedTransition || animationStarted) return;
      animationStarted = true;

      const frames = preloadSequence(conn.seq);
      const activeCanvas = getActiveCanvas();
      const startIdx = conn.reverse ? frames.length - 1 : 0;
      const endIdx = conn.reverse ? 0 : frames.length - 1;

      queue.pause();

      // The animation starts as soon as its opening frames are in (the rest stream in behind it);
      // if even those do not arrive in time, cut straight to the destination room.
      awaitSequenceHead(frames, startIdx, endIdx, SEQUENCE_HEAD_FRAMES, SEQUENCE_READY_TIMEOUT_MS).then((headReady) => {
        if (hasCompletedTransition) return;
        if (!headReady) {
          console.warn(`[Transition] ${connKey}: opening frames not loaded — skipping animation`);
          completeTransition();
          return;
        }
        playImageSequence(activeCanvas, frames, startIdx, endIdx, () => completeTransition());
      });
    };

    fadeUIOut(() => { uiDone = true; startAnimation(); });
    fadeBackdropOut(() => { backdropDone = true; startAnimation(); });
  }

  // --- Leaving for /projects/ (full page load, so the Back button and bfcache work as before) ---
  function navigateUrl(targetUrl) {
    if (!targetUrl) return;
    if (targetUrl === '/projects' || targetUrl === 'projects/' || targetUrl === 'projects' || targetUrl === '/projects/') {
      try {
        sessionStorage.setItem('returnFromProjects', 'true');
        sessionStorage.removeItem('returnFromProjectsToLiving'); // a leftover Escape flag must not win
      } catch (err) {}
      window.location.href = window.location.protocol === 'file:' ? 'projects/index.html' : 'projects/';
      return;
    }
    window.location.href = targetUrl;
  }

  // --- Hotspots and tooltip ---
  const hotspots = {
    currentBounds: { x: 0, y: 0, width: 0, height: 0 },

    showTooltip(text, clientX, clientY) {
      const tip = dom.tooltip;
      if (isScrollLocked || !text || !tip) return;
      tip.textContent = text;
      tip.classList.add('visible');
      this.updateTooltipPosition(clientX, clientY);
    },

    updateTooltipPosition(clientX, clientY) {
      const tip = dom.tooltip;
      if (!tip || !tip.classList.contains('visible') || isScrollLocked) return;
      const offset = 14;
      const tipRect = tip.getBoundingClientRect();
      const tipWidth = tipRect.width || 80;
      const tipHeight = tipRect.height || 28;
      let posX = clientX + offset;
      let posY = clientY + offset;
      // Near the right or bottom edge: show it above-left of the cursor.
      if (posX + tipWidth + 12 > window.innerWidth || posY + tipHeight + 12 > window.innerHeight) {
        posX = clientX - tipWidth - offset;
        posY = clientY - tipHeight - offset;
      }
      posX = Math.max(8, Math.min(posX, window.innerWidth - tipWidth - 8));
      posY = Math.max(8, Math.min(posY, window.innerHeight - tipHeight - 8));
      tip.style.transform = `translate3d(${Math.round(posX)}px, ${Math.round(posY)}px, 0)`;
    },

    hideTooltip() {
      if (dom.tooltip) dom.tooltip.classList.remove('visible');
    },

    updateStageBounds(bounds) {
      if (!stage) return;
      if (bounds) {
        const c = this.currentBounds;
        if (c.x === bounds.x && c.y === bounds.y && c.width === bounds.width && c.height === bounds.height) return;
        this.currentBounds = bounds;
      }
      stage.style.left = `${this.currentBounds.x}px`;
      stage.style.top = `${this.currentBounds.y}px`;
      stage.style.width = `${this.currentBounds.width}px`;
      stage.style.height = `${this.currentBounds.height}px`;
    },

    // Re-renders the hotspots of the current room (React draws them; a new epoch resets hover state).
    renderObjects() {
      if (!stage) return;
      if (this.currentBounds.width === 0 && currentActiveFrameImg) {
        const activeCanvas = getActiveCanvas();
        if (activeCanvas) drawFrameToCanvas(activeCanvas, currentActiveFrameImg);
      } else {
        this.updateStageBounds(this.currentBounds);
      }
      this.hideTooltip();
      hotspotEpoch += 1;
      bridge.setHotspots({ room: currentRoom, epoch: hotspotEpoch });
    },

    setInteractiveEnabled(enabled) {
      if (!stage) return;
      if (enabled) stage.classList.remove('interactive-disabled');
      else {
        stage.classList.add('interactive-disabled');
        this.hideTooltip();
      }
    },

    // Pointer handlers called by the Hotspot components.
    enter(config, e) {
      if (isScrollLocked) return false;
      const tooltipText = config.label || (config.action && config.action.targetRoom ? ROOM_TITLES[config.action.targetRoom] : '') || config.id;
      this.showTooltip(tooltipText, e.clientX, e.clientY);
      if (config.action && config.action.targetRoom) {
        const hoverConn = ROOM_CONNECTIONS[`${currentRoom}-${config.action.targetRoom}`];
        if (hoverConn && hoverConn.seq) preloadSequence(hoverConn.seq);
      }
      return true;
    },
    move(e) {
      if (isScrollLocked) return;
      this.updateTooltipPosition(e.clientX, e.clientY);
    },
    leave() {
      this.hideTooltip();
    },
    activate(config) {
      if (isScrollLocked) return;
      this.hideTooltip();
      this.handleObjectClick(config);
    },

    handleObjectClick(config) {
      if (isScrollLocked || interactionGateClosed) return;
      this.hideTooltip();

      const action = config.action;
      if (!action) return;

      if (action.type === 'contact') { openContactInterface(); return; }
      if (action.type === 'kitchen_blog') { kitchen.openKitchenBlog(); return; }

      if (action.sequence || action.type === 'animation' || (action.animation && (action.animation.sequence || action.animation.folder))) {
        const seqKey = action.sequence || (action.animation && action.animation.sequence);
        let frames = [];
        if (seqKey) {
          frames = preloadSequence(seqKey);
        } else if (action.animation && action.animation.folder) {
          const animSeq = action.animation;
          for (let i = animSeq.startFrame || 1; i <= (animSeq.endFrame || 1); i++) {
            const img = new Image();
            img.src = `${animSeq.folder}${animSeq.prefix || ''}${pad4(i)}.jpg`;
            frames.push(img);
          }
        }
        if (frames.length === 0) return;

        isScrollLocked = true;
        this.setInteractiveEnabled(false);
        this.hideTooltip();

        // Hard cap: if the animation never completes, navigate after 10 seconds anyway.
        let safetyTimer = null;
        if (action.type === 'url' && action.url) {
          safetyTimer = setTimeout(() => {
            console.warn('[Transition] Safety timeout fired — forcing navigation');
            navigateUrl(action.url);
          }, 10000);
        }

        const activeCanvas = getActiveCanvas();
        // The final frame is decoded first so the sequence never stalls right before navigating.
        const lastFrame = frames[frames.length - 1];
        const doPlay = () => {
          playImageSequence(activeCanvas, frames, 0, frames.length - 1, () => {
            if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
            if (action.type === 'hold') return;
            if (action.type === 'url' && action.url) { navigateUrl(action.url); return; }
            if (action.type === 'navigate' && action.targetRoom) { navigateToRoom(action.targetRoom); return; }
            // Standalone interaction animation: return to the room.
            setTimeout(() => {
              const baseFrame = getRoomBaseFrame(currentRoom);
              if (baseFrame) drawFrameToCanvas(activeCanvas, baseFrame);
              hotspots.renderObjects();
              fadeBackdropIn();
              fadeUIIn(() => {
                hotspots.setInteractiveEnabled(true);
                isScrollLocked = false;
              });
            }, 400);
          });
        };

        fadeUIOut();
        fadeBackdropOut();
        if (lastFrame && lastFrame.complete && lastFrame.naturalWidth > 0) doPlay();
        else if (lastFrame && typeof lastFrame.decode === 'function') lastFrame.decode().then(doPlay).catch(doPlay);
        else if (lastFrame) {
          lastFrame.addEventListener('load', doPlay, { once: true });
          lastFrame.addEventListener('error', doPlay, { once: true });
        } else doPlay();
        return;
      }

      if (action.type === 'url' && action.url) { navigateUrl(action.url); return; }
      if (action.type === 'navigate' && action.targetRoom) navigateToRoom(action.targetRoom);
    },
  };

  // --- Contact window ---
  function isContactInterfaceOpen() { return contactOpen; }

  function openContactInterface() {
    if (!dom.contactModal) return;
    hotspots.hideTooltip();
    isScrollLocked = true;
    contactOpen = true;
    dom.contactModal.classList.add('is-open');
    dom.contactModal.setAttribute('aria-hidden', 'false');
    bridge.setContactOpen(true);
    const firstInput = dom.contactModal.querySelector('input:not([type="hidden"]), textarea, button');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }

  function closeContactInterface() {
    if (!dom.contactModal) return;
    contactOpen = false;
    dom.contactModal.classList.remove('is-open');
    dom.contactModal.setAttribute('aria-hidden', 'true');
    bridge.setContactOpen(false);
    isScrollLocked = false;
    hotspots.renderObjects();
  }

  // --- Kitchen case study window (shares the scroll lock and hotspots) ---
  const kitchen = createKitchenBlog(dom.kitchen, {
    hideTooltip: () => hotspots.hideTooltip(),
    lock: () => { isScrollLocked = true; },
    unlockAfterClose: () => {
      isScrollLocked = false;
      hotspots.renderObjects();
      // The room-ready gate may have opened while the case study was up, so re-enable here.
      if (!interactionGateClosed && hasRevealed) hotspots.setInteractiveEnabled(true);
    },
    isScrollLocked: () => isScrollLocked,
    hasRevealed: () => hasRevealed,
    currentRoom: () => currentRoom,
    navigateToRoom: (room, cb) => navigateToRoom(room, cb),
  });

  // --- Navigation bar, buttons ---
  function onNavClick(navKey) {
    if (isScrollLocked) {
      if (isContactInterfaceOpen()) closeContactInterface();
      else if (kitchen.isOpen()) kitchen.closeKitchenBlog();
      else return;
    }
    const destRoom = NAV_TO_ROOM[navKey];
    if (!destRoom) return;
    if (destRoom === currentRoom && destRoom === 'office') { openContactInterface(); return; }
    if (destRoom === currentRoom && destRoom === 'kitchen') { kitchen.openKitchenBlog(); return; }
    navigateToRoom(destRoom);
  }

  function onExploreProjects() {
    if (isScrollLocked) return;
    hotspots.handleObjectClick(HOTSPOTS.bedroomPC);
  }
  function onHomeExplore() {
    if (isScrollLocked) return;
    navigateToRoom('bedroom');
  }
  function onKitchenIntro() {
    if (isScrollLocked && !kitchen.isOpen()) return;
    kitchen.openKitchenBlog();
  }
  function onContactIntro() {
    if (isScrollLocked && !isContactInterfaceOpen()) return;
    openContactInterface();
  }
  function onSocialEnter(label, e) {
    if (isScrollLocked) return;
    hotspots.showTooltip(label, e.clientX, e.clientY);
  }

  // --- Circular scroll navigation ---
  function handleScrollNavigation(direction) {
    if (isScrollLocked) return;
    const currentIndex = SCROLL_CIRCLE.indexOf(currentRoom);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex + direction;
    if (nextIndex >= SCROLL_CIRCLE.length) nextIndex = 0;
    else if (nextIndex < 0) nextIndex = SCROLL_CIRCLE.length - 1;
    navigateToRoom(SCROLL_CIRCLE[nextIndex]);
  }

  let wheelAccumulator = 0;
  listen(window, 'wheel', (e) => {
    if (!hasRevealed || isScrollLocked) { wheelAccumulator = 0; return; }
    wheelAccumulator += e.deltaY;
    if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;
      handleScrollNavigation(direction);
    }
  }, { passive: true });

  let touchStartY = 0;
  listen(window, 'touchstart', (e) => {
    if (e.touches.length > 0) touchStartY = e.touches[0].clientY;
  }, { passive: true });
  listen(window, 'touchend', (e) => {
    if (!hasRevealed || isScrollLocked) return;
    if (e.changedTouches.length === 0) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) < 40) return;
    handleScrollNavigation(deltaY > 0 ? 1 : -1);
  }, { passive: true });

  listen(window, 'resize', () => {
    if (currentActiveFrameImg) {
      drawFrameToCanvas(getActiveCanvas(), currentActiveFrameImg);
      hotspots.renderObjects();
    }
  });

  // --- Parallax ---
  function initParallaxEngine() {
    const sceneElement = dom.scene;
    if (!sceneElement) return;
    setTimeout(() => sceneElement.classList.add('zoomed-in'), 50);

    import('parallax-js').then((mod) => {
      const Parallax = mod.default || mod;
      try {
        if (!parallaxInstance) {
          parallaxInstance = new Parallax(sceneElement, {
            relativeInput: true,
            clipRelativeInput: false,
            hoverOnly: false,
            frictionX: 0.08,
            frictionY: 0.08,
            scalarX: 28,
            scalarY: 28,
            pointerEvents: true,
          });
        }
      } catch (err) {
        console.warn('Parallax init failed:', err);
      }
    }).catch(() => {});
  }

  // --- Room-ready gate after the intro ---
  function roomTransitionsReady(room) {
    const adjacent = ROOM_ADJACENCY[room] || [];
    const keys = (ROOM_PRIORITY[room] || adjacent).filter((k) => adjacent.indexOf(k) !== -1);
    return keys.every((seqKey) => {
      const frames = initSequenceFrames(seqKey);
      const settled = frames.filter((img) => img.complete && img.src).length;
      const headReady = transitionHeadIndices(room, seqKey, SEQUENCE_HEAD_FRAMES).every((i) => frames[i] && frames[i].complete);
      return headReady && settled >= Math.ceil(frames.length * ROOM_READY_MIN_FRACTION);
    });
  }

  let interactionGateTimer = null;
  function holdInteractionUntilRoomReady() {
    if (roomTransitionsReady(currentRoom)) return;
    interactionGateClosed = true;
    hotspots.setInteractiveEnabled(false);
    const startedAt = performance.now();
    if (interactionGateTimer) clearInterval(interactionGateTimer);
    interactionGateTimer = setInterval(() => {
      const timedOut = performance.now() - startedAt > ROOM_READY_MAX_WAIT_MS;
      if (!timedOut && !roomTransitionsReady(currentRoom)) return;
      clearInterval(interactionGateTimer);
      interactionGateTimer = null;
      interactionGateClosed = false;
      console.log(`[Preloader] ${timedOut ? 'Wait cap reached' : 'Transitions ready'} — unlocking interaction`);
      const modalOpen = kitchen.isOpen() || isContactInterfaceOpen();
      if (hasRevealed && !isScrollLocked && !modalOpen) hotspots.setInteractiveEnabled(true);
    }, 120);
  }

  function revealUI(opts) {
    hasRevealed = true;
    if (uiContainer) {
      updateUIRoomState(currentRoom);
      uiContainer.classList.remove('ui-hidden');
      uiContainer.classList.add('revealed', 'visible');
    }
    updateRoomTitle(currentRoom);
    fadeBackdropIn();
    hotspots.renderObjects();
    hotspots.setInteractiveEnabled(true);
    isScrollLocked = false;
    queue.reprioritize(currentRoom);
    queue.start(currentRoom);
    if (opts && opts.gate) holdInteractionUntilRoomReady();
  }

  // --- Returning from /projects/ (reload or bfcache restore) ---
  //   'bedroom' -> Return to Room: PC -> Bedroom (reverse BedroomToPC)
  //   'living'  -> Escape:         PC -> Bedroom -> Living (continuous reverse)
  let projectsReturnInProgress = false;

  function readProjectsReturn() {
    try {
      // Escape wins: the PC click also leaves returnFromProjects set.
      if (sessionStorage.getItem('returnFromProjectsToLiving') === 'true') return 'living';
      if (sessionStorage.getItem('returnFromProjects') === 'true') return 'bedroom';
    } catch (e) {
      console.warn('Unable to access sessionStorage:', e);
    }
    return null;
  }

  // Flags are cleared only once the restoration has finished, so a reload mid-animation still works.
  function clearProjectsReturnFlags() {
    try {
      sessionStorage.removeItem('returnFromProjects');
      sessionStorage.removeItem('returnFromProjectsToLiving');
    } catch (e) {}
  }

  // Run cb exactly once when img is decoded (or has failed / does not exist).
  function whenFrameReady(img, cb) {
    let done = false;
    const once = () => { if (!done) { done = true; cb(); } };
    if (!img) { once(); return; }
    if (!img.src && img._targetSrc) img.src = img._targetSrc;
    if (img.complete && img.naturalWidth > 0) { once(); return; }
    if (typeof img.decode === 'function') img.decode().then(once, once);
    else {
      img.addEventListener('load', once, { once: true });
      img.addEventListener('error', once, { once: true });
    }
  }

  function restoreFromProjects(dest) {
    if (projectsReturnInProgress) return; // never run the reverse animation twice
    projectsReturnInProgress = true;

    const toLiving = dest === 'living';
    const finalRoom = toLiving ? 'living' : 'bedroom';
    const finalNav = ROOM_TO_NAV[finalRoom];
    const activeCanvas = getActiveCanvas();

    if (freedomSplash) {
      freedomSplash.style.display = 'none';
      freedomSplash.classList.add('fade-out');
    }

    currentRoom = finalRoom;
    updateRoomTitle(finalRoom);
    updateActiveNav(finalNav);

    if (uiContainer) {
      updateUIRoomState(finalRoom);
      uiContainer.classList.add('ui-hidden');
    }
    if (backdropRect) backdropRect.classList.add('backdrop-hidden');

    isScrollLocked = true;
    hasRevealed = true;
    hotspots.setInteractiveEnabled(false);

    const pcFrames = preloadSequence('bedroom_pc');
    const bedroomLivingFrames = toLiving ? preloadSequence('living_bedroom') : null;
    const finalFrame = toLiving ? bedroomLivingFrames[0] : getRoomBaseFrame('bedroom');

    const finish = () => {
      whenFrameReady(finalFrame, () => {
        if (finalFrame) drawFrameToCanvas(activeCanvas, finalFrame);
        try {
          if (finalNav && window.location.hash !== `#${finalNav}`) {
            window.history.replaceState(null, '', `#${finalNav}`);
          }
        } catch (e) {}
        hotspots.renderObjects();
        fadeBackdropIn();
        fadeUIIn(() => {
          hotspots.setInteractiveEnabled(true);
          isScrollLocked = false;
          clearProjectsReturnFlags();
          projectsReturnInProgress = false;
        });
      });
    };

    const startPlayback = () => {
      const lastFrame = pcFrames[pcFrames.length - 1];
      if (lastFrame) drawFrameToCanvas(activeCanvas, lastFrame);
      // 1. PC -> Bedroom (reverse BedroomToPC)
      playImageSequence(activeCanvas, pcFrames, pcFrames.length - 1, 0, () => {
        if (toLiving) {
          // 2. Bedroom -> Living (reverse), without a stop
          playImageSequence(activeCanvas, bedroomLivingFrames, bedroomLivingFrames.length - 1, 0, finish);
        } else finish();
      });
    };

    whenFrameReady(pcFrames[pcFrames.length - 1], startPlayback);
  }

  // --- Startup ---
  function initPortfolio() {
    const activeCanvas = getActiveCanvas();
    initParallaxEngine();
    hotspots.setInteractiveEnabled(false); // nothing is clickable until the entrance has finished

    const projectsReturn = readProjectsReturn();

    let isIntroCompleted = false;
    try {
      localStorage.removeItem('portfolioIntroCompleted');
      isIntroCompleted = sessionStorage.getItem('portfolioIntroCompleted') === 'true';
    } catch (e) {
      console.warn('Unable to access sessionStorage:', e);
    }

    // PATH 1: back from /projects/
    if (projectsReturn) {
      restoreFromProjects(projectsReturn);
      return;
    }

    // PATH 2: later visit, reload, or a direct room link (#projects, #blog, ...)
    const targetRoom = getRoomFromHash() || 'living';

    // Lands straight on the requested room. `fadeSplash` dissolves the Freedom splash instead of
    // removing it, for when the intro is skipped after loading began.
    const landDirectly = (fadeSplash) => {
      if (freedomSplash) {
        if (fadeSplash) {
          freedomSplash.style.transition = `opacity ${FREEDOM_FADE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          freedomSplash.classList.add('fade-out');
          setTimeout(() => { freedomSplash.style.display = 'none'; }, FREEDOM_FADE_DURATION);
        } else {
          freedomSplash.style.display = 'none';
          freedomSplash.classList.add('fade-out');
        }
      }

      currentRoom = targetRoom;
      updateRoomTitle(targetRoom);
      updateActiveNav(ROOM_TO_NAV[targetRoom] || 'home');

      if (uiContainer) {
        updateUIRoomState(targetRoom);
        uiContainer.classList.remove('ui-hidden');
      }

      const baseFrame = getRoomBaseFrame(targetRoom);
      const drawRoomAndReveal = () => {
        if (baseFrame) drawFrameToCanvas(activeCanvas, baseFrame);
        revealUI({ gate: true });
        kitchen.restoreBlogFromHistoryState();
      };

      if (baseFrame && baseFrame.complete && baseFrame.naturalWidth > 0) drawRoomAndReveal();
      else if (baseFrame) {
        if (typeof baseFrame.decode === 'function') baseFrame.decode().then(drawRoomAndReveal).catch(drawRoomAndReveal);
        else { baseFrame.onload = drawRoomAndReveal; baseFrame.onerror = drawRoomAndReveal; }
      } else {
        revealUI({ gate: true });
        kitchen.restoreBlogFromHistoryState();
      }
    };

    if (isIntroCompleted) {
      landDirectly(false);
      return;
    }

    // PATH 3: first visit — Freedom splash, asset loading, entrance walkthrough.
    isScrollLocked = true;
    hasRevealed = false;
    hotspots.setInteractiveEnabled(false);
    if (uiContainer) {
      uiContainer.classList.add('ui-hidden');
      uiContainer.classList.remove('revealed', 'visible');
    }

    // Slow-connection guard (desktop only): skip a walkthrough that would play choppily.
    const isDesktopViewport = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
    const netInfo = navigator.connection || null;
    const reportsSlowNetwork = !!(netInfo && (netInfo.saveData || /^(slow-2g|2g|3g)$/.test(netInfo.effectiveType || '')));
    let introDecided = false;

    function skipIntro(reason) {
      if (introDecided) return;
      introDecided = true;
      console.log(`[Intro] Skipped (${reason}) — landing on ${targetRoom}`);
      try { sessionStorage.setItem('portfolioIntroCompleted', 'true'); } catch (e) {}
      landDirectly(true);
    }

    if (isDesktopViewport && reportsSlowNetwork) {
      skipIntro('browser reports a slow or data-saving connection');
      return;
    }

    const entranceFrames = initSequenceFrames('entrance');
    const firstEntranceFrame = entranceFrames[0];
    if (firstEntranceFrame && !firstEntranceFrame.src && firstEntranceFrame._targetSrc) {
      firstEntranceFrame.src = firstEntranceFrame._targetSrc;
    }

    function onAssetsReady() {
      if (introDecided) return; // the intro was already skipped as too slow
      introDecided = true;

      // Stream the remaining entrance frames (18..95) in playback order.
      const remainingEntrance = entranceFrames.slice(18);
      let streamIdx = 0;
      let activeStreams = 0;
      const pumpStream = () => {
        while (activeStreams < 4 && streamIdx < remainingEntrance.length) {
          const item = remainingEntrance[streamIdx++];
          activeStreams++;
          loadImage(item).then(() => { activeStreams--; pumpStream(); });
        }
      };
      pumpStream();

      // The Freedom splash fades out, then the walkthrough starts.
      if (freedomSplash) {
        freedomSplash.style.transition = `opacity ${FREEDOM_FADE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        freedomSplash.classList.add('fade-out');
        setTimeout(() => { freedomSplash.style.display = 'none'; }, FREEDOM_FADE_DURATION);
      }
      loader.fadeOutIndicator();

      setTimeout(() => {
        playImageSequence(activeCanvas, entranceFrames, 0, entranceFrames.length - 1, () => {
          try {
            sessionStorage.setItem('portfolioIntroCompleted', 'true');
            document.documentElement.classList.add('intro-completed');
          } catch (e) {}
          const livingBase = getRoomBaseFrame('living');
          if (livingBase) drawFrameToCanvas(activeCanvas, livingBase);
          if (targetRoom && targetRoom !== 'living') {
            currentRoom = 'living';
            revealUI();
            navigateToRoom(targetRoom);
          } else {
            revealUI({ gate: true });
          }
        });
      }, ENTRANCE_START_DELAY);
    }

    // Draw the first entrance frame as soon as it is available.
    const drawFirstFrameIfReady = () => {
      if (firstEntranceFrame && firstEntranceFrame.complete && firstEntranceFrame.naturalWidth > 0) {
        drawFrameToCanvas(activeCanvas, firstEntranceFrame);
      }
    };
    if (firstEntranceFrame && firstEntranceFrame.complete && firstEntranceFrame.naturalWidth > 0) drawFirstFrameIfReady();
    else if (firstEntranceFrame) firstEntranceFrame.onload = drawFirstFrameIfReady;

    if (backdropRect) backdropRect.classList.add('backdrop-hidden');
    if (uiContainer) {
      uiContainer.classList.add('ui-hidden');
      uiContainer.classList.remove('revealed', 'visible');
    }

    loader.loadCriticalAssets(onAssetsReady);
    if (isDesktopViewport) {
      setTimeout(() => skipIntro(`first frames not ready within ${SLOW_CONNECTION_BUFFER_MS}ms`), SLOW_CONNECTION_BUFFER_MS);
    }
  }

  // --- Global keys and history ---
  listen(window, 'keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (isContactInterfaceOpen()) { closeContactInterface(); return; }
      if (kitchen.isOpen()) { kitchen.closeKitchenBlog(); return; }
      if (currentRoom !== 'living' && !isScrollLocked && hasRevealed) navigateToRoom('living');
    }
  });

  // Back/Forward cache restore from /projects/: the page comes back frozen on the last PC frame,
  // so run the same restoration as a normal return (only for a real restore with a return flag).
  listen(window, 'pageshow', (e) => {
    if (!e.persisted) return;
    rememberHouseRoom();
    const dest = readProjectsReturn();
    if (dest) restoreFromProjects(dest);
  });

  // Back / Forward for the case study window (same-document entries).
  listen(window, 'popstate', () => kitchen.syncBlogWithHistory());

  // Hash changes (Back / Forward between rooms).
  listen(window, 'hashchange', () => {
    if (isScrollLocked || !hasRevealed) return;
    const destRoom = getRoomFromHash();
    if (destRoom && destRoom !== currentRoom) {
      if (isContactInterfaceOpen()) closeContactInterface();
      navigateToRoom(destRoom);
    }
  });

  // Development helper: resetIntro() in the console clears the intro flag and reloads.
  window.resetIntro = function () {
    try {
      localStorage.removeItem('portfolioIntroCompleted');
      sessionStorage.removeItem('portfolioIntroCompleted');
      sessionStorage.removeItem('returnFromProjects');
      sessionStorage.removeItem('returnFromProjectsToLiving');
      document.documentElement.classList.remove('intro-completed');
      location.reload();
    } catch (e) {}
  };

  return {
    start: initPortfolio,
    destroy() {
      cleanups.forEach((fn) => fn());
      stopCurrentAnimation();
      if (interactionGateTimer) clearInterval(interactionGateTimer);
      kitchen.destroy();
      if (parallaxInstance && parallaxInstance.destroy) parallaxInstance.destroy();
    },
    hotspots,
    kitchen,
    onNavClick,
    onExploreProjects,
    onHomeExplore,
    onKitchenIntro,
    onContactIntro,
    onSocialEnter,
    closeContact: closeContactInterface,
    isLocked: () => isScrollLocked,
  };
}
