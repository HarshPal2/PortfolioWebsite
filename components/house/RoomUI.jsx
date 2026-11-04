'use client';
// Everything drawn over the room: lo-fi switch, navigation, the big room title, each room's text,
// and the footer. The container's show/hide classes are animated by the controller.
import { Fragment } from 'react';
import LivingIntro from './rooms/LivingIntro';
import BedroomIntro from './rooms/BedroomIntro';
import KitchenIntro from './rooms/KitchenIntro';
import PoolIntro from './rooms/PoolIntro';
import OfficeIntro from './rooms/OfficeIntro';

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'projects', label: 'Projects' },
  { key: 'blog', label: 'Case Study' },
  { key: 'about-me', label: 'About Me' },
  { key: 'contact', label: 'Contact' },
];

// Which nav keys count as "the same link" (old aliases kept from the original markup).
const NAV_ALIASES = { home: ['home', 'about'], 'about-me': ['about-me', 'aboutme', 'reviews'], blog: ['blog', 'blogs'] };
const isActive = (navKey, active) => navKey === active || (NAV_ALIASES[active] || []).includes(navKey);

const SOCIALS = [
  { cls: 'icon-linkedin', href: 'https://www.linkedin.com/in/harsh-pal-42b174205/', rel: 'Linkedin Profile of Harsh', aria: 'LinkedIn Profile', img: 'Media/LinkedinLogo.png', alt: 'LinkedIn', tip: 'LinkedIn' },
  { cls: 'icon-artstation', href: 'https://www.artstation.com/harshpal', rel: 'Artstation portfolio of Harsh', aria: 'ArtStation Profile', img: 'Media/ArtstationLogo.jpg', alt: 'ArtStation', tip: 'ArtStation' },
];

export default function RoomUI({ refs, title, activeNav, controller }) {
  const c = controller;
  const call = (fn) => (e) => { e.preventDefault(); if (c) fn(); };

  return (
    <div id="ui-container" className="ui-container ui-hidden" ref={refs.ui}>
      {/* Lo-fi (text-only) version switch */}
      <a href="reading/" className="lofi-btn" id="lofi-btn" aria-label="Switch to the lo-fi, text-only version of this portfolio" title="Lo-fi version">{' '}
        <svg className="lofi-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M15 3v4h4" />
          <path d="M10 12h6M10 15.5h6M10 8.5h2" />
        </svg>{' '}
        <span className="lofi-label">LO-FI</span>{' '}
      </a>{' '}

      {/* Navigation */}
      <div className="parallax-layer layer-nav" data-depth="0.18">
        <header className="top-header stagger-1">
          <nav className="nav-bar">
            {NAV.map((n, i) => (
              <Fragment key={n.key}>
                {i > 0 ? ' ' : null}
                <a href={`#${n.key}`} className={`nav-link${isActive(n.key, activeNav) ? ' active' : ''}`} data-nav={n.key}
                  onClick={call(() => c.onNavClick(n.key))}>
                  {n.label}
                </a>
              </Fragment>
            ))}
          </nav>
        </header>
      </div>{' '}

      {/* Room title ("Freedom", "Projects", ...) */}
      <div className="parallax-layer layer-title" data-depth="0.26">
        <div className="freedom-title stagger-2">
          <h1>{title}</h1>
        </div>
      </div>{' '}

      {/* Each room's text; CSS shows the one for the current room */}
      <div className="parallax-layer layer-main" data-depth="0.35">
        <LivingIntro />{' '}
        <BedroomIntro onExploreProjects={() => c && c.onExploreProjects()} />{' '}
        <KitchenIntro onKitchenIntro={() => c && c.onKitchenIntro()} />{' '}
        <PoolIntro />{' '}
        <OfficeIntro onContactIntro={() => c && c.onContactIntro()} />
      </div>{' '}

      {/* Footer and social links */}
      <div className="parallax-layer layer-footer" data-depth="0.22">
        <footer className="bottom-footer">
          <div className="footer-center stagger-6">
            <span className="powered-text">POWERED BY IMAGINATION</span>
          </div>{' '}
          <div className="footer-socials stagger-6">
            {SOCIALS.map((s, i) => (
              <Fragment key={s.cls}>
                {i > 0 ? ' ' : null}
                <a href={s.href} target="_blank" rel={s.rel} className={`social-icon ${s.cls}`} aria-label={s.aria}
                  onMouseEnter={(e) => c && c.onSocialEnter(s.tip, e)}
                  onMouseMove={(e) => c && !c.isLocked() && c.hotspots.updateTooltipPosition(e.clientX, e.clientY)}
                  onMouseLeave={() => c && c.hotspots.hideTooltip()}
                  onClick={() => c && c.hotspots.hideTooltip()}>
                  {' '}<img src={s.img} alt={s.alt} />{' '}
                </a>
              </Fragment>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
