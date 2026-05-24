import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-initials">JDC</span>
              <span className="logo-text">John D'Cruz <span className="logo-bold">Gomes</span></span>
            </div>
            <p>Dedicated to serving our community with integrity, compassion, and purpose. Together, we build a better tomorrow.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {[['home', 'Home'], ['about', 'About'], ['plans', 'Plans'], ['services', 'Services'], ['contact', 'Contact']].map(([id, label]) => (
                <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              {['Personal Counseling', 'Community Development', 'Youth Empowerment', 'Senior Support'].map(s => (
                <li key={s}><a href="#services" onClick={e => { e.preventDefault(); scrollTo('services'); }}>{s}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Subscribe to receive community news and updates.</p>
            {subbed ? (
              <p style={{ color: 'var(--gold)' }}>✓ Subscribed! Thank you.</p>
            ) : (
              <form className="newsletter-form" id="newsletter-form" onSubmit={e => { e.preventDefault(); setSubbed(true); }}>
                <input id="newsletter-email" type="email" placeholder="Your email address" required value={email} onChange={e => setEmail(e.target.value)} />
                <button type="submit" id="newsletter-submit-btn" aria-label="Subscribe">→</button>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 John D'Cruz Gomes. All Rights Reserved. | Serving the Community with Pride.</p>
        </div>
      </div>
    </footer>
  );
}
