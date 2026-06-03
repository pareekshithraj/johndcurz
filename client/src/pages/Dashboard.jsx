import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { openGoogleForm } from '../siteConfig';

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    api.get('/appointments/my')
      .then((r) => setAppointments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const upcoming = appointments.filter((a) => a.status !== 'cancelled' && a.status !== 'completed' && new Date(a.date) >= new Date());
  const past = appointments.filter((a) => a.status === 'completed' || new Date(a.date) < new Date());
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div className="dashboard-page">
      <nav className="dash-nav">
        <Link to="/" className="nav-logo" id="dash-logo-link">
          <span className="logo-initials">JDG</span>
          <span className="logo-text">John D Cruz</span>
        </Link>
        <div className="dash-nav-right">
          <span className="dash-username">Hi {user.name}</span>
          <button className="btn-logout" id="dash-logout-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>
      </nav>

      <div className="dash-container">
        <div className="dash-header">
          <div>
            <h1>My Appointments</h1>
            <p>Track and manage your sessions with John</p>
          </div>
          <Link
            to="/"
            className="btn btn-primary"
            id="book-new-btn"
            onClick={(e) => {
              e.preventDefault();
              openGoogleForm();
            }}
          >
            + Book New Session
          </Link>
        </div>

        <div className="dash-stats">
          <div className="dash-stat-card" id="stat-total">
            <div className="dsc-icon">📅</div>
            <div className="dsc-val">{appointments.length}</div>
            <div className="dsc-label">Total Bookings</div>
          </div>
          <div className="dash-stat-card" id="stat-upcoming">
            <div className="dsc-icon">⏰</div>
            <div className="dsc-val">{upcoming.length}</div>
            <div className="dsc-label">Upcoming</div>
          </div>
          <div className="dash-stat-card" id="stat-completed">
            <div className="dsc-icon">✅</div>
            <div className="dsc-val">{past.length}</div>
            <div className="dsc-label">Completed</div>
          </div>
          <div className="dash-stat-card" id="stat-cancelled">
            <div className="dsc-icon">❌</div>
            <div className="dsc-val">{cancelled.length}</div>
            <div className="dsc-label">Cancelled</div>
          </div>
        </div>

        {loading ? (
          <div className="dash-loading"><div className="loading-spinner" /></div>
        ) : appointments.length === 0 ? (
          <div className="dash-empty" id="no-appointments">
            <div className="empty-icon">📋</div>
            <h3>No appointments yet</h3>
            <p>Open the Google Form to request your first session.</p>
            <Link
              to="/"
              className="btn btn-primary"
              id="book-first-btn"
              onClick={(e) => {
                e.preventDefault();
                openGoogleForm();
              }}
            >
              Open Google Form
            </Link>
          </div>
        ) : (
          <div className="appointments-list" id="appointments-list">
            {appointments.map((a) => (
              <div key={a.id} className="appt-card" id={`appt-${a.id}`}>
                <div className="appt-left">
                  <div className="appt-plan">{a.plan_name}</div>
                  <div className="appt-datetime">
                    {new Date(`${a.date}T12:00:00`).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {'  '}at {a.time}
                  </div>
                  {a.notes && <div className="appt-notes">Notes: {a.notes}</div>}
                </div>
                <div className="appt-right">
                  {a.plan_price > 0 && <div className="appt-price">₹{a.plan_price.toLocaleString('en-IN')}</div>}
                  <div className="appt-status" style={{ color: STATUS_COLORS[a.status] || '#999' }}>
                    ● {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </div>
                  <div className="appt-id">#{a.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
