// Plays an image sequence at 24 fps. A frame that is still downloading is waited for at most
// 150 ms, then skipped, so the animation never freezes.
const FRAME_INTERVAL = 1000 / 24; // 41.67 ms per frame

export function createSequencePlayer(drawFrame) {
  let animId = null;

  function stop() {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  function play(canvas, frames, startIdx, endIdx, onComplete, onFrame) {
    stop();
    if (!frames || frames.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let currentIdx = startIdx;
    const step = startIdx <= endIdx ? 1 : -1;
    let lastTime = performance.now();

    const finishAt = () => {
      animId = null;
      if (onComplete) onComplete();
    };

    function animate(now) {
      const delta = now - lastTime;
      if (delta >= FRAME_INTERVAL) {
        lastTime = now - (delta % FRAME_INTERVAL);

        const img = frames[currentIdx];
        if (img && img.naturalWidth > 0) {
          drawFrame(canvas, img);
          if (typeof onFrame === 'function') onFrame(currentIdx);
          if (currentIdx === endIdx) { finishAt(); return; }
          currentIdx += step;
        } else if (img && !img.complete) {
          // Still downloading: hold the current picture and wait for it.
          if (!img.src && img._targetSrc) img.src = img._targetSrc;
          if (!img._loadWaiting) {
            img._loadWaiting = true;
            img._waitStartTime = performance.now();
            const onReady = () => { img._loadWaiting = false; };
            img.addEventListener('load', onReady, { once: true });
            img.addEventListener('error', onReady, { once: true });
          } else if (img._waitStartTime && (performance.now() - img._waitStartTime > 150)) {
            // Waited more than 150 ms: skip forward so the animation does not freeze.
            img._loadWaiting = false;
            if (currentIdx === endIdx) { finishAt(); return; }
            currentIdx += step;
          }
        } else {
          // Failed or unavailable frame: skip it.
          if (currentIdx === endIdx) { finishAt(); return; }
          currentIdx += step;
        }
      }
      animId = requestAnimationFrame(animate);
    }

    const firstImg = frames[startIdx];
    if (firstImg) {
      if (!firstImg.src && firstImg._targetSrc) firstImg.src = firstImg._targetSrc;
      if (firstImg.complete && firstImg.naturalWidth > 0) drawFrame(canvas, firstImg);
    }
    if (typeof onFrame === 'function') onFrame(startIdx);
    animId = requestAnimationFrame(animate);
  }

  return { play, stop };
}
