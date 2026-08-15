import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // true = checking session

  useEffect(() => {
    // Clean up OAuth redirect query params immediately
    const params = new URLSearchParams(window.location.search);
    if (params.has('authenticated') || params.has('code') || params.has('state')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Restore session from HttpOnly session cookie
    ApiService.getCurrentUser()
      .then((res) => {
        if (res?.success && res.data?.user) {
          setUser(res.data.user);
          setProfile(res.data.profile || null);
        }
      })
      .catch(() => {
        // Not logged in — that's fine
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await ApiService.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, profile, setProfile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
