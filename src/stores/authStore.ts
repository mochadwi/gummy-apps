/**
 * Auth state management using Zustand
 * Handles parent/child auth, token storage, and permission checks
 */

import { create } from 'zustand';
import { AuthSession, Child, Parent, AuthError } from '@types/index';

interface AuthStore {
  session: AuthSession | null;
  user: Parent | Child | null;
  isLoading: boolean;
  error: AuthError | null;
  
  // Auth actions
  setSession: (session: AuthSession) => void;
  setUser: (user: Parent | Child) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AuthError | null) => void;
  
  // Selectors
  isAuthenticated: () => boolean;
  isParent: () => boolean;
  isChild: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  user: null,
  isLoading: false,
  error: null,
  
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ session: null, user: null, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  isAuthenticated: () => {
    const { session } = get();
    if (!session) return false;
    return session.expiresAt > Date.now();
  },
  
  isParent: () => get().user?.role === 'parent',
  isChild: () => get().user?.role === 'child',
}));
