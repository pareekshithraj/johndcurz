export default function About() {
  return (
    <section id="about" className="about section">
      <div className="container">
        <div className="section-tag">About John</div>
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-image-frame">
              <img src="/john_portrait.png" alt="John D Cruz" className="about-img" />
              <div className="about-image-accent" />
            </div>
            <div className="about-card-float">
              <div className="float-icon">🏛️</div>
              <div>
                <strong>Public Service Leader</strong>
                <span>Serving since 2009</span>
              </div>
            </div>
          </div>

          <div className="about-content">
            <h2 className="section-title">
              A Leader Rooted in <span className="text-accent">Purpose &amp; People</span>
            </h2>
            <p className="about-intro">
              John D'Cruz Gomes has dedicated his life in improving the well-being of individuals, families,
              and communities. As a seasoned counselor and public servant, he brings empathy, integrity,
              and unwavering commitment to every role he undertakes.
            </p>
            
            <div className="about-credentials" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1e293b', fontWeight: '600' }}>Academic Background</h3>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', color: '#475569' }}>
                <li style={{ marginBottom: '0.5rem' }}>🎓 B.A. Bed [St. Josephs]</li>
                <li>🎓 M.B.A [HR] TASMAC</li>
              </ul>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1e293b', fontWeight: '600' }}>Professional Experience</h3>
              <p style={{ color: '#475569', lineHeight: 1.6 }}>
                🧠 Psychotherapy cum counseling [A.S.A – Atma Shakthi Academy - German Mental Health Institute, Mount St. Joseph, Bannerghatta]
              </p>
            </div>

            <div className="about-values">
              {[
                { icon: '⚖️', label: 'Integrity', id: 'value-integrity' },
                { icon: '❤️', label: 'Compassion', id: 'value-compassion' },
                { icon: '🔍', label: 'Transparency', id: 'value-transparency' },
                { icon: '🤝', label: 'Service', id: 'value-service' },
              ].map(v => (
                <div key={v.id} className="value-pill" id={v.id}>
                  <span className="value-icon">{v.icon}</span> {v.label}
                </div>
              ))}
            </div>

            <a href="#plans"
              className="btn btn-primary"
              id="about-plans-btn"
              onClick={e => { e.preventDefault(); document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); }}>
              View Our Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
