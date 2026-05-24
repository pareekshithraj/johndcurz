import { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate
    setSent(true);
    setLoading(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-tag">Get In Touch</div>
        <h2 className="section-title centered">Let's <span className="text-accent">Connect</span></h2>
        <p className="section-subtitle">Whether you need guidance, want to support community efforts, or simply wish to talk — John is here for you.</p>

        <div className="contact-grid">
          <div className="contact-info">
            {[
              { id: 'contact-phone', icon: '📞', label: 'Phone', value: <a href="tel:9980814227">9980814227</a> },
              { id: 'contact-email', icon: '✉️', label: 'Email', value: <a href="mailto:johndcruzgomes@gmail.com">johndcruzgomes@gmail.com</a> },
              { id: 'contact-office', icon: '🏢', label: 'Office', value: <span>123 Civic Center Drive, Suite 400</span> },
              { id: 'contact-hours', icon: '🕐', label: 'Office Hours', value: <span>Mon–Fri: 9:00 AM – 5:00 PM</span> },
            ].map(item => (
              <div key={item.id} className="contact-info-item" id={item.id}>
                <div className="contact-info-icon">{item.icon}</div>
                <div>
                  <strong>{item.label}</strong>
                  {item.value}
                </div>
              </div>
            ))}

            <div className="contact-socials">
              {[
                { id: 'social-facebook', label: 'Facebook', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { id: 'social-twitter', label: 'Twitter', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg> },
                { id: 'social-linkedin', label: 'LinkedIn', svg: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
              ].map(s => (
                <a key={s.id} href="#" className="social-btn" id={s.id} aria-label={s.label}>{s.svg}</a>
              ))}
            </div>
          </div>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="form-name">Full Name</label>
                <input id="form-name" type="text" placeholder="Your full name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="form-email">Email Address</label>
                <input id="form-email" type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="form-subject">Subject</label>
              <select id="form-subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                <option value="">Select a topic…</option>
                <option value="counseling">Personal Counseling</option>
                <option value="community">Community Program</option>
                <option value="youth">Youth Empowerment</option>
                <option value="crisis">Crisis Support</option>
                <option value="other">Other / General Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="form-message">Your Message</label>
              <textarea id="form-message" rows={5} placeholder="Tell John how he can help you…" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>

            <button type="submit" className="btn btn-primary btn-full" id="form-submit-btn" disabled={loading}>
              <span>{loading ? 'Sending…' : 'Send Message'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>

            {sent && (
              <div className="form-success">
                ✅ Thank you! Your message has been sent. John will be in touch soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
