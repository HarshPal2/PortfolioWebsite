/**
 * Harsh Portfolio — Unified House Room Navigation & Interaction Controller (24 FPS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM References ---
  const canvasA = document.getElementById('sequence-canvas');
  const canvasB = document.getElementById('sequence-canvas-secondary');
  const uiContainer = document.getElementById('ui-container');
  const freedomSplash = document.getElementById('freedom-splash');
  const backdropRect = document.querySelector('.fullscreen-backdrop-rect');
  const sceneElement = document.getElementById('parallax-scene');
  const navLinks = document.querySelectorAll('.nav-link');
  const roomTitleEl = document.querySelector('.freedom-title h1');

  // --- Entrance Sequence Timing Constants ---
  const FREEDOM_FADE_DURATION = 800;    // Duration (ms) for Freedom title to smoothly fade out to 0 opacity

  let hasRevealed = false;
  let isScrollLocked = false;
  let currentRoom = 'living';
  let currentAnimId = null;
  let currentActiveFrameImg = null;
  let parallaxInstance = null;

  function getActiveCanvas() {
    return canvasA && canvasA.classList.contains('active-video') ? canvasA : canvasB;
  }

  // --- Animation Sequence Definitions ---
  const sequences = {
    'entrance': { folder: 'Media/Entrance/', prefix: 'Entrance', start: 1, count: 96 },
    'living_bedroom': { folder: 'Media/Living_Bedroom/', prefix: 'LivingToBedroom', start: 97, count: 48 },
    'living_kitchen': { folder: 'Media/Living_Kitchen/', prefix: 'LivingToKitchen', start: 146, count: 24 },
    'living_pool': { folder: 'Media/Living_Pool/', prefix: 'LivingToPool', start: 171, count: 48 },
    'living_office': { folder: 'Media/Living_Office/', prefix: 'LivingToOffice', start: 220, count: 48 },
    'office_bedroom': { folder: 'Media/Office_Bedroom/', prefix: 'OfficeToBedroom', start: 269, count: 48 },
    'bedroom_kitchen': { folder: 'Media/Bedroom_Kitchen/', prefix: 'BedroomToKitchen', start: 318, count: 24 },
    'kitchen_pool': { folder: 'Media/Kitchen_Pool/', prefix: 'KitchenToPool', start: 343, count: 48 },
    'pool_office': { folder: 'Media/Pool_Office/', prefix: 'PoolToOffice', start: 392, count: 48 },
    'office_kitchen': { folder: 'Media/Office_Kitchen/', prefix: 'OfficetoKitchen', start: 441, count: 48 },
    'pool_bedroom': { folder: 'Media/Pool_Bedroom/', prefix: 'PoolToBedroom', start: 490, count: 48 },
    'bedroom_pc': { folder: 'Media/BedroomToPCScreen/', prefix: 'BedroomtoPc', start: 539, count: 24 }
  };

  // Format extension for sequence frames (all media navigation assets are .avif)
  const imgExt = '.avif';
  console.log(`[AssetEngine] Using format ${imgExt} for animation sequences`);

  // --- In-Memory Frame Cache & LRU Eviction Policy ---
  const frameCache = {};
  const cacheAccessTimes = {};
  const MAX_CACHED_SEQUENCES = 6; // Keep RAM usage bounded and predictable

  function pad4(n) {
    return String(n).padStart(4, '0');
  }

  function pruneCache() {
    const keys = Object.keys(frameCache);
    if (keys.length <= MAX_CACHED_SEQUENCES) return;

    // Never evict entrance, current room connections, or current active sequence
    const protectedKeys = new Set(['entrance']);
    if (BackgroundAssetQueue._roomAdjacency[currentRoom]) {
      BackgroundAssetQueue._roomAdjacency[currentRoom].forEach((k) => protectedKeys.add(k));
    }

    const evictCandidates = keys
      .filter((k) => !protectedKeys.has(k))
      .sort((a, b) => (cacheAccessTimes[a] || 0) - (cacheAccessTimes[b] || 0));

    if (evictCandidates.length > 0) {
      const toEvict = evictCandidates[0];
      delete frameCache[toEvict];
      delete cacheAccessTimes[toEvict];
    }
  }

  function initSequenceFrames(key) {
    cacheAccessTimes[key] = Date.now();
    if (frameCache[key]) return frameCache[key];

    const seq = sequences[key];
    if (!seq) return [];

    const frames = [];
    const start = seq.start || 1;
    for (let i = 0; i < seq.count; i++) {
      const frameNum = start + i;
      const img = new Image();
      const baseSrc = `${seq.folder}${seq.prefix}${pad4(frameNum)}`;
      img._targetSrc = `${baseSrc}${imgExt}`;
      frames.push(img);
    }

    frameCache[key] = frames;
    pruneCache();
    return frames;
  }

  function preloadSequence(key) {
    const frames = initSequenceFrames(key);
    frames.forEach((img) => {
      if (!img.src && img._targetSrc) {
        img.src = img._targetSrc;
      }
    });
    return frames;
  }

  // --- Progressive Background Asset Queue ---
  // Loads non-critical sequences in small, throttled batches during idle time.
  // Prioritizes outgoing transitions from currentRoom. Never chokes the main thread.
  const BackgroundAssetQueue = {
    _queue: [],
    _activeLoading: 0,
    _concurrency: 3, // at most 3 images loading concurrently
    _isPaused: false,
    _hasStarted: false,

    _roomAdjacency: {
      'living': ['living_bedroom', 'living_office', 'living_kitchen', 'living_pool'],
      'bedroom': ['bedroom_pc', 'bedroom_kitchen', 'office_bedroom', 'pool_bedroom', 'living_bedroom'],
      'kitchen': ['bedroom_kitchen', 'office_kitchen', 'kitchen_pool', 'living_kitchen'],
      'poolroom': ['pool_bedroom', 'kitchen_pool', 'pool_office', 'living_pool'],
      'office': ['living_office', 'office_bedroom', 'office_kitchen', 'pool_office']
    },

    start() {
      if (this._hasStarted) return;
      this._hasStarted = true;
      this.reprioritize(currentRoom);
      this._pump();
    },

    pause() {
      this._isPaused = true;
    },

    resume() {
      this._isPaused = false;
      this._pump();
    },

    reprioritize(room) {
      const adjacent = this._roomAdjacency[room] || [];
      const allKeys = Object.keys(sequences).filter((k) => k !== 'entrance');
      // Priority: adjacent sequences first, then remaining sequences
      const priorityOrder = [...adjacent, ...allKeys.filter((k) => !adjacent.includes(k))];

      const newQueue = [];
      priorityOrder.forEach((seqKey) => {
        const seq = sequences[seqKey];
        if (!seq) return;
        const cached = frameCache[seqKey];
        if (cached && cached.every((img) => img.complete && img.naturalWidth > 0)) {
          return;
        }
        for (let i = 1; i <= seq.count; i++) {
          newQueue.push({ seqKey, index: i });
        }
      });

      this._queue = newQueue;
      this._pump();
    },

    _pump() {
      if (this._isPaused) return;

      while (this._activeLoading < this._concurrency && this._queue.length > 0) {
        const item = this._queue.shift();
        const seq = sequences[item.seqKey];
        if (!seq) continue;

        if (!frameCache[item.seqKey]) {
          preloadSequence(item.seqKey);
        }

        const img = frameCache[item.seqKey][item.index - 1];
        if (!img || (img.complete && img.naturalWidth > 0)) {
          continue;
        }

        this._activeLoading++;
        const onDone = () => {
          this._activeLoading--;
          this._pump();
        };

        if (typeof img.decode === 'function') {
          img.decode().then(onDone).catch(onDone);
        } else {
          img.addEventListener('load', onDone, { once: true });
          img.addEventListener('error', onDone, { once: true });
        }
      }
    }
  };

  // ---------------------------------------------------------------------------
  // Critical Asset Preloader
  // Ensures every required image is in the browser's decoded cache before the
  // entrance animation begins. Progress is logged and shown via the Freedom loading indicator.
  // ---------------------------------------------------------------------------
  const AssetLoader = {
    _totalCritical: 0,
    _loadedCritical: 0,
    _onComplete: null,
    _indicatorEl: null,
    _percentEl: null,
    _indicatorRevealTimer: null,

    _loadImage(img) {
      return new Promise((resolve) => {
        if (!img) {
          resolve(false);
          return;
        }
        if (!img.src && img._targetSrc) {
          img.src = img._targetSrc;
        }
        if (img.complete) {
          resolve(img.naturalWidth > 0);
          return;
        }
        const onDone = () => {
          img.removeEventListener('load', onDone);
          img.removeEventListener('error', onDone);
          resolve(img.naturalWidth > 0);
        };
        img.addEventListener('load', onDone, { once: true });
        img.addEventListener('error', onDone, { once: true });
      });
    },

    _decodeImage(img) {
      return this._loadImage(img);
    },

    _getIndicator() {
      if (!this._indicatorEl) {
        this._indicatorEl = document.getElementById('freedom-loading-indicator');
        this._percentEl   = document.getElementById('freedom-loading-percent');
      }
      return this._indicatorEl;
    },

    _updateIndicator(loaded, total) {
      const pct = Math.min(100, Math.round((loaded / total) * 100));
      if (this._percentEl) this._percentEl.textContent = `${pct}%`;
    },

    fadeOutIndicator() {
      return new Promise((resolve) => {
        if (this._indicatorRevealTimer) {
          clearTimeout(this._indicatorRevealTimer);
          this._indicatorRevealTimer = null;
        }
        const el = this._getIndicator();
        if (!el) { resolve(); return; }
        el.classList.add('is-fading-out');
        el.classList.remove('is-visible');
        setTimeout(resolve, 350);
      });
    },

    loadCriticalAssets(onComplete) {
      // 1. Initialize entrance sequence without firing 96 network requests at once
      const entranceFrames = initSequenceFrames('entrance');

      // Frame 1 starts immediately for early canvas display
      if (!entranceFrames[0].src && entranceFrames[0]._targetSrc) {
        entranceFrames[0].src = entranceFrames[0]._targetSrc;
      }

      // Preload living base frame directly (single image) without loading all 48 bedroom transition frames
      const livingBaseImg = new Image();
      livingBaseImg.src = 'Media/Living_Bedroom/LivingToBedroom0097.avif';

      const crossImg = new Image();
      crossImg.src = 'Media/Cross.png';

      // Safe playback buffer: 18 frames (~0.75s of animation at 24fps) + living base + Cross
      // This loads rapidly in 1.5 - 2.5s and delivers a perfectly smooth startup
      const BUFFER_COUNT = 18;
      const bufferFrames = entranceFrames.slice(0, BUFFER_COUNT);

      const criticalItems = [
        ...bufferFrames,
        livingBaseImg,
        crossImg
      ];

      this._totalCritical  = criticalItems.length;
      this._loadedCritical = 0;
      this._onComplete     = onComplete;

      console.log(`[Preloader] Tracking initial buffer — ${this._totalCritical} critical assets`);

      // Make indicator visible immediately
      const el = this._getIndicator();
      if (el) el.classList.add('is-visible');

      let resolved = 0;
      let hasCompleted = false;

      const finish = () => {
        if (hasCompleted) return;
        hasCompleted = true;
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
        if (this._onComplete) {
          const cb = this._onComplete;
          this._onComplete = null;
          cb();
        }
      };

      // Safety fallback: 8s maximum wait for buffer
      let safetyTimer = setTimeout(() => {
        console.warn('[Preloader] Buffer timer elapsed — proceeding to animation');
        finish();
      }, 8000);

      // Pipelined concurrent loading: 4 images at a time for optimal HTTP/2 throughput
      let idx = 0;
      let activeRequests = 0;
      const concurrency = 4;

      const pump = () => {
        while (activeRequests < concurrency && idx < criticalItems.length) {
          const item = criticalItems[idx++];
          activeRequests++;
          this._loadImage(item).then(() => {
            activeRequests--;
            resolved++;
            this._loadedCritical = resolved;
            this._updateIndicator(resolved, this._totalCritical);
            if (resolved >= this._totalCritical) {
              finish();
            } else {
              pump();
            }
          });
        }
      };
      pump();
    },
  };


  // --- Canvas Image Renderer ---
  function drawFrameToCanvas(canvas, img) {
    if (!canvas || !img) return;
    currentActiveFrameImg = img;

    if (img.naturalWidth === 0) return;

    const targetWidth = canvas.clientWidth || Math.round(window.innerWidth * 1.1);
    const targetHeight = canvas.clientHeight || Math.round(window.innerHeight * 1.1);

    if (canvas.width !== targetWidth) canvas.width = targetWidth;
    if (canvas.height !== targetHeight) canvas.height = targetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');

    const imgRatio = img.naturalWidth / img.naturalHeight;
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
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    if (typeof InteractiveObjectManager !== 'undefined' && InteractiveObjectManager.updateStageBounds) {
      InteractiveObjectManager.updateStageBounds({
        x: offsetX,
        y: offsetY,
        width: drawWidth,
        height: drawHeight
      });
    }
  }

  window.addEventListener('resize', () => {
    if (currentActiveFrameImg) {
      drawFrameToCanvas(getActiveCanvas(), currentActiveFrameImg);
      if (typeof InteractiveObjectManager !== 'undefined') {
        InteractiveObjectManager.renderObjects();
      }
    }
  });

  function stopCurrentAnimation() {
    if (currentAnimId !== null) {
      cancelAnimationFrame(currentAnimId);
      currentAnimId = null;
    }
  }

  function playImageSequence(canvas, frames, startIdx, endIdx, onComplete, onFrame) {
    stopCurrentAnimation();
    if (!frames || frames.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let currentIdx = startIdx;
    const step = startIdx <= endIdx ? 1 : -1;
    const frameInterval = 1000 / 24; // 24 FPS = 41.67ms per frame
    let lastTime = performance.now();

    function animate(now) {
      const delta = now - lastTime;
      if (delta >= frameInterval) {
        lastTime = now - (delta % frameInterval);

        const img = frames[currentIdx];
        if (img && img.naturalWidth > 0) {
          drawFrameToCanvas(canvas, img);

          if (typeof onFrame === 'function') {
            onFrame(currentIdx);
          }

          if (currentIdx === endIdx) {
            currentAnimId = null;
            if (onComplete) onComplete();
            return;
          }
          currentIdx += step;
        } else if (img && !img.complete) {
          // If this frame is still downloading, hold current canvas display and wait for it
          if (!img.src && img._targetSrc) {
            img.src = img._targetSrc;
          }
          if (!img._loadWaiting) {
            img._loadWaiting = true;
            img._waitStartTime = performance.now();
            const onReady = () => {
              img._loadWaiting = false;
            };
            img.addEventListener('load', onReady, { once: true });
            img.addEventListener('error', onReady, { once: true });
          } else if (img._waitStartTime && (performance.now() - img._waitStartTime > 150)) {
            // Frame wait limit exceeded (150ms) — skip forward so animation flow doesn't freeze
            img._loadWaiting = false;
            if (currentIdx === endIdx) {
              currentAnimId = null;
              if (onComplete) onComplete();
              return;
            }
            currentIdx += step;
          }
        } else {
          // Frame completed with error or unavailable — skip to next to keep sequence flowing
          if (currentIdx === endIdx) {
            currentAnimId = null;
            if (onComplete) onComplete();
            return;
          }
          currentIdx += step;
        }
      }
      currentAnimId = requestAnimationFrame(animate);
    }

    const firstImg = frames[startIdx];
    if (firstImg) {
      if (!firstImg.src && firstImg._targetSrc) {
        firstImg.src = firstImg._targetSrc;
      }
      if (firstImg.complete && firstImg.naturalWidth > 0) {
        drawFrameToCanvas(canvas, firstImg);
      }
    }
    if (typeof onFrame === 'function') {
      onFrame(startIdx);
    }
    currentAnimId = requestAnimationFrame(animate);
  }

  // --- Room Navigation State & Title Controller ---
  const roomToNav = {
    'living': 'home',
    'bedroom': 'projects',
    'kitchen': 'blog',
    'poolroom': 'about-me',
    'office': 'contact'
  };

  const navToRoom = {
    'home': 'living',
    'about': 'living',
    'projects': 'bedroom',
    'blog': 'kitchen',
    'blogs': 'kitchen',
    'about-me': 'poolroom',
    'aboutme': 'poolroom',
    'reviews': 'poolroom',
    'contact': 'office'
  };

  function getRoomFromHash() {
    try {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
      if (!hash) return null;
      if (navToRoom[hash]) return navToRoom[hash];
      if (['living', 'bedroom', 'kitchen', 'poolroom', 'office'].includes(hash)) return hash;
    } catch (e) {}
    return null;
  }

  const roomTitles = {
    'living': 'Freedom',
    'bedroom': 'Projects',
    'kitchen': 'Blog',
    'poolroom': 'About Me',
    'office': 'Contact'
  };

  function updateRoomTitle(roomKey) {
    if (roomTitleEl && roomTitles[roomKey]) {
      roomTitleEl.textContent = roomTitles[roomKey];
    }
  }

  function updateActiveNav(targetNavKey) {
    navLinks.forEach((l) => {
      const navKey = l.getAttribute('data-nav') || l.getAttribute('href').replace('#', '');
      if (
        navKey === targetNavKey ||
        (targetNavKey === 'home' && (navKey === 'home' || navKey === 'about')) ||
        (targetNavKey === 'about-me' && (navKey === 'about-me' || navKey === 'aboutme' || navKey === 'reviews')) ||
        (targetNavKey === 'blog' && (navKey === 'blog' || navKey === 'blogs'))
      ) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
  }

  // Complete bidirectional room-to-room animation graph
  const roomConnections = {
    'living-bedroom': { seq: 'living_bedroom', reverse: false },
    'bedroom-living': { seq: 'living_bedroom', reverse: true },

    'living-kitchen': { seq: 'living_kitchen', reverse: false },
    'kitchen-living': { seq: 'living_kitchen', reverse: true },

    'living-poolroom': { seq: 'living_pool', reverse: false },
    'poolroom-living': { seq: 'living_pool', reverse: true },

    'living-office': { seq: 'living_office', reverse: false },
    'office-living': { seq: 'living_office', reverse: true },

    'bedroom-kitchen': { seq: 'bedroom_kitchen', reverse: false },
    'kitchen-bedroom': { seq: 'bedroom_kitchen', reverse: true },

    'bedroom-poolroom': { seq: 'pool_bedroom', reverse: true },
    'poolroom-bedroom': { seq: 'pool_bedroom', reverse: false },

    'office-bedroom': { seq: 'office_bedroom', reverse: false },
    'bedroom-office': { seq: 'office_bedroom', reverse: true },

    'kitchen-poolroom': { seq: 'kitchen_pool', reverse: false },
    'poolroom-kitchen': { seq: 'kitchen_pool', reverse: true },

    'office-kitchen': { seq: 'office_kitchen', reverse: false },
    'kitchen-office': { seq: 'office_kitchen', reverse: true },

    'poolroom-office': { seq: 'pool_office', reverse: false },
    'office-poolroom': { seq: 'pool_office', reverse: true }
  };

  // Circular scroll loop order
  const scrollCircle = ['living', 'bedroom', 'kitchen', 'poolroom', 'office'];

  // --- 25% Black Backdrop Fade Controller ---
  function fadeBackdropOut(onComplete) {
    if (!backdropRect) {
      if (onComplete) onComplete();
      return;
    }

    const computedOpacity = window.getComputedStyle(backdropRect).opacity;
    if (parseFloat(computedOpacity) < 0.05 || backdropRect.classList.contains('backdrop-hidden')) {
      if (onComplete) onComplete();
      return;
    }

    let hasCompleted = false;
    const finish = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      backdropRect.removeEventListener('transitionend', handleTransitionEnd);
      if (onComplete) onComplete();
    };

    const handleTransitionEnd = (e) => {
      if (e.target === backdropRect && e.propertyName === 'opacity') {
        finish();
      }
    };

    backdropRect.addEventListener('transitionend', handleTransitionEnd);
    setTimeout(finish, 600);

    backdropRect.classList.add('backdrop-hidden');
  }

  function fadeBackdropIn(onComplete) {
    if (!backdropRect) {
      if (onComplete) onComplete();
      return;
    }

    const computedOpacity = window.getComputedStyle(backdropRect).opacity;
    if (parseFloat(computedOpacity) > 0.95 && !backdropRect.classList.contains('backdrop-hidden')) {
      if (onComplete) onComplete();
      return;
    }

    let hasCompleted = false;
    const finish = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      backdropRect.removeEventListener('transitionend', handleTransitionEnd);
      if (onComplete) onComplete();
    };

    const handleTransitionEnd = (e) => {
      if (e.target === backdropRect && e.propertyName === 'opacity') {
        finish();
      }
    };

    backdropRect.addEventListener('transitionend', handleTransitionEnd);
    setTimeout(finish, 600);

    backdropRect.classList.remove('backdrop-hidden');
  }

  // --- UI Fade Controller ---
  function fadeUIOut(onComplete) {
    if (!uiContainer) {
      if (onComplete) onComplete();
      return;
    }

    const computedOpacity = window.getComputedStyle(uiContainer).opacity;
    if (parseFloat(computedOpacity) < 0.05 || uiContainer.classList.contains('ui-hidden')) {
      uiContainer.classList.remove('visible', 'revealed');
      if (onComplete) onComplete();
      return;
    }

    let hasCompleted = false;
    const finish = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      uiContainer.removeEventListener('transitionend', handleTransitionEnd);
      uiContainer.classList.remove('visible', 'revealed');
      if (onComplete) onComplete();
    };

    const handleTransitionEnd = (e) => {
      if (e.target === uiContainer && e.propertyName === 'opacity') {
        finish();
      }
    };

    uiContainer.addEventListener('transitionend', handleTransitionEnd);
    setTimeout(finish, 550);

    uiContainer.classList.add('ui-hidden');
  }

  const allRooms = ['living', 'bedroom', 'kitchen', 'poolroom', 'office'];

  function updateUIRoomState(room) {
    if (!uiContainer) return;
    allRooms.forEach((r) => uiContainer.classList.remove(`room-${r}`));
    uiContainer.classList.add(`room-${room}`);

    if (room === 'living') {
      uiContainer.classList.remove('projects-mode');
    } else {
      uiContainer.classList.add('projects-mode');
    }
  }

  function fadeUIIn(onComplete) {
    if (!uiContainer) {
      if (onComplete) onComplete();
      return;
    }

    updateUIRoomState(currentRoom);

    uiContainer.classList.remove('ui-hidden');
    uiContainer.classList.add('visible');
    uiContainer.classList.add('revealed');

    let hasCompleted = false;
    const finish = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      uiContainer.removeEventListener('transitionend', handleTransitionEnd);
      if (onComplete) onComplete();
    };

    const handleTransitionEnd = (e) => {
      if (e.target === uiContainer && e.propertyName === 'opacity') {
        finish();
      }
    };

    uiContainer.addEventListener('transitionend', handleTransitionEnd);
    setTimeout(finish, 550);
  }

  function getRoomBaseFrame(room) {
    if (room === 'living') {
      const frames = preloadSequence('living_bedroom');
      return frames ? frames[0] : null;
    }
    if (room === 'bedroom') {
      const frames = preloadSequence('living_bedroom');
      return frames ? frames[frames.length - 1] : null;
    }
    if (room === 'kitchen') {
      const frames = preloadSequence('living_kitchen');
      return frames ? frames[frames.length - 1] : null;
    }
    if (room === 'poolroom') {
      const frames = preloadSequence('living_pool');
      return frames ? frames[frames.length - 1] : null;
    }
    if (room === 'office') {
      const frames = preloadSequence('living_office');
      return frames ? frames[frames.length - 1] : null;
    }
    return null;
  }

  // --- Unified Room-to-Room Transition Controller ---
  function navigateToRoom(destRoom, onComplete) {
    if (isScrollLocked) return;
    if (currentRoom === destRoom) return;

    const connKey = `${currentRoom}-${destRoom}`;
    const conn = roomConnections[connKey];
    if (!conn) {
      console.warn(`No connection defined for: ${connKey}`);
      return;
    }

    isScrollLocked = true;
    if (typeof InteractiveObjectManager !== 'undefined') {
      InteractiveObjectManager.setInteractiveEnabled(false);
    }

    let hasCompletedTransition = false;
    let safetyTimer = null;

    const completeTransition = () => {
      if (hasCompletedTransition) return;
      hasCompletedTransition = true;
      if (safetyTimer) {
        clearTimeout(safetyTimer);
        safetyTimer = null;
      }

      currentRoom = destRoom;

      const baseFrame = getRoomBaseFrame(destRoom);
      const activeCanvas = getActiveCanvas();
      if (baseFrame && activeCanvas) {
        if (baseFrame.complete && baseFrame.naturalWidth > 0) {
          drawFrameToCanvas(activeCanvas, baseFrame);
        } else {
          const onBaseReady = () => drawFrameToCanvas(activeCanvas, baseFrame);
          baseFrame.addEventListener('load', onBaseReady, { once: true });
        }
      }

      updateRoomTitle(destRoom);

      const destNav = roomToNav[destRoom];
      updateActiveNav(destNav);

      // Keep URL hash synchronized cleanly
      try {
        if (destNav && window.location.hash !== `#${destNav}`) {
          window.history.replaceState(null, '', `#${destNav}`);
        }
      } catch (e) {}

      if (uiContainer) {
        updateUIRoomState(destRoom);
      }

      if (typeof InteractiveObjectManager !== 'undefined') {
        InteractiveObjectManager.renderObjects();
      }

      fadeBackdropIn();

      fadeUIIn(() => {
        if (typeof InteractiveObjectManager !== 'undefined') {
          InteractiveObjectManager.setInteractiveEnabled(true);
        }
        isScrollLocked = false;
        BackgroundAssetQueue.reprioritize(destRoom);
        BackgroundAssetQueue.resume();
        if (onComplete) onComplete();
      });
    };

    // Safety timeout: transition must never leave the user permanently locked
    safetyTimer = setTimeout(() => {
      if (!hasCompletedTransition) {
        console.warn(`[Transition] Safety timeout fired for ${connKey} — completing room state`);
        stopCurrentAnimation();
        completeTransition();
      }
    }, 6000);

    let uiDone = false;
    let backdropDone = false;

    const startAnimation = () => {
      if (!uiDone || !backdropDone) return;
      if (hasCompletedTransition) return;

      const frames = preloadSequence(conn.seq);
      const activeCanvas = getActiveCanvas();

      const startIdx = conn.reverse ? frames.length - 1 : 0;
      const endIdx = conn.reverse ? 0 : frames.length - 1;

      BackgroundAssetQueue.pause();
      playImageSequence(activeCanvas, frames, startIdx, endIdx, () => {
        completeTransition();
      });
    };

    fadeUIOut(() => {
      uiDone = true;
      startAnimation();
    });

    fadeBackdropOut(() => {
      backdropDone = true;
      startAnimation();
    });
  }

  // ==========================================================================
  // Interactive Objects Architectural Framework
  // ==========================================================================
  const INTERACTION_DEBUG = false;

  const interactiveObjects = {
    // Living Room (About Me) -> Corridor / Doorway leading to Bedroom (Projects)
    livingBedroomDoor: Object.freeze({
      id: 'livingBedroomDoor',
      room: 'living',
      label: 'Projects',
      shape: 'polygon',
      bounds: Object.freeze({
        left: '8%',
        top: '18%',
        width: '24%',
        height: '62%'
      }),
      polygon: '12,36 47,40 46,80.5 9.5,88.5',
      interactionType: 'both',
      cursor: 'pointer',
      glowColor: '#ffffff',
      glowSoftColor: 'rgba(255, 255, 255, 0.45)',
      fillColor: 'rgba(255, 255, 255, 0.08)',
      strokeColor: 'rgb(255, 255, 255)',
      action: Object.freeze({
        type: 'navigate',
        targetRoom: 'bedroom',
        animation: null
      })
    }),

    // Living Room (About Me) -> Corridor / Doorway leading to Office (Contact Me)
    livingOfficeDoor: Object.freeze({
      id: 'livingOfficeDoor',
      room: 'living',
      label: 'Contact Me',
      shape: 'polygon',
      bounds: Object.freeze({
        left: '82.3%',
        top: '42.5%',
        width: '9.4%',
        height: '27.9%'
      }),
      polygon: '0.0,0.0 97.8,-7.5 100.0,109.0 2,92.0',
      interactionType: 'both',
      cursor: 'pointer',
      glowColor: '#ffffff',
      glowSoftColor: 'rgba(255, 255, 255, 0.45)',
      fillColor: 'rgba(255, 255, 255, 0.08)',
      strokeColor: 'rgb(255, 255, 255)',
      action: Object.freeze({
        type: 'navigate',
        targetRoom: 'office',
        animation: null
      })
    }),


    // Bedroom (Projects) -> PC Screen Interaction Animation (Hold on last frame test)
    bedroomPC: Object.freeze({
      id: 'bedroomPC',
      room: 'bedroom',
      label: 'PC',
      shape: 'polygon',
      bounds: Object.freeze({
        left: '39.8%',
        top: '49.0%',
        width: '6.8%',
        height: '4.6%'
      }),
      polygon: '2,20 85,20 88,88 2,94',
      interactionType: 'both',
      cursor: 'pointer',
      glowColor: '#ffffff',
      glowSoftColor: 'rgba(255, 255, 255, 0.45)',
      fillColor: 'rgba(255, 255, 255, 0.08)',
      strokeColor: 'rgb(255, 255, 255)',
      action: Object.freeze({
        type: 'url',
        sequence: 'bedroom_pc',
        url: 'projects/'
      })
    }),

    // Contact Room (Office) -> Harsh Figure Interaction (from Media/Colliders/OfficeCollider.svg)
    officeContact: Object.freeze({
      id: 'officeContact',
      room: 'office',
      label: 'Contact Me',
      shape: 'path',
      bounds: Object.freeze({
        left: '0%',
        top: '0%',
        width: '100%',
        height: '100%'
      }),
      viewBox: '0 0 480 480',
      preserveAspectRatio: 'none',
      path: 'M276.74,270.78c-.06-.07-.05-.19-.04-.44.01-.68.02-1.36.04-2.04.05-2.72.1-5.43.15-8.15.1-5.43.19-10.86.29-16.29.05-2.77.1-5.54.15-8.31.02-.96.04-1.94.33-2.86.95-2.96,4.29-4.31,7.24-5.28.72-2.81-1.26-5.66-1.12-8.56.05-1.03.37-2.05.93-2.92,1.04-1.61,2.92-2.67,4.84-2.62s3.78,1.26,4.52,3.03c.8,1.89.3,4.09-.53,5.97-.63,1.43-1.45,2.77-2.42,3.99,2.55.37,5.05,1.09,7.4,2.15.36.16.73.34.99.64.31.35.42.83.52,1.29.45,2.22.55,4.5.65,6.76.15,3.48.31,6.95.46,10.43.05,1.13.1,2.28-.12,3.39-.22,1.13-.71,2.18-1.08,3.27-.76,2.27-.97,4.69-1.17,7.07-.36,4.21-.72,8.43-.6,12.66-5.36-.78-10.72-1.56-16.08-2.34-1.34-.2-2.68-.39-4.02-.59-.32-.05-.64-.09-.96-.14-.2-.03-.3-.05-.35-.11Z',
      interactionType: 'both',
      cursor: 'pointer',
      glowColor: '#ffffff',
      glowSoftColor: 'rgba(255, 255, 255, 0.45)',
      fillColor: 'rgba(255, 255, 255, 0.08)',
      strokeColor: 'rgb(255, 255, 255)',
      action: Object.freeze({
        type: 'contact'
      })
    }),

    // Kitchen Room -> Island Counter Blog Interaction
    kitchenBlog: Object.freeze({
      id: 'kitchenBlog',
      room: 'kitchen',
      label: 'Kitchen Blog Lab',
      shape: 'rect',
      bounds: Object.freeze({
        left: '41%',
        top: '54%',
        width: '26%',
        height: '22%'
      }),
      interactionType: 'both',
      cursor: 'pointer',
      glowColor: '#ff7a18',
      glowSoftColor: 'rgba(255, 122, 24, 0.45)',
      fillColor: 'rgba(255, 122, 24, 0.08)',
      strokeColor: '#ff7a18',
      action: Object.freeze({
        type: 'kitchen_blog'
      })
    })
  };

  function navigateUrl(targetUrl) {
    if (!targetUrl) return;
    if (targetUrl === '/projects' || targetUrl === 'projects/' || targetUrl === 'projects' || targetUrl === '/projects/') {
      try {
        sessionStorage.setItem('returnFromProjects', 'true');
      } catch (err) { }

      if (window.location.protocol === 'file:') {
        window.location.href = 'projects/index.html';
      } else {
        window.location.href = 'projects/';
      }
      return;
    }
    window.location.href = targetUrl;
  }

  const InteractiveObjectManager = {
    stage: null,
    tooltipEl: null,
    currentBounds: { x: 0, y: 0, width: 0, height: 0 },

    init() {
      this.stage = document.getElementById('interactive-stage');
      this.createTooltip();
      // Start fully disabled — do not render any objects or accept any input
      // until the entrance sequence has completely finished (revealUI is called).
      this.setInteractiveEnabled(false);
    },

    createTooltip() {
      if (!this.tooltipEl) {
        let el = document.getElementById('interaction-tooltip');
        if (!el) {
          el = document.createElement('div');
          el.id = 'interaction-tooltip';
          el.className = 'interaction-tooltip';
          document.body.appendChild(el);
        }
        this.tooltipEl = el;
      }
    },

    showTooltip(text, clientX, clientY) {
      if (isScrollLocked || !text) return;
      if (!this.tooltipEl) this.createTooltip();
      if (!this.tooltipEl) return;
      this.tooltipEl.textContent = text;
      this.tooltipEl.classList.add('visible');
      this.updateTooltipPosition(clientX, clientY);
    },

    updateTooltipPosition(clientX, clientY) {
      if (!this.tooltipEl || !this.tooltipEl.classList.contains('visible') || isScrollLocked) return;
      const offset = 14;
      const tipRect = this.tooltipEl.getBoundingClientRect();
      const tipWidth = tipRect.width || 80;
      const tipHeight = tipRect.height || 28;

      let posX = clientX + offset;
      let posY = clientY + offset;

      // If colliding with right or bottom screen edges, relocate to top-left corner of cursor
      const collidesRight = posX + tipWidth + 12 > window.innerWidth;
      const collidesBottom = posY + tipHeight + 12 > window.innerHeight;

      if (collidesRight || collidesBottom) {
        posX = clientX - tipWidth - offset;
        posY = clientY - tipHeight - offset;
      }

      // Clamp inside viewport
      posX = Math.max(8, Math.min(posX, window.innerWidth - tipWidth - 8));
      posY = Math.max(8, Math.min(posY, window.innerHeight - tipHeight - 8));

      this.tooltipEl.style.transform = `translate3d(${Math.round(posX)}px, ${Math.round(posY)}px, 0)`;
    },

    hideTooltip() {
      if (this.tooltipEl) {
        this.tooltipEl.classList.remove('visible');
      }
    },

    updateStageBounds(bounds) {
      if (!this.stage) {
        this.stage = document.getElementById('interactive-stage');
      }
      if (!this.stage) return;
      if (bounds) {
        if (
          this.currentBounds.x === bounds.x &&
          this.currentBounds.y === bounds.y &&
          this.currentBounds.width === bounds.width &&
          this.currentBounds.height === bounds.height
        ) {
          return;
        }
        this.currentBounds = bounds;
      }
      this.stage.style.left = `${this.currentBounds.x}px`;
      this.stage.style.top = `${this.currentBounds.y}px`;
      this.stage.style.width = `${this.currentBounds.width}px`;
      this.stage.style.height = `${this.currentBounds.height}px`;
    },

    renderObjects() {
      if (!this.stage) {
        this.stage = document.getElementById('interactive-stage');
      }
      if (!this.stage) return;

      if (this.currentBounds.width === 0 && currentActiveFrameImg) {
        const activeCanvas = getActiveCanvas();
        if (activeCanvas) {
          drawFrameToCanvas(activeCanvas, currentActiveFrameImg);
        }
      } else {
        this.updateStageBounds(this.currentBounds);
      }

      this.stage.innerHTML = '';
      this.hideTooltip();

      if (INTERACTION_DEBUG) {
        this.stage.classList.add('interactive-debug-active');
      } else {
        this.stage.classList.remove('interactive-debug-active');
      }

      Object.values(interactiveObjects).forEach((config) => {
        if (config.room !== currentRoom) return;

        const objEl = document.createElement('div');
        objEl.className = 'interactive-object';
        objEl.id = `obj-${config.id}`;
        objEl.setAttribute('data-object-id', config.id);

        objEl.style.left = config.bounds.left;
        objEl.style.top = config.bounds.top;
        objEl.style.width = config.bounds.width;
        objEl.style.height = config.bounds.height;

        if (config.glowColor) objEl.style.setProperty('--obj-glow', config.glowColor);
        if (config.glowSoftColor) objEl.style.setProperty('--obj-glow-soft', config.glowSoftColor);
        if (config.fillColor) objEl.style.setProperty('--obj-fill', config.fillColor);
        if (config.strokeColor) objEl.style.setProperty('--obj-stroke', config.strokeColor);

        if (INTERACTION_DEBUG) {
          const debugLabel = document.createElement('div');
          debugLabel.className = 'interactive-debug-label';
          debugLabel.textContent = `${config.id} [${config.room}]`;
          objEl.appendChild(debugLabel);
        }

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', config.viewBox || '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', config.preserveAspectRatio || 'none');

        let shapeEl;
        if (config.shape === 'polygon' && config.polygon) {
          shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          shapeEl.setAttribute('points', config.polygon);
          shapeEl.setAttribute('class', 'glow-shape');
        } else if (config.shape === 'path' && config.path) {
          shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          shapeEl.setAttribute('d', config.path);
          shapeEl.setAttribute('class', 'glow-shape');
        } else {
          shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          shapeEl.setAttribute('x', '2');
          shapeEl.setAttribute('y', '2');
          shapeEl.setAttribute('width', '96');
          shapeEl.setAttribute('height', '96');
          shapeEl.setAttribute('rx', '4');
          shapeEl.setAttribute('class', 'glow-shape');
        }

        shapeEl.setAttribute('role', 'button');
        shapeEl.setAttribute('aria-label', config.label || config.id);
        shapeEl.style.cursor = config.cursor || 'pointer';

        svg.appendChild(shapeEl);
        objEl.appendChild(svg);

        const supportsHover = config.interactionType === 'hover' || config.interactionType === 'both';
        const supportsClick = config.interactionType === 'click' || config.interactionType === 'both';

        if (supportsHover) {
          const tooltipText = config.label || (config.action && config.action.targetRoom ? roomTitles[config.action.targetRoom] : '') || config.id;

          shapeEl.addEventListener('mouseenter', (e) => {
            if (isScrollLocked) return;
            objEl.classList.add('is-hovered');
            shapeEl.classList.add('is-hovered');
            this.showTooltip(tooltipText, e.clientX, e.clientY);
            if (config.action && config.action.targetRoom) {
              const hoverConnKey = `${currentRoom}-${config.action.targetRoom}`;
              const hoverConn = roomConnections[hoverConnKey];
              if (hoverConn && hoverConn.seq) {
                preloadSequence(hoverConn.seq);
              }
            }
            if (typeof config.onHover === 'function') config.onHover(config, objEl, e);
          });

          shapeEl.addEventListener('mousemove', (e) => {
            if (isScrollLocked) return;
            this.updateTooltipPosition(e.clientX, e.clientY);
          });

          shapeEl.addEventListener('mouseleave', (e) => {
            objEl.classList.remove('is-hovered');
            shapeEl.classList.remove('is-hovered');
            this.hideTooltip();
            if (typeof config.onHoverLeave === 'function') config.onHoverLeave(config, objEl);
          });
        }

        if (supportsClick) {
          const triggerAction = (e) => {
            if (isScrollLocked) return;
            this.hideTooltip();
            this.handleObjectClick(config, objEl);
          };

          shapeEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerAction(e);
          });

          shapeEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerAction(e);
            }
          });
        }

        this.stage.appendChild(objEl);
      });
    },

    handleObjectClick(config, objEl) {
      if (isScrollLocked) return;
      this.hideTooltip();

      if (typeof config.onClick === 'function') {
        config.onClick(config, objEl);
      }

      const action = config.action;
      if (!action) return;

      if (action.type === 'contact') {
        openContactInterface();
        return;
      }

      if (action.type === 'kitchen_blog') {
        openKitchenBlog();
        return;
      }

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

        let uiDone = false;
        let backdropDone = false;
        let animationStarted = false;

        // Hard-cap safety net: if animation never completes (e.g. decode failure
        // on last frame, RAF issue), force navigation after 10 seconds.
        // This guarantees isScrollLocked never gets permanently stuck.
        let safetyTimer = null;
        const armSafetyTimeout = () => {
          if (action.type === 'url' && action.url) {
            safetyTimer = setTimeout(() => {
              console.warn('[Transition] Safety timeout fired — forcing navigation');
              navigateUrl(action.url);
            }, 10000); // 10s absolute maximum for the entire animation
          }
        };

        const startAnim = () => {
          if (!uiDone || !backdropDone) return;
          if (animationStarted) return; // prevent double-fire
          animationStarted = true;
          armSafetyTimeout();

          const activeCanvas = getActiveCanvas();

          // Pre-verify the last frame is decoded so the sequence won't
          // freeze waiting for the final frame right before navigation.
          const lastFrame = frames[frames.length - 1];
          const doPlay = () => {
            playImageSequence(activeCanvas, frames, 0, frames.length - 1, () => {
              if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }

              // Test Mode: Hold the last frame of the animation
              if (action.type === 'hold') {
                return;
              }

              // URL Navigation (e.g. /projects page navigation)
              if (action.type === 'url' && action.url) {
                navigateUrl(action.url);
                return;
              }

              if (action.type === 'navigate' && action.targetRoom) {
                navigateToRoom(action.targetRoom);
                return;
              }

              // Standalone interaction animation return
              setTimeout(() => {
                const baseFrame = getRoomBaseFrame(currentRoom);
                if (baseFrame) {
                  drawFrameToCanvas(activeCanvas, baseFrame);
                }
                InteractiveObjectManager.renderObjects();
                fadeBackdropIn();
                fadeUIIn(() => {
                  InteractiveObjectManager.setInteractiveEnabled(true);
                  isScrollLocked = false;
                });
              }, 400);
            });
          }; // end doPlay

          // Pre-decode the final frame before playback starts.
          // If the last frame hasn't finished downloading yet, wait for it first.
          // This prevents the sequence from stalling on the very last frame.
          if (lastFrame && lastFrame.complete && lastFrame.naturalWidth > 0) {
            doPlay();
          } else if (lastFrame && typeof lastFrame.decode === 'function') {
            lastFrame.decode().then(doPlay).catch(doPlay);
          } else if (lastFrame) {
            const onLastFrameReady = () => doPlay();
            lastFrame.addEventListener('load', onLastFrameReady, { once: true });
            lastFrame.addEventListener('error', onLastFrameReady, { once: true });
          } else {
            doPlay();
          }
        }; // end startAnim

        fadeUIOut(() => {
          uiDone = true;
          startAnim();
        });

        fadeBackdropOut(() => {
          backdropDone = true;
          startAnim();
        });

        return;
      }


      if (action.type === 'url' && action.url) {
        navigateUrl(action.url);
        return;
      }

      if (action.type === 'navigate' && action.targetRoom) {
        navigateToRoom(action.targetRoom);
      }
    },

    setInteractiveEnabled(enabled) {
      if (!this.stage) {
        this.stage = document.getElementById('interactive-stage');
      }
      if (!this.stage) return;
      if (enabled) {
        this.stage.classList.remove('interactive-disabled');
      } else {
        this.stage.classList.add('interactive-disabled');
        this.hideTooltip();
      }
    }
  };

  // --- UI Event Listeners ---
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrollLocked) {
        if (isContactInterfaceOpen()) {
          closeContactInterface();
        } else if (typeof isKitchenBlogOpen === 'function' && isKitchenBlogOpen()) {
          closeKitchenBlog();
        } else {
          return;
        }
      }
      const navKey = link.getAttribute('data-nav') || link.getAttribute('href').replace('#', '');
      const destRoom = navToRoom[navKey];
      if (!destRoom) return;
      if (destRoom === currentRoom && destRoom === 'office') {
        openContactInterface();
        return;
      }
      if (destRoom === currentRoom && destRoom === 'kitchen') {
        openKitchenBlog();
        return;
      }
      navigateToRoom(destRoom);
    });
  });

  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach((icon) => {
    const isLinkedIn = icon.classList.contains('icon-linkedin') || icon.getAttribute('aria-label')?.includes('LinkedIn');
    const label = isLinkedIn ? 'LinkedIn' : 'ArtStation';

    icon.addEventListener('mouseenter', (e) => {
      if (isScrollLocked) return;
      InteractiveObjectManager.showTooltip(label, e.clientX, e.clientY);
    });

    icon.addEventListener('mousemove', (e) => {
      if (isScrollLocked) return;
      InteractiveObjectManager.updateTooltipPosition(e.clientX, e.clientY);
    });

    icon.addEventListener('mouseleave', () => {
      InteractiveObjectManager.hideTooltip();
    });

    icon.addEventListener('click', () => {
      InteractiveObjectManager.hideTooltip();
    });
  });

  const exploreProjectsBtn = document.getElementById('explore-projects-btn');
  if (exploreProjectsBtn) {
    exploreProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrollLocked) return;
      const pcConfig = interactiveObjects.bedroomPC;
      if (pcConfig && typeof InteractiveObjectManager !== 'undefined') {
        InteractiveObjectManager.handleObjectClick(pcConfig, null);
      } else {
        navigateUrl('projects/');
      }
    });
  }

  const homeExploreBtn = document.getElementById('home-explore-btn');
  if (homeExploreBtn) {
    homeExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrollLocked) return;
      navigateToRoom('bedroom');
    });
  }

  const kitchenIntroBtn = document.getElementById('kitchen-intro-btn');
  if (kitchenIntroBtn) {
    kitchenIntroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrollLocked && (!isKitchenBlogOpen || !isKitchenBlogOpen())) return;
      openKitchenBlog();
    });
  }

  const contactIntroBtn = document.getElementById('contact-intro-btn');
  if (contactIntroBtn) {
    contactIntroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isScrollLocked && !isContactInterfaceOpen()) return;
      openContactInterface();
    });
  }

  // --- Contact Me Editorial Interface Controller ---
  const contactModal = document.getElementById('contact-modal');
  const contactModalBackdrop = document.getElementById('contact-modal-backdrop');
  const contactModalClose = document.getElementById('contact-modal-close');
  const contactForm = document.getElementById('contact-form');
  const contactFormStatus = document.getElementById('contact-form-status');

  function isContactInterfaceOpen() {
    return contactModal && contactModal.classList.contains('is-open');
  }

  function openContactInterface() {
    if (!contactModal) return;
    InteractiveObjectManager.hideTooltip();
    isScrollLocked = true;
    contactModal.classList.add('is-open');
    contactModal.setAttribute('aria-hidden', 'false');
    const firstInput = contactModal.querySelector('input:not([type="hidden"]), textarea, button');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeContactInterface() {
    if (!contactModal) return;
    contactModal.classList.remove('is-open');
    contactModal.setAttribute('aria-hidden', 'true');
    isScrollLocked = false;
    InteractiveObjectManager.renderObjects();
  }

  if (contactModalClose) {
    contactModalClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeContactInterface();
    });
  }

  if (contactModalBackdrop) {
    contactModalBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeContactInterface();
    });
  }

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const msgInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!nameInput || !emailInput || !msgInput) return;

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = msgInput.value.trim();

      if (!name || !email || !message) {
        if (contactFormStatus) {
          contactFormStatus.textContent = 'Please fill in all fields.';
          contactFormStatus.style.color = '#f87171';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('span');
        if (btnText) btnText.textContent = 'Sending...';
      }

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Harsh,\n\n${message}\n\nFrom: ${name} (${email})`);
      const mailtoUrl = `mailto:harshpal.contact@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        if (contactFormStatus) {
          contactFormStatus.textContent = 'Thank you! Opening your email client to send...';
          contactFormStatus.style.color = '#4ade80';
        }

        window.open(mailtoUrl, '_blank');

        setTimeout(() => {
          contactForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            const btnText = submitBtn.querySelector('span');
            if (btnText) btnText.textContent = 'Send Message';
          }
          setTimeout(() => {
            if (contactFormStatus) contactFormStatus.textContent = '';
            closeContactInterface();
          }, 1800);
        }, 1000);
      }, 500);
    });
  }

  // --- Interactive Kitchen Blog Section Controller ---
  const kitchenBlogStage = document.getElementById('kitchen-blog-stage');
  const kitchenCanvas = document.getElementById('kitchen-canvas');
  const kitchenSceneStage = document.getElementById('kitchen-scene-stage');
  const floatingWindow = document.getElementById('floating-project-window');
  const windowProjectTitleMini = document.getElementById('window-project-title-mini');
  const windowSectionTitleMini = document.getElementById('window-section-title-mini');
  const contentCourseNum = document.getElementById('content-course-num');
  const contentCourseTag = document.getElementById('content-course-tag');
  const contentHeading = document.getElementById('content-heading');
  const contentBody = document.getElementById('content-body-scrollable');
  const sectionTabBtns = document.querySelectorAll('.section-tab-btn');
  const projectPickBtns = document.querySelectorAll('.nav-project-btn');
  const stoveDialsRow = document.getElementById('stove-dials-row');
  const stoveDialPods = document.querySelectorAll('.stove-dial-pod');
  const kitchenHoodArea = document.getElementById('kitchen-hood-area');
  const kitchenHoodExitBtn = document.getElementById('kitchen-hood-exit-btn');
  const kitchenReturnBtn = document.getElementById('kitchen-return-btn');
  const windowCloseBtn = document.getElementById('window-close-btn');
  const kitchenStageBackdrop = document.getElementById('kitchen-stage-backdrop');

  // Background Kitchen Image for Full-Viewport Canvas Rendering (Matching PC Screen Section)
  const kitchenImage = new Image();
  kitchenImage.src = 'Media/KitchenScene.avif';

  function renderKitchenScene() {
    if (!kitchenCanvas) return;
    const ctx = kitchenCanvas.getContext('2d');
    const width = kitchenCanvas.width = window.innerWidth;
    const height = kitchenCanvas.height = window.innerHeight;

    const imgRatio = (kitchenImage.naturalWidth && kitchenImage.naturalHeight)
      ? (kitchenImage.naturalWidth / kitchenImage.naturalHeight)
      : 1.0;
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
    if (kitchenImage.complete && kitchenImage.naturalWidth > 0) {
      ctx.drawImage(kitchenImage, offsetX, offsetY, drawWidth, drawHeight);
    }

    if (kitchenSceneStage) {
      kitchenSceneStage.style.left = `${offsetX}px`;
      kitchenSceneStage.style.top = `${offsetY}px`;
      kitchenSceneStage.style.width = `${drawWidth}px`;
      kitchenSceneStage.style.height = `${drawHeight}px`;
    }
  }

  kitchenImage.onload = () => {
    if (typeof isKitchenBlogOpen === 'function' && isKitchenBlogOpen()) {
      renderKitchenScene();
    }
  };

  window.addEventListener('resize', () => {
    if (typeof isKitchenBlogOpen === 'function' && isKitchenBlogOpen()) {
      renderKitchenScene();
    }
  });

  const kitchenSecCounter = document.getElementById('kitchen-sec-counter');

  const KITCHEN_SPREADS = [
    { id: 'kb-sec-01', num: '01', dialIdx: 0 },
    { id: 'kb-sec-02', num: '02', dialIdx: 1 },
    { id: 'kb-sec-03', num: '03', dialIdx: 2 },
    { id: 'kb-sec-04', num: '04', dialIdx: 3 },
    { id: 'kb-sec-05', num: '05', dialIdx: 4 }
  ];

  const STOVE_DIAL_TARGETS = [
    'kb-sec-01', // Dial 1: The Hook
    'kb-sec-02', // Dial 2: Intro
    'kb-sec-03', // Dial 3: The Idea
    'kb-sec-04', // Dial 4: Research
    'kb-sec-05'  // Dial 5: Future
  ];

  let activeSpreadIdx = 0;
  let activeKitchenDial = 0;
  let kitchenDialRotations = [0, 0, 0, 0, 0];
  let isKitchenRetracting = false;

  function isKitchenBlogOpen() {
    return kitchenBlogStage && kitchenBlogStage.classList.contains('is-open');
  }

  function updateKitchenUI() {
    // Update stove dials (active pod & needle rotation)
    stoveDialPods.forEach((pod, idx) => {
      pod.classList.toggle('active', idx === activeKitchenDial);
      const knob = pod.querySelector('.dial-knob');
      if (knob) {
        const rot = kitchenDialRotations[idx] || 0;
        knob.style.setProperty('--needle-rot', `${rot}deg`);
      }
    });

    // Update section counter in header: e.g. "01 / 05"
    if (kitchenSecCounter && KITCHEN_SPREADS[activeSpreadIdx]) {
      kitchenSecCounter.textContent = `${KITCHEN_SPREADS[activeSpreadIdx].num} / 05`;
    }

    // Update right rail section tabs (matching Illustrator preview)
    const railTabs = document.querySelectorAll('.kb-rail-tab');
    railTabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === activeSpreadIdx);
    });
  }

  function setKitchenDial(dialIdx) {
    activeKitchenDial = Math.max(0, Math.min(STOVE_DIAL_TARGETS.length - 1, dialIdx));
    activeSpreadIdx = activeKitchenDial;
    const targetId = STOVE_DIAL_TARGETS[activeKitchenDial];
    if (targetId && contentBody) {
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        const targetTop = targetSec.getBoundingClientRect().top - contentBody.getBoundingClientRect().top + contentBody.scrollTop;
        contentBody.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }
    }
    updateKitchenUI();
  }

  function openKitchenBlog() {
    if (!kitchenBlogStage) return;
    InteractiveObjectManager.hideTooltip();
    isScrollLocked = true;
    isKitchenRetracting = false;

    if (floatingWindow) {
      floatingWindow.classList.remove('is-retracting');
    }

    kitchenBlogStage.classList.add('is-open');
    kitchenBlogStage.setAttribute('aria-hidden', 'false');

    renderKitchenScene();
    activeSpreadIdx = 0;
    activeKitchenDial = 0;
    kitchenDialRotations = [0, 0, 0, 0, 0];
    if (contentBody) contentBody.scrollTop = 0;
    updateKitchenUI();
  }

  function closeKitchenBlog() {
    if (!kitchenBlogStage || isKitchenRetracting) return;
    isKitchenRetracting = true;

    // Animate floating window moving upward directly into the kitchen hood
    if (floatingWindow) {
      floatingWindow.classList.add('is-retracting');
    }

    setTimeout(() => {
      kitchenBlogStage.classList.remove('is-open');
      kitchenBlogStage.setAttribute('aria-hidden', 'true');
      if (floatingWindow) {
        floatingWindow.classList.remove('is-retracting');
      }
      isScrollLocked = false;
      isKitchenRetracting = false;
      if (typeof InteractiveObjectManager !== 'undefined') {
        InteractiveObjectManager.renderObjects();
      }
    }, 600);
  }

  window.openKitchenBlog = openKitchenBlog;
  window.closeKitchenBlog = closeKitchenBlog;
  window.setKitchenDial = setKitchenDial;

  // Handle mouse wheel specifically over the Stove Dials row
  if (stoveDialsRow) {
    stoveDialsRow.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isKitchenRetracting) return;

      const delta = e.deltaY;
      if (delta > 30 && activeKitchenDial < STOVE_DIAL_TARGETS.length - 1) {
        setKitchenDial(activeKitchenDial + 1);
      } else if (delta < -30 && activeKitchenDial > 0) {
        setKitchenDial(activeKitchenDial - 1);
      }
    }, { passive: false });
  }

  // Synchronize GluSight active spread and dials with scroll position inside content-body-scrollable
  if (contentBody) {
    let scrollDebounce = null;
    contentBody.addEventListener('scroll', () => {
      if (scrollDebounce) cancelAnimationFrame(scrollDebounce);
      scrollDebounce = requestAnimationFrame(() => {
        const bodyRect = contentBody.getBoundingClientRect();
        const threshold = bodyRect.top + bodyRect.height * 0.35;
        const isBottom = contentBody.scrollTop + contentBody.clientHeight >= contentBody.scrollHeight - 60;
        let foundIdx = 0;
        if (isBottom) {
          foundIdx = KITCHEN_SPREADS.length - 1;
        } else {
          KITCHEN_SPREADS.forEach((spread, idx) => {
            const el = document.getElementById(spread.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= threshold) {
                foundIdx = idx;
              }
            }
          });
        }
        if (foundIdx !== activeSpreadIdx) {
          activeSpreadIdx = foundIdx;
          activeKitchenDial = KITCHEN_SPREADS[activeSpreadIdx].dialIdx;
          kitchenDialRotations[activeKitchenDial] = (activeSpreadIdx % 3) * 45;
          updateKitchenUI();
        }
      });
    }, { passive: true });
  }

  // Handle click on Right Rail Section Tabs
  const kitchenRailTabs = document.querySelectorAll('.kb-rail-tab');
  kitchenRailTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const secIdx = parseInt(tab.getAttribute('data-section'), 10);
      if (!isNaN(secIdx)) {
        setKitchenDial(secIdx);
      }
    });
  });

  // Prevent wheel and touch events from bubbling out of the floating project window
  if (floatingWindow) {
    floatingWindow.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });

    floatingWindow.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });

    floatingWindow.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: true });
  }

  // Prevent wheel and touch events on the kitchen backdrop from triggering room transitions
  if (kitchenBlogStage) {
    kitchenBlogStage.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });

    kitchenBlogStage.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });
  }

  // Hook up stove dial clicks
  stoveDialPods.forEach((pod) => {
    pod.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = parseInt(pod.getAttribute('data-section'), 10);
      if (!isNaN(sec)) setKitchenDial(sec);
    });
  });

  if (kitchenReturnBtn) {
    kitchenReturnBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeKitchenBlog();
    });
  }

  if (kitchenHoodExitBtn) {
    kitchenHoodExitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeKitchenBlog();
    });
  }

  if (kitchenHoodArea) {
    kitchenHoodArea.addEventListener('click', (e) => {
      if (e.target === kitchenHoodArea || e.target.closest('.kitchen-hood-exit-btn')) {
        closeKitchenBlog();
      }
    });
  }

  if (windowCloseBtn) {
    windowCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeKitchenBlog();
    });
  }

  if (kitchenStageBackdrop) {
    kitchenStageBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeKitchenBlog();
    });
  }

  // --- Circular Scroll Navigation Controller ---
  function handleScrollNavigation(direction) {
    if (isScrollLocked) return;

    const currentIndex = scrollCircle.indexOf(currentRoom);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex >= scrollCircle.length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = scrollCircle.length - 1;
    }

    const destRoom = scrollCircle[nextIndex];
    navigateToRoom(destRoom);
  }

  let wheelAccumulator = 0;
  const WHEEL_THRESHOLD = 50;

  window.addEventListener('wheel', (e) => {
    if (!hasRevealed || isScrollLocked) {
      wheelAccumulator = 0;
      return;
    }

    wheelAccumulator += e.deltaY;

    if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;
      handleScrollNavigation(direction);
    }
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!hasRevealed || isScrollLocked) return;
    if (e.changedTouches.length === 0) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaY) < 40) return;

    const direction = deltaY > 0 ? 1 : -1;
    handleScrollNavigation(direction);
  }, { passive: true });

  // --- Parallax & Scene Controller ---
  function initParallaxEngine() {
    if (!sceneElement) return;

    setTimeout(() => {
      sceneElement.classList.add('zoomed-in');
    }, 50);

    if (typeof window.Parallax === 'function') {
      try {
        if (!parallaxInstance) {
          parallaxInstance = new window.Parallax(sceneElement, {
            relativeInput: true,
            clipRelativeInput: false,
            hoverOnly: false,
            frictionX: 0.08,
            frictionY: 0.08,
            scalarX: 28,
            scalarY: 28,
            pointerEvents: true
          });
        }
        return;
      } catch (err) {
        console.warn('Parallax.js library init fallback to native engine:', err);
      }
    }

    const layers = sceneElement.querySelectorAll('.parallax-layer[data-depth]');
    if (layers.length === 0) return;

    let targetNormX = 0;
    let targetNormY = 0;
    let currentNormX = 0;
    let currentNormY = 0;
    const lerpFactor = 0.08;
    const scalarX = 30;
    const scalarY = 30;

    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetNormX = (e.clientX - centerX) / centerX;
      targetNormY = (e.clientY - centerY) / centerY;
    }, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          targetNormX = Math.min(Math.max(e.gamma / 45, -1), 1);
          targetNormY = Math.min(Math.max(e.beta / 45, -1), 1);
        }
      }, { passive: true });
    }

    function updateNativeParallax() {
      currentNormX += (targetNormX - currentNormX) * lerpFactor;
      currentNormY += (targetNormY - currentNormY) * lerpFactor;

      layers.forEach((layer) => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
        const translateX = (currentNormX * depth * scalarX).toFixed(2);
        const translateY = (currentNormY * depth * scalarY).toFixed(2);
        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });

      requestAnimationFrame(updateNativeParallax);
    }

    requestAnimationFrame(updateNativeParallax);
  }

  // --- Unified UI Reveal Helper ---
  function revealUI() {
    hasRevealed = true;

    if (uiContainer) {
      updateUIRoomState(currentRoom);
      uiContainer.classList.remove('ui-hidden');
      uiContainer.classList.add('revealed', 'visible');
    }

    updateRoomTitle(currentRoom);

    fadeBackdropIn();

    if (typeof InteractiveObjectManager !== 'undefined') {
      InteractiveObjectManager.renderObjects();
      InteractiveObjectManager.setInteractiveEnabled(true);
    }

    isScrollLocked = false;

    if (typeof BackgroundAssetQueue !== 'undefined') {
      BackgroundAssetQueue.reprioritize(currentRoom);
      BackgroundAssetQueue.start();
    }
  }

  // ==========================================================================
  // Unified Startup & Initialization Pipeline
  // ==========================================================================
  function initPortfolio() {
    const activeCanvas = getActiveCanvas();

    // 1. Initialize Parallax Scene & Interactive Object Stage
    initParallaxEngine();
    InteractiveObjectManager.init();
    // 2. Check Startup State
    let isReturnFromProjects = false;
    let isReturnFromProjectsToLiving = false;
    try {
      isReturnFromProjects = sessionStorage.getItem('returnFromProjects') === 'true';
      isReturnFromProjectsToLiving = sessionStorage.getItem('returnFromProjectsToLiving') === 'true';
    } catch (e) {
      console.warn('Unable to access sessionStorage:', e);
    }

    let isIntroCompleted = false;
    try {
      localStorage.removeItem('portfolioIntroCompleted');
      isIntroCompleted = sessionStorage.getItem('portfolioIntroCompleted') === 'true';
    } catch (e) {
      console.warn('Unable to access sessionStorage:', e);
    }

    // ------------------------------------------------------------------------
    // PATH 1A: Return from /projects -> Living (PC -> Bedroom -> Home continuous)
    // ------------------------------------------------------------------------
    if (isReturnFromProjectsToLiving) {
      if (freedomSplash) {
        freedomSplash.style.display = 'none';
        freedomSplash.classList.add('fade-out');
      }

      currentRoom = 'living';
      updateRoomTitle('living');
      updateActiveNav('home');

      if (uiContainer) {
        updateUIRoomState('living');
        uiContainer.classList.add('ui-hidden');
      }

      if (backdropRect) {
        backdropRect.classList.add('backdrop-hidden');
      }

      isScrollLocked = true;
      hasRevealed = true;
      InteractiveObjectManager.setInteractiveEnabled(false);

      const pcFrames = preloadSequence('bedroom_pc');
      const bedroomLivingFrames = preloadSequence('living_bedroom');
      const livingBaseFrame = bedroomLivingFrames[0];

      const startDoubleReversePlayback = () => {
        const lastFrame = pcFrames[pcFrames.length - 1];
        if (lastFrame) {
          drawFrameToCanvas(activeCanvas, lastFrame);
        }

        // 1. Play PC -> Bedroom reverse animation
        playImageSequence(activeCanvas, pcFrames, pcFrames.length - 1, 0, () => {
          // 2. Immediately without stopping, play Bedroom -> Living reverse animation
          playImageSequence(activeCanvas, bedroomLivingFrames, bedroomLivingFrames.length - 1, 0, () => {
            currentRoom = 'living';
            updateRoomTitle('living');
            updateActiveNav('home');

            if (uiContainer) {
              updateUIRoomState('living');
            }

            if (livingBaseFrame) {
              drawFrameToCanvas(activeCanvas, livingBaseFrame);
            }

            InteractiveObjectManager.renderObjects();
            fadeBackdropIn();

            fadeUIIn(() => {
              InteractiveObjectManager.setInteractiveEnabled(true);
              isScrollLocked = false;
              try {
                sessionStorage.removeItem('returnFromProjectsToLiving');
              } catch (e) {}
            });
          });
        });
      };

      const startFrame = pcFrames[pcFrames.length - 1];
      if (startFrame && startFrame.complete && startFrame.naturalWidth > 0) {
        startDoubleReversePlayback();
      } else if (startFrame) {
        if (typeof startFrame.decode === 'function') {
          startFrame.decode().then(startDoubleReversePlayback).catch(startDoubleReversePlayback);
        } else {
          startFrame.onload = startDoubleReversePlayback;
          startFrame.onerror = startDoubleReversePlayback;
        }
      } else {
        startDoubleReversePlayback();
      }
      return;
    }

    // ------------------------------------------------------------------------
    // PATH 1: Return from /projects (Reverse BedroomToPC Animation -> Bedroom)
    // ------------------------------------------------------------------------
    if (isReturnFromProjects) {
      if (freedomSplash) {
        freedomSplash.style.display = 'none';
        freedomSplash.classList.add('fade-out');
      }

      currentRoom = 'bedroom';
      updateRoomTitle('bedroom');
      updateActiveNav('projects');

      if (uiContainer) {
        updateUIRoomState('bedroom');
        uiContainer.classList.add('ui-hidden');
      }

      if (backdropRect) {
        backdropRect.classList.add('backdrop-hidden');
      }

      isScrollLocked = true;
      hasRevealed = true;
      InteractiveObjectManager.setInteractiveEnabled(false);

      const pcFrames = preloadSequence('bedroom_pc');
      const bedroomFrames = preloadSequence('living_bedroom');
      const bedroomBaseFrame = bedroomFrames[bedroomFrames.length - 1];

      const startReversePlayback = () => {
        const lastFrame = pcFrames[pcFrames.length - 1];
        if (lastFrame) {
          drawFrameToCanvas(activeCanvas, lastFrame);
        }

        playImageSequence(activeCanvas, pcFrames, pcFrames.length - 1, 0, () => {
          if (bedroomBaseFrame) {
            drawFrameToCanvas(activeCanvas, bedroomBaseFrame);
          }

          InteractiveObjectManager.renderObjects();
          fadeBackdropIn();

          fadeUIIn(() => {
            InteractiveObjectManager.setInteractiveEnabled(true);
            isScrollLocked = false;
            try {
              sessionStorage.removeItem('returnFromProjects');
            } catch (e) {}
          });
        });
      };

      const startFrame = pcFrames[pcFrames.length - 1];
      if (startFrame && startFrame.complete && startFrame.naturalWidth > 0) {
        startReversePlayback();
      } else if (startFrame) {
        if (typeof startFrame.decode === 'function') {
          startFrame.decode().then(startReversePlayback).catch(startReversePlayback);
        } else {
          startFrame.onload = startReversePlayback;
          startFrame.onerror = startReversePlayback;
        }
      } else {
        startReversePlayback();
      }
      return;
    }

    // ------------------------------------------------------------------------
    // PATH 2: Subsequent Visit / Normal Browser Refresh / Direct Room Hash
    // ------------------------------------------------------------------------
    const targetRoom = getRoomFromHash() || 'living';

    // Temporary feature flag: bypass the initial loading screen and entrance sequence
    // to open directly to Living / About Me page. Set to false to restore intro.
    const BYPASS_LOADING_SCREEN = true;

    if (BYPASS_LOADING_SCREEN || isIntroCompleted) {
      if (freedomSplash) {
        freedomSplash.style.display = 'none';
        freedomSplash.classList.add('fade-out');
      }

      currentRoom = targetRoom;
      updateRoomTitle(targetRoom);
      const activeNav = roomToNav[targetRoom] || 'home';
      updateActiveNav(activeNav);

      if (uiContainer) {
        updateUIRoomState(targetRoom);
        uiContainer.classList.remove('ui-hidden');
      }

      const baseFrame = getRoomBaseFrame(targetRoom);
      const drawRoomAndReveal = () => {
        if (baseFrame) {
          drawFrameToCanvas(activeCanvas, baseFrame);
        }
        revealUI();
      };

      if (baseFrame && baseFrame.complete && baseFrame.naturalWidth > 0) {
        drawRoomAndReveal();
      } else if (baseFrame) {
        if (typeof baseFrame.decode === 'function') {
          baseFrame.decode().then(drawRoomAndReveal).catch(drawRoomAndReveal);
        } else {
          baseFrame.onload = drawRoomAndReveal;
          baseFrame.onerror = drawRoomAndReveal;
        }
      } else {
        revealUI();
      }
      return;
    }

    // ------------------------------------------------------------------------
    // PATH 3: First Visit (Freedom Splash -> Asset Loading -> Entrance Sequence)
    // "Freedom" is the loading screen. It stays visible until critical buffer
    // frames are decoded. Only then does it fade out and the entrance plays.
    // ------------------------------------------------------------------------
    isScrollLocked = true;
    hasRevealed = false;
    if (typeof InteractiveObjectManager !== 'undefined') {
      InteractiveObjectManager.setInteractiveEnabled(false);
    }
    if (uiContainer) {
      uiContainer.classList.add('ui-hidden');
      uiContainer.classList.remove('revealed', 'visible');
    }

    const entranceFrames = initSequenceFrames('entrance');
    const firstEntranceFrame = entranceFrames[0];
    if (firstEntranceFrame && !firstEntranceFrame.src && firstEntranceFrame._targetSrc) {
      firstEntranceFrame.src = firstEntranceFrame._targetSrc;
    }

    /**
     * Called once — after critical buffer frames and living base image are ready.
     */
    function onAssetsReady() {
      console.log('[Preloader] Buffer ready — streaming remaining frames and starting entrance');

      // Immediately begin streaming remaining entrance frames (18 to 95) in strict playback order
      const remainingEntrance = entranceFrames.slice(18);
      let streamIdx = 0;
      let activeStreams = 0;
      const streamConcurrency = 4;
      const pumpStream = () => {
        while (activeStreams < streamConcurrency && streamIdx < remainingEntrance.length) {
          const item = remainingEntrance[streamIdx++];
          activeStreams++;
          AssetLoader._loadImage(item).then(() => {
            activeStreams--;
            pumpStream();
          });
        }
      };
      pumpStream();

      // Step 1: Fade loading indicator out first
      AssetLoader.fadeOutIndicator().then(() => {
        // Step 2: Fade Freedom splash out smoothly
        if (freedomSplash) {
          freedomSplash.style.transition = `opacity ${FREEDOM_FADE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          freedomSplash.classList.add('fade-out');
        }

        // Step 3: After Freedom has fully faded, begin the entrance animation
        setTimeout(() => {
          if (freedomSplash) {
            freedomSplash.style.display = 'none';
          }

          // Entrance sequence plays smoothly
          playImageSequence(activeCanvas, entranceFrames, 0, entranceFrames.length - 1, () => {
            try {
              sessionStorage.setItem('portfolioIntroCompleted', 'true');
              document.documentElement.classList.add('intro-completed');
            } catch (e) {
              console.warn('Unable to write to sessionStorage:', e);
            }
            const livingBase = getRoomBaseFrame('living');
            if (livingBase) {
              drawFrameToCanvas(activeCanvas, livingBase);
            }
            if (targetRoom && targetRoom !== 'living') {
              currentRoom = 'living';
              revealUI();
              navigateToRoom(targetRoom);
            } else {
              revealUI();
            }
          });
        }, FREEDOM_FADE_DURATION);
      });
    }

    // Draw the first entrance frame immediately when available
    const drawFirstFrameIfReady = () => {
      if (firstEntranceFrame && firstEntranceFrame.complete && firstEntranceFrame.naturalWidth > 0) {
        drawFrameToCanvas(activeCanvas, firstEntranceFrame);
      }
    };

    if (firstEntranceFrame && firstEntranceFrame.complete && firstEntranceFrame.naturalWidth > 0) {
      drawFirstFrameIfReady();
    } else if (firstEntranceFrame) {
      firstEntranceFrame.onload = drawFirstFrameIfReady;
    }

    if (backdropRect) {
      backdropRect.classList.add('backdrop-hidden');
    }
    if (uiContainer) {
      uiContainer.classList.add('ui-hidden');
      uiContainer.classList.remove('revealed', 'visible');
    }

    // Start preloading immediately at t=0
    AssetLoader.loadCriticalAssets(onAssetsReady);
  }

  // --- Global Escape Key Navigation (Return to About Me / Living) ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (typeof isContactInterfaceOpen === 'function' && isContactInterfaceOpen()) {
        closeContactInterface();
        return;
      }
      if (typeof isKitchenBlogOpen === 'function' && isKitchenBlogOpen()) {
        closeKitchenBlog();
        return;
      }
      if (currentRoom !== 'living' && !isScrollLocked && hasRevealed) {
        navigateToRoom('living');
      }
    }
  });

  // --- URL Hash Change Navigation (Back / Forward Browser Buttons) ---
  window.addEventListener('hashchange', () => {
    if (isScrollLocked || !hasRevealed) return;
    const destRoom = getRoomFromHash();
    if (destRoom && destRoom !== currentRoom) {
      if (typeof isContactInterfaceOpen === 'function' && isContactInterfaceOpen()) {
        closeContactInterface();
      }
      navigateToRoom(destRoom);
    }
  });

  // --- Run Unified Pipeline ---
  initPortfolio();
  /**
   * Development Helper Function:
   * Call `resetIntro()` in the browser DevTools console to clear the intro flag and test first-visit behavior again.
   */
  window.resetIntro = function () {
    try {
      localStorage.removeItem('portfolioIntroCompleted');
      sessionStorage.removeItem('portfolioIntroCompleted');
      sessionStorage.removeItem('returnFromProjects');
      sessionStorage.removeItem('returnFromProjectsToLiving');
      document.documentElement.classList.remove('intro-completed');
      console.log('Intro state reset successfully. Reloading...');
      location.reload();
    } catch (e) {
      console.warn('Unable to clear storage:', e);
    }
  };
});
