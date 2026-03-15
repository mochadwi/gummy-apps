/**
 * Auth service
 * Handles parent/child account creation, linking, and token management
 */

import * as SecureStore from 'expo-secure-store';
import { AuthSession, Parent, Child, AuthError, Cohort } from '@types/index';

const TOKEN_KEY = 'flovey_token';
const REFRESH_TOKEN_KEY = 'flovey_refresh_token';

// In MVP: mock auth. Real implementation uses backend API
const MOCK_BACKEND_URL = 'http://localhost:3000';

export const authService = {
  /**
   * Parent registration with email/password
   */
  async registerParent(email: string, password: string): Promise<{ parent: Parent; session: AuthSession }> {
    try {
      // Mock: In real app, POST to /auth/parent/register
      const parentId = this.generateId();
      const parent: Parent = {
        id: parentId,
        role: 'parent',
        email,
        children: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const session = this.createSession(parentId, 'parent');
      await this.saveSession(session);
      
      return { parent, session };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Parent login
   */
  async loginParent(email: string, password: string): Promise<{ parent: Parent; session: AuthSession }> {
    try {
      // Mock: In real app, POST to /auth/parent/login
      const parentId = this.generateId();
      const parent: Parent = {
        id: parentId,
        role: 'parent',
        email,
        children: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const session = this.createSession(parentId, 'parent');
      await this.saveSession(session);
      
      return { parent, session };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Add child to parent's account
   */
  async addChild(
    parentId: string,
    name: string,
    age: number,
    cohort: Cohort,
    profilePhoto?: string
  ): Promise<Child> {
    try {
      const childId = this.generateId();
      const child: Child = {
        id: childId,
        role: 'child',
        name,
        age,
        cohort,
        parentIds: [parentId],
        profilePhoto,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // In real app: POST /families/{familyId}/children
      return child;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Child login with PIN (parent-set)
   */
  async loginChildWithPin(childId: string, pin: string): Promise<{ child: Child; session: AuthSession }> {
    try {
      // Mock: In real app, POST to /auth/child/login with PIN verification
      const child: Child = {
        id: childId,
        role: 'child',
        name: 'Mock Child',
        age: 8,
        cohort: 'seedling',
        parentIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      const session = this.createSession(childId, 'child');
      await this.saveSession(session);
      
      return { child, session };
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Restore session from secure storage
   */
  async restoreSession(): Promise<AuthSession | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) return null;
      
      // Parse and validate token
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp < Date.now() / 1000) {
        await this.clearSession();
        return null;
      }
      
      return JSON.parse(token);
    } catch {
      return null;
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthSession> {
    try {
      // Mock: In real app, POST to /auth/refresh
      const session = this.createSession(this.generateId(), 'parent');
      await this.saveSession(session);
      return session;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    try {
      await this.clearSession();
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Helpers

  private createSession(userId: string, role: 'parent' | 'child'): AuthSession {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
    return {
      userId,
      role,
      accessToken: `mock_token_${userId}`,
      refreshToken: `mock_refresh_${userId}`,
      expiresAt,
    };
  },

  private async saveSession(session: AuthSession): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(session));
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
  },

  private async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },

  private handleError(error: unknown): AuthError {
    if (error instanceof Error) {
      return {
        code: 'AUTH_ERROR',
        message: error.message,
        details: error,
      };
    }
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: error,
    };
  },
};
