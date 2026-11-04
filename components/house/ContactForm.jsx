'use client';
// Contact form: checks the fields, then opens the visitor's email app with the message filled in.
import { useRef, useState } from 'react';

export default function ContactForm({ onDone }) {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ text: '', color: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    const f = formRef.current;
    const name = f.elements.name.value.trim();
    const email = f.elements.email.value.trim();
    const message = f.elements.message.value.trim();

    if (!name || !email || !message) {
      setStatus({ text: 'Please fill in all fields.', color: '#f87171' });
      return;
    }

    setSending(true);
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi Harsh,\n\n${message}\n\nFrom: ${name} (${email})`);
    const mailtoUrl = `mailto:harshpal.contact@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setStatus({ text: 'Thank you! Opening your email client to send...', color: '#4ade80' });
      window.open(mailtoUrl, '_blank');
      setTimeout(() => {
        f.reset();
        setSending(false);
        setTimeout(() => {
          setStatus((s) => ({ ...s, text: '' }));
          onDone();
        }, 1800);
      }, 1000);
    }, 500);
  };

  return (
    <form id="contact-form" className="contact-form" ref={formRef} onSubmit={onSubmit}>
                <div className="contact-input-group">
                  <label htmlFor="contact-name" className="contact-label">
                    Name
                  </label>{' '}
                  <input type="text" id="contact-name" name="name" className="contact-input" placeholder="Your name" required autoComplete="name" />
                </div>{' '}
                <div className="contact-input-group">
                  <label htmlFor="contact-email" className="contact-label">
                    Email
                  </label>{' '}
                  <input type="email" id="contact-email" name="email" className="contact-input" placeholder="Your email address" required autoComplete="email" />
                </div>{' '}
                <div className="contact-input-group">
                  <label htmlFor="contact-message" className="contact-label">
                    Message
                  </label>{' '}
                  <textarea id="contact-message" name="message" className="contact-textarea" rows="4" placeholder="Tell me about your project, idea, or inquiry..." required />
                </div>{' '}
                <button type="submit" className="contact-submit-btn" id="contact-submit-btn" disabled={sending}>{' '}
                  <span>
                    {sending ? 'Sending...' : 'Send Message'}
                  </span>{' '}
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>{' '}
                </button>{' '}
                <div className="contact-form-status" id="contact-form-status" aria-live="polite" style={status.color ? { color: status.color } : undefined}>
                  {status.text}
                </div>
              </form>
  );
}
