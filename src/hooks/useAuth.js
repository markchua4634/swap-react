import { useState, useEffect } from 'react';
import { auth, getAccessToken } from '../api/base44';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // Token exists — set it and fetch current user
      auth.setToken(token);
      const me = await auth.me();
      setUser(me);
    } catch (e) {
      // Token invalid/expired
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { access_token, user } = await auth.loginViaEmailPassword(email, password);
    setUser(user);
    return user;
  };

  const loginWithGoogle = () => {
    auth.loginWithProvider('google', window.location.href);
  };

  const logout = () => {
    auth.logout(window.location.href);
    setUser(null);
  };

  const register = async (email, password, full_name) => {
    const res = await auth.register({ email, password, full_name });
    return res;
  };

  return { user, loading, login, loginWithGoogle, logout, register, refreshUser: checkAuth };
}
