/**
 * useAuth hook
 * Provides auth state and actions to components
 */

import { useEffect } from 'react';
import { useAuthStore } from '@stores/authStore';
import { authService } from '@services/authService';
import { AuthSession, Parent, Child } from '@types/index';

export function useAuth() {
  const { session, user, isLoading, error, setSession, setUser, setLoading, setError, clearAuth } =
    useAuthStore();

  // Restore session on app launch
  useEffect(() => {
    bootstrapAuth();
  }, []);

  async function bootstrapAuth() {
    setLoading(true);
    try {
      const session = await authService.restoreSession();
      if (session) {
        setSession(session);
        // In real app: fetch user details from API
      }
    } catch (err) {
      console.error('Bootstrap failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loginParent(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { parent, session } = await authService.loginParent(email, password);
      setSession(session);
      setUser(parent);
    } catch (err) {
      const error = err instanceof Error ? { code: 'LOGIN_ERROR', message: err.message } : null;
      setError(error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function registerParent(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { parent, session } = await authService.registerParent(email, password);
      setSession(session);
      setUser(parent);
    } catch (err) {
      const error = err instanceof Error ? { code: 'REGISTER_ERROR', message: err.message } : null;
      setError(error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginChild(childId: string, pin: string) {
    setLoading(true);
    setError(null);
    try {
      const { child, session } = await authService.loginChildWithPin(childId, pin);
      setSession(session);
      setUser(child);
    } catch (err) {
      const error = err instanceof Error ? { code: 'LOGIN_ERROR', message: err.message } : null;
      setError(error);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await authService.logout();
      clearAuth();
    } finally {
      setLoading(false);
    }
  }

  return {
    session,
    user,
    isLoading,
    error,
    isAuthenticated: session?.expiresAt ? session.expiresAt > Date.now() : false,
    isParent: user?.role === 'parent',
    isChild: user?.role === 'child',
    loginParent,
    registerParent,
    loginChild,
    logout,
  };
}
