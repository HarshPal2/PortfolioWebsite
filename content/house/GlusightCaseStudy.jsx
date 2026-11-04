// GluSight case study article shown in the Kitchen window (concept, not clinically validated).
export default function GlusightCaseStudy() {
  return (
    <article className="kitchen-article-canvas" id="kitchen-article-canvas" aria-label="GluSight Detailed Case Study">
      {/* ==========================================================================
                 SECTION 01 — THE HOOK
                 ========================================================================== */}{' '}
      <section className="kb-spread kb-section-hook kb-page-active" id="kb-sec-01" data-section-idx="0">
        <div className="kb-artboard-meta-strip">
          <span className="kb-meta-left">
            The Hook
          </span>{' '}
          <span className="kb-meta-right">
            Sections / 01
          </span>
        </div>{' '}
        <div className="kb-hero-split">
          <div className="kb-hero-text-col">
            <div className="kb-heading-group">
              <h1 className="kb-hero-heading">
                What if your glucose monitor could tell you what happens next?
              </h1>{' '}
              <div className="kb-orange-bar kb-bar-hero" />
            </div>{' '}
            <p className="kb-lead-text">{' '}
              Living with diabetes means more than keeping track of numbers. GluSight explores how predictive insights could help people better understand their glucose levels and prepare for what's ahead.{' '}
            </p>
          </div>{' '}
          <div className="kb-hero-visual-col">
            <div className="kb-hero-img-wrap">
              <img src="Media/GluSight/ref_01_hero_phone.jpg" alt="GluSight predictive glucose telemetry interface on mobile device" className="kb-hero-img" />
            </div>
          </div>
        </div>
      </section>{' '}
      {/* ==========================================================================
                 SECTION 02 — INTRODUCING GLUSIGHT
                 ========================================================================== */}{' '}
      <section className="kb-spread kb-section-intro" id="kb-sec-02" data-section-idx="1">
        <div className="kb-artboard-meta-strip">
          <span className="kb-meta-left">
            Concept Overview
          </span>{' '}
          <span className="kb-meta-right">
            Sections / 02
          </span>
        </div>{' '}
        <div className="kb-heading-group">
          <h2 className="kb-heading">
            Introducing GluSight
          </h2>{' '}
          <div className="kb-orange-bar kb-bar-glusight" />
        </div>{' '}
        <p className="kb-lead-text">{' '}
          GluSight is a concept exploring how predictive glucose insights could help people understand possible changes in their glucose levels and prepare for what's ahead.{' '}
        </p>{' '}
        {/* System Hero Visual */}{' '}
        <div className="kb-system-hero-wrap">
          <img src="Media/GluSight/glusight_hero_full.png" alt="Concept visualisation of the GluSight system: a sensor disc and the mobile interface" className="kb-system-hero-img" />{' '}
          <p className="kb-caption-sub">
            Concept visualisation of the GluSight system: a sensor disc and the mobile interface.
          </p>
        </div>{' '}
        {/* Two Conceptual Pillars */}{' '}
        <div className="kb-concept-pillars">
          <div className="kb-pillar-item">
            <h3 className="kb-sub-heading">
              The Idea
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
            <p className="kb-body-text">{' '}
              Instead of focusing only on the current reading, GluSight explores how a possible future glucose trend could help people anticipate changes and better understand their glucose information.{' '}
            </p>
          </div>{' '}
          <div className="kb-pillar-item">
            <h3 className="kb-sub-heading">
              Designed Around Anticipation
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
            <p className="kb-body-text">{' '}
              The concept explores how presenting current glucose information alongside a possible future trend could help users make sense of what they are seeing and consider what might happen next.{' '}
            </p>
          </div>
        </div>{' '}
        {/* Four Core Feature Areas */}{' '}
        <div className="kb-features-editorial">
          <div className="kb-feature-editorial-item">
            <div className="kb-feature-num">
              FEATURE 01
            </div>{' '}
            <h4 className="kb-feature-name">
              Current Glucose
            </h4>{' '}
            <p className="kb-body-text">{' '}
              Understand the present through a clear view of the current glucose reading and its trend.{' '}
            </p>{' '}
            <div className="kb-feature-asset-wrap">
              <img src="Media/GluSight/glusight_ui_reading_crop.png" alt="GluSight current glucose reading display" className="kb-feature-asset-img" />
            </div>
          </div>{' '}
          <div className="kb-feature-editorial-item">
            <div className="kb-feature-num">
              FEATURE 02
            </div>{' '}
            <h4 className="kb-feature-name">
              Predicted Glucose Trend
            </h4>{' '}
            <p className="kb-body-text">{' '}
              Explore how glucose levels might change over the coming period through a visual projection of a possible future trend.{' '}
            </p>{' '}
            <div className="kb-feature-asset-wrap">
              <img src="Media/GluSight/glusight_crop_prediction_graph.png" alt="Prediction graph from the GluSight Home screen: recorded glucose as a solid line and a predicted continuation as a dashed line" className="kb-feature-asset-img" />
            </div>
          </div>{' '}
          <div className="kb-feature-editorial-item">
            <div className="kb-feature-num">
              FEATURE 03
            </div>{' '}
            <h4 className="kb-feature-name">
              Communicating Uncertainty
            </h4>{' '}
            <p className="kb-body-text">{' '}
              Distinguish observed readings from estimated future values, helping users recognise that predictions are not guarantees.{' '}
            </p>{' '}
            <div className="kb-feature-asset-wrap">
              <img src="Media/GluSight/glusight_crop_confidence_note.png" alt="Confidence indicator and a note saying the prediction is based on past patterns, from the GluSight Home screen" className="kb-feature-asset-img" />
            </div>
          </div>{' '}
          <div className="kb-feature-editorial-item">
            <div className="kb-feature-num">
              FEATURE 04
            </div>{' '}
            <h4 className="kb-feature-name">
              Contextual Information
            </h4>{' '}
            <p className="kb-body-text">{' '}
              Explore how relevant factors, such as meals, physical activity, medication, stress, and sleep, could help users make sense of changing glucose patterns.{' '}
            </p>{' '}
            <div className="kb-feature-asset-wrap">
              <img src="Media/GluSight/glusight_screen_log_meal.png" alt="GluSight Log Meal screen with quick meal categories and a free-text description" className="kb-feature-asset-img" />
            </div>
          </div>
        </div>
      </section>{' '}
      {/* ==========================================================================
                 SECTION 03 — EXPLORING THE IDEA
                 ========================================================================== */}{' '}
      <section className="kb-spread kb-section-exploring" id="kb-sec-03" data-section-idx="2">
        <div className="kb-artboard-meta-strip">
          <span className="kb-meta-left">
            A Closer Look
          </span>{' '}
          <span className="kb-meta-right">
            Sections / 03
          </span>
        </div>{' '}
        <div className="kb-heading-group">
          <h2 className="kb-heading">
            A Closer Look at GluSight
          </h2>{' '}
          <div className="kb-orange-bar kb-bar-idea" />
        </div>{' '}
        <p className="kb-lead-text">{' '}
          GluSight’s interface is built around three screens: Home, Log Meal and Settings. This section explains what each one is intended to do and the design thinking behind it. They are concept screens showing sample data, and they have not been tested with users.{' '}
        </p>{' '}
        {/* Early sketches */}{' '}
        <div className="kb-sub-block kb-sketch-block">
          <div className="kb-sub-header-group">
            <span className="kb-sub-tag">
              EARLY SKETCHES
            </span>{' '}
            <h3 className="kb-sub-heading">
              Where the Screens Started
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />
          </div>{' '}
          <p className="kb-body-text">{' '}
            Before the concept screens, I drew three rough pencil sketches. They are shown here as drawn, in the order I drew them, and are lightly cropped and brightened only so they can be read.{' '}
          </p>{' '}
          <div className="kb-sketch-row">
            <figure className="kb-sketch-fig">
              <img src="Media/GluSight/glusight_sketch_1_first_idea.jpg" alt="Pencil sketch of a phone screen with a large glucose reading and rising arrow, a note on how far above normal it is, a log meal button, two suggested actions and a graph" className="kb-sketch-img" loading="lazy" />{' '}
              <figcaption className="kb-caption-sub">
                <strong>
                  Sketch 1.
                </strong>{' '}
                The reading with a direction arrow, how far it sits above normal, a Log Meal button, two suggested actions (drink water, go for a walk) and a graph.
              </figcaption>
            </figure>{' '}
            <figure className="kb-sketch-fig">
              <img src="Media/GluSight/glusight_sketch_2_night_alert.jpg" alt="Pencil sketch of a phone screen showing a low glucose alert at night with a short message and the alarm set to vibrate" className="kb-sketch-img" loading="lazy" />{' '}
              <figcaption className="kb-caption-sub">
                <strong>
                  Sketch 2.
                </strong>{' '}
                A low-glucose alert at night, with a short plain message and the alarm set to vibrate.
              </figcaption>
            </figure>{' '}
            <figure className="kb-sketch-fig">
              <img src="Media/GluSight/glusight_sketch_3_latest.jpg" alt="Pencil sketch of a phone screen with a glucose reading and direction arrow, an expected range ahead, and a graph that continues forward" className="kb-sketch-img" loading="lazy" />{' '}
              <figcaption className="kb-caption-sub">
                <strong>
                  Sketch 3.
                </strong>{' '}
                The reading with its direction, an expected range ahead and a graph that continues forward.
              </figcaption>
            </figure>
          </div>
        </div>{' '}
        {/* The three concept screens */}{' '}
        <div className="kb-process-progression">
          <div className="kb-process-row">
            <div className="kb-process-text-col">
              <span className="kb-process-step-num">
                01
              </span>{' '}
              <h3 className="kb-sub-heading">
                Home: The Present and a Possible Future
              </h3>{' '}
              <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
              <p className="kb-body-text">{' '}
                The Home screen puts the current glucose reading at the centre, with its time and a trend label, and places a graph beneath it. Recorded glucose is drawn as a solid line and a predicted continuation as a dashed line, with the target range shaded so values can be read against it.{' '}
              </p>{' '}
              <p className="kb-body-text">
                <strong>
                  Design decision:
                </strong>{' '}
                Two different line styles keep what has been measured visibly separate from what is estimated. A short note and a confidence indicator beneath the graph frame the prediction as an estimate based on past patterns, not a certainty.{' '}
              </p>
            </div>{' '}
            <div className="kb-process-visual-col">
              <div className="kb-process-asset-wrap">
                <img src="Media/GluSight/glusight_screen_home.png" alt="GluSight Home screen with the current glucose reading, a trend label, a prediction graph and a confidence indicator" className="kb-process-asset-img" />{' '}
                <p className="kb-caption-sub">
                  Home: current reading, trend, and a prediction graph with a confidence indicator.
                </p>
              </div>
            </div>
          </div>{' '}
          <div className="kb-process-row kb-row-reverse">
            <div className="kb-process-text-col">
              <span className="kb-process-step-num">
                02
              </span>{' '}
              <h3 className="kb-sub-heading">
                Log Meal: Adding Context
              </h3>{' '}
              <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
              <p className="kb-body-text">{' '}
                The Log Meal screen lets someone record what they ate by choosing a quick category (Sugary, Heavy Meal or Light Meal) or describing the meal in their own words. The time of logging is shown and can be changed.{' '}
              </p>{' '}
              <p className="kb-body-text">
                <strong>
                  Design decision:
                </strong>{' '}
                The concept explores how meal context could sit alongside glucose readings, so a change might be understood in relation to what happened rather than as a number on its own. Quick categories are intended to keep logging fast.{' '}
              </p>
            </div>{' '}
            <div className="kb-process-visual-col">
              <div className="kb-process-asset-wrap">
                <img src="Media/GluSight/glusight_screen_log_meal.png" alt="GluSight Log Meal screen with quick meal categories, a description field and a Log Meal button" className="kb-process-asset-img" />{' '}
                <p className="kb-caption-sub">
                  Log Meal: quick categories and a free-text description.
                </p>
              </div>
            </div>
          </div>{' '}
          <div className="kb-process-row">
            <div className="kb-process-text-col">
              <span className="kb-process-step-num">
                03
              </span>{' '}
              <h3 className="kb-sub-heading">
                Settings: Personalisation and Control
              </h3>{' '}
              <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
              <p className="kb-body-text">{' '}
                Settings groups three things: health setup details (diabetes type, target range, weight and age) that are intended to personalise predictions; alert controls for predicted high and low alerts, silent mode and alert sensitivity; and preferences such as how often to be asked about food.{' '}
              </p>{' '}
              <p className="kb-body-text">
                <strong>
                  Design decision:
                </strong>{' '}
                The concept treats prediction alerts as optional and adjustable, so people can decide how and when predictions reach them.{' '}
              </p>
            </div>{' '}
            <div className="kb-process-visual-col">
              <div className="kb-process-asset-wrap">
                <img src="Media/GluSight/glusight_screen_settings.png" alt="GluSight Settings screen with health setup, alerts and preferences" className="kb-process-asset-img" />{' '}
                <p className="kb-caption-sub">
                  Settings: health setup, alert controls and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>{' '}
      {/* ==========================================================================
                 SECTION 04 — RESEARCH & INSIGHTS
                 ========================================================================== */}{' '}
      <section className="kb-spread kb-section-research" id="kb-sec-04" data-section-idx="3">
        <div className="kb-artboard-meta-strip">
          <span className="kb-meta-left">
            Research &amp; Insights
          </span>{' '}
          <span className="kb-meta-right">
            Sections / 04
          </span>
        </div>{' '}
        <div className="kb-heading-group">
          <h2 className="kb-heading">
            Research &amp; Insights
          </h2>{' '}
          <div className="kb-orange-bar kb-bar-research" />
        </div>{' '}
        <p className="kb-lead-text">{' '}
          Three short interviews and some published research, kept separate from my own interpretations. The sample is small and the concept is untested.{' '}
        </p>{' '}
        {/* Primary research: three interviews */}{' '}
        <div className="kb-sub-block kb-interview-block">
          <div className="kb-sub-header-group">
            <span className="kb-sub-tag">
              PRIMARY RESEARCH • THREE INTERVIEWS
            </span>{' '}
            <h3 className="kb-sub-heading">
              Type 1, Type 2 and Prediabetes
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />
          </div>{' '}
          <p className="kb-body-text">{' '}
            Three consenting, anonymised interviews: type 1, type 2 and prediabetic. The type 2 participant spoke Hindi, so those quotes are my translation. A very small sample that shaped my thinking but does not validate the concept.{' '}
          </p>{' '}
          <div className="kb-int-list">
            <div className="kb-int-row">
              <span className="kb-int-num">
                01
              </span>
              <div className="kb-int-main">
                <h4 className="kb-int-title">
                  Highs cause stress, and worrying seems to make it worse
                </h4>
                <div className="kb-int-quotes">
                  <blockquote className="kb-int-quote">
                    <p>
                      “Stress is the only thing that goes through my mind.”
                    </p>
                  </blockquote>
                  <blockquote className="kb-int-quote">
                    <p>
                      “When I thought about it too much, my sugar would go up. It’s all a game of the mind.”
                    </p>
                    <cite>
                      Translated from Hindi
                    </cite>
                  </blockquote>
                  <blockquote className="kb-int-quote">
                    <p>
                      “Now I’m not conscious about it, but earlier, I used to be.”
                    </p>
                  </blockquote>
                </div>
                <p className="kb-int-note">
                  <span className="kb-int-label">
                    Takeaway
                  </span>
                  This pointed toward keeping the main screen calm and avoiding wording that adds to worry.
                </p>
              </div>
            </div>
            <div className="kb-int-row">
              <span className="kb-int-num">
                02
              </span>
              <div className="kb-int-main">
                <h4 className="kb-int-title">
                  Lows cause panic, especially outdoors
                </h4>
                <div className="kb-int-quotes">
                  <blockquote className="kb-int-quote">
                    <p>
                      “It can cause a moment of panic, especially when I’m outdoors.”
                    </p>
                  </blockquote>
                </div>
                <p className="kb-int-context">
                  Another participant also described dizziness from lows and keeping a toffee at hand.
                </p>
                <p className="kb-int-note">
                  <span className="kb-int-label">
                    Takeaway
                  </span>
                  This pointed toward a low alert that is short, plain and quick to act on.
                </p>
              </div>
            </div>
            <div className="kb-int-row">
              <span className="kb-int-num">
                03
              </span>
              <div className="kb-int-main">
                <h4 className="kb-int-title">
                  Night checking varies
                </h4>
                <div className="kb-int-quotes">
                  <blockquote className="kb-int-quote">
                    <p>
                      “Every night, I have to make sure it’s normal.”
                    </p>
                  </blockquote>
                </div>
                <p className="kb-int-context">
                  Another participant said she has never done this.
                </p>
                <p className="kb-int-note">
                  <span className="kb-int-label">
                    Takeaway
                  </span>
                  Habits differed a lot, so night behaviour could not be assumed to be the same for everyone.
                </p>
              </div>
            </div>
            <div className="kb-int-row">
              <span className="kb-int-num">
                04
              </span>
              <div className="kb-int-main">
                <h4 className="kb-int-title">
                  Re-checking to see the direction
                </h4>
                <div className="kb-int-quotes">
                  <blockquote className="kb-int-quote">
                    <p>
                      “I had to keep checking the monitor to see if it’s getting worse or if it’s getting better.”
                    </p>
                  </blockquote>
                  <blockquote className="kb-int-quote">
                    <p>
                      “I have to make sure that whatever I’m going to have next is not going to make my levels worse.”
                    </p>
                  </blockquote>
                </div>
                <p className="kb-int-note">
                  <span className="kb-int-label">
                    Takeaway
                  </span>
                  This pointed toward showing direction of change alongside the number.
                </p>
              </div>
            </div>
            <div className="kb-int-row">
              <span className="kb-int-num">
                05
              </span>
              <div className="kb-int-main">
                <h4 className="kb-int-title">
                  Distrust of accuracy
                </h4>
                <div className="kb-int-quotes">
                  <blockquote className="kb-int-quote">
                    <p>
                      “No machine is accurate. The lab test is the best.”
                    </p>
                    <cite>
                      Translated from Hindi
                    </cite>
                  </blockquote>
                </div>
                <p className="kb-int-context">
                  One participant compared a home reading of 150 with a lab result of 120.
                </p>
                <p className="kb-int-note">
                  <span className="kb-int-label">
                    Takeaway
                  </span>
                  This pointed toward being honest that readings are estimates.
                </p>
              </div>
            </div>
          </div>
        </div>{' '}
        {/* 04A: Secondary Research */}{' '}
        <div className="kb-sub-block kb-secondary-research-block">
          <div className="kb-sub-header-group">
            <span className="kb-sub-tag">
              04A • SECONDARY RESEARCH
            </span>{' '}
            <h3 className="kb-sub-heading">
              Learning From Existing Research
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />
          </div>{' '}
          <p className="kb-body-text">{' '}
            Published research on glucose monitoring and variability gave context. None of it evaluates GluSight.{' '}
          </p>{' '}
          {/* Lifestyle & Contextual Factors Integrated Visual */}{' '}
          <div className="kb-banner-full-wrap">
            <img src="Media/GluSight/ref_04_banner_integrated.png" alt="Lifestyle factors and glucose variability diagram" className="kb-banner-full-img" />{' '}
            <p className="kb-caption-sub">
              Illustration of lifestyle factors that can influence glucose: meals, physical activity, medication and sleep.
            </p>
          </div>{' '}
          {/* Verified Papers Editorial List (Newspaper clippings matching Reference/NewspaperClippings.jpg) */}{' '}
          <div className="kb-papers-list">
            <article className="kb-paper-item">
              <div className="kb-paper-header">
                <span className="kb-paper-journal">
                  Diabetologia • 2024
                </span>{' '}
                <span className="kb-paper-tag">
                  CLINICAL
                </span>
              </div>{' '}
              <h4 className="kb-paper-title">
                “Continuous glucose monitoring in adults with type 2 diabetes: A systematic review and meta-analysis.”
              </h4>
            </article>{' '}
            <article className="kb-paper-item">
              <div className="kb-paper-header">
                <span className="kb-paper-journal">
                  Published 2023
                </span>{' '}
                <span className="kb-paper-tag">
                  PATIENT-REPORTED
                </span>
              </div>{' '}
              <h4 className="kb-paper-title">
                “Patient-Reported Usefulness and Challenges in Using Hypoglycemia-Informing Features of Continuous Glucose Monitors to Manage Hypoglycemia.”
              </h4>
            </article>{' '}
            <article className="kb-paper-item">
              <div className="kb-paper-header">
                <span className="kb-paper-journal">
                  Sports Medicine &amp; Health Science • 2021
                </span>{' '}
                <span className="kb-paper-tag">
                  PHYSIOLOGY
                </span>
              </div>{' '}
              <h4 className="kb-paper-title">
                “Glycemic variability: Importance, relationship with physical activity, and the influence of exercise.”
              </h4>
            </article>
          </div>
        </div>{' '}
        {/* 04B: Working assumptions (interpretations, not findings) */}{' '}
        <div className="kb-sub-block kb-insights-block">
          <div className="kb-sub-header-group">
            <span className="kb-sub-tag">
              04B • WORKING ASSUMPTIONS
            </span>{' '}
            <h3 className="kb-sub-heading">
              What Shaped the Concept
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />
          </div>{' '}
          <p className="kb-body-text">{' '}
            My interpretations, not findings. They still need testing with more people.{' '}
          </p>{' '}
          {/* The Three Connected Themes (Integrated Layout matching Project DetailedLayout-08.png) */}{' '}
          <div className="kb-themes-integrated-container">
            <img src="Media/GluSight/themes_3_complete_flow.png" alt="Illustration of three connected ideas: understanding the numbers, uncertainty about what's next, and turning information into action" className="kb-themes-canvas-art" />{' '}
            {/* Insight 01: Different Responses, Shared Uncertainty */}{' '}
            <div className="kb-theme-callout kb-theme-1-callout">
              <span className="kb-insight-tag">
                ASSUMPTION 01
              </span>{' '}
              <h4 className="kb-insight-title">
                People May Respond Differently
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Everyone lives with glucose differently.{' '}
              </p>
            </div>{' '}
            {/* Insight 02: Understanding What Comes Next */}{' '}
            <div className="kb-theme-callout kb-theme-2-callout">
              <span className="kb-insight-tag">
                ASSUMPTION 02
              </span>{' '}
              <h4 className="kb-insight-title">
                The Current Reading May Not Be Enough
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Knowing the number does not say where it is heading.{' '}
              </p>
            </div>{' '}
            {/* Insight 03: Information Needs Interpretation */}{' '}
            <div className="kb-theme-callout kb-theme-3-callout">
              <span className="kb-insight-tag">
                ASSUMPTION 03
              </span>{' '}
              <h4 className="kb-insight-title">
                Information May Need Interpretation
              </h4>{' '}
              <p className="kb-body-text">{' '}
                A number helps most when it comes with meaning.{' '}
              </p>
            </div>
          </div>
        </div>{' '}
        {/* 04D: Connecting the Research to GluSight */}{' '}
        <div className="kb-bridge-block">
          <div className="kb-bridge-content">
            <span className="kb-sub-tag">
              04C • OPPORTUNITY BRIDGE
            </span>{' '}
            <h3 className="kb-sub-heading">
              From Insight to Opportunity
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
            <p className="kb-lead-text kb-bridge-lead">{' '}
              The opportunity: showing where glucose may be heading, without presenting an estimate as a certainty.{' '}
            </p>
          </div>
        </div>
      </section>{' '}
      {/* ==========================================================================
                 SECTION 05 — FUTURE PLANS & REFLECTION
                 ========================================================================== */}{' '}
      <section className="kb-spread kb-section-future" id="kb-sec-05" data-section-idx="4">
        <div className="kb-artboard-meta-strip">
          <span className="kb-meta-left">
            Future Direction
          </span>{' '}
          <span className="kb-meta-right">
            Sections / 05
          </span>
        </div>{' '}
        <div className="kb-heading-group">
          <h2 className="kb-heading">
            Looking Beyond Monitoring
          </h2>{' '}
          <div className="kb-orange-bar kb-bar-future" />
        </div>{' '}
        <p className="kb-lead-text">{' '}
          GluSight explores how predictive glucose insights could extend the monitoring experience beyond current readings. Further work would focus on understanding how people interpret predicted trends, respond to uncertainty, and use these insights in everyday life.{' '}
        </p>{' '}
        {/* What Comes Next */}{' '}
        <div className="kb-sub-block">
          <h3 className="kb-sub-heading">
            What Comes Next?
          </h3>{' '}
          <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
          <p className="kb-body-text">{' '}
            The next stage would be to explore how people understand possible future glucose trends, how uncertainty should be communicated, and whether these insights could support meaningful decisions in everyday life.{' '}
          </p>{' '}
          {/* Five Future Plans Grid */}{' '}
          <div className="kb-plans-grid">
            <div className="kb-plan-card">
              <span className="kb-plan-num">
                01
              </span>{' '}
              <h4 className="kb-plan-title">
                Testing the Understanding of Predictions
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Explore whether users can distinguish current glucose readings from estimated future values and correctly interpret what a predicted trend represents.{' '}
              </p>
            </div>{' '}
            <div className="kb-plan-card">
              <span className="kb-plan-num">
                02
              </span>{' '}
              <h4 className="kb-plan-title">
                Communicating Uncertainty
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Investigate how prediction ranges, visual distinctions, and supporting explanations could communicate uncertainty without making future glucose changes appear guaranteed.{' '}
              </p>
            </div>{' '}
            <div className="kb-plan-card">
              <span className="kb-plan-num">
                03
              </span>{' '}
              <h4 className="kb-plan-title">
                Understanding Context
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Explore how contextual information, such as meals, physical activity, medication, stress, and sleep, could help users interpret glucose trends without overwhelming them with information.{' '}
              </p>
            </div>{' '}
            <div className="kb-plan-card">
              <span className="kb-plan-num">
                04
              </span>{' '}
              <h4 className="kb-plan-title">
                Evaluating the Experience
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Conduct usability research to understand how people navigate the concept, interpret its visualisations, and decide what information they need to make sense of their glucose data.{' '}
              </p>
            </div>{' '}
            <div className="kb-plan-card">
              <span className="kb-plan-num">
                05
              </span>{' '}
              <h4 className="kb-plan-title">
                Recognising the Limitations
              </h4>{' '}
              <p className="kb-body-text">{' '}
                Investigate how the concept should communicate the limitations of predictions and avoid encouraging users to treat estimates as guaranteed outcomes or substitutes for appropriate medical guidance.{' '}
              </p>
            </div>
          </div>
        </div>{' '}
        {/* Final Reflection & Hardware Visual */}{' '}
        <div className="kb-reflection-split">
          <div className="kb-reflection-text-col">
            <h3 className="kb-sub-heading">
              Final Reflection
            </h3>{' '}
            <div className="kb-orange-bar kb-bar-accent-sm" />{' '}
            <p className="kb-body-text">{' '}
              GluSight began with a question about what glucose monitoring could offer beyond the present reading. The concept explores how communicating possible future trends might help people make sense of their glucose information. The next step is to understand whether people can interpret these predictions clearly, trust them appropriately, and find them useful in everyday life.{' '}
            </p>
          </div>{' '}
          <div className="kb-reflection-visual-col">
            <div className="kb-reflection-asset-wrap">
              <img src="Media/GluSight/glusight_sensor_disc_closeup.png" alt="GluSight companion sensor device hardware puck" className="kb-reflection-hardware-img" />{' '}
              <p className="kb-caption-sub">
                Hardware companion concept: discreet, calm wearable telemetry.
              </p>
            </div>
          </div>
        </div>{' '}
        {/* Editorial Colophon Outro */}{' '}
        <footer className="kb-editorial-colophon">
          <div className="kb-colophon-rule" />{' '}
          <p className="kb-colophon-quote">{' '}
            “Transforming uncertain bio-signals into actionable everyday clarity.”{' '}
          </p>{' '}
          <span className="kb-colophon-folio">
            GLUSIGHT CONCEPT CASE STUDY — HARSH PORTFOLIO © 2026
          </span>
        </footer>
      </section>
    </article>
  );
}
