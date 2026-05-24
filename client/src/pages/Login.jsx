import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect');

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect === 'book' ? '/?book=1' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span className="logo-initials">JDC</span>
          <span className="logo-text">John D Cruz</span>
        </Link>
        <div className="auth-hero-text">
          <h1>Welcome Back</h1>
          <p>Login to manage your appointments with John D Cruz — Counselor &amp; Public Servant.</p>
        </div>
        <div className="auth-decorative">
          <div className="dec-circle dec-1" />
          <div className="dec-circle dec-2" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Sign In</h2>
          <p className="auth-sub">Don't have an account? <Link to="/signup" id="signup-link">Sign up</Link></p>

          {/* Demo credentials */}
          <div className="demo-box">
            <strong>👤 Demo Client:</strong> Register a new account<br/>
            <strong>⚡ Admin:</strong> john@johndcruz.com / admin123
          </div>

          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input id="login-email" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>

            {error && <div className="auth-error" role="alert">⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary btn-full" id="login-submit-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
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
