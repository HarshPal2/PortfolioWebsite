/**
 * Harsh Portfolio — /project Page Script
 * 3D PC Monitor Canvas Renderer, Loading Intro, & Parallax Controller
 */

(function () {
  'use strict';

  let projectLoading = true;

  const canvas = document.getElementById('project-canvas');
  const stage = document.getElementById('monitor-screen-stage');
  const scene = document.getElementById('parallax-scene');
  const loadingOverlay = document.getElementById('project-loading-overlay');

  const pcImage = new Image();
  pcImage.src = '../Media/BedroomToPCScreen/BedtoPC0075.jpg';

  let parallaxInstance = null;

  function initParallax() {
    if (scene && typeof Parallax !== 'undefined' && !parallaxInstance) {
      parallaxInstance = new Parallax(scene, {
        relativeInput: true,
        hoverOnly: false,
        frictionX: 0.08,
        frictionY: 0.08,
        scalarX: 8.0,
        scalarY: 8.0
      });
    }
  }

  function renderScene() {
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
      stage.style.left = `${offsetX}px`;
      stage.style.top = `${offsetY}px`;
      stage.style.width = `${drawWidth}px`;
      stage.style.height = `${drawHeight}px`;
    }
  }

  // --- Loading Intro Dismissal Controller ---
  const LOADING_DURATION_MS = 1000;
  let loadingDismissTimer = null;

  function startLoadingSequence() {
    if (loadingDismissTimer) return;

    loadingDismissTimer = setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          projectLoading = false;
        }, 800);
      } else {
        projectLoading = false;
      }
    }, LOADING_DURATION_MS);
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

  // Start sequence immediately on DOMContentLoaded or script exec
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderScene();
      initParallax();
      startLoadingSequence();
    });
  } else {
    renderScene();
    initParallax();
    startLoadingSequence();
  }
})();
