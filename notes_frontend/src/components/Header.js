import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top navigation bar with app title, nav links, and logout. */
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="nv-header">
      <div className="nv-header-left">
        <span className="nv-logo" aria-label="Notes App">🗒️</span>
        <Link to="/notes" className="nv-brand">Ocean Notes</Link>
      </div>
      <nav className="nv-nav">
        {user ? (
          <>
            <Link className={`nv-link ${location.pathname.startsWith('/notes') ? 'active' : ''}`} to="/notes">My Notes</Link>
            <button className="nv-btn nv-btn-ghost" onClick={onLogout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <Link className={`nv-link ${location.pathname === '/login' ? 'active' : ''}`} to="/login">Login</Link>
            <Link className={`nv-link ${location.pathname === '/register' ? 'active' : ''}`} to="/register">Register</Link>
          </>
        )}
      </nav>
      {user && <div className="nv-user">👤 {user.email || user.name || 'User'}</div>}
    </header>
  );
}
