// Keeps keyboard focus inside an open window (case study, contact): focus moves in when it opens,
// Tab and Shift+Tab cycle within it, and focus goes back to where it was when it closes.
export function createFocusTrap(container) {
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let previous = null;
  let onKey = null;
  const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';
  return {
    activate(initial, returnTo) {
      if (!container) return;
      if (!onKey) previous = returnTo || document.activeElement;
      if (onKey) document.removeEventListener('keydown', onKey, true);
      onKey = (e) => {
        if (e.key !== 'Tab') return;
        const items = Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), visible);
        if (!items.length) { e.preventDefault(); return; }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (!container.contains(active)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && (active === first || active === container)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      };
      document.addEventListener('keydown', onKey, true);
      const target = initial || container;
      if (target === container && !container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
      // The window may still be fading in; retry briefly until it can take focus.
      let tries = 0;
      const tryFocus = () => {
        if (!onKey) return;
        try { target.focus({ preventScroll: true }); } catch (err) {}
        if (document.activeElement !== target && ++tries < 15) setTimeout(tryFocus, 100);
      };
      tryFocus();
    },
    release() {
      if (onKey) document.removeEventListener('keydown', onKey, true);
      onKey = null;
      const opener = previous;
      const openerId = opener && opener.id;
      previous = null;
      // React may re-create the opener while the room text comes back, so look it up again by id.
      const current = () => (openerId && document.getElementById(openerId)) || opener;
      if (opener && opener !== document.body && typeof opener.focus === 'function') {
        // The opener may still be fading back in; retry briefly until it can take focus.
        let tries = 0;
        const tryBack = () => {
          const back = current();
          if (onKey || !back || !document.contains(back)) return;
          try { back.focus({ preventScroll: true }); } catch (err) {}
          if (document.activeElement !== back && ++tries < 60) setTimeout(tryBack, 120);
        };
        tryBack();
      }
    }
  };
}
