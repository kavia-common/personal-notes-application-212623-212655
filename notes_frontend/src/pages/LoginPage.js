import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form to authenticate the user. */
  const { login, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/notes');
    } catch (ex) {
      setErr(ex.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="nv-app">
      <Header />
      <main className="nv-main auth">
        <div className="nv-card nv-auth-card">
          <h1 className="nv-title">Welcome back</h1>
          <p className="nv-subtitle">Sign in to continue to Ocean Notes</p>
          {err && <div className="nv-alert nv-alert-error" role="alert">{err}</div>}
          <form onSubmit={submit} className="nv-form">
            <label className="nv-label">
              Email
              <input className="nv-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="nv-label">
              Password
              <input className="nv-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button className="nv-btn nv-btn-primary nv-btn-full" type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="nv-auth-alt">
            New here? <Link to="/register" className="nv-link">Create an account</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
