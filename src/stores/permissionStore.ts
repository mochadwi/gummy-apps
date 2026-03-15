/**
 * Permission state management
 * Determines what actions a parent can take for each child
 */

import { create } from 'zustand';
import { ChildPermission } from '@types/index';

interface PermissionStore {
  permissions: Map<string, ChildPermission[]>; // childId -> permissions
  
  // Actions
  setPermissions: (childId: string, permissions: ChildPermission[]) => void;
  hasPermission: (childId: string, permission: ChildPermission) => boolean;
  clearPermissions: (childId: string) => void;
}

const DEFAULT_PARENT_PERMISSIONS: ChildPermission[] = [
  'view_tasks',
  'approve_task_completion',
  'create_task',
  'view_goals',
  'create_goal',
  'view_portfolio',
  'create_challenge',
  'manage_notifications',
  'manage_settings',
];

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  permissions: new Map(),
  
  setPermissions: (childId, permissions) => {
    set((state) => {
      const newPermissions = new Map(state.permissions);
      newPermissions.set(childId, permissions);
      return { permissions: newPermissions };
    });
  },
  
  hasPermission: (childId, permission) => {
    const { permissions } = get();
    return permissions.get(childId)?.includes(permission) ?? false;
  },
  
  clearPermissions: (childId) => {
    set((state) => {
      const newPermissions = new Map(state.permissions);
      newPermissions.delete(childId);
      return { permissions: newPermissions };
    });
  },
}));

/**
 * Initialize default permissions for a parent-child relationship
 */
export function initializeParentPermissions(childId: string): void {
  usePermissionStore.setState((state) => {
    const newPermissions = new Map(state.permissions);
    newPermissions.set(childId, DEFAULT_PARENT_PERMISSIONS);
    return { permissions: newPermissions };
  });
}

/**
 * Grant specific permission to a parent for a child
 */
export function grantPermission(childId: string, permission: ChildPermission): void {
  usePermissionStore.setState((state) => {
    const newPermissions = new Map(state.permissions);
    const existing = newPermissions.get(childId) ?? [];
    if (!existing.includes(permission)) {
      newPermissions.set(childId, [...existing, permission]);
    }
    return { permissions: newPermissions };
  });
}

/**
 * Revoke specific permission from a parent for a child
 */
export function revokePermission(childId: string, permission: ChildPermission): void {
  usePermissionStore.setState((state) => {
    const newPermissions = new Map(state.permissions);
    const existing = newPermissions.get(childId) ?? [];
    newPermissions.set(childId, existing.filter((p) => p !== permission));
    return { permissions: newPermissions };
  });
}
