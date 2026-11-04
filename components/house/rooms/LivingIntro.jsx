// Living room text, shown when the camera settles in this room.
export default function LivingIntro() {
  return (
    <main className="hero-main living-main about-main" id="living-main" aria-label="Home Introduction">
      <div className="about-block living-block">
        {/* Headline */}{' '}
        <div className="headline-wrapper stagger-3">
          <h2 className="main-headline living-headline">{' '}
            I’m{' '}
            <strong className="highlight-name">
              Harsh
            </strong>
            ,
            <br />{' '}
            a visual designer
            <br />{' '}
            and 3D artist.{' '}
          </h2>
        </div>{' '}
        {/* Supporting Text */}{' '}
        <p className="sub-headline living-sub-headline stagger-4">{' '}
          I create experiences through
          <br />{' '}
          emotions, motion, and storytelling{' '}
        </p>{' '}
        {/* Orange Accent Line (Global Signature Design Element) */}{' '}
        <div className="orange-accent-line stagger-4" />{' '}
        {/* Manifesto / Tagline */}{' '}
        <div className="tagline-wrapper stagger-4">
          <p className="tagline">{' '}
            CURIOUS BY NATURE.
            <br />{' '}
            EXPERIMENTAL BY CHOICE.{' '}
          </p>
        </div>
      </div>
    </main>
  );
}
