import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', {
        name: form.name, email: form.email, phone: form.phone, password: form.password
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span className="logo-initials">JDG</span>
          <span className="logo-text">John D Cruz</span>
        </Link>
        <div className="auth-hero-text">
          <h1>Join Our Community</h1>
          <p>Create an account to book appointments, track your sessions, and get personalized support from John D Cruz.</p>
        </div>
        <div className="auth-decorative">
          <div className="dec-circle dec-1" />
          <div className="dec-circle dec-2" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Create Account</h2>
          <p className="auth-sub">Already have an account? <Link to="/login" id="login-link">Sign in</Link></p>

          <form onSubmit={handleSubmit} id="signup-form">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input id="signup-name" type="text" placeholder="Your full name" required
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input id="signup-email" type="email" placeholder="you@example.com" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="signup-phone">Phone Number</label>
                <input id="signup-phone" type="tel" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input id="signup-password" type="password" placeholder="Min. 6 characters" required
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="form-group">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <input id="signup-confirm" type="password" placeholder="Repeat password" required
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
            </div>

            {error && <div className="auth-error" role="alert">⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary btn-full" id="signup-submit-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-back">
            <Link to="/" id="back-home-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
