// ─────────────────────────────────────────────────────
//  AuthContext — Global Auth State
//  Stores user + token across the whole app.
//  Persists login to localStorage so user stays logged in
//  even after refreshing the page.
//
//  Usage:
//    const { user, token, login, logout } = useAuth();
// ─────────────────────────────────────────────────────

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Load saved user from localStorage on first render
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('xsola_user')); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('xsola_token'));

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('xsola_user',  JSON.stringify(userData));
    localStorage.setItem('xsola_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('xsola_user');
    localStorage.removeItem('xsola_token');
  };

  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this anywhere in your app
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}