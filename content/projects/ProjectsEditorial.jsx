// The Projects page as it reads on phones (and before the desktop OS takes over the screen):
// project list on the left, the selected project's showcase on the right.
export default function ProjectsEditorial() {
  return (
    <div className="editorial-container">
              <div className="editorial-layout">
                {/* Left Column: Editorial Hierarchical Navigation */}{' '}
                <nav className="editorial-nav" aria-label="Project Categories Navigation">
                  {/* Return to Room Navigation Link */}{' '}
                  <div className="nav-return-group">
                    <button type="button" className="nav-return-btn" id="nav-return-btn" aria-label="Return to Room">{' '}
                      <span className="return-arrow" aria-hidden="true">
                        ←
                      </span>{' '}
                      <span className="return-label">
                        Return to Room
                      </span>{' '}
                    </button>
                  </div>{' '}
                  {/* Scrollable Category & Project Pills Container */}{' '}
                  <div className="nav-categories-scroll">
                    {/* Category 1: CASE STUDY */}{' '}
                    <div className="nav-category-group">
                      <h2 className="nav-category-title">
                        CASE STUDY
                      </h2>{' '}
                      <ul className="nav-project-list">
                        <li className="nav-project-item">
                          <button className="nav-project-btn active" data-project="glusight">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              GluSight
                            </span>{' '}
                          </button>
                        </li>
                      </ul>
                    </div>{' '}
                    {/* Category 2: VISUALS */}{' '}
                    <div className="nav-category-group">
                      <h2 className="nav-category-title">
                        VISUALS
                      </h2>{' '}
                      <ul className="nav-project-list">
                        <li className="nav-project-item">
                          <button className="nav-project-btn" data-project="cabin-in-woods">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              Cabin in Woods
                            </span>{' '}
                          </button>
                        </li>{' '}
                        <li className="nav-project-item">
                          <button className="nav-project-btn" data-project="product-renders">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              Product Renders
                            </span>{' '}
                          </button>
                        </li>{' '}
                        <li className="nav-project-item">
                          <button className="nav-project-btn" data-project="biophilic-interior">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              Biophilic Interior
                            </span>{' '}
                          </button>
                        </li>
                      </ul>
                    </div>{' '}
                    {/* Category 3: GRAPHICS */}{' '}
                    <div className="nav-category-group">
                      <h2 className="nav-category-title">
                        GRAPHICS
                      </h2>{' '}
                      <ul className="nav-project-list">
                        <li className="nav-project-item">
                          <button className="nav-project-btn" data-project="contemporary-aipan">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              Contemporary Aipan
                            </span>{' '}
                          </button>
                        </li>{' '}
                        <li className="nav-project-item">
                          <button className="nav-project-btn" data-project="poster">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              Poster
                            </span>{' '}
                          </button>
                        </li>{' '}
                        <li className="nav-project-item">
                          <button className="nav-project-btn" data-project="bookmark">{' '}
                            <span className="active-dot">
                              ●
                            </span>{' '}
                            <span className="project-name">
                              Bookmark
                            </span>{' '}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>{' '}
                {/* Right Column: Scrollable GluSight Editorial Case Study */}{' '}
                <main className="editorial-main-content">
                  {/* GluSight Dedicated Concise Project Overview */}{' '}
                  <article id="glusight-case-study" className="glusight-case-study editorial-article" aria-label="GluSight Project Overview">
                    {/* SPREAD 01: HERO OPENING SPREAD (Cols 1-5 Text / Cols 6-12 Hero Visual) */}{' '}
                    <section className="editorial-spread spread-opening grid-12">
                      <div className="opening-text-col span-5">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            NO. 01
                          </span>{' '}
                          <span className="folio-cat">
                            CASE STUDY — MEDICAL UX/UI
                          </span>
                        </div>{' '}
                        <h1 className="editorial-hero-title">
                          GluSight
                        </h1>{' '}
                        <div className="editorial-rule" />{' '}
                        <h2 className="editorial-hook">
                          What if your glucose monitor could tell you what happens next?
                        </h2>{' '}
                        <p className="editorial-lead">{' '}
                          GluSight explores how predictive insights can help people understand their glucose levels and anticipate what's next. A concept for a continuous glucose monitoring interface, exploring how a possible future trend could be shown alongside the current reading.{' '}
                        </p>{' '}
                        {/* Metadata Strip */}{' '}
                        <div className="editorial-meta-grid">
                          <div className="meta-item">
                            <span className="meta-label">
                              DISCIPLINE
                            </span>{' '}
                            <span className="meta-val">
                              Medical UX/UI
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              TIMELINE
                            </span>{' '}
                            <span className="meta-val">
                              2026
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              ROLE
                            </span>{' '}
                            <span className="meta-val">
                              Research &amp; User Interface
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              MEDIUM
                            </span>{' '}
                            <span className="meta-val">
                              Design System &amp; Predictive UI
                            </span>
                          </div>
                        </div>
                      </div>{' '}
                      {/* Master Hero Visual (Span 7) */}{' '}
                      <div className="opening-visual-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-hero">
                            <img src="Media/GluSight/ref_01_hero_phone.jpg" alt="GluSight predictive glucose telemetry interface on mobile device" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 01 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Predictive glucose telemetry interface displaying live reading and forward horizon.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 02: CORE DESIGN INNOVATIONS (3 Columns) */}{' '}
                    <section className="editorial-spread spread-pillars grid-12">
                      <div className="pillar-col span-4">
                        <div className="pillar-folio">
                          01 / TREND
                        </div>{' '}
                        <h3 className="pillar-title">
                          Predicted Trend
                        </h3>{' '}
                        <p className="pillar-desc">{' '}
                          Showing a possible future glucose trend alongside the current reading, so people can consider what may come next.{' '}
                        </p>
                      </div>{' '}
                      <div className="pillar-col span-4">
                        <div className="pillar-folio">
                          02 / UNCERTAINTY
                        </div>{' '}
                        <h3 className="pillar-title">
                          Communicating Uncertainty
                        </h3>{' '}
                        <p className="pillar-desc">{' '}
                          A confidence indicator and clear visual distinctions between recorded and estimated values, framing predictions as estimates rather than certainties.{' '}
                        </p>
                      </div>{' '}
                      <div className="pillar-col span-4">
                        <div className="pillar-folio">
                          03 / CONTEXT
                        </div>{' '}
                        <h3 className="pillar-title">
                          Contextual Habits
                        </h3>{' '}
                        <p className="pillar-desc">{' '}
                          Exploring how meals, physical activity and rest could be shown alongside glucose readings to give the numbers context.{' '}
                        </p>
                      </div>
                    </section>{' '}
                    {/* SPREAD 03: EDITORIAL LINK TO CASE STUDY */}{' '}
                    <section className="editorial-spread spread-blog-link">
                      <div className="blog-callout-card">
                        <div className="blog-callout-badge">
                          DETAILED CASE STUDY
                        </div>{' '}
                        <h3 className="blog-callout-heading">
                          Want to explore the concept in more detail?
                        </h3>{' '}
                        <p className="blog-callout-text">{' '}
                          The full case study covers the concept, a closer look at the interface, published research and future plans. It is in the Case Study section.{' '}
                        </p>{' '}
                        <a href="../index.html#blog" className="blog-callout-btn" id="bedroom-to-kitchen-blog-btn">{' '}
                          <span>
                            Read Full Case Study
                          </span>{' '}
                          <span className="btn-arrow" aria-hidden="true">
                            →
                          </span>{' '}
                        </a>
                      </div>
                    </section>{' '}
                    {/* Colophon Outro */}{' '}
                    <footer className="editorial-colophon">
                      <div className="colophon-inner">
                        <div className="colophon-rule" />{' '}
                        <p className="colophon-quote">{' '}
                          “Transforming uncertain bio-signals into actionable everyday clarity.”{' '}
                        </p>{' '}
                        <span className="colophon-folio">
                          GLUSIGHT — HARSH PORTFOLIO © 2026
                        </span>
                      </div>
                    </footer>
                  </article>{' '}
                  {/* Cabin in the Woods Dedicated Editorial Architectural Showcase */}{' '}
                  <article id="cabin-case-study" className="cabin-case-study editorial-article" aria-label="Cabin in the Woods Visual Showcase" style={{ "display": "none" }}>
                    {/* SPREAD 01: ASYMMETRIC OPENING SPREAD (Cols 1-5 Text / Cols 6-12 Hero Visual) */}{' '}
                    <section className="editorial-spread spread-opening grid-12">
                      <div className="opening-text-col span-5">
                        <div className="editorial-folio-tag">
                          <span className="folio-no">
                            NO. 01
                          </span>{' '}
                          <span className="folio-cat">
                            VISUALS — ARCHITECTURAL CGI
                          </span>
                        </div>{' '}
                        <h1 className="editorial-hero-title">
                          Cabin in the Woods
                        </h1>{' '}
                        <div className="editorial-rule" />{' '}
                        <h2 className="editorial-hook">
                          An architectural visualization study exploring stillness, materiality, and light in an ancient woodland.
                        </h2>{' '}
                        <p className="editorial-lead">{' '}
                          An architectural visualization study exploring how a small woodland retreat can feel integrated with its surrounding landscape rather than placed within it.{' '}
                        </p>{' '}
                        {/* Metadata Strip with Fine Hairlines */}{' '}
                        <div className="editorial-meta-grid">
                          <div className="meta-item">
                            <span className="meta-label">
                              DISCIPLINE
                            </span>{' '}
                            <span className="meta-val">
                              Architectural CGI
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              TIMELINE
                            </span>{' '}
                            <span className="meta-val">
                              2026
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              ROLE
                            </span>{' '}
                            <span className="meta-val">
                              Environment &amp; Lighting
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              MEDIUM
                            </span>{' '}
                            <span className="meta-val">
                              Blender Cycles &amp; Substance
                            </span>
                          </div>
                        </div>
                      </div>{' '}
                      {/* Master Hero Perspective (Span 7) */}{' '}
                      <div className="opening-visual-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-hero">
                            <img src="Media/Cabin/cabin_hero.jpg" alt="Cabin in the Woods architectural master perspective" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 01 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Filtered morning sunlight establishes a quiet relationship between the cabin and the forest.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 02: OFFSET PHILOSOPHY SPREAD (Cols 1-4 Margin Note / Cols 5-12 Pull Quote) */}{' '}
                    <section className="editorial-spread spread-statement grid-12">
                      <div className="statement-label-col span-4">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            02
                          </span>{' '}
                          <span className="folio-title">
                            SPATIAL CONTEXT
                          </span>
                        </div>{' '}
                        <div className="editorial-hairline" />{' '}
                        <p className="statement-subtext">
                          The dialogue between crafted timber structures and organic landscape.
                        </p>
                      </div>{' '}
                      <div className="statement-quote-col span-8">
                        <blockquote className="editorial-large-quote">{' '}
                          “The design focuses on the relationship between built form and nature, using weathered timber, a steep pitched roof, decorative detailing, and a restrained material palette to give the cabin a distinct sense of character.”{' '}
                        </blockquote>
                      </div>
                    </section>{' '}
                    {/* SPREAD 03: ASYMMETRIC SCALE CONTRAST (Dominant Tall 7 Cols / Offset Macro 5 Cols) */}{' '}
                    <section className="editorial-spread spread-asymmetric-duo grid-12">
                      {/* Left: Dominant Tall Foliage Canopy (Span 7) */}{' '}
                      <div className="duo-dominant-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-tall">
                            <img src="Media/Cabin/cabin_detail_canopy.jpg" alt="Morning sun filtering through maple leaves onto timber siding" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 02 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Diffuse morning sunlight filtered through layered maple leaves, casting soft shadows across weathered timber siding.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      {/* Right: Offset Handcrafted Frieze Detail (Span 5) */}{' '}
                      <div className="duo-offset-col span-5">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-square">
                            <img src="Media/Cabin/cabin_detail_gable.jpg" alt="Pitched roof gable and handcrafted decorative floral frieze" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 03 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Decorative floral frieze and steep timber gable reinforcing rustic authenticity.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 04: FULL-BLEED CINEMATIC MOTION (Span 12) */}{' '}
                    <section className="editorial-spread spread-cinema grid-12" id="cabin-film-trigger-section">
                      <div className="cinema-card-col span-12">
                        <div className="cabin-film-card">
                          <div className="cabin-film-bg-preview">
                            <img src="Media/Cabin/cabin_hero.jpg" alt="Cinematic Film Preview" className="film-bg-img" />{' '}
                            <div className="film-bg-gradient" />
                          </div>{' '}
                          <button className="cabin-film-trigger" id="cabin-film-btn" aria-label="Watch Cabin in the Woods Cinematic Film">{' '}
                            <div className="film-trigger-content">
                              <div className="film-badge-row">
                                <span className="film-num">
                                  01 / FILM
                                </span>{' '}
                                <span className="film-duration">
                                  CINEMATIC PRESENTATION
                                </span>
                              </div>{' '}
                              <h3 className="film-title">
                                Watch the House
                              </h3>{' '}
                              <p className="film-subtitle">
                                An immersive motion journey through light, shadow, and stillness.
                              </p>{' '}
                              <div className="film-action-link">
                                <span className="film-play-icon">
                                  ▶
                                </span>{' '}
                                <span className="film-action-text">
                                  PLAY FILM →
                                </span>
                              </div>
                            </div>{' '}
                          </button>
                        </div>
                      </div>
                    </section>{' '}
                    {/* SPREAD 05: TACTILE ARCHITECTURAL STUDIES (Span 6 / Span 6 Offset) */}{' '}
                    <section className="editorial-spread spread-tactile-duo grid-12">
                      <div className="tactile-col span-6">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Cabin/cabin_detail_windows.jpg" alt="Diamond leaded glazing and timber entrance doorway" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 04 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Diamond-patterned leaded glazing framed within the weathered facade.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="tactile-col span-6">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Cabin/cabin_detail_porch.jpg" alt="Weathered timber porch railing and mossy forest floor" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 05 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Weathered timber porch detailing transitioning into the forest floor.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 06: EDITORIAL COLOPHON & OUTRO (Span 12 Centered) */}{' '}
                    <footer className="editorial-colophon">
                      <div className="colophon-inner">
                        <div className="colophon-rule" />{' '}
                        <p className="colophon-quote">{' '}
                          “A quiet dialogue between structure, shadow, and nature.”{' '}
                        </p>{' '}
                        <span className="colophon-folio">
                          VISUALS — HARSH PORTFOLIO © 2026
                        </span>
                      </div>
                    </footer>
                  </article>{' '}
                  {/* Product Renders Dedicated Editorial Showcase */}{' '}
                  <article id="product-renders-case-study" className="product-renders-case-study editorial-article" aria-label="Product Renders Visual Showcase" style={{ "display": "none" }}>
                    {/* SPREAD 01: ASYMMETRIC OPENING SPREAD (Cols 1-5 Text / Cols 6-12 Hero Visual) */}{' '}
                    <section className="editorial-spread spread-opening grid-12">
                      <div className="opening-text-col span-5">
                        <div className="editorial-folio-tag">
                          <span className="folio-no">
                            NO. 02
                          </span>{' '}
                          <span className="folio-cat">
                            VISUALS — 3D LOOKDEV &amp; MATERIALITY
                          </span>
                        </div>{' '}
                        <h1 className="editorial-hero-title">
                          Product Renders
                        </h1>{' '}
                        <div className="editorial-rule" />{' '}
                        <h2 className="editorial-hook">
                          A curated collection of 3D look-development, hard-surface detailing, and photorealistic material studies.
                        </h2>{' '}
                        <p className="editorial-lead">{' '}
                          Exploring the intersection of industrial form, physical light behavior, and tactile material response through precise shader construction and studio lighting choreography.{' '}
                        </p>{' '}
                        {/* Metadata Strip with Fine Hairlines */}{' '}
                        <div className="editorial-meta-grid">
                          <div className="meta-item">
                            <span className="meta-label">
                              DISCIPLINE
                            </span>{' '}
                            <span className="meta-val">
                              3D LookDev &amp; Lighting
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              TIMELINE
                            </span>{' '}
                            <span className="meta-val">
                              2025 — 2026
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              ROLE
                            </span>{' '}
                            <span className="meta-val">
                              3D Artist &amp; Stylist
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              MEDIUM
                            </span>{' '}
                            <span className="meta-val">
                              Blender Cycles &amp; Substance
                            </span>
                          </div>
                        </div>
                      </div>{' '}
                      {/* Master Hero Perspective (Span 7) */}{' '}
                      <div className="opening-visual-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-hero">
                            <img src="Media/Product Renders/harsh-pal-finalrender.jpg" alt="Polaroid camera 3D look-development on wet pavement with foliage reflections" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 01 ]
                            </span>{' '}
                            <span className="caption-desc">
                              High-fidelity 3D look-development of the olive green Polaroid Now resting on weathered wet ground.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 02: OFFSET PHILOSOPHY SPREAD (Cols 1-4 Margin Note / Cols 5-12 Pull Quote) */}{' '}
                    <section className="editorial-spread spread-statement grid-12">
                      <div className="statement-label-col span-4">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            02
                          </span>{' '}
                          <span className="folio-title">
                            SHADING PHILOSOPHY
                          </span>
                        </div>{' '}
                        <div className="editorial-hairline" />{' '}
                        <p className="statement-subtext">
                          The tangible relationship between light, micro-roughness, and material memory.
                        </p>
                      </div>{' '}
                      <div className="statement-quote-col span-8">
                        <blockquote className="editorial-large-quote">{' '}
                          “Look-development is not merely about achieving photorealism—it is the craft of giving digital objects physical memory, tactile friction, and a sense of tangible reality.”{' '}
                        </blockquote>
                      </div>
                    </section>{' '}
                    {/* SPREAD 03: ASYMMETRIC MATERIAL CONTRAST (Ceramic Light 7 Cols / Macro Polymer 5 Cols) */}{' '}
                    <section className="editorial-spread spread-asymmetric-duo grid-12">
                      {/* Left: Handcrafted Ceramic Lighthouse (Span 7) */}{' '}
                      <div className="duo-dominant-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-square">
                            <img src="Media/Product Renders/1Psed.png" alt="Handcrafted ceramic lighthouse candleholder with flame and dappled leaf shadows" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 02 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Handcrafted ceramic lighthouse candleholder exploring translucent subsurface scattering and ambient flame warmth.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      {/* Right: Micro-surface Macro LookDev (Span 5) */}{' '}
                      <div className="duo-offset-col span-5">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-square">
                            <img src="Media/Product Renders/harsh-pal-image0001.jpg" alt="Macro 3D render showcasing micro polymer roughness and optical lens coatings" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 03 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Micro-surface look-development capturing molded polymer grain, recessed typography, and coated glass elements.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 04: FULL WIDESCREEN CINEMA & MOTION TURNTABLE (Span 12) */}{' '}
                    <section className="editorial-spread spread-cinema-duo grid-12" id="product-film-trigger-section">
                      <div className="cinema-widescreen-col span-12">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-widescreen">
                            <img src="Media/Product Renders/img (9).png" alt="Atmospheric widescreen product look-development scene" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 04 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Atmospheric widescreen look-development integrating directional lighting with nuanced surface reflectivity.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      {/* Cinematic Motion Presentation Card (Span 12) */}{' '}
                      <div className="cinema-card-col span-12">
                        <div className="cabin-film-card product-film-card">
                          <div className="cabin-film-bg-preview">
                            <img src="Media/Product Renders/harsh-pal-finalrender.jpg" alt="Product Motion Turntable Preview" className="film-bg-img" />{' '}
                            <div className="film-bg-gradient" />
                          </div>{' '}
                          <button className="cabin-film-trigger" id="product-film-btn" aria-label="Watch Product Motion Breakdown">{' '}
                            <div className="film-trigger-content">
                              <div className="film-badge-row">
                                <span className="film-num">
                                  02 / FILM
                                </span>{' '}
                                <span className="film-duration">
                                  TURNTABLE PRESENTATION
                                </span>
                              </div>{' '}
                              <h3 className="film-title">
                                Watch Turntable Motion
                              </h3>{' '}
                              <p className="film-subtitle">
                                Dynamic 360° motion study exploring specular rolloff, Fresnel, and real-time roughness.
                              </p>{' '}
                              <div className="film-action-link">
                                <span className="film-play-icon">
                                  ▶
                                </span>{' '}
                                <span className="film-action-text">
                                  PLAY MOTION →
                                </span>
                              </div>
                            </div>{' '}
                          </button>
                        </div>
                      </div>
                    </section>{' '}
                    {/* SPREAD 05: ASYMMETRIC SPATIAL & SCULPTURAL COMPOSITION (Portrait 5 Cols / Sculptural 7 Cols) */}{' '}
                    <section className="editorial-spread spread-spatial-duo grid-12">
                      <div className="spatial-portrait-col span-5">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-tall">
                            <img src="Media/Product Renders/img (11).png" alt="Vertical spatial product lighting study with architectural contrast" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 06 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Vertical spatial lighting study exploring architectural contrast and specular highlights.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="spatial-sculptural-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Product Renders/img (3).jpg" alt="Sculptural product study examining geometric curvature and directional highlights" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 07 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Sculptural product study examining geometric curvature and directional studio highlights.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 06: EDITORIAL COLOPHON & OUTRO */}{' '}
                    <footer className="editorial-colophon">
                      <div className="colophon-inner">
                        <div className="colophon-rule" />{' '}
                        <p className="colophon-quote">{' '}
                          “A continuous inquiry into form, light, and the tangible soul of synthetic surfaces.”{' '}
                        </p>{' '}
                        <span className="colophon-folio">
                          VISUALS — HARSH PORTFOLIO © 2026
                        </span>
                      </div>
                    </footer>
                  </article>{' '}
                  {/* ========================================================================== */}{' '}
                  {/* BIOPHILIC INTERIOR CASE STUDY */}{' '}
                  {/* ========================================================================== */}{' '}
                  <article id="biophilic-case-study" className="editorial-case-study" style={{ "display": "none" }}>
                    {/* SPREAD 01: HERO / OPENING SPREAD (Cols 1-5 Text / Cols 6-12 Master Image) */}{' '}
                    <section className="editorial-spread spread-hero grid-12">
                      <div className="opening-text-col span-5">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            NO. 03
                          </span>{' '}
                          <span className="folio-cat">
                            VISUALS — SPATIAL &amp; INTERIOR ARCHITECTURE
                          </span>
                        </div>{' '}
                        <h1 className="editorial-hero-title">
                          Biophilic Interior
                        </h1>{' '}
                        <div className="editorial-rule" />{' '}
                        <h2 className="editorial-hook">
                          A serene spatial sanctuary investigating the symbiosis of raw timber, tranquil water, and living flora.
                        </h2>{' '}
                        <p className="editorial-lead">{' '}
                          An interior architectural exploration into biophilic living environments, examining how natural lighting, organic cedar textures, reflective water features, and verdant courtyard vegetation can soften contemporary spaces into contemplative sanctuaries.{' '}
                        </p>{' '}
                        {/* Metadata Strip with Fine Hairlines */}{' '}
                        <div className="editorial-meta-grid">
                          <div className="meta-item">
                            <span className="meta-label">
                              DISCIPLINE
                            </span>{' '}
                            <span className="meta-val">
                              Spatial &amp; Interior CGI
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              TIMELINE
                            </span>{' '}
                            <span className="meta-val">
                              2025
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              ROLE
                            </span>{' '}
                            <span className="meta-val">
                              Spatial Designer &amp; Lighting
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              MEDIUM
                            </span>{' '}
                            <span className="meta-val">
                              Blender Cycles &amp; Substance 3D
                            </span>
                          </div>
                        </div>
                      </div>{' '}
                      {/* Master Hero Perspective (Span 7) */}{' '}
                      <div className="opening-visual-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-hero">
                            <img src="Media/Biophilic environment/img.png" alt="Biophilic Interior master perspective with indoor pool and slatted divider" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 01 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Master perspective across the reflective indoor emerald pool, vertical cedar slat screen, and open-air garden terrace.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 02: OFFSET PHILOSOPHY SPREAD */}{' '}
                    <section className="editorial-spread spread-statement grid-12">
                      <div className="statement-label-col span-4">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            02
                          </span>{' '}
                          <span className="folio-title">
                            BIOPHILIC CONTEXT
                          </span>
                        </div>{' '}
                        <div className="editorial-hairline" />{' '}
                        <p className="statement-subtext">
                          Nature as an integral architectural dimension rather than decorative afterthought.
                        </p>
                      </div>{' '}
                      <div className="statement-quote-col span-8">
                        <blockquote className="editorial-large-quote">{' '}
                          “Biophilic design is not simply placing plants in a room; it is sculpting sunlight, water, and organic tactile grain into a continuous sensory sanctuary.”{' '}
                        </blockquote>
                      </div>
                    </section>{' '}
                    {/* SPREAD 03: ASYMMETRIC SCALE CONTRAST (Dominant Span 7 / Offset Span 5) */}{' '}
                    <section className="editorial-spread spread-asymmetric-duo grid-12">
                      {/* Left: Dominant Elevated Spatial Perspective (Span 7) */}{' '}
                      <div className="duo-dominant-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Biophilic environment/img (8).png" alt="Elevated architectural study of the lounge and garden veranda" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 02 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Elevated architectural study revealing the uninterrupted threshold between interior lounge seating and exterior gravel courtyard.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      {/* Right: Offset Suspended Swing Sofa (Span 5) */}{' '}
                      <div className="duo-offset-col span-5">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Biophilic environment/img (4).png" alt="Suspended timber daybed swing with botanical upholstery" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 03 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Suspended oak daybed upholstered in organic botanical motif textiles, catching dappled pergola sunlight.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 04: TACTILE ARCHITECTURAL VIGNETTES (Span 6 / Span 6) */}{' '}
                    <section className="editorial-spread spread-tactile-duo grid-12">
                      <div className="tactile-col span-6">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Biophilic environment/img (3).png" alt="Spindle armchair and teak tea table" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 04 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Intimate sitting nook featuring a spindle-back timber armchair, slatted teak tea table, and ceramic tea set.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="tactile-col span-6">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Biophilic environment/img (6).png" alt="Curved tambour oak credenza with ambient backlighting" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 05 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Custom low-profile oak credenza with curved corners, tambour sliding slats, and warm ambient backlighting.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 05: BOTANICAL STILL LIFE & MATERIAL STUDY (Span 7 / Span 5) */}{' '}
                    <section className="editorial-spread spread-asymmetric-duo grid-12">
                      <div className="duo-dominant-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-landscape">
                            <img src="Media/Biophilic environment/img (9).png" alt="Ceramic still life with meadow wildflowers and doughnut vase" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 06 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Ceramic still life studying porous earthenware clay, sculptural donut silhouette, and delicate meadow botanicals.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="duo-offset-col span-5" style={{ "display": "flex", "flexDirection": "column", "justifyContent": "center" }}>
                        <div className="folio-indicator">
                          <span className="folio-no">
                            05
                          </span>{' '}
                          <span className="folio-title">
                            MATERIAL HARMONY
                          </span>
                        </div>{' '}
                        <div className="editorial-hairline" />{' '}
                        <p className="statement-subtext" style={{ "fontSize": "15px", "lineHeight": "1.6", "color": "#444444" }}>{' '}
                          Natural unfinished white oak, textured terrazzo flooring, hand-turned porous ceramics, and water-tempered emerald glass coalesce into a calm tactile equilibrium, grounding the mind through material honesty.{' '}
                        </p>
                      </div>
                    </section>{' '}
                    {/* SPREAD 06: EDITORIAL COLOPHON & OUTRO */}{' '}
                    <footer className="editorial-colophon">
                      <div className="colophon-inner">
                        <div className="colophon-rule" />{' '}
                        <p className="colophon-quote">{' '}
                          “Where the boundaries between dwelling and landscape gently dissolve into stillness.”{' '}
                        </p>{' '}
                        <span className="colophon-folio">
                          VISUALS — HARSH PORTFOLIO © 2026
                        </span>
                      </div>
                    </footer>
                  </article>{' '}
                  {/* ========================================================================== */}{' '}
                  {/* POSTER COLLECTION CASE STUDY */}{' '}
                  {/* ========================================================================== */}{' '}
                  <article id="poster-case-study" className="editorial-case-study" style={{ "display": "none" }}>
                    {/* SPREAD 01: HERO / OPENING SPREAD (Cols 1-5 Text / Cols 6-12 Master Image) */}{' '}
                    <section className="editorial-spread spread-hero grid-12">
                      <div className="opening-text-col span-5">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            NO. 02
                          </span>{' '}
                          <span className="folio-cat">
                            GRAPHICS — EDITORIAL &amp; SPECULATIVE POSTER DESIGN
                          </span>
                        </div>{' '}
                        <h1 className="editorial-hero-title">
                          Poster Collection
                        </h1>{' '}
                        <div className="editorial-rule" />{' '}
                        <h2 className="editorial-hook">
                          A curated collection exploring speculative cinema, lucid dreamscapes, and whimsical character typography.
                        </h2>{' '}
                        <p className="editorial-lead">{' '}
                          A dual-themed poster exhibition examining two distinct graphic design explorations: the SOMNIUM speculative sci-fi series centered on neural dream-recording technology, alongside an expressive, playful series of character prints celebrating warmth, color, and witty typography.{' '}
                        </p>{' '}
                        {/* Metadata Strip with Fine Hairlines */}{' '}
                        <div className="editorial-meta-grid">
                          <div className="meta-item">
                            <span className="meta-label">
                              DISCIPLINE
                            </span>{' '}
                            <span className="meta-val">
                              Poster &amp; Art Direction
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              TIMELINE
                            </span>{' '}
                            <span className="meta-val">
                              2025 — 2026
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              ROLE
                            </span>{' '}
                            <span className="meta-val">
                              Graphic Designer &amp; Illustrator
                            </span>
                          </div>{' '}
                          <div className="meta-item">
                            <span className="meta-label">
                              MEDIUM
                            </span>{' '}
                            <span className="meta-val">
                              Digital Collage &amp; Vector Art
                            </span>
                          </div>
                        </div>
                      </div>{' '}
                      {/* Master Hero Poster (Span 7) */}{' '}
                      <div className="opening-visual-col span-7">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-poster">
                            <img src="Media/Posters/Poster_1Iteration_1.png" alt="SOMNIA speculative sci-fi poster" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 01 ]
                            </span>{' '}
                            <span className="caption-desc">
                              SOMNIA — Speculative sci-fi poster exploring cinematic neural recording, surreal scale, and monolithic topography.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 02: PHILOSOPHY STATEMENT SPREAD */}{' '}
                    <section className="editorial-spread spread-statement grid-12">
                      <div className="statement-label-col span-4">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            02
                          </span>{' '}
                          <span className="folio-title">
                            THE SOMNIUM TRIPTYCH
                          </span>
                        </div>{' '}
                        <div className="editorial-hairline" />{' '}
                        <p className="statement-subtext">
                          Narrative tension, neural interfaces, and the subconscious imagination.
                        </p>
                      </div>{' '}
                      <div className="statement-quote-col span-8">
                        <blockquote className="editorial-large-quote">{' '}
                          “Poster design is storytelling captured in a single frame. It orchestrates typographic tension, narrative ambiguity, and chromatic atmosphere to invite curiosity.”{' '}
                        </blockquote>
                      </div>
                    </section>{' '}
                    {/* SPREAD 03: THE SOMNIUM COMPANIONS (Span 6 / Span 6) */}{' '}
                    <section className="editorial-spread spread-poster-duo grid-12">
                      <div className="poster-col-6 span-6">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-poster">
                            <img src="Media/Posters/Harsh_590028088_4_5.png" alt="SOMNIUM Dreams cosmic illustration poster" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 02 ]
                            </span>{' '}
                            <span className="caption-desc">
                              SOMNIUM Dreams — Rich atmospheric digital painting capturing the transition between deep sleep and vivid cosmic imagination.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="poster-col-6 span-6">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-poster">
                            <img src="Media/Posters/Poster_4Somnium4.png" alt="SOMNIUM Dreamplay surrealist architectural reflection poster" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 03 ]
                            </span>{' '}
                            <span className="caption-desc">
                              SOMNIUM Dreamplay — Surrealist optical inversion fusing European urban architecture, floating pillows, and camera recording UI.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 04: THEMATIC INTERMISSION SPREAD */}{' '}
                    <section className="editorial-spread spread-statement grid-12">
                      <div className="statement-label-col span-4">
                        <div className="folio-indicator">
                          <span className="folio-no">
                            03
                          </span>{' '}
                          <span className="folio-title">
                            CHARACTER &amp; WIT
                          </span>
                        </div>{' '}
                        <div className="editorial-hairline" />{' '}
                        <p className="statement-subtext">
                          Playful typographic character prints designed to bring spontaneous charm.
                        </p>
                      </div>{' '}
                      <div className="statement-quote-col span-8">
                        <blockquote className="editorial-large-quote">{' '}
                          “Balancing conceptual gravitas with lighthearted graphic levity — exploring how simple silhouettes and expressive lettering evoke instant joy.”{' '}
                        </blockquote>
                      </div>
                    </section>{' '}
                    {/* SPREAD 05: CHARACTER TRIPTYCH (Span 4 / Span 4 / Span 4) */}{' '}
                    <section className="editorial-spread spread-poster-trio grid-12">
                      <div className="poster-col-4 span-4">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-poster">
                            <img src="Media/Posters/Poster_1_Harsh.png" alt="You Make My Heart Go Quack character poster" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 04 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Heart Go Quack — Graphic character illustration celebrating bold flat colors and cheerful lettering.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="poster-col-4 span-4">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-poster">
                            <img src="Media/Posters/Poster_2_Harsh.png" alt="Cat-itude is everything character poster" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 05 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Cat-itude Is Everything — Minimalist feline silhouette with heart tail on chocolate ground.
                            </span>
                          </figcaption>
                        </figure>
                      </div>{' '}
                      <div className="poster-col-4 span-4">
                        <figure className="editorial-figure">
                          <div className="editorial-img-wrap frame-poster">
                            <img src="Media/Posters/Poster_3_Harsh.png" alt="Too Cool to Fall character poster" className="editorial-img" />
                          </div>{' '}
                          <figcaption className="editorial-caption">
                            <span className="caption-idx">
                              [ 06 ]
                            </span>{' '}
                            <span className="caption-desc">
                              Too Cool to Fall — Tongue-in-cheek illustration featuring soft denim blue tones and rose accent.
                            </span>
                          </figcaption>
                        </figure>
                      </div>
                    </section>{' '}
                    {/* SPREAD 06: EDITORIAL COLOPHON & OUTRO */}{' '}
                    <footer className="editorial-colophon">
                      <div className="colophon-inner">
                        <div className="colophon-rule" />{' '}
                        <p className="colophon-quote">{' '}
                          “From speculative cosmic cinema to lighthearted character wit, every print explores the rhythm of typography and visual joy.”{' '}
                        </p>{' '}
                        <span className="colophon-folio">
                          GRAPHICS — HARSH PORTFOLIO © 2026
                        </span>
                      </div>
                    </footer>
                  </article>{' '}
                  {/* Fallback Standard Project View (For other projects) */}{' '}
                  <div id="standard-project-view" className="standard-project-view" style={{ "display": "none" }}>
                    <header className="editorial-header">
                      <span className="editorial-section-label" id="project-section-label">
                        Visuals
                      </span>{' '}
                      <h1 className="editorial-title" id="project-title">
                        Project Title
                      </h1>
                    </header>{' '}
                    <div className="editorial-content-grid">
                      <aside className="editorial-meta">
                        <div className="meta-group">
                          <span className="meta-label">
                            Discipline
                          </span>{' '}
                          <span className="meta-value" id="project-discipline">
                            —
                          </span>
                        </div>{' '}
                        <div className="meta-group">
                          <span className="meta-label">
                            Timeline
                          </span>{' '}
                          <span className="meta-value" id="project-timeline">
                            —
                          </span>
                        </div>{' '}
                        <div className="meta-group">
                          <span className="meta-label">
                            Role
                          </span>{' '}
                          <span className="meta-value" id="project-role">
                            —
                          </span>
                        </div>{' '}
                        <div className="meta-group">
                          <span className="meta-label">
                            Medium
                          </span>{' '}
                          <span className="meta-value" id="project-medium">
                            —
                          </span>
                        </div>
                      </aside>{' '}
                      <article className="editorial-body">
                        <p className="lead-paragraph" id="project-lead">
                          —
                        </p>{' '}
                        <div className="body-columns">
                          <p className="body-paragraph" id="project-p1">
                            —
                          </p>{' '}
                          <p className="body-paragraph" id="project-p2">
                            —
                          </p>
                        </div>
                      </article>
                    </div>
                  </div>
                </main>
              </div>
            </div>
  );
}
