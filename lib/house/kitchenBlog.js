// Kitchen case study window: opening/closing (with the hood retract animation), the five sections,
// stove dials, pager, keys and swipe, and Back/Forward support. Ported from the original script.js.
import { initKitchenStories } from './kitchenStories';
import { initKitchenTable } from './kitchenTable';

const KITCHEN_SPREADS = [
  { id: 'kb-sec-01', num: '01', dialIdx: 0 },
  { id: 'kb-sec-02', num: '02', dialIdx: 1 },
  { id: 'kb-sec-03', num: '03', dialIdx: 2 },
  { id: 'kb-sec-04', num: '04', dialIdx: 3 },
  { id: 'kb-sec-05', num: '05', dialIdx: 4 },
];
const DIAL_COUNT = 5; // Hook, Intro, The Idea, Research, Future

/**
 * @param root  the #kitchen-blog-stage element
 * @param house { hideTooltip, lock, unlockAfterClose, isScrollLocked, hasRevealed, currentRoom, navigateToRoom }
 */
export function createKitchenBlog(root, house) {
  const $ = (id) => (root ? root.querySelector('#' + id) : null);
  const kitchenBlogStage = root;
  const kitchenCanvas = $('kitchen-canvas');
  const kitchenSceneStage = $('kitchen-scene-stage');
  const floatingWindow = $('floating-project-window');
  const contentBody = $('content-body-scrollable');
  const stoveDialsRow = root ? root.querySelector('#stove-dials-row') : null;
  const stoveDialPods = root ? Array.from(root.querySelectorAll('.stove-dial-pod')) : [];
  const kitchenHoodArea = $('kitchen-hood-area');
  const kitchenSecCounter = $('kitchen-sec-counter');
  const cleanups = [];
  const listen = (target, type, fn, opts) => {
    if (!target) return;
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  };

  // Full-viewport kitchen picture behind the window (2D canvas, as before).
  const kitchenImage = new Image();
  kitchenImage.src = 'Media/KitchenScene.avif';

  function renderKitchenScene() {
    if (!kitchenCanvas) return;
    const ctx = kitchenCanvas.getContext('2d');
    const width = kitchenCanvas.width = window.innerWidth;
    const height = kitchenCanvas.height = window.innerHeight;
    const imgRatio = (kitchenImage.naturalWidth && kitchenImage.naturalHeight) ? (kitchenImage.naturalWidth / kitchenImage.naturalHeight) : 1.0;
    let drawWidth, drawHeight, offsetX, offsetY;
    if (width / height > imgRatio) {
      drawWidth = width; drawHeight = width / imgRatio; offsetX = 0; offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio; drawHeight = height; offsetX = (width - drawWidth) / 2; offsetY = 0;
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

  kitchenImage.onload = () => { if (isKitchenBlogOpen()) renderKitchenScene(); };
  listen(window, 'resize', () => { if (isKitchenBlogOpen()) renderKitchenScene(); });

  let activeSpreadIdx = 0;
  let activeKitchenDial = 0;
  let kitchenDialRotations = [0, 0, 0, 0, 0];
  let isKitchenRetracting = false;

  function isKitchenBlogOpen() {
    return !!(kitchenBlogStage && kitchenBlogStage.classList.contains('is-open'));
  }

  function updateKitchenUI() {
    stoveDialPods.forEach((pod, idx) => {
      pod.classList.toggle('active', idx === activeKitchenDial);
      const knob = pod.querySelector('.dial-knob');
      if (knob) knob.style.setProperty('--needle-rot', `${kitchenDialRotations[idx] || 0}deg`);
    });
    if (kitchenSecCounter && KITCHEN_SPREADS[activeSpreadIdx]) {
      kitchenSecCounter.textContent = `${KITCHEN_SPREADS[activeSpreadIdx].num} / 05`;
    }
    root.querySelectorAll('.kb-rail-tab').forEach((tab, idx) => tab.classList.toggle('active', idx === activeSpreadIdx));
  }

  // Paged slides: one section visible at a time (the marble-table mode scrolls instead).
  function isKitchenTableMode() {
    return !!(kitchenBlogStage && kitchenBlogStage.classList.contains('kb-table-mode'));
  }

  function showKitchenPage(idx, animate) {
    if (isKitchenTableMode()) {
      const target = $(KITCHEN_SPREADS[idx].id);
      if (target && contentBody) {
        const top = target.getBoundingClientRect().top - contentBody.getBoundingClientRect().top + contentBody.scrollTop;
        try { contentBody.scrollTo({ top: Math.max(0, top - 8), behavior: animate ? 'smooth' : 'auto' }); }
        catch (e) { contentBody.scrollTop = Math.max(0, top - 8); }
      }
      const tCount = $('kb-pager-count');
      if (tCount) tCount.textContent = `${KITCHEN_SPREADS[idx].num} / 05`;
      return;
    }
    KITCHEN_SPREADS.forEach((spread, i) => {
      const el = $(spread.id);
      if (!el) return;
      const on = i === idx;
      el.classList.toggle('kb-page-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on && animate) {
        el.classList.remove('kb-page-enter');
        void el.offsetWidth;
        el.classList.add('kb-page-enter');
      }
    });
    if (contentBody) contentBody.scrollTop = 0;
    const prev = $('kb-prev');
    const next = $('kb-next');
    const count = $('kb-pager-count');
    if (prev) prev.disabled = idx <= 0;
    if (next) next.disabled = idx >= KITCHEN_SPREADS.length - 1;
    if (count) count.textContent = `${KITCHEN_SPREADS[idx].num} / 05`;
  }

  function setKitchenDial(dialIdx) {
    const prevIdx = activeSpreadIdx;
    activeKitchenDial = Math.max(0, Math.min(DIAL_COUNT - 1, dialIdx));
    activeSpreadIdx = activeKitchenDial;
    showKitchenPage(activeSpreadIdx, activeSpreadIdx !== prevIdx);
    updateKitchenUI();
  }

  // Scroll-spy hook for the marble-table mode: updates counter and rail without scrolling.
  function kbSetActiveSection(idx) {
    if (typeof idx !== 'number' || idx < 0 || idx >= KITCHEN_SPREADS.length || idx === activeSpreadIdx) return;
    activeSpreadIdx = idx;
    activeKitchenDial = idx;
    const tCount = $('kb-pager-count');
    if (tCount) tCount.textContent = `${KITCHEN_SPREADS[idx].num} / 05`;
    updateKitchenUI();
  }

  // --- Case study window <-> browser history ---
  // Opening pushes ONE history entry (same URL, state {kitchenBlog:true}) so Back closes it. Every
  // close path funnels through popstate, so Back and the on-screen controls behave identically.
  let blogHistoryBackPending = false;

  function historyHasBlogState() {
    try { return !!(window.history.state && window.history.state.kitchenBlog); } catch (e) { return false; }
  }

  function openKitchenBlog(opts) {
    if (!kitchenBlogStage) return;
    const fromHistory = !!(opts && opts.fromHistory === true);
    house.hideTooltip();
    house.lock();
    isKitchenRetracting = false;
    if (floatingWindow) floatingWindow.classList.remove('is-retracting');

    kitchenBlogStage.classList.add('is-open');
    kitchenBlogStage.setAttribute('aria-hidden', 'false');

    // One entry per opening: skip when history already represents the open window.
    if (!fromHistory && !historyHasBlogState()) {
      try { window.history.pushState({ kitchenBlog: true }, '', window.location.href); } catch (e) {}
    }

    renderKitchenScene();
    activeSpreadIdx = 0;
    activeKitchenDial = 0;
    kitchenDialRotations = [0, 0, 0, 0, 0];
    showKitchenPage(0, false);
    if (contentBody) contentBody.scrollTop = 0;
    updateKitchenUI();
  }

  // Visual close only (the hood retract animation). Does not touch history.
  function closeKitchenBlogUI() {
    if (!kitchenBlogStage || isKitchenRetracting) return;
    isKitchenRetracting = true;
    if (floatingWindow) floatingWindow.classList.add('is-retracting');
    setTimeout(() => {
      kitchenBlogStage.classList.remove('is-open');
      kitchenBlogStage.setAttribute('aria-hidden', 'true');
      if (floatingWindow) floatingWindow.classList.remove('is-retracting');
      isKitchenRetracting = false;
      house.unlockAfterClose();
    }, 600);
  }

  // Close request from the UI / Escape. When the window owns the current history entry, pop it;
  // popstate then runs closeKitchenBlogUI().
  function closeKitchenBlog() {
    if (!kitchenBlogStage || isKitchenRetracting) return;
    if (isKitchenBlogOpen() && historyHasBlogState()) {
      if (blogHistoryBackPending) return;
      blogHistoryBackPending = true;
      try {
        window.history.back();
      } catch (e) {
        blogHistoryBackPending = false;
        closeKitchenBlogUI();
        return;
      }
      // history.back() is asynchronous; if no popstate arrives, still close the window.
      setTimeout(() => {
        if (blogHistoryBackPending) {
          blogHistoryBackPending = false;
          if (isKitchenBlogOpen()) closeKitchenBlogUI();
        }
      }, 1000);
      return;
    }
    closeKitchenBlogUI();
  }

  // Re-open because history says it should be open (Forward). Waits out a running transition,
  // and goes to the Kitchen first if we are elsewhere.
  function openBlogFromHistory(attempt) {
    if (!historyHasBlogState()) return;
    if (isKitchenBlogOpen() && !isKitchenRetracting) return;
    if (house.isScrollLocked()) {
      if (attempt < 60) setTimeout(() => openBlogFromHistory(attempt + 1), 50);
      return;
    }
    if (house.currentRoom() !== 'kitchen') {
      house.navigateToRoom('kitchen', () => openBlogFromHistory(0));
      return;
    }
    openKitchenBlog({ fromHistory: true });
  }

  function syncBlogWithHistory() {
    blogHistoryBackPending = false;
    if (!historyHasBlogState()) {
      if (isKitchenBlogOpen()) closeKitchenBlogUI();
      return;
    }
    if (!house.hasRevealed()) return;
    openBlogFromHistory(0);
  }

  // Page (re)loaded on an entry that represents an open window, or arrived from the Projects page's
  // "full case study" button (one-shot flag that expires after 30 s).
  function restoreBlogFromHistoryState() {
    if (house.currentRoom() === 'kitchen' && historyHasBlogState() && !isKitchenBlogOpen()) {
      openKitchenBlog({ fromHistory: true });
      return;
    }
    let wantsBlog = false;
    try {
      const t = parseInt(sessionStorage.getItem('openKitchenBlogOnArrival') || '0', 10);
      sessionStorage.removeItem('openKitchenBlogOnArrival');
      wantsBlog = t > 0 && (Date.now() - t) < 30000;
    } catch (e) {}
    if (wantsBlog && house.currentRoom() === 'kitchen' && !isKitchenBlogOpen()) openKitchenBlog();
  }

  // --- Controls ---
  listen(stoveDialsRow, 'wheel', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isKitchenRetracting) return;
    if (e.deltaY > 30 && activeKitchenDial < DIAL_COUNT - 1) setKitchenDial(activeKitchenDial + 1);
    else if (e.deltaY < -30 && activeKitchenDial > 0) setKitchenDial(activeKitchenDial - 1);
  }, { passive: false });

  listen($('kb-prev'), 'click', () => setKitchenDial(activeKitchenDial - 1));
  listen($('kb-next'), 'click', () => setKitchenDial(activeKitchenDial + 1));
  listen(document, 'keydown', (e) => {
    if (!isKitchenBlogOpen() || isKitchenRetracting) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); setKitchenDial(activeKitchenDial + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setKitchenDial(activeKitchenDial - 1); }
  });
  if (contentBody) {
    let sx = 0, sy = 0, tracking = false;
    listen(contentBody, 'touchstart', (e) => {
      if (e.touches.length !== 1) { tracking = false; return; }
      tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    listen(contentBody, 'touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) setKitchenDial(activeKitchenDial + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  root.querySelectorAll('.kb-rail-tab').forEach((tab) => {
    listen(tab, 'click', (e) => {
      e.preventDefault();
      const secIdx = parseInt(tab.getAttribute('data-section'), 10);
      if (!isNaN(secIdx)) setKitchenDial(secIdx);
    });
  });

  // Keep wheel and touch inside the window from changing rooms.
  const stop = (e) => e.stopPropagation();
  listen(floatingWindow, 'wheel', stop, { passive: true });
  listen(floatingWindow, 'touchmove', stop, { passive: true });
  listen(floatingWindow, 'touchstart', stop, { passive: true });
  listen(kitchenBlogStage, 'wheel', stop, { passive: true });
  listen(kitchenBlogStage, 'touchmove', stop, { passive: true });

  stoveDialPods.forEach((pod) => {
    listen(pod, 'click', (e) => {
      e.preventDefault();
      const sec = parseInt(pod.getAttribute('data-section'), 10);
      if (!isNaN(sec)) setKitchenDial(sec);
    });
  });

  const closeOnClick = (e) => { e.preventDefault(); closeKitchenBlog(); };
  listen($('kitchen-return-btn'), 'click', closeOnClick);
  listen($('kitchen-hood-exit-btn'), 'click', closeOnClick);
  listen(kitchenHoodArea, 'click', (e) => {
    if (e.target === kitchenHoodArea || e.target.closest('.kitchen-hood-exit-btn')) closeKitchenBlog();
  });
  listen($('window-close-btn'), 'click', closeOnClick);
  listen($('kitchen-stage-backdrop'), 'click', closeOnClick);

  // Visual-project slides and the marble-table layout.
  const api = { setKitchenDial, kbSetActiveSection };
  const stories = initKitchenStories(root, api);
  const table = initKitchenTable(root, api);

  return {
    isOpen: isKitchenBlogOpen,
    openKitchenBlog,
    closeKitchenBlog,
    syncBlogWithHistory,
    restoreBlogFromHistoryState,
    setKitchenDial,
    destroy() {
      cleanups.forEach((fn) => fn());
      if (stories && stories.destroy) stories.destroy();
      if (table && table.destroy) table.destroy();
    },
  };
}
