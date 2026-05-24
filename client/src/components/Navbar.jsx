import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onBookNow }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = `navbar${scrolled ? ' scrolled' : ''}`;

  const scrollTo = (id) => {
    setMenuOpen(false);
    if (!isHome) return;
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className={navClass} id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" id="nav-logo-link">
          <span className="logo-initials">JDC</span>
          <span className="logo-text">John D'Cruz <span className="logo-bold">Gomes</span></span>
        </Link>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
          <li><a href="#about" className="nav-link" onClick={() => scrollTo('about')}>About</a></li>
          <li><a href="#services" className="nav-link" onClick={() => scrollTo('services')}>Services</a></li>
          <li><a href="#plans" className="nav-link" onClick={() => scrollTo('plans')}>Programs</a></li>
          <li><a href="#contact" className="nav-link" onClick={() => scrollTo('contact')}>Contact</a></li>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <li><Link to="/admin" className="nav-link nav-cta" id="nav-admin-btn">Admin ⚡</Link></li>
              ) : (
                <li><Link to="/dashboard" className="nav-link" id="nav-dashboard-btn">My Bookings</Link></li>
              )}
              <li>
                <button className="nav-link nav-cta" id="nav-logout-btn" onClick={logout}
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link" id="nav-login-btn">Login</Link></li>
              <li>
                <button className="nav-link nav-cta" id="nav-book-btn" onClick={() => { setMenuOpen(false); onBookNow?.(); }}>
                  Book Now
                </button>
              </li>
            </>
          )}
        </ul>

        <button className={`hamburger${menuOpen ? ' active' : ''}`} id="hamburger"
          aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
