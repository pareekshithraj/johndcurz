const TIMELINE = [
  { year: '2023', icon: '📜', title: 'Certificate of Publication – S.O.S', desc: 'AL-LINA Publication' },
  { year: '2023', icon: '📖', title: 'Author of book: Counselor’s Diary', desc: 'AL-LINA Publication' },
  { year: '2023', icon: '🖋️', title: 'Ethereal Writer', desc: 'Being OMNIFIC Publication' },
  { year: '2015', icon: '🎓', title: 'Mentor', desc: 'K.V.K 2011-18 – Principal /English H.O.D./Counselor' },
  { year: '2013-14', icon: '🎖️', title: 'Certificate of Appreciation as Times NIE Teacher Co-Ordinator', desc: 'NIE – Times of India' },
  { year: '2010', icon: '📚', title: 'Resource Person for School Edition', desc: 'DHIE – Deccan Herald in Education' },
  { year: '2008', icon: '🏆', title: 'Certificate for English Teaching', desc: 'OXFORD UNIVERSITY PRESS' },
  { year: '2008', icon: '🌟', title: 'Educational Consultant', desc: 'NATIONAL EDUCATORS, Nagpur' },
  { year: '2002', icon: '🧠', title: 'Special Trainer in Child Psychology/Spoken English', desc: 'KOLBRO GROUP, Nagpur' },
  { year: '2000', icon: '🗣️', title: 'Best communicative English Trainer', desc: 'VETA – Vivekananda English Training Academy' }
];

export default function Achievements() {
  return (
    <section id="achievements" className="achievements section">
      <div className="container">
        <div className="section-tag">Track Record</div>
        <h2 className="section-title centered">
          Notable <span className="text-accent">Achievements</span>
        </h2>
        <p className="section-subtitle">A legacy built on real results for real people</p>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item" id={`timeline-${i + 1}`}>
              <div className="timeline-marker">
                <span className="timeline-year">{item.year}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
