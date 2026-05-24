import { useEffect, useState } from 'react';
import api from '../api';

const PLAN_META = {
  starter: { gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', accentColor: '#94a3b8', icon: '🌱', glow: 'rgba(148,163,184,0.15)' },
  care:    { gradient: 'linear-gradient(135deg, #1c1400 0%, #2d1f00 100%)', accentColor: '#d4a843', icon: '⭐', glow: 'rgba(212,168,67,0.2)' },
  full:    { gradient: 'linear-gradient(135deg, #0d1f3c 0%, #0a1628 100%)', accentColor: '#60a5fa', icon: '💎', glow: 'rgba(96,165,250,0.2)' },
  custom:  { gradient: 'linear-gradient(135deg, #1a0d2e 0%, #0f0720 100%)', accentColor: '#a78bfa', icon: '✨', glow: 'rgba(167,139,250,0.2)' },
};

export const FALLBACK_PLANS = [
  {
    id: 'fallback-starter',
    name: 'Starter Session',
    slug: 'starter',
    sessions: 1,
    duration: '45 minutes',
    price: 500,
    description: 'A focused one-on-one session for immediate guidance and next steps.',
    badge: 'Good Start',
  },
  {
    id: 'fallback-care',
    name: 'Care Package',
    slug: 'care',
    sessions: 1,
    duration: '1 hour',
    price: 1000,
    description: 'A focused one-hour counseling session for personal support and steady progress.',
    badge: 'Most Popular',
  },
  {
    id: 'fallback-full',
    name: 'Full Support Program',
    slug: 'full',
    sessions: 1,
    duration: '1 hour',
    price: 1500,
    description: 'A comprehensive one-on-one support session for deeper care, planning, and practical follow-through.',
    badge: 'Best Value',
  },
  {
    id: 'fallback-custom',
    name: 'Custom Session',
    slug: 'custom',
    sessions: 1,
    duration: 'Flexible duration',
    price: 0,
    description: 'Tailored support for families, groups, or community program needs.',
    badge: 'Flexible',
  },
];

export function normalizePlans(plans) {
  return plans.map((plan) => {
    const overrides = {
      starter: { name: 'Starter Session', sessions: 1, price: 500, duration: '45 minutes' },
      care: {
        name: 'Care Package',
        sessions: 1,
        duration: '1 hour',
        price: 1000,
        description: 'A focused one-hour counseling session for personal support and steady progress.',
      },
      full: {
        name: 'Full Support Program',
        sessions: 1,
        duration: '1 hour',
        price: 1500,
        description: 'A comprehensive one-on-one support session for deeper care, planning, and practical follow-through.',
      },
      custom: {
        name: 'Custom Session',
        sessions: 1,
        duration: 'Flexible duration',
      },
    };

    return { ...plan, ...(overrides[plan.slug] || { sessions: 1 }) };
  });
}

export default function Plans({ onBookPlan }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    api.get('/plans')
      .then(r => setPlans(normalizePlans(r.data?.length ? r.data : FALLBACK_PLANS)))
      .catch(() => setPlans(normalizePlans(FALLBACK_PLANS)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="plans" className="plans-section">
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="loading-spinner" />
      </div>
    </section>
  );

  return (
    <section id="plans" className="plans-section">
      {/* Decorative background blobs */}
      <div className="plans-blob plans-blob-1" />
      <div className="plans-blob plans-blob-2" />

      <div className="container">
        <div className="plans-header">
          <div className="section-tag">Service Plans</div>
          <h2 className="section-title centered">
            Individual <span className="text-accent">Counseling Plans</span>
          </h2>
          <p className="plans-subtitle">
            One-on-one private sessions — choose the plan that fits your journey
          </p>
        </div>

        <div className="plans-grid-new">
          {plans.map((plan) => {
            const meta = PLAN_META[plan.slug] || PLAN_META.starter;
            const isPopular = plan.badge === 'Most Popular';
            const isHovered = hovered === plan.id;

            return (
              <div
                key={plan.id}
                className={`plan-card-new${isPopular ? ' plan-popular' : ''}${isHovered ? ' plan-hovered' : ''}`}
                id={`plan-${plan.slug}`}
                onMouseEnter={() => setHovered(plan.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ background: meta.gradient, boxShadow: isHovered ? `0 32px 64px ${meta.glow}, 0 0 0 1px ${meta.accentColor}30` : undefined }}
              >
                {/* Popular ribbon */}
                {isPopular && (
                  <div className="plan-popular-ribbon">
                    <span>Most Popular</span>
                  </div>
                )}

                {/* Badge chip */}
                {plan.badge && !isPopular && (
                  <div className="plan-chip" style={{ color: meta.accentColor, borderColor: `${meta.accentColor}40`, background: `${meta.accentColor}12` }}>
                    {plan.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="pcn-icon" style={{ background: `${meta.accentColor}15`, color: meta.accentColor }}>
                  {meta.icon}
                </div>

                {/* Name & description */}
                <h3 className="pcn-name">{plan.name}</h3>
                <p className="pcn-desc">{plan.description}</p>

                {/* Divider */}
                <div className="pcn-divider" style={{ background: `${meta.accentColor}25` }} />

                {/* Session info — clean pills */}
                <div className="pcn-info">
                  <div className="pcn-pill" style={{ background: `${meta.accentColor}12`, color: meta.accentColor }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
                    1 Person
                  </div>
                  <div className="pcn-pill" style={{ background: `${meta.accentColor}12`, color: meta.accentColor }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {plan.duration}
                  </div>
                </div>

                {/* Price */}
                <div className="pcn-price">
                  {plan.slug === 'custom' ? (
                    <div className="pcn-price-quote">Contact for Pricing</div>
                  ) : (
                    <div className="pcn-price-num">
                      <span className="pcn-currency" style={{ color: meta.accentColor }}>₹</span>
                      <span className="pcn-amount" style={{ color: meta.accentColor }}>{plan.price.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  className="pcn-btn"
                  id={`book-plan-${plan.slug}`}
                  onClick={() => onBookPlan(plan)}
                  style={{
                    background: isPopular ? `linear-gradient(135deg, ${meta.accentColor}, #c8962f)` : `${meta.accentColor}18`,
                    color: isPopular ? '#0a1628' : meta.accentColor,
                    border: `1px solid ${meta.accentColor}40`,
                  }}
                >
                  {plan.slug === 'custom' ? 'Request a Quote' : 'Book This Plan'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="plans-trust">
          <span>🔒 Secure Booking</span>
          <span>👤 Private 1-on-1 Sessions</span>
          <span>📅 Flexible Scheduling</span>
          <span>✅ No Hidden Charges</span>
        </div>
      </div>
    </section>
  );
}
