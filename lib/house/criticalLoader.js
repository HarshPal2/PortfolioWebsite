// First-visit preloader: the opening entrance frames, the Living room frame and Cross.png must be
// ready before the walkthrough starts. Progress is shown as a percentage under "Freedom".

export function loadImage(img) {
  return new Promise((resolve) => {
    if (!img) { resolve(false); return; }
    if (!img.src && img._targetSrc) img.src = img._targetSrc;
    if (img.complete) { resolve(img.naturalWidth > 0); return; }
    const onDone = () => {
      img.removeEventListener('load', onDone);
      img.removeEventListener('error', onDone);
      resolve(img.naturalWidth > 0);
    };
    img.addEventListener('load', onDone, { once: true });
    img.addEventListener('error', onDone, { once: true });
  });
}

const BUFFER_COUNT = 18; // ~0.75 s of animation at 24 fps

export function createCriticalLoader(store, indicatorEl, percentEl) {
  return {
    fadeOutIndicator() {
      return new Promise((resolve) => {
        if (!indicatorEl) { resolve(); return; }
        indicatorEl.classList.add('is-fading-out');
        indicatorEl.classList.remove('is-visible');
        setTimeout(resolve, 350);
      });
    },

    loadCriticalAssets(onComplete) {
      // Entrance frames are created without firing 96 requests at once; frame 1 starts now.
      const entranceFrames = store.initSequenceFrames('entrance');
      if (!entranceFrames[0].src && entranceFrames[0]._targetSrc) {
        entranceFrames[0].src = entranceFrames[0]._targetSrc;
      }

      // The Living base frame on its own, without the 48 bedroom transition frames.
      const livingBaseImg = new Image();
      livingBaseImg.src = 'Media/Living_Bedroom/LivingToBedroom0097.avif';

      const crossImg = new Image();
      crossImg.src = 'Media/Cross.png';

      const criticalItems = [...entranceFrames.slice(0, BUFFER_COUNT), livingBaseImg, crossImg];
      const total = criticalItems.length;

      if (indicatorEl) indicatorEl.classList.add('is-visible');

      let resolved = 0;
      let hasCompleted = false;
      let safetyTimer = null;
      const finish = () => {
        if (hasCompleted) return;
        hasCompleted = true;
        if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = null; }
        if (onComplete) onComplete();
      };

      // Safety fallback: 8 s maximum wait for the buffer.
      safetyTimer = setTimeout(finish, 8000);

      // 4 images at a time for good HTTP/2 throughput.
      let idx = 0;
      let active = 0;
      const pump = () => {
        while (active < 4 && idx < criticalItems.length) {
          const item = criticalItems[idx++];
          active++;
          loadImage(item).then(() => {
            active--;
            resolved++;
            if (percentEl) percentEl.textContent = `${Math.min(100, Math.round((resolved / total) * 100))}%`;
            if (resolved >= total) finish();
            else pump();
          });
        }
      };
      pump();
    },
  };
}
