import { useEffect, useRef, useState } from 'react';

function useCountUp(target, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, trigger]);
  return val;
}

export default function Hero({ onBookNow }) {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const years = useCountUp(20, statsVisible);
  const lives = useCountUp(5000, statsVisible);
  const programs = useCountUp(120, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-glow-container">
        <div className="glow-blob glow-blob-left" />
        <div className="glow-blob glow-blob-right" />
      </div>

      <div className="hero-inner">
        <div className="hero-content">
          <div className="section-tag">Counselor &amp; Public Servant</div>
          <h1 className="hero-title">
            John D'Cruz Gomes
            <span className="hero-title-main" style={{color: '#4facfe'}}>Counselor &amp; Public Servant</span>
          </h1>

          <p className="hero-subtitle">
            John D Cruz provides trusted counseling, public service support, and
            community programs built around dignity, access, and practical help.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" id="hero-book-btn" onClick={onBookNow}>
              <span>Book an Appointment</span>
            </button>
            <a className="btn btn-outline" href="#about">
              Learn About John
            </a>
          </div>

          <div className="hero-stats" ref={statsRef}>
            <div className="hero-stat">
              <strong>{years}+</strong>
              <span>Years serving</span>
            </div>
            <div className="hero-stat">
              <strong>{lives.toLocaleString()}+</strong>
              <span>Lives supported</span>
            </div>
            <div className="hero-stat">
              <strong>{programs}+</strong>
              <span>Programs led</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="John D Cruz community service portrait">
          <div className="hero-portrait-card">
            <img src="/john_portrait.png" alt="John D Cruz" className="hero-portrait" />
            <div className="portrait-badge">
              <span>Serving since</span>
              <strong>2009</strong>
            </div>
          </div>
          <div className="hero-service-card hero-service-card-left">
            <span>01</span>
            <strong>Personal Counseling</strong>
          </div>
          <div className="hero-service-card hero-service-card-right">
            <span>02</span>
            <strong>Community Support</strong>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
