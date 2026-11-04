'use client';
// Contact window (opens from the Office room): message form and direct links.
import ContactForm from './ContactForm';

export default function ContactModal({ modalRef, onClose }) {
  return (
    <div ref={modalRef} id="contact-modal" className="contact-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Contact Harsh">
      <div className="contact-modal-backdrop" id="contact-modal-backdrop" onClick={(e) => { e.preventDefault(); onClose(); }} />{' '}
      <div className="contact-modal-container">
        <div className="contact-modal-card">
          <button type="button" className="contact-modal-close" id="contact-modal-close" aria-label="Close Contact Interface" onClick={(e) => { e.preventDefault(); onClose(); }}>{' '}
            <span aria-hidden="true">
              ✕
            </span>{' '}
          </button>{' '}
          <div className="contact-card-header">
            <div className="contact-tag-row">
              <span className="contact-tag-num">
                04
              </span>{' '}
              <span className="contact-tag-title">
                CONTACT ME
              </span>
            </div>{' '}
            <h2 className="contact-headline">
              Let's connect.
            </h2>{' '}
            <div className="contact-accent-line" />{' '}
            <p className="contact-subhead">{' '}
              Have a project in mind, an inquiry, or want to collaborate? Feel free to reach out directly or connect through my social profiles.{' '}
            </p>
          </div>{' '}
          <div className="contact-card-grid">
            {/* Column 1: Direct Message Form */}{' '}
            <div className="contact-form-column">
              <ContactForm onDone={onClose} />
            </div>{' '}
            {/* Column 2: Direct Channels */}{' '}
            <div className="contact-channels-column">
              <div className="contact-channels-title">
                Direct Channels
              </div>{' '}
              <div className="contact-channel-cards">
                {/* LinkedIn */}{' '}
                <a href="https://www.linkedin.com/in/harsh-pal-42b174205/" target="_blank" rel="noopener noreferrer" className="contact-channel-card">{' '}
                  <div className="channel-icon-wrap">
                    <img src="Media/LinkedinLogo.png" alt="LinkedIn" />
                  </div>{' '}
                  <div className="channel-info">
                    <span className="channel-name">
                      LinkedIn
                    </span>{' '}
                    <span className="channel-desc">
                      Professional Profile &amp; Inquiries
                    </span>
                  </div>{' '}
                  <span className="channel-arrow" aria-hidden="true">
                    ↗
                  </span>{' '}
                </a>{' '}
                {/* ArtStation */}{' '}
                <a href="https://www.artstation.com/harshpal" target="_blank" rel="noopener noreferrer" className="contact-channel-card">{' '}
                  <div className="channel-icon-wrap">
                    <img src="Media/ArtstationLogo.jpg" alt="ArtStation" />
                  </div>{' '}
                  <div className="channel-info">
                    <span className="channel-name">
                      ArtStation
                    </span>{' '}
                    <span className="channel-desc">
                      3D Works &amp; Visual Projects
                    </span>
                  </div>{' '}
                  <span className="channel-arrow" aria-hidden="true">
                    ↗
                  </span>{' '}
                </a>
              </div>{' '}
              <div className="contact-location-note">
                <span className="location-dot" />{' '}
                <span>
                  Based in India • Available for Visual Design &amp; 3D Art
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
