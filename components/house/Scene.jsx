// The room picture: two canvases the frame sequences are drawn into (three.js), the 25% black
// backdrop, and the stage that holds the clickable hotspots. Parallax moves the layers.
export default function Scene({ refs, children }) {
  return (
    <div id="parallax-scene" className="parallax-scene" ref={refs.scene}>
      {/* Layer 1: background sequence canvas */}
      <div className="parallax-layer layer-bg" data-depth="0.08">
        <div className="video-wrapper">
          <canvas id="sequence-canvas" className="bg-video active-video" ref={refs.canvasA} />{' '}
          <canvas id="sequence-canvas-secondary" className="bg-video" ref={refs.canvasB} />
        </div>
      </div>{' '}
      {/* Layer 2: backdrop overlay */}
      <div className="parallax-layer layer-backdrop" data-depth="0.12">
        <div className="fullscreen-backdrop-rect" ref={refs.backdrop} />
      </div>{' '}
      {/* Layer 3: interactive objects */}
      <div className="parallax-layer layer-interactive" data-depth="0.08">
        <div id="interactive-stage" className="interactive-stage" ref={refs.stage}>
          {children}
        </div>
      </div>
    </div>
  );
}
