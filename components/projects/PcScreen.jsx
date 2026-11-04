// The PC screen in the Bedroom: the monitor render (drawn with three.js), the screen content and the
// exit button, plus the full-screen film player. Static markup: lib/projects/controller.js and
// the desktop OS take over after mount, so React never re-renders it.
import { memo } from 'react';
import ProjectsEditorial from '@/content/projects/ProjectsEditorial';

function PcScreen() {
  return (
    <>
      <div id="parallax-scene" className="parallax-scene">
      {/* Layer 1: 3D PC Canvas Background */}{' '}
      <div className="parallax-layer layer-bg" data-depth="0.08">
        <div className="video-wrapper">
          <canvas id="project-canvas" className="bg-video active-video" />
        </div>
      </div>{' '}
      {/* Layer 2: Monitor Screen Content Viewport (Aligned 1:1 with Canvas 3D PC) */}{' '}
      <div className="parallax-layer layer-screen" data-depth="0.08">
        <div id="monitor-screen-stage" className="monitor-screen-stage">
          <div className="monitor-content-viewport is-loading">
            {/* Project Page Loading Intro Overlay (Inside Monitor Screen Panel) */}{' '}
            <div id="project-loading-overlay" className="project-loading-overlay">
              {/* Layer 1: Screen Wallpaper */}{' '}
              <div className="loading-wallpaper-layer">
                <img src="Media/1314645.jpg" alt="Wallpaper Background" className="loading-wallpaper-img" />
              </div>{' '}
              {/* Layer 2: 25% Black Transparent Film */}{' '}
              <div className="loading-dark-film" />{' '}
              {/* Layer 3: Loading / Introductory Text UI */}{' '}
              <div className="loading-ui-container">
                <div className="loading-ui-content">
                  <span className="loading-subtitle">
                    Loading
                  </span>{' '}
                  <h1 className="loading-title">
                    Projects
                  </h1>{' '}
                  <div className="loading-line-indicator">
                    <div className="loading-line-bar" />
                  </div>
                </div>
              </div>
            </div>{' '}
            {/* 12-Column Editorial Grid Container */}{' '}
            <ProjectsEditorial />
          </div>
          {/* /.monitor-content-viewport */}{' '}
          {/* Exit Projects Interactive Overlay */}{' '}
          {/* Positioned over the top-left corner of the PC monitor frame */}{' '}
          {/* Uses the same white glow polygon style as home interactive objects */}{' '}
          <div id="exit-projects-btn" className="pc-exit-btn" role="button" aria-label="Exit Projects" tabIndex="0">
            <svg className="pc-exit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon className="pc-exit-shape glow-shape" points="2,2 98,2 98,98 2,98" />
            </svg>{' '}
            <span className="pc-exit-tooltip-label">
              Exit Projects
            </span>
          </div>
        </div>
        {/* /.monitor-screen-stage */}
      </div>
      {/* /.layer-screen */}
    </div>
      <div id="cinematic-video-modal" className="cinematic-video-modal" aria-hidden="true">
      {/* Fade to black curtain */}{' '}
      <div className="cinematic-black-curtain" id="cinematic-curtain" />{' '}
      {/* Video player container */}{' '}
      <div className="cinematic-video-container" id="cinematic-video-container">
        <video id="cinematic-video-element" className="cinematic-video-player" playsInline preload="auto">
          <source src="Media/TreeHouseWithout.mp4" type="video/mp4" />{' '}
          Your browser does not support HTML5 video.{' '}
        </video>{' '}
        {/* Discreet Exit Button */}{' '}
        <button className="cinematic-close-btn" id="cinematic-close-btn" aria-label="Exit Cinematic Film">{' '}
          <span className="close-label">
            ESC / RETURN
          </span>{' '}
          <span className="close-icon">
            ×
          </span>{' '}
        </button>
      </div>
    </div>
    </>
  );
}

export default memo(PcScreen, () => true);
