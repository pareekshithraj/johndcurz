import { GOOGLE_FORM_URL } from '../siteConfig';

export default function Contact() {
  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="section-tag">Get In Touch</div>
        <h2 className="section-title centered">Let's <span className="text-accent">Connect</span></h2>
        <p className="section-subtitle">
          Whether you need guidance, want to support community efforts, or simply wish to talk, John is here for you.
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            {[
              { id: 'contact-phone', icon: '📞', label: 'Phone', value: <a href="tel:+919980814227">+91 99808 14227</a> },
              { id: 'contact-email', icon: '✉️', label: 'Email', value: <a href="mailto:johndcruzgomes@gmail.com">johndcruzgomes@gmail.com</a> },
              { id: 'contact-office', icon: '🏢', label: 'Office', value: <span>123 Civic Center Drive, Suite 400</span> },
              { id: 'contact-hours', icon: '🕐', label: 'Office Hours', value: <span>Mon-Fri: 9:00 AM - 5:00 PM</span> },
            ].map((item) => (
              <div key={item.id} className="contact-info-item" id={item.id}>
                <div className="contact-info-icon">{item.icon}</div>
                <div>
                  <strong>{item.label}</strong>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="contact-form" id="contact-form">
            <div className="form-group">
              <label>Appointment &amp; Inquiry Form</label>
              <p style={{ color: 'var(--text-light)', lineHeight: 1.8, marginTop: '0.5rem' }}>
                All appointment requests, counseling inquiries, and support follow-ups are now handled through a Google Form.
                Open the form, fill in your details, and John will review your request and get back to you.
              </p>
            </div>

            <div className="booking-summary-box">
              <div className="bs-row">
                <span>For</span>
                <strong>Counseling, mentoring, and consultation requests</strong>
              </div>
              <div className="bs-row">
                <span>Includes</span>
                <strong>Personal, de-addiction, and marital support inquiries</strong>
              </div>
              <div className="bs-row">
                <span>Response</span>
                <strong>Follow-up after form review</strong>
              </div>
            </div>

            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-full"
              id="form-submit-btn"
            >
              <span>Open Google Form</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
