// Kitchen room text, shown when the camera settles in this room.
export default function KitchenIntro({ onKitchenIntro }) {
  return (
    <section className="kitchen-main" id="kitchen-main" aria-label="Case Study Introduction">
      <div className="kitchen-block">
        {/* Heading */}{' '}
        <div className="headline-wrapper stagger-3">
          <h2 className="main-headline kitchen-headline">{' '}
            Reflections &amp; Explorations.{' '}
          </h2>
        </div>{' '}
        {/* Body */}{' '}
        <p className="sub-headline kitchen-sub-headline stagger-4">{' '}
          Writings on spatial design, real-time technology, and creative experiments.{' '}
        </p>{' '}
        {/* Orange Accent Line */}{' '}
        <div className="orange-accent-line stagger-4" />{' '}
        {/* Case Study CTA Button */}{' '}
        <div className="kitchen-cta-wrapper stagger-4">
          <button type="button" className="explore-projects-btn kitchen-intro-btn" id="kitchen-intro-btn" onClick={(e) => { e.preventDefault(); onKitchenIntro(); }}>{' '}
            <span>
              Case Study
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
