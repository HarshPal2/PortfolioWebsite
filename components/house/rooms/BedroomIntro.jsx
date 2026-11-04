// Bedroom room text, shown when the camera settles in this room.
export default function BedroomIntro({ onExploreProjects }) {
  return (
    <section className="bedroom-main" id="bedroom-main" aria-label="Projects Introduction">
      <div className="bedroom-block">
        {/* Heading */}{' '}
        <div className="headline-wrapper stagger-3">
          <h2 className="main-headline bedroom-headline">{' '}
            A place to explore.{' '}
          </h2>
        </div>{' '}
        {/* Body */}{' '}
        <p className="sub-headline bedroom-sub-headline stagger-4">{' '}
          From constructed worlds to digital experiences, my work moves between disciplines, ideas, and ways of seeing without staying in one place for too long.{' '}
        </p>{' '}
        {/* Orange Accent Line */}{' '}
        <div className="orange-accent-line stagger-4" />{' '}
        {/* Explore Projects Button */}{' '}
        <div className="bedroom-cta-wrapper stagger-4">
          <button type="button" className="explore-projects-btn" id="explore-projects-btn" onClick={(e) => { e.preventDefault(); onExploreProjects(); }}>{' '}
            <span>
              Explore Projects
            </span>{' '}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>{' '}
          </button>
        </div>
      </div>
    </section>
  );
}
