'use client';
// Contact form for the reading version: opens the visitor's email app with the message filled in.
export default function ReadingContactForm() {
  const onSubmit = (ev) => {
    ev.preventDefault();
    const f = ev.currentTarget;
    const name = f.name.value.trim(), email = f.email.value.trim(), msg = f.message.value.trim();
    const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
    const body = encodeURIComponent('Hi Harsh,\n\n' + msg + '\n\nFrom: ' + name + ' (' + email + ')');
    window.location.href = 'mailto:harshpal.contact@gmail.com?subject=' + subject + '&body=' + body;
  };
  return (
    <form id="contact-form" onSubmit={onSubmit}>
      <div>
        <label htmlFor="n">Name</label>
        <input id="n" name="name" required autoComplete="name" />
      </div>{' '}
      <div>
        <label htmlFor="e">Email</label>
        <input id="e" name="email" type="email" required autoComplete="email" />
      </div>{' '}
      <div>
        <label htmlFor="m">Message</label>
        <textarea id="m" name="message" required />
      </div>{' '}
      <button className="btn" type="submit">Send message</button>{' '}
      <p className="fine">This opens your email app with the message filled in.</p>
    </form>
  );
}
