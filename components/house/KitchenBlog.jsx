// Kitchen case study window: the kitchen picture, the hood, and the floating window with the
// GluSight case study and visual-project slides. Static markup: lib/house/kitchenBlog.js,
// kitchenStories.js and kitchenTable.js drive it after mount, so React never re-renders it.
import { memo } from 'react';
import GlusightCaseStudy from '@/content/house/GlusightCaseStudy';

function KitchenBlog({ stageRef }) {
  return (
    <div ref={stageRef} id="kitchen-blog-stage" className="kitchen-blog-stage" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Interactive Kitchen Blog">
      <div className="kitchen-stage-backdrop" id="kitchen-stage-backdrop" />{' '}
      {/* Edge-to-Edge 3D Kitchen Canvas Environment (Matching PC Screen Section) */}{' '}
      <div className="kitchen-canvas-wrapper" id="kitchen-canvas-wrapper">
        <canvas id="kitchen-canvas" className="kitchen-canvas" />
      </div>{' '}
      {/* Coordinate Stage Aligned 1:1 with 3D Kitchen Canvas Scene */}{' '}
      <div className="kitchen-scene-stage" id="kitchen-scene-stage">
        {/* 1. Kitchen Hood Area (Exit Mechanism) */}{' '}
        <div className="kitchen-hood-area" id="kitchen-hood-area" title="Retract window to Kitchen Hood and exit">
          <button type="button" className="kitchen-hood-exit-btn" id="kitchen-hood-exit-btn" aria-label="Retract window into Kitchen Hood to exit">{' '}
            <span className="hood-exit-arrow" aria-hidden="true">
              ▲
            </span>{' '}
            <span className="hood-exit-text">
              Retract to Exit
            </span>{' '}
          </button>
        </div>{' '}
        {/* 2. Floating Kitchen Blog Window (Reproducing Adobe Illustrator Detailed Layout) */}{' '}
        <div className="floating-project-window kitchen-blog-window" id="floating-project-window">
          {/* Top Editorial Header Bar (Matching Illustrator Artboard Header) */}{' '}
          <header className="kb-header-bar">
            <div className="kb-header-left">
              <button type="button" className="kitchen-return-btn kb-return-btn" id="kitchen-return-btn" aria-label="Return to Kitchen">{' '}
                <span className="return-arrow" aria-hidden="true">
                  ←
                </span>{' '}
                <span className="return-label">
                  Return to Kitchen
                </span>{' '}
              </button>
            </div>{' '}
            <div className="kb-header-center">
              <span className="kb-header-title" id="kb-header-title">
                Case Study • GluSight
              </span>
            </div>{' '}
            <div className="kb-header-right">
              <div className="kb-header-sections" id="kitchen-header-sections">
                <span className="kb-sec-tag">
                  SECTIONS
                </span>{' '}
                <span className="kb-sec-val" id="kitchen-sec-counter">
                  01 / 05
                </span>
              </div>
            </div>
          </header>{' '}
          {/* Window Body Container: Tripartite Editorial Canvas matching preview_detailed_layout.jpg */}{' '}
          <div className="kb-window-body" id="kb-window-body">
            {/* Left Editorial Rail (Projects Category Label matching Illustrator artboard) */}{' '}
            <aside className="kb-rail kb-rail-left" aria-label="Category Rail">
              <div className="kb-rail-inner">
                <span className="kb-rail-tag-projects">
                  Projects
                </span>{' '}
                <nav className="kb-project-tabs" id="kb-project-tabs" aria-label="Kitchen Blog projects">
                  <button type="button" className="kb-project-tab active" data-project="glusight" aria-pressed="true">
                    GluSight
                  </button>{' '}
                  <button type="button" className="kb-project-tab" data-project="cabin" aria-pressed="false">
                    Cabin in the Woods
                  </button>{' '}
                  <button type="button" className="kb-project-tab" data-project="product" aria-pressed="false">
                    Product Renders
                  </button>{' '}
                  <button type="button" className="kb-project-tab" data-project="biophilic" aria-pressed="false">
                    Biophilic Interior
                  </button>{' '}
                  <button type="button" className="kb-project-tab" data-project="posters" aria-pressed="false">
                    Poster Collection
                  </button>
                </nav>
              </div>
            </aside>{' '}
            {/* Main Scrollable Case Study Content (Open Editorial Architecture) */}{' '}
            <main className="kitchen-content-scroll content-body-scrollable" id="content-body-scrollable">
              <GlusightCaseStudy />
            </main>{' '}
            {/* Visual-project stories (built by stories.js): one visual + one poem or story per slide */}{' '}
            <main className="kb-story-main" id="kb-story-main" aria-label="Project stories" />{' '}
            {/* Slide pager: one case-study section per page */}{' '}
            <div className="kb-pager" id="kb-pager" role="group" aria-label="Case study pages">
              <button type="button" className="kb-pager-btn" id="kb-prev" aria-label="Previous page">
                ← Prev
              </button>{' '}
              <span className="kb-pager-count" id="kb-pager-count" aria-live="polite">
                01 / 05
              </span>{' '}
              <button type="button" className="kb-pager-btn" id="kb-next" aria-label="Next page">
                Next →
              </button>
            </div>{' '}
            <aside className="kb-rail kb-rail-right kb-rail-story" id="kb-story-rail" aria-label="Story slides">
              <div className="kb-rail-inner">
                <div className="kb-rail-title">
                  Slides
                </div>{' '}
                <nav className="kb-rail-tabs" id="kb-story-tabs" aria-label="Project slides" />
              </div>
            </aside>{' '}
            {/* Right Editorial Rail (Section Tab Matching preview_detailed_layout.jpg) */}{' '}
            <aside className="kb-rail kb-rail-right" aria-label="Section Tabs">
              <div className="kb-rail-inner">
                <div className="kb-rail-title">
                  Sections
                </div>{' '}
                <nav className="kb-rail-tabs" aria-label="GluSight Sections">
                  <button type="button" className="kb-rail-tab active" data-section="0" data-target="kb-sec-01" aria-label="Section 1: The Hook" title="01. The Hook">{' '}
                    <span className="kb-tab-num">
                      01.
                    </span>{' '}
                    <span className="kb-tab-name">
                      The Hook
                    </span>{' '}
                  </button>{' '}
                  <button type="button" className="kb-rail-tab" data-section="1" data-target="kb-sec-02" aria-label="Section 2: Introducing GluSight" title="02. Introducing GluSight">{' '}
                    <span className="kb-tab-num">
                      02.
                    </span>{' '}
                    <span className="kb-tab-name">
                      Introducing GluSight
                    </span>{' '}
                  </button>{' '}
                  <button type="button" className="kb-rail-tab" data-section="2" data-target="kb-sec-03" aria-label="Section 3: A Closer Look at GluSight" title="03. A Closer Look at GluSight">{' '}
                    <span className="kb-tab-num">
                      03.
                    </span>{' '}
                    <span className="kb-tab-name">
                      A Closer Look
                    </span>{' '}
                  </button>{' '}
                  <button type="button" className="kb-rail-tab" data-section="3" data-target="kb-sec-04" aria-label="Section 4: Research & Insights" title="04. Research & Insights">{' '}
                    <span className="kb-tab-num">
                      04.
                    </span>{' '}
                    <span className="kb-tab-name">
                      Research &amp; Insights
                    </span>{' '}
                  </button>{' '}
                  <button type="button" className="kb-rail-tab" data-section="4" data-target="kb-sec-05" aria-label="Section 5: Future Plans & Reflection" title="05. Future Plans & Reflection">{' '}
                    <span className="kb-tab-num">
                      05.
                    </span>{' '}
                    <span className="kb-tab-name">
                      Future &amp; Reflection
                    </span>{' '}
                  </button>
                </nav>
              </div>
            </aside>
          </div>
        </div>{' '}
        {/* Stove Control Dials Row temporarily removed per user request */}
      </div>
    </div>
  );
}

export default memo(KitchenBlog, () => true);
