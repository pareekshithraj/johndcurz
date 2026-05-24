import { useState } from 'react';

const TESTIMONIALS = [
  { id: 't1', initials: 'M', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', name: 'Maria Santos', role: 'Community Resident', text: '"John D Cruz changed my life. When I was at my lowest point, his counseling gave me the strength and direction I needed to rebuild. He genuinely cares about every person he helps."' },
  { id: 't2', initials: 'R', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', name: 'Robert Pereira', role: 'Small Business Owner', text: '"As a local business owner, I\'ve seen John advocate tirelessly for our neighborhood. He listens, he acts, and he delivers. His integrity is unmatched in public service."' },
  { id: 't3', initials: 'L', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', name: 'Linda Fernandez', role: 'Parent & Community Volunteer', text: '"Thanks to John\'s youth program, my son received a scholarship and is now studying engineering. John\'s commitment to the youth of our community is inspiring and real."' },
  { id: 't4', initials: 'A', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', name: 'Dr. Anita Nair', role: 'Healthcare Professional', text: '"John doesn\'t just talk about change — he makes it happen. His leadership in the health center project has been a blessing for thousands of families in our area."' },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  const getVisible = () => {
    const result = [];
    for (let i = 0; i < 3; i++) result.push(TESTIMONIALS[(current + i) % total]);
    return result;
  };

  return (
    <section id="testimonials" className="testimonials section section-dark">
      <div className="container">
        <div className="section-tag">Voices of the Community</div>
        <h2 className="section-title centered">
          What People <span className="text-accent">Are Saying</span>
        </h2>

        <div className="testimonials-slider" id="testimonials-slider">
          <div className="testimonial-track">
            {getVisible().map((t, i) => (
              <div key={`${t.id}-${i}`} className="testimonial-card" id={`testimonial-${t.id}`}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar" style={{ background: t.gradient }}>{t.initials}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-controls">
            <button className="slider-btn" id="prev-btn" onClick={prev} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="slider-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`dot${i === current ? ' active' : ''}`}
                  onClick={() => setCurrent(i)} aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
            <button className="slider-btn" id="next-btn" onClick={next} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
