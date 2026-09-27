/**
 * Harsh Portfolio — Unified House Room Navigation & Interaction Controller (24 FPS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM References ---
  const canvasA = document.getElementById('sequence-canvas');
  const canvasB = document.getElementById('sequence-canvas-secondary');
  const uiContainer = document.getElementById('ui-container');
  const freedomSplash = document.getElementById('freedom-splash');
  const topHeader = document.querySelector('.top-header');
  const backdropRect = document.querySelector('.fullscreen-backdrop-rect');
  const sceneElement = document.getElementById('parallax-scene');
  const navLinks = document.querySelectorAll('.nav-link');
  const roomTitleEl = document.querySelector('.freedom-title h1');

  // --- Entrance Sequence Timing Constants (Configurable) ---
  const FREEDOM_DISPLAY_DURATION = 1000; // Duration (ms) Freedom title stays fully visible before fading
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

  function getStandbyCanvas() {
    return canvasA && canvasA.classList.contains('active-video') ? canvasB : canvasA;
  }

  // --- Animation Sequence Definitions ---
  const sequences = {
    'entrance': { folder: 'Media/Entrance/', prefix: 'Entrance', count: 100 },
    'living_bedroom': { folder: 'Media/Living_Bedroom/', prefix: 'LivingToBedroom', count: 50 },
    'living_kitchen': { folder: 'Media/Living_Kitchen/', prefix: 'LivingToKitchen', count: 50 },
    'living_pool': { folder: 'Media/Living_Pool/', prefix: 'LivingToPool', count: 50 },
    'living_office': { folder: 'Media/Living_Office/', prefix: 'LivingToOffice', count: 50 },
    'bedroom_kitchen': { folder: 'Media/Bedroom_Kitchen/', prefix: 'BedtoKitchen', count: 25 },
    'bedroom_pc': { folder: 'Media/BedroomToPCScreen/', prefix: 'BedtoPC', count: 75 },
    'pool_bedroom': { folder: 'Media/Pool_Bedroom/', prefix: 'PoolToBedroom', count: 100 },
    'office_bedroom': { folder: 'Media/Office_Bedroom/', prefix: 'OfficeToBedroom', count: 75 },
    'kitchen_pool': { folder: 'Media/Kitchen_Pool/', prefix: 'KitchenToPool', count: 100 },
    'office_kitchen': { folder: 'Media/Office_Kitchen/', prefix: 'OfficeToKitchen', count: 75 },
    'pool_office': { folder: 'Media/Pool_Office/', prefix: 'PoolToOffice', count: 75 }
  };

  const frameCache = {};

  function pad4(n) {
    return String(n).padStart(4, '0');
  }

  function preloadSequence(key) {
    if (frameCache[key]) return frameCache[key];
    const seq = sequences[key];
    if (!seq) return [];
    const frames = [];
    for (let i = 1; i <= seq.count; i++) {
      const img = new Image();
      img.src = `${seq.folder}${seq.prefix}${pad4(i)}.jpg`;
      frames.push(img);
    }
    frameCache[key] = frames;
    return frames;
  }

  // Preload all sequence frames upfront into memory
  Object.keys(sequences).forEach((k) => preloadSequence(k));

  // --- Canvas Image Renderer ---
  function drawFrameToCanvas(canvas, img) {
    if (!canvas || !img) return;
    currentActiveFrameImg = img;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth || Math.round(window.innerWidth * 1.1);
    const height = canvas.height = canvas.clientHeight || Math.round(window.innerHeight * 1.1);

    if (img.naturalWidth === 0) return;

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

  function playImageSequence(canvas, frames, startIdx, endIdx, onComplete) {
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
        }

        if (currentIdx === endIdx) {
          currentAnimId = null;
          if (onComplete) onComplete();
          return;
        }
        currentIdx += step;
      }
      currentAnimId = requestAnimationFrame(animate);
    }

    const firstImg = frames[startIdx];
    if (firstImg) {
      drawFrameToCanvas(canvas, firstImg);
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

    'bedroom-poolroom': { seq: 'pool_bedroom', reverse: false },
    'poolroom-bedroom': { seq: 'pool_bedroom', reverse: true },

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
      if (onComplete) onComplete();
      return;
    }

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

    let uiDone = false;
    let backdropDone = false;

    const startAnimation = () => {
      if (!uiDone || !backdropDone) return;

      const frames = preloadSequence(conn.seq);
      const activeCanvas = getActiveCanvas();

      const startIdx = conn.reverse ? frames.length - 1 : 0;
      const endIdx = conn.reverse ? 0 : frames.length - 1;

      playImageSequence(activeCanvas, frames, startIdx, endIdx, () => {
        currentRoom = destRoom;

        const baseFrame = getRoomBaseFrame(destRoom);
        if (baseFrame) {
          drawFrameToCanvas(activeCanvas, baseFrame);
        }

        updateRoomTitle(destRoom);

        const destNav = roomToNav[destRoom];
        updateActiveNav(destNav);

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
          if (onComplete) onComplete();
        });
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
      polygon: '2,6 98,6 98,94 2,94',
      interactionType: 'both',
      cursor: 'pointer',
      glowColor: '#ffffff',
      glowSoftColor: 'rgba(255, 255, 255, 0.45)',
      fillColor: 'rgba(255, 255, 255, 0.08)',
      strokeColor: 'rgb(255, 255, 255)',
      action: Object.freeze({
        type: 'url',
        sequence: 'bedroom_pc',
        url: '/projects'
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
    })
  };

  const InteractiveObjectManager = {
    stage: null,
    tooltipEl: null,
    currentBounds: { x: 0, y: 0, width: 0, height: 0 },

    init() {
      this.stage = document.getElementById('interactive-stage');
      this.createTooltip();
      if (currentActiveFrameImg) {
        drawFrameToCanvas(getActiveCanvas(), currentActiveFrameImg);
      }
      this.renderObjects();
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

        const startAnim = () => {
          if (!uiDone || !backdropDone) return;
          const activeCanvas = getActiveCanvas();

          playImageSequence(activeCanvas, frames, 0, frames.length - 1, () => {
            // Test Mode: Hold the last frame of the animation
            if (action.type === 'hold') {
              return;
            }

            // URL Navigation (e.g. /projects page navigation)
            if (action.type === 'url' && action.url) {
              window.location.href = action.url;
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
        };

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
        window.location.href = action.url;
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
        window.location.href = '/projects';
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
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');

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

    if (typeof InteractiveObjectManager !== 'undefined') {
      InteractiveObjectManager.renderObjects();
      InteractiveObjectManager.setInteractiveEnabled(true);
    }

    isScrollLocked = false;
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
      isIntroCompleted = localStorage.getItem('portfolioIntroCompleted') === 'true';
    } catch (e) {
      console.warn('Unable to access localStorage:', e);
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
    // PATH 2: Subsequent Visit / Normal Browser Refresh (Living Room)
    // ------------------------------------------------------------------------
    const livingBaseFrames = preloadSequence('living_bedroom');
    const livingBaseFrame = livingBaseFrames[0];

    if (isIntroCompleted) {
      if (freedomSplash) {
        freedomSplash.style.display = 'none';
        freedomSplash.classList.add('fade-out');
      }

      currentRoom = 'living';
      updateRoomTitle('living');
      updateActiveNav('home');

      if (uiContainer) {
        updateUIRoomState('living');
        uiContainer.classList.remove('ui-hidden');
      }

      const drawLivingAndReveal = () => {
        if (livingBaseFrame) {
          drawFrameToCanvas(activeCanvas, livingBaseFrame);
        }
        revealUI();
      };

      if (livingBaseFrame && livingBaseFrame.complete && livingBaseFrame.naturalWidth > 0) {
        drawLivingAndReveal();
      } else if (livingBaseFrame) {
        if (typeof livingBaseFrame.decode === 'function') {
          livingBaseFrame.decode().then(drawLivingAndReveal).catch(drawLivingAndReveal);
        } else {
          livingBaseFrame.onload = drawLivingAndReveal;
          livingBaseFrame.onerror = drawLivingAndReveal;
        }
      } else {
        revealUI();
      }
      return;
    }

    // ------------------------------------------------------------------------
    // PATH 3: First Visit (Freedom Splash -> Entrance Sequence -> Living Room)
    // ------------------------------------------------------------------------
    const entranceFrames = preloadSequence('entrance');
    const firstEntranceFrame = entranceFrames[0];

    function beginEntranceFlow() {
      // 1. "Freedom" appears and remains clearly visible for approximately 1 second
      setTimeout(() => {
        // 2. "Freedom" fades out smoothly over FREEDOM_FADE_DURATION
        if (freedomSplash) {
          freedomSplash.style.transition = `opacity ${FREEDOM_FADE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          freedomSplash.classList.add('fade-out');
        }

        // 3. After the fade-out completes, the Entrance sequence starts
        setTimeout(() => {
          if (freedomSplash) {
            freedomSplash.style.display = 'none';
          }

          // 4. Entrance video sequence plays normally
          playImageSequence(activeCanvas, entranceFrames, 0, entranceFrames.length - 1, () => {
            try {
              localStorage.setItem('portfolioIntroCompleted', 'true');
              document.documentElement.classList.add('intro-completed');
            } catch (e) {
              console.warn('Unable to write to localStorage:', e);
            }
            if (livingBaseFrame) {
              drawFrameToCanvas(activeCanvas, livingBaseFrame);
            }
            // 5. Entrance text appears centered over the video / living room
            revealUI();
          });
        }, FREEDOM_FADE_DURATION);
      }, FREEDOM_DISPLAY_DURATION);
    }

    if (firstEntranceFrame) {
      if (firstEntranceFrame.complete && firstEntranceFrame.naturalWidth > 0) {
        drawFrameToCanvas(activeCanvas, firstEntranceFrame);
        beginEntranceFlow();
      } else {
        firstEntranceFrame.onload = () => {
          drawFrameToCanvas(activeCanvas, firstEntranceFrame);
          beginEntranceFlow();
        };
        firstEntranceFrame.onerror = () => {
          beginEntranceFlow();
        };
      }
    } else {
      beginEntranceFlow();
    }
  }

  // --- Global Escape Key Navigation (Return to About Me / Living) ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (typeof isContactInterfaceOpen === 'function' && isContactInterfaceOpen()) {
        closeContactInterface();
        return;
      }
      if (currentRoom !== 'living' && !isScrollLocked && hasRevealed) {
        navigateToRoom('living');
      }
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
      sessionStorage.removeItem('returnFromProjects');
      document.documentElement.classList.remove('intro-completed');
      console.log('Intro state reset successfully. Reloading...');
      location.reload();
    } catch (e) {
      console.warn('Unable to clear storage:', e);
    }
  };
});
