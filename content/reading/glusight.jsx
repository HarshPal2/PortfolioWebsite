// Reading version: glusight (converted from reading/glusight/index.html)
export default function GlusightReading() {
  return (
    <>

      <a className="skip" href="#main">
        Skip to content
      </a>{' '}
      <header>
        <div className="wrap">
          <div className="bar">
            <a className="brand" href="../../reading/">
              Harsh
            </a>{' '}
            <nav aria-label="Sections">
              <a href="../#about">
                About
              </a>{' '}
              <a href="../#projects">
                Projects
              </a>{' '}
              <a href="../#case-study">
                Case study
              </a>{' '}
              <a href="../#contact">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>{' '}
      <div className="wrap">
        <main id="main">
          <p className="crumbs">
            <a href="../#projects">
              ← All projects
            </a>{' '}
            ·{' '}
            <span style={{ "textTransform": "uppercase", "letterSpacing": ".06em", "fontSize": "16px" }}>
              CASE STUDY — MEDICAL UX/UI
            </span>
          </p>{' '}
          <h1>
            GluSight
          </h1>{' '}
          <p className="lede">
            What if your glucose monitor could tell you what happens next?
          </p>{' '}
          <dl className="meta-grid">
            <div>
              <dt>
                Discipline
              </dt>
              <dd>
                Medical UX/UI
              </dd>
            </div>
            <div>
              <dt>
                Timeline
              </dt>
              <dd>
                2026
              </dd>
            </div>
            <div>
              <dt>
                Role
              </dt>
              <dd>
                Research &amp; User Interface
              </dd>
            </div>
            <div>
              <dt>
                Medium
              </dt>
              <dd>
                Design System &amp; Predictive UI
              </dd>
            </div>
          </dl>{' '}
          <figure>
            <img src="../img/glusight-ref-01-hero-phone.webp" width="1179" height="737" alt="GluSight predictive glucose interface on a mobile device" loading="lazy" decoding="async" />
            <figcaption>
              The GluSight concept: the current reading with a prediction graph.
            </figcaption>
          </figure>{' '}
          <p className="fine">
            GluSight is an independent design concept. It has not been clinically validated or tested with users.
          </p>{' '}
          <nav className="toc" aria-label="Case study sections">
            <a href="#hook">
              01 The Hook
            </a>
            <a href="#intro">
              02 Introducing GluSight
            </a>
            <a href="#screens">
              03 A Closer Look
            </a>
            <a href="#research">
              04 Research &amp; Insights
            </a>
            <a href="#future">
              05 Future Plans &amp; Reflection
            </a>
          </nav>{' '}
          <section id="hook">
            <h2>
              The Hook
            </h2>{' '}
            <p className="lede">
              Living with diabetes means more than keeping track of numbers.
            </p>{' '}
            <p>
              GluSight explores how predictive insights could help people better understand their glucose levels and prepare for what’s ahead.
            </p>
          </section>{' '}
          <section id="intro">
            <h2>
              Introducing GluSight
            </h2>{' '}
            <p>
              GluSight is a concept exploring how predictive glucose insights could help people understand possible changes in their glucose levels and prepare for what’s ahead.
            </p>{' '}
            <h3 className="sub">
              The Idea
            </h3>{' '}
            <p>
              Instead of focusing only on the current reading, GluSight explores how a possible future glucose trend could help people anticipate changes and better understand their glucose information.
            </p>{' '}
            <h3 className="sub">
              Designed Around Anticipation
            </h3>{' '}
            <p>
              The concept explores how presenting current glucose information alongside a possible future trend could help users make sense of what they are seeing and consider what might happen next.
            </p>{' '}
            <div className="pillar">
              <span className="k">
                FEATURE 01
              </span>
              <h3>
                Current Glucose
              </h3>
              <p>
                Understand the present through a clear view of the current glucose reading and its trend.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                FEATURE 02
              </span>
              <h3>
                Predicted Glucose Trend
              </h3>
              <p>
                Explore how glucose levels might change over the coming period through a visual projection of a possible future trend.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                FEATURE 03
              </span>
              <h3>
                Communicating Uncertainty
              </h3>
              <p>
                Distinguish observed readings from estimated future values, helping users recognise that predictions are not guarantees.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                FEATURE 04
              </span>
              <h3>
                Contextual Information
              </h3>
              <p>
                Explore how relevant factors, such as meals, physical activity, medication, stress, and sleep, could help users make sense of changing glucose patterns.
              </p>
            </div>
          </section>{' '}
          <section id="screens">
            <h2>
              A Closer Look at GluSight
            </h2>{' '}
            <p>
              The interface is built around three screens: Home, Log Meal and Settings. This section explains what each one is intended to do and the design thinking behind it. They are concept screens showing sample data, and they have not been tested with users.
            </p>{' '}
            <h3 className="sub">
              Where the Screens Started
            </h3>{' '}
            <p>
              Before the concept screens, I drew three rough pencil sketches. They are shown here as drawn, in the order I drew them, and are lightly cropped and brightened only so they can be read.
            </p>{' '}
            <div className="sketches">
              <figure>
                <img src="../img/glusight-sketch-1.webp" width="625" height="1100" alt="Pencil sketch of a phone screen with a large glucose reading and rising arrow, a note on how far above normal it is, a Log Meal button, two suggested actions and a graph" loading="lazy" decoding="async" />
                <figcaption>
                  <strong>
                    Sketch 1.
                  </strong>{' '}
                  The reading with a direction arrow, how far it sits above normal, a Log Meal button, two suggested actions (drink water, go for a walk) and a graph.
                </figcaption>
              </figure>{' '}
              <figure>
                <img src="../img/glusight-sketch-2.webp" width="613" height="1100" alt="Pencil sketch of a phone screen showing a low glucose alert at night with a short message and the alarm set to vibrate" loading="lazy" decoding="async" />
                <figcaption>
                  <strong>
                    Sketch 2.
                  </strong>{' '}
                  A low-glucose alert at night, with a short plain message and the alarm set to vibrate.
                </figcaption>
              </figure>{' '}
              <figure>
                <img src="../img/glusight-sketch-3.webp" width="671" height="1100" alt="Pencil sketch of a phone screen with a glucose reading and direction arrow, an expected range ahead, and a graph that continues forward" loading="lazy" decoding="async" />
                <figcaption>
                  <strong>
                    Sketch 3.
                  </strong>{' '}
                  The reading with its direction, an expected range ahead and a graph that continues forward.
                </figcaption>
              </figure>
            </div>{' '}
            <div className="screen">
              <span className="k">
                01
              </span>
              <h3 className="sub">
                Home: The Present and a Possible Future
              </h3>{' '}
              <p>
                The Home screen puts the current glucose reading at the centre, with its time and a trend label, and places a graph beneath it. Recorded glucose is drawn as a solid line and a predicted continuation as a dashed line, with the target range shaded so values can be read against it.
              </p>{' '}
              <p>
                <strong>
                  Design decision:
                </strong>{' '}
                Two different line styles keep what has been measured visibly separate from what is estimated. A short note and a confidence indicator beneath the graph frame the prediction as an estimate based on past patterns, not a certainty.
              </p>{' '}
              <figure className="phone">
                <img src="../img/glusight-screen-home.webp" width="430" height="932" alt="GluSight Home screen with the current glucose reading, a trend label, a prediction graph and a confidence indicator" loading="lazy" decoding="async" />
                <figcaption>
                  Home: current reading, trend, and a prediction graph with a confidence indicator.
                </figcaption>
              </figure>
            </div>{' '}
            <div className="screen">
              <span className="k">
                02
              </span>
              <h3 className="sub">
                Log Meal: Adding Context
              </h3>{' '}
              <p>
                The Log Meal screen lets someone record what they ate by choosing a quick category (Sugary, Heavy Meal or Light Meal) or describing the meal in their own words. The time of logging is shown and can be changed.
              </p>{' '}
              <p>
                <strong>
                  Design decision:
                </strong>{' '}
                The concept explores how meal context could sit alongside glucose readings, so a change might be understood in relation to what happened rather than as a number on its own. Quick categories are intended to keep logging fast.
              </p>{' '}
              <figure className="phone">
                <img src="../img/glusight-screen-log-meal.webp" width="430" height="932" alt="GluSight Log Meal screen with quick categories and a free-text description" loading="lazy" decoding="async" />
                <figcaption>
                  Log Meal: quick categories and a free-text description.
                </figcaption>
              </figure>
            </div>{' '}
            <div className="screen">
              <span className="k">
                03
              </span>
              <h3 className="sub">
                Settings: Personalisation and Control
              </h3>{' '}
              <p>
                Settings groups three things: health setup details (diabetes type, target range, weight and age) that are intended to personalise predictions; alert controls for predicted high and low alerts, silent mode and alert sensitivity; and preferences such as how often to be asked about food.
              </p>{' '}
              <p>
                <strong>
                  Design decision:
                </strong>{' '}
                The concept treats prediction alerts as optional and adjustable, so people can decide how and when predictions reach them.
              </p>{' '}
              <figure className="phone">
                <img src="../img/glusight-screen-settings.webp" width="430" height="932" alt="GluSight Settings screen with health setup, alert controls and preferences" loading="lazy" decoding="async" />
                <figcaption>
                  Settings: health setup, alert controls and preferences.
                </figcaption>
              </figure>
            </div>
          </section>{' '}
          <section id="research">
            <h2>
              Research &amp; Insights
            </h2>{' '}
            <p>
              Three short interviews and some published research, kept separate from my own interpretations. The sample is small and the concept is untested.
            </p>{' '}
            <h3 className="sub">
              Type 1, Type 2 and Prediabetes
            </h3>{' '}
            <p>
              Three consenting, anonymised interviews: type 1, type 2 and prediabetic. The type 2 participant spoke Hindi, so those quotes are my translation. A very small sample that shaped my thinking but does not validate the concept.
            </p>{' '}
            <div className="finding">
              <span className="k">
                01
              </span>
              <h3>
                Highs cause stress, and worrying seems to make it worse
              </h3>
              <blockquote className="q">
                “Stress is the only thing that goes through my mind.”
              </blockquote>
              <blockquote className="q">
                “When I thought about it too much, my sugar would go up. It’s all a game of the mind.”
                <span className="qn">
                  Translated from Hindi
                </span>
              </blockquote>
              <blockquote className="q">
                “Now I’m not conscious about it, but earlier, I used to be.”
              </blockquote>
              <p className="take">
                <span className="tl">
                  Takeaway
                </span>
                This pointed toward keeping the main screen calm and avoiding wording that adds to worry.
              </p>
            </div>{' '}
            <div className="finding">
              <span className="k">
                02
              </span>
              <h3>
                Lows cause panic, especially outdoors
              </h3>
              <blockquote className="q">
                “It can cause a moment of panic, especially when I’m outdoors.”
              </blockquote>
              <p className="ctx">
                Another participant also described dizziness from lows and keeping a toffee at hand.
              </p>
              <p className="take">
                <span className="tl">
                  Takeaway
                </span>
                This pointed toward a low alert that is short, plain and quick to act on.
              </p>
            </div>{' '}
            <div className="finding">
              <span className="k">
                03
              </span>
              <h3>
                Night checking varies
              </h3>
              <blockquote className="q">
                “Every night, I have to make sure it’s normal.”
              </blockquote>
              <p className="ctx">
                Another participant said she has never done this.
              </p>
              <p className="take">
                <span className="tl">
                  Takeaway
                </span>
                Habits differed a lot, so night behaviour could not be assumed to be the same for everyone.
              </p>
            </div>{' '}
            <div className="finding">
              <span className="k">
                04
              </span>
              <h3>
                Re-checking to see the direction
              </h3>
              <blockquote className="q">
                “I had to keep checking the monitor to see if it’s getting worse or if it’s getting better.”
              </blockquote>
              <blockquote className="q">
                “I have to make sure that whatever I’m going to have next is not going to make my levels worse.”
              </blockquote>
              <p className="take">
                <span className="tl">
                  Takeaway
                </span>
                This pointed toward showing direction of change alongside the number.
              </p>
            </div>{' '}
            <div className="finding">
              <span className="k">
                05
              </span>
              <h3>
                Distrust of accuracy
              </h3>
              <blockquote className="q">
                “No machine is accurate. The lab test is the best.”
                <span className="qn">
                  Translated from Hindi
                </span>
              </blockquote>
              <p className="ctx">
                One participant compared a home reading of 150 with a lab result of 120.
              </p>
              <p className="take">
                <span className="tl">
                  Takeaway
                </span>
                This pointed toward being honest that readings are estimates.
              </p>
            </div>{' '}
            <h3 className="sub">
              Learning From Existing Research
            </h3>{' '}
            <p>
              Published research on glucose monitoring and variability gave context. None of it evaluates GluSight.
            </p>{' '}
            <ul className="list papers">
              <li>
                <div>
                  “Continuous glucose monitoring in adults with type 2 diabetes: A systematic review and meta-analysis.”
                  <br />
                  <span>
                    Diabetologia · 2024
                  </span>
                </div>
              </li>{' '}
              <li>
                <div>
                  “Patient-Reported Usefulness and Challenges in Using Hypoglycemia-Informing Features of Continuous Glucose Monitors to Manage Hypoglycemia.”
                  <br />
                  <span>
                    Published 2023
                  </span>
                </div>
              </li>{' '}
              <li>
                <div>
                  “Glycemic variability: Importance, relationship with physical activity, and the influence of exercise.”
                  <br />
                  <span>
                    Sports Medicine &amp; Health Science · 2021
                  </span>
                </div>
              </li>
            </ul>{' '}
            <h3 className="sub">
              What Shaped the Concept
            </h3>{' '}
            <p>
              My interpretations, not findings. They still need testing with more people.
            </p>{' '}
            <div className="pillar">
              <span className="k">
                ASSUMPTION 01
              </span>
              <h3>
                People May Respond Differently
              </h3>
              <p>
                Everyone lives with glucose differently.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                ASSUMPTION 02
              </span>
              <h3>
                The Current Reading May Not Be Enough
              </h3>
              <p>
                Knowing the number does not say where it is heading.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                ASSUMPTION 03
              </span>
              <h3>
                Information May Need Interpretation
              </h3>
              <p>
                A number helps most when it comes with meaning.
              </p>
            </div>{' '}
            <h3 className="sub">
              From Insight to Opportunity
            </h3>{' '}
            <p>
              The opportunity: showing where glucose may be heading, without presenting an estimate as a certainty.
            </p>
          </section>{' '}
          <section id="future">
            <h2>
              Future Plans &amp; Reflection
            </h2>{' '}
            <h3 className="sub">
              Looking Beyond Monitoring
            </h3>{' '}
            <p>
              GluSight explores how predictive glucose insights could extend the monitoring experience beyond current readings. Further work would focus on understanding how people interpret predicted trends, respond to uncertainty, and use these insights in everyday life.
            </p>{' '}
            <h3 className="sub">
              What Comes Next?
            </h3>{' '}
            <p>
              The next stage would be to explore how people understand possible future glucose trends, how uncertainty should be communicated, and whether these insights could support meaningful decisions in everyday life.
            </p>{' '}
            <div className="pillar">
              <span className="k">
                01
              </span>
              <h3>
                Testing the Understanding of Predictions
              </h3>
              <p>
                Explore whether users can distinguish current glucose readings from estimated future values and correctly interpret what a predicted trend represents.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                02
              </span>
              <h3>
                Communicating Uncertainty
              </h3>
              <p>
                Investigate how prediction ranges, visual distinctions, and supporting explanations could communicate uncertainty without making future glucose changes appear guaranteed.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                03
              </span>
              <h3>
                Understanding Context
              </h3>
              <p>
                Explore how contextual information, such as meals, physical activity, medication, stress, and sleep, could help users interpret glucose trends without overwhelming them with information.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                04
              </span>
              <h3>
                Evaluating the Experience
              </h3>
              <p>
                Conduct usability research to understand how people navigate the concept, interpret its visualisations, and decide what information they need to make sense of their glucose data.
              </p>
            </div>{' '}
            <div className="pillar">
              <span className="k">
                05
              </span>
              <h3>
                Recognising the Limitations
              </h3>
              <p>
                Investigate how the concept should communicate the limitations of predictions and avoid encouraging users to treat estimates as guaranteed outcomes or substitutes for appropriate medical guidance.
              </p>
            </div>{' '}
            <h3 className="sub">
              Final Reflection
            </h3>{' '}
            <p>
              GluSight began with a question about what glucose monitoring could offer beyond the present reading. The concept explores how communicating possible future trends might help people make sense of their glucose information. The next step is to understand whether people can interpret these predictions clearly, trust them appropriately, and find them useful in everyday life.
            </p>
          </section>{' '}
          <p>
            <a className="btn" href="../../projects/">
              See this project in the 3D house
            </a>
          </p>{' '}
          <div className="pager">
            <span />
            <a href="../cabin-in-the-woods/">
              Cabin in the Woods →
            </a>
          </div>
        </main>{' '}
        <footer>
          <nav aria-label="Footer">
            <a href="../#about">
              About
            </a>
            <a href="../#projects">
              Projects
            </a>
            <a href="../#contact">
              Contact
            </a>
            <a href="../../">
              3D house
            </a>
          </nav>{' '}
          © 2026 Harsh{' '}
        </footer>
      </div>
        </>
  );
}
