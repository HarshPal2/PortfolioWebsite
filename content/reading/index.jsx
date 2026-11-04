// Reading version: home (converted from reading/index.html)
import ProjectDeck from '@/components/reading/ProjectDeck';
import ReadingContactForm from '@/components/reading/ReadingContactForm';

export default function ReadingHome() {
  return (
    <>

      <a className="skip" href="#main">
        Skip to content
      </a>{' '}
      <header>
        <div className="wrap">
          <div className="bar">
            <a className="brand" href="#top" id="top">
              Harsh
            </a>{' '}
            <nav aria-label="Sections">
              <a href="#about">
                About
              </a>{' '}
              <a href="#projects">
                Projects
              </a>{' '}
              <a href="#case-study">
                Case study
              </a>{' '}
              <a href="#contact">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>{' '}
      <div className="wrap">
        <div className="notice">{' '}
          This is the plain, fast version of my portfolio. The full experience is an interactive 3D house.{' '}
          <br />
          <a className="btn" href="../" id="enter-3d">
            Enter the 3D house
          </a>
        </div>{' '}
        <main id="main">
          <h1>
            I’m Harsh, a visual designer and 3D artist.
          </h1>{' '}
          <p className="lede">
            I create experiences through emotions, motion, and storytelling. Curious by nature. Experimental by choice.
          </p>{' '}
          <p>
            From constructed worlds to digital experiences, my work moves between disciplines, ideas, and ways of seeing without staying in one place for too long.
          </p>{' '}
          <section id="about">
            <h2>
              About
            </h2>{' '}
            <p>
              I’m a designer and 3D artist interested in creating environments and experiences that sit between the physical and digital.
            </p>{' '}
            <p>
              My work moves between 3D environments, visualisation, interaction design, and immersive experiences. I’m interested in not only building a space, but shaping how someone experiences it, and how technology can make that interaction more meaningful.
            </p>{' '}
            <p className="meta">
              Designer · 3D Artist · Experience Builder · Based in India
            </p>
          </section>{' '}
          <section id="projects">
            <h2>
              Projects
            </h2>{' '}
            <ProjectDeck>
                <li className="slide" id="slide-1" role="group" aria-roledescription="slide" aria-label="1 of 5">
                  <a className="card" href="glusight/">{' '}
                    <span className="card-img">
                      <img src="img/glusight-ref-01-hero-phone.webp" alt="GluSight predictive glucose interface on a mobile phone" loading="eager" decoding="async" style={{ "objectPosition": "center top", "transform": "scale(1.2)", "transformOrigin": "center top" }} />
                    </span>{' '}
                    <span className="card-body">{' '}
                      <span className="card-no">
                        01 / 05
                      </span>{' '}
                      <span className="card-title">
                        GluSight
                      </span>{' '}
                      <span className="card-meta">
                        Medical UX/UI concept · 2026
                      </span>{' '}
                      <span className="card-desc">
                        A concept exploring how predictive glucose insights could help people understand possible changes in their glucose levels and prepare for what’s ahead.
                      </span>{' '}
                      <span className="card-cta">
                        View project →
                      </span>{' '}
                    </span>{' '}
                  </a>
                </li>{' '}
                <li className="slide" id="slide-2" role="group" aria-roledescription="slide" aria-label="2 of 5">
                  <a className="card" href="cabin-in-the-woods/">{' '}
                    <span className="card-img">
                      <img src="img/cabin-cabin-hero.webp" alt="Cabin in the Woods architectural master perspective" loading="lazy" decoding="async" style={{ "objectPosition": "center center" }} />
                    </span>{' '}
                    <span className="card-body">{' '}
                      <span className="card-no">
                        02 / 05
                      </span>{' '}
                      <span className="card-title">
                        Cabin in the Woods
                      </span>{' '}
                      <span className="card-meta">
                        Architectural visualisation · 2026
                      </span>{' '}
                      <span className="card-desc">
                        A study of stillness, materiality, and light, exploring how a small woodland retreat can feel part of its landscape rather than placed within it.
                      </span>{' '}
                      <span className="card-cta">
                        View project →
                      </span>{' '}
                    </span>{' '}
                  </a>
                </li>{' '}
                <li className="slide" id="slide-3" role="group" aria-roledescription="slide" aria-label="3 of 5">
                  <a className="card" href="product-renders/">{' '}
                    <span className="card-img">
                      <img src="img/product-renders-harsh-pal-finalrender.webp" alt="Polaroid camera 3D look-development on wet pavement" loading="lazy" decoding="async" style={{ "objectPosition": "center center" }} />
                    </span>{' '}
                    <span className="card-body">{' '}
                      <span className="card-no">
                        03 / 05
                      </span>{' '}
                      <span className="card-title">
                        Product Renders
                      </span>{' '}
                      <span className="card-meta">
                        3D look development · 2025–2026
                      </span>{' '}
                      <span className="card-desc">
                        Look-development, hard-surface detailing, and photorealistic material studies.
                      </span>{' '}
                      <span className="card-cta">
                        View project →
                      </span>{' '}
                    </span>{' '}
                  </a>
                </li>{' '}
                <li className="slide" id="slide-4" role="group" aria-roledescription="slide" aria-label="4 of 5">
                  <a className="card" href="biophilic-interior/">{' '}
                    <span className="card-img">
                      <img src="img/biophilic-environment-img.webp" alt="Biophilic interior with indoor pool and slatted divider" loading="lazy" decoding="async" style={{ "objectPosition": "center center" }} />
                    </span>{' '}
                    <span className="card-body">{' '}
                      <span className="card-no">
                        04 / 05
                      </span>{' '}
                      <span className="card-title">
                        Biophilic Interior
                      </span>{' '}
                      <span className="card-meta">
                        Spatial &amp; interior visualisation · 2025
                      </span>{' '}
                      <span className="card-desc">
                        An interior exploration of how raw timber, still water, and living plants can soften contemporary spaces into calm, contemplative ones.
                      </span>{' '}
                      <span className="card-cta">
                        View project →
                      </span>{' '}
                    </span>{' '}
                  </a>
                </li>{' '}
                <li className="slide" id="slide-5" role="group" aria-roledescription="slide" aria-label="5 of 5">
                  <a className="card" href="poster-collection/">{' '}
                    <span className="card-img">
                      <img src="img/posters-poster-1iteration-1.webp" alt="SOMNIA speculative sci-fi poster" loading="lazy" decoding="async" style={{ "objectPosition": "center top" }} />
                    </span>{' '}
                    <span className="card-body">{' '}
                      <span className="card-no">
                        05 / 05
                      </span>{' '}
                      <span className="card-title">
                        Poster Collection
                      </span>{' '}
                      <span className="card-meta">
                        Graphic design · 2025–2026
                      </span>{' '}
                      <span className="card-desc">
                        A poster collection exploring speculative cinema, lucid dreamscapes, and whimsical character typography.
                      </span>{' '}
                      <span className="card-cta">
                        View project →
                      </span>{' '}
                    </span>{' '}
                  </a>
                </li>
            </ProjectDeck>{' '}
            <p className="fine">
              Swipe, use the arrows, or press the left and right keys. Films and full galleries are in the{' '}
              <a href="../projects/">
                3D project gallery
              </a>
              .
            </p>
          </section>{' '}
          <section id="case-study">
            <h2>
              Case study: GluSight
            </h2>{' '}
            <p className="lede">
              What if your glucose monitor could tell you what happens next?
            </p>{' '}
            <p>
              Living with diabetes means more than keeping track of numbers. GluSight is a design concept that explores how presenting current glucose information alongside a possible future trend could help people anticipate changes and better understand what they are seeing.
            </p>{' '}
            <ul className="list">
              <li>
                Current glucose{' '}
                <span>
                  Present reading and its trend
                </span>
              </li>{' '}
              <li>
                Predicted trend{' '}
                <span>
                  A possible future, shown as an estimate
                </span>
              </li>{' '}
              <li>
                Communicating uncertainty{' '}
                <span>
                  Observed vs estimated values
                </span>
              </li>{' '}
              <li>
                Contextual information{' '}
                <span>
                  Meals, activity, medication, stress, sleep
                </span>
              </li>
            </ul>{' '}
            <p className="fine" style={{ "marginTop": "14px" }}>
              GluSight is an independent concept and has not been clinically validated. The full write-up is in the Kitchen of the 3D house:{' '}
              <a href="../#blog">
                read the full case study
              </a>
              .
            </p>
          </section>{' '}
          <section id="contact">
            <h2>
              Contact me
            </h2>{' '}
            <p>
              Have a project in mind, an inquiry, or want to collaborate? Reach out directly or connect through my profiles.
            </p>{' '}
            <div className="contact-row">
              <a className="btn" href="mailto:harshpal.contact@gmail.com">
                Email me
              </a>{' '}
              <a className="btn" href="https://www.linkedin.com/in/harsh-pal-42b174205/" rel="noopener">
                LinkedIn
              </a>{' '}
              <a className="btn" href="https://www.artstation.com/harshpal" rel="noopener">
                ArtStation
              </a>
            </div>{' '}
            <ReadingContactForm />
          </section>
        </main>{' '}
        <footer>
          <nav aria-label="Footer">
            <a href="#about">
              About
            </a>
            <a href="#projects">
              Projects
            </a>
            <a href="#case-study">
              Case study
            </a>
            <a href="#contact">
              Contact
            </a>
            <a href="../">
              3D house
            </a>
          </nav>{' '}
          © 2026 Harsh{' '}
        </footer>
      </div>{' '}{' '}
    
    </>
  );
}
