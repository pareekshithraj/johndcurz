const SERVICES = [
  { id: 'counseling', icon: '🧠', title: 'Personal Counseling', desc: 'One-on-one guidance for individuals navigating life challenges, mental health, career transitions, and personal growth.' },
  { id: 'community', icon: '🏘️', title: 'Community Development', desc: 'Spearheading neighborhood improvement initiatives, affordable housing advocacy, and local infrastructure projects.', featured: true },
  { id: 'youth', icon: '🎓', title: 'Youth Empowerment', desc: 'Mentorship programs, scholarship drives, and skill-building workshops tailored for the next generation of leaders.' },
  { id: 'seniors', icon: '🌟', title: 'Senior Support', desc: 'Dedicated programs ensuring our senior citizens receive the care, respect, and services they truly deserve.' },
  { id: 'crisis', icon: '🆘', title: 'Crisis Intervention', desc: 'Rapid response support for families and individuals in crisis situations, connecting them to critical resources.' },
  { id: 'civic', icon: '🗳️', title: 'Civic Engagement', desc: 'Educating and empowering citizens to participate actively in local government and public policy decisions.' },
];

export default function Services() {
  return (
    <section id="services" className="services section section-dark">
      <div className="container">
        <div className="section-tag">What I Do</div>
        <h2 className="section-title centered">
          Community <span className="text-accent">Services &amp; Programs</span>
        </h2>
        <p className="section-subtitle">Comprehensive support designed to uplift every member of our community</p>

        <div className="services-grid">
          {SERVICES.map(s => (
            <div key={s.id} className={`service-card${s.featured ? ' featured' : ''}`} id={`service-${s.id}`}>
              {s.featured && <div className="service-featured-badge">Most Requested</div>}
              <div className="service-icon-wrap">
                <div className="service-icon">{s.icon}</div>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href="#contact" className="service-link"
                onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Learn More <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
