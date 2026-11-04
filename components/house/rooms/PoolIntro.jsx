// Pool room text, shown when the camera settles in this room.
export default function PoolIntro() {
  return (
    <section className="pool-main" id="pool-main" aria-label="About Me">
      <div className="pool-block">
        {/* Heading */}{' '}
        <div className="headline-wrapper stagger-3">
          <h2 className="main-headline pool-headline">{' '}
            A little about me.{' '}
          </h2>
        </div>{' '}
        {/* Body */}{' '}
        <p className="sub-headline pool-sub-headline stagger-4">{' '}
          I’m Harsh, a designer and 3D artist interested in creating environments and experiences that sit between the physical and digital.{' '}
        </p>{' '}
        {/* Orange Accent Line */}{' '}
        <div className="orange-accent-line stagger-4" />{' '}
        {/* Supporting Paragraph */}{' '}
        <p className="pool-supporting-text stagger-4">{' '}
          My work moves between 3D environments, visualisation, interaction design, and immersive experiences. I’m interested in not only building a space, but shaping how someone experiences it—and how technology can make that interaction more meaningful.{' '}
        </p>{' '}
        {/* Small Supporting Descriptor */}{' '}
        <div className="pool-descriptor-wrap stagger-4">
          <span className="pool-descriptor">
            Designer · 3D Artist · Experience Builder
          </span>
        </div>
      </div>
    </section>
  );
}
