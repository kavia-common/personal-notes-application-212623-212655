import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

// Keys for local storage
const TOKEN_KEY = 'notesapp_token';
const USER_KEY = 'notesapp_user';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access Auth context (user, token, login, register, logout) */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions to children. */
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState('');

  // Verify token on mount if present
  useEffect(() => {
    let isActive = true;
    async function verify() {
      if (!token) return;
      setLoading(true);
      try {
        const { data } = await api.me(token);
        if (isActive) {
          setUser(data || null);
          setError('');
        }
      } catch (e) {
        if (isActive) {
          setUser(null);
          setToken('');
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }
    verify();
    return () => { isActive = false; };
  }, [token]);

  const saveAuth = useCallback((tok, usr) => {
    setToken(tok || '');
    setUser(usr || null);
    if (tok) localStorage.setItem(TOKEN_KEY, tok); else localStorage.removeItem(TOKEN_KEY);
    if (usr) localStorage.setItem(USER_KEY, JSON.stringify(usr)); else localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(async (email, password) => {
    setError('');
    const { data } = await api.login(email, password);
    const tok = data?.access_token || data?.token || '';
    const meRes = await api.me(tok);
    saveAuth(tok, meRes.data);
    return meRes.data;
  }, [saveAuth]);

  const register = useCallback(async (email, password) => {
    setError('');
    const { data } = await api.register(email, password);
    const tok = data?.access_token || data?.token || '';
    const meRes = await api.me(tok);
    saveAuth(tok, meRes.data);
    return meRes.data;
  }, [saveAuth]);

  const logout = useCallback(() => {
    saveAuth('', null);
  }, [saveAuth]);

  const value = useMemo(() => ({
    user, token, loading, error, setError, login, register, logout,
  }), [user, token, loading, error, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function RequireAuth({ children, fallback = null }) {
  /** Renders children if authenticated; otherwise renders fallback (e.g., <Navigate/>) */
  const { token, loading } = useAuth();
  if (loading) return null;
  if (!token) return fallback;
  return children;
}
