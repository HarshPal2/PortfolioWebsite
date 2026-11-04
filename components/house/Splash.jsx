// "Freedom" loading screen shown on the first visit while the opening frames load.
export default function Splash({ refs }) {
  return (
    <div id="freedom-splash" className="freedom-splash" ref={refs.splash}>
      <div className="freedom-splash-inner">
        <h1 className="freedom-splash-text">Freedom</h1>{' '}
        <div className="freedom-loading-indicator" id="freedom-loading-indicator" ref={refs.indicator}>
          <span className="freedom-loading-label">Loading</span>{' '}
          <span className="freedom-loading-percent" id="freedom-loading-percent" ref={refs.percent}>0%</span>
        </div>
      </div>
    </div>
  );
}
