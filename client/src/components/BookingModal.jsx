import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const STEPS = ['Plan', 'Date & Time', 'Your Details', 'Confirmed!'];

function getNext7Days() {
  const days = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0) { // exclude Sundays
      days.push({
        iso: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
  }
  return days.slice(0, 10);
}

export default function BookingModal({ open, onClose, selectedPlan, plans = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [chosenPlan, setChosenPlan] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState({ available: [], booked: [] });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const days = getNext7Days();

  useEffect(() => {
    if (open) {
      setStep(0);
      setChosenPlan(selectedPlan || null);
      setSelectedDate('');
      setSelectedTime('');
      setError('');
      setBooking(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open, selectedPlan]);

  useEffect(() => {
    if (selectedDate && chosenPlan) {
      setLoadingSlots(true);
      setSelectedTime('');
      api.get(`/appointments/slots?date=${selectedDate}&plan_id=${chosenPlan.id}`)
        .then(r => setSlots(r.data))
        .catch(() => setSlots({ available: [], booked: [] }))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate, chosenPlan]);

  if (!open) return null;

  const goBack = () => { setError(''); setStep(s => s - 1); };

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!chosenPlan) return setError('Please select a plan');
      if (!user) { onClose(); return navigate('/login?redirect=book'); }
      setStep(1);
    } else if (step === 1) {
      if (!selectedDate) return setError('Please pick a date');
      if (!selectedTime) return setError('Please pick a time slot');
      setStep(2);
    } else if (step === 2) {
      if (!form.phone) return setError('Please enter your phone number');
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/appointments', {
        plan_id: chosenPlan.id,
        date: selectedDate,
        time: selectedTime,
        phone: form.phone,
        notes: form.notes
      });
      setBooking(res.data);
      setStep(3);
    } catch (e) {
      setError(e.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" id="booking-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label="Book Appointment">
        <button className="modal-close" id="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

        {/* Progress bar */}
        <div className="modal-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`progress-step${i <= step ? ' active' : ''}${i < step ? ' done' : ''}`}>
              <div className="step-dot">{i < step ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="modal-body">
          {/* STEP 0 — Choose Plan */}
          {step === 0 && (
            <div className="modal-step" id="step-plan">
              <h2>Choose Your Plan</h2>
              <p className="step-subtitle">Select the counseling plan that best fits your needs</p>
              <div className="modal-plans">
                {plans.map(p => (
                  <button
                    key={p.id}
                    id={`modal-plan-${p.slug}`}
                    className={`modal-plan-option${chosenPlan?.id === p.id ? ' selected' : ''}`}
                    onClick={() => setChosenPlan(p)}
                  >
                    <div className="mpo-left">
                      <strong>{p.name}</strong>
                      <span>{p.duration}</span>
                    </div>
                    <div className="mpo-right">
                      {p.slug === 'custom' ? (
                        <span className="mpo-price">Quote</span>
                      ) : (
                        <span className="mpo-price">₹{p.price.toLocaleString('en-IN')}</span>
                      )}
                      {p.badge && <span className="mpo-badge">{p.badge}</span>}
                    </div>
                    {chosenPlan?.id === p.id && <span className="mpo-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Date & Time */}
          {step === 1 && (
            <div className="modal-step" id="step-datetime">
              <h2>Pick a Date &amp; Time</h2>
              <p className="step-subtitle">All sessions are conducted in person at John's office</p>

              <div className="date-grid">
                {days.map(d => (
                  <button
                    key={d.iso}
                    id={`date-btn-${d.iso}`}
                    className={`date-btn${selectedDate === d.iso ? ' selected' : ''}`}
                    onClick={() => setSelectedDate(d.iso)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {selectedDate && (
                <>
                  <h4 className="slots-title">Available Slots</h4>
                  {loadingSlots ? (
                    <div className="slots-loading">Loading slots…</div>
                  ) : (
                    <div className="slots-grid">
                      {slots.available.length === 0 && (
                        <p style={{ color: 'var(--text-light)', gridColumn: '1/-1' }}>No slots available for this date.</p>
                      )}
                      {slots.available.map(t => (
                        <button
                          key={t}
                          id={`slot-${t.replace(/[: ]/g, '-')}`}
                          className={`slot-btn${selectedTime === t ? ' selected' : ''}`}
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                      {slots.booked.map(t => (
                        <button key={t} className="slot-btn booked" disabled>{t} ✗</button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* STEP 2 — Personal Details */}
          {step === 2 && (
            <div className="modal-step" id="step-details">
              <h2>Your Details</h2>
              <p className="step-subtitle">Booking as <strong>{user?.name}</strong> ({user?.email})</p>

              <div className="booking-summary-box">
                <div className="bs-row">
                  <span>Plan</span>
                  <strong>{chosenPlan?.name}</strong>
                </div>
                <div className="bs-row">
                  <span>Date</span>
                  <strong>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
                <div className="bs-row">
                  <span>Time</span>
                  <strong>{selectedTime}</strong>
                </div>
                {chosenPlan?.slug !== 'custom' && (
                  <div className="bs-row">
                    <span>Amount</span>
                    <strong className="bs-amount">₹{chosenPlan?.price?.toLocaleString('en-IN')}</strong>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="booking-phone">Phone Number *</label>
                <input
                  id="booking-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="booking-notes">Additional Notes (optional)</label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  placeholder="Anything John should know before your session…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && booking && (
            <div className="modal-step confirmation-step" id="step-confirmation">
              <div className="confirm-icon">🎉</div>
              <h2>Booking Confirmed!</h2>
              <p>Your appointment with John D Cruz has been booked successfully.</p>

              <div className="booking-summary-box">
                <div className="bs-row"><span>Booking ID</span><strong>#{booking.id}</strong></div>
                <div className="bs-row"><span>Plan</span><strong>{booking.plan_name}</strong></div>
                <div className="bs-row">
                  <span>Date</span>
                  <strong>{new Date(booking.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </div>
                <div className="bs-row"><span>Time</span><strong>{booking.time}</strong></div>
                <div className="bs-row"><span>Status</span><strong className="status-badge status-pending">Pending Confirmation</strong></div>
              </div>

              <p className="confirm-note">John will confirm your appointment shortly. You can track your bookings in <strong>My Bookings</strong>.</p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-primary" id="view-bookings-btn" onClick={() => { onClose(); navigate('/dashboard'); }}>
                  View My Bookings
                </button>
                <button className="btn btn-outline-dark" id="close-confirm-btn" onClick={onClose}>
                  Back to Home
                </button>
              </div>
            </div>
          )}

          {error && <div className="modal-error" role="alert">⚠️ {error}</div>}
        </div>

        {step < 3 && (
          <div className="modal-footer">
            {step > 0 && (
              <button className="btn btn-outline-dark" id="modal-back-btn" onClick={goBack}>← Back</button>
            )}
            <button
              className="btn btn-primary"
              id="modal-next-btn"
              onClick={handleNext}
              disabled={submitting}
            >
              {submitting ? 'Booking…' : step === 2 ? 'Confirm Booking' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
