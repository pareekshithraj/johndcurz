import { GOOGLE_FORM_URL } from '../siteConfig';

export default function Footer() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-initials">JDG</span>
              <span className="logo-text">John D'Cruz <span className="logo-bold">Gomes</span></span>
            </div>
            <p>Dedicated to serving our community with integrity, compassion, and purpose. Together, we build a better tomorrow.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {[['home', 'Home'], ['about', 'About'], ['plans', 'Plans'], ['services', 'Services'], ['contact', 'Contact']].map(([id, label]) => (
                <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              {['Personal Counseling', 'De-Addiction Counseling', 'Pre-Marital Counseling', 'Post-Marital Counseling'].map((s) => (
                <li key={s}><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{s}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4>Google Form</h4>
            <p>Use the Google Form for appointments, counseling requests, and general inquiries.</p>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              id="newsletter-submit-btn"
            >
              Open Form
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 John D'Cruz Gomes. All Rights Reserved. | Serving the Community with Pride.</p>
        </div>
      </div>
    </footer>
  );
}
