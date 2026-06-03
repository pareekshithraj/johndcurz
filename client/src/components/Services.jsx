const SERVICES = [
  {
    id: 'counseling',
    icon: '🧠',
    title: 'Personal Counseling',
    desc: 'One-on-one guidance for individuals navigating life challenges, emotional stress, mental health, career transitions, and personal growth.',
  },
  {
    id: 'deaddiction',
    icon: '🌿',
    title: 'De-Addiction Counseling',
    desc: 'Support for all chemical substance abuse cases with intervention, recovery guidance, family support, and practical next-step care.',
    featured: true,
  },
  {
    id: 'premarital',
    icon: '💍',
    title: 'Pre-Marital Counseling Intervention',
    desc: 'Guidance for couples preparing for marriage with conversations around expectations, communication, values, and long-term stability.',
  },
  {
    id: 'postmarital',
    icon: '🤝',
    title: 'Post-Marital Life Counseling Intervention',
    desc: 'Focused counseling support for married couples facing conflict, adjustment issues, trust concerns, and relationship rebuilding.',
  },
  {
    id: 'mentorship',
    icon: '🎓',
    title: 'Mentorship & Life Guidance',
    desc: 'Steady mentoring for youth and adults seeking direction, confidence, decision-making clarity, and purposeful personal development.',
  },
  {
    id: 'crisis',
    icon: '🆘',
    title: 'Crisis Intervention',
    desc: 'Immediate support for individuals and families in difficult situations, with calm guidance and referral toward the right help systems.',
  },
];

export default function Services() {
  return (
    <section id="services" className="services section section-dark">
      <div className="container">
        <div className="section-tag">What I Do</div>
        <h2 className="section-title centered">
          Counseling <span className="text-accent">Services &amp; Interventions</span>
        </h2>
        <p className="section-subtitle">
          Focused support for individuals, couples, families, and people seeking meaningful personal change
        </p>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div key={s.id} className={`service-card${s.featured ? ' featured' : ''}`} id={`service-${s.id}`}>
              {s.featured && <div className="service-featured-badge">Most Requested</div>}
              <div className="service-icon-wrap">
                <div className="service-icon">{s.icon}</div>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a
                href="#contact"
                className="service-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
