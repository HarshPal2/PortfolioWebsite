// Office room text, shown when the camera settles in this room.
export default function OfficeIntro({ onContactIntro }) {
  return (
    <section className="office-main" id="office-main" aria-label="Contact Introduction">
      <div className="office-block">
        {/* Heading */}{' '}
        <div className="headline-wrapper stagger-3">
          <h2 className="main-headline office-headline">{' '}
            Ideas are better shared.{' '}
          </h2>
        </div>{' '}
        {/* Body */}{' '}
        <p className="sub-headline office-sub-headline stagger-4">{' '}
          Have an idea, a project, or simply something worth exploring? Let’s open the door and see where it leads.{' '}
        </p>{' '}
        {/* Orange Accent Line */}{' '}
        <div className="orange-accent-line stagger-4" />{' '}
        {/* Get in Touch Button */}{' '}
        <div className="office-cta-wrapper stagger-4">
          <button type="button" className="explore-projects-btn contact-intro-btn" id="contact-intro-btn" onClick={(e) => { e.preventDefault(); onContactIntro(); }}>{' '}
            <span>
              Get in Touch
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
