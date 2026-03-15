/**
 * Core domain models for Flovey
 */

export type Cohort = 'seedling' | 'navigator'; // 6-9 vs 10-14

export interface User {
  id: string;
  role: 'parent' | 'child';
  email?: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Parent extends User {
  role: 'parent';
  email: string;
  children: string[]; // child IDs
}

export interface Child extends User {
  role: 'child';
  name: string;
  age: number;
  cohort: Cohort;
  parentIds: string[]; // parent IDs
  profilePhoto?: string;
}

export interface FamilyAccount {
  id: string;
  parentIds: string[];
  childIds: string[];
  createdAt: number;
}

export interface AccountLink {
  id: string;
  parentId: string;
  childId: string;
  role: 'primary_parent' | 'co_parent';
  permissions: ChildPermission[];
  linkedAt: number;
}

export type ChildPermission =
  | 'view_tasks'
  | 'approve_task_completion'
  | 'create_task'
  | 'view_goals'
  | 'create_goal'
  | 'view_portfolio'
  | 'create_challenge'
  | 'manage_notifications'
  | 'manage_settings';

export interface AuthSession {
  userId: string;
  role: 'parent' | 'child';
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}
