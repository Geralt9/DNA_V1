import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { userService } from '../services/userService.js';

const AuthContext = createContext(null);

/**
 * status: 'checking' (restoring a session on boot) | 'authenticated' | 'anonymous'
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let alive = true;
    // TODO(backend): with the real API this becomes "refresh, then /auth/me".
    authService
      .me()
      .then((session) => {
        if (!alive) return;
        if (session) {
          setUser(session.user);
          setToken(session.token);
          setStatus('authenticated');
        } else setStatus('anonymous');
      })
      .catch(() => alive && setStatus('anonymous'));
    return () => {
      alive = false;
    };
  }, []);

  const accept = useCallback(({ user: u, token: t }) => {
    setUser(u);
    setToken(t);
    setStatus('authenticated');
    return u;
  }, []);

  const login = useCallback((credentials) => authService.login(credentials).then(accept), [accept]);
  const signup = useCallback((details) => authService.signup(details).then(accept), [accept]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setStatus('anonymous');
    }
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const updated = await userService.updateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({ user, token, status, isAuthenticated: status === 'authenticated', login, signup, logout, updateProfile }),
    [user, token, status, login, signup, logout, updateProfile],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
