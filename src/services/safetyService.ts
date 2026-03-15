/**
 * Safety service
 * Manages child safety guardrails, privacy, and data compliance
 */

import { useSafetyStore } from '@stores/safetyStore';
import {
  SafetyGuardrail,
  ActivityLog,
  DataExport,
  DeletionRequest,
  ConsentRecord,
} from '@types/safety';

export const safetyService = {
  /**
   * Record consent to privacy policy
   */
  recordConsent(userId: string, policyId: string, ipAddress?: string, userAgent?: string): ConsentRecord {
    const consent: ConsentRecord = {
      id: this.generateId(),
      userId,
      policyId,
      consentedAt: Date.now(),
      ipAddress,
      userAgent,
    };
    
    useSafetyStore.getState().recordConsent(consent);
    return consent;
  },

  /**
   * Check if user has consented to a policy
   */
  hasConsented(userId: string, policyId: string): boolean {
    return useSafetyStore.getState().hasConsent(userId, policyId);
  },

  /**
   * Create or update a safety guardrail for a child
   */
  setGuardrail(
    childId: string,
    type: 'spend_limit' | 'screen_time' | 'content_filter' | 'notification_control',
    value: number | string,
    parentId: string
  ): SafetyGuardrail {
    const existing = useSafetyStore.getState().checkGuardrail(childId, type);
    
    if (existing) {
      useSafetyStore.getState().updateGuardrail(existing.id, {
        value,
        updatedBy: parentId,
      });
      return { ...existing, value, updatedBy: parentId };
    }
    
    const guardrail: SafetyGuardrail = {
      id: this.generateId(),
      childId,
      type,
      enabled: true,
      value,
      createdAt: Date.now(),
      updatedBy: parentId,
    };
    
    useSafetyStore.getState().addGuardrail(guardrail);
    return guardrail;
  },

  /**
   * Disable a guardrail
   */
  disableGuardrail(childId: string, type: string, parentId: string): void {
    const guardrail = useSafetyStore.getState().checkGuardrail(childId, type);
    if (guardrail) {
      useSafetyStore.getState().updateGuardrail(guardrail.id, {
        enabled: false,
        updatedBy: parentId,
      });
    }
  },

  /**
   * Check if a guardrail is enforced
   */
  isGuardrailEnforced(childId: string, type: string): boolean {
    const guardrail = useSafetyStore.getState().checkGuardrail(childId, type);
    return guardrail?.enabled ?? false;
  },

  /**
   * Get guardrail value
   */
  getGuardrailValue(childId: string, type: string): number | string | null {
    const guardrail = useSafetyStore.getState().checkGuardrail(childId, type);
    return guardrail?.value ?? null;
  },

  /**
   * Log activity (for audit trail and parental visibility)
   */
  logActivity(
    childId: string,
    action: string,
    details: Record<string, unknown> = {},
    visibleToParent: boolean = true
  ): ActivityLog {
    const log: ActivityLog = {
      id: this.generateId(),
      childId,
      action,
      details,
      timestamp: Date.now(),
      visibleToParent,
    };
    
    useSafetyStore.getState().logActivity(log);
    return log;
  },

  /**
   * Get parent-visible activity logs for a child
   */
  getParentVisibleLogs(childId: string): ActivityLog[] {
    return useSafetyStore.getState().getParentVisibleLogs(childId);
  },

  /**
   * Request data export (GDPR compliance)
   */
  requestDataExport(childId: string, parentId: string, format: 'json' | 'csv'): DataExport {
    const dataExport: DataExport = {
      id: this.generateId(),
      childId,
      requestedAt: Date.now(),
      requestedBy: parentId,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      format,
      status: 'pending',
    };
    
    useSafetyStore.getState().createDataExport(dataExport);
    return dataExport;
  },

  /**
   * Request account deletion (30-day grace period)
   */
  requestAccountDeletion(childId: string, parentId: string): DeletionRequest {
    const request: DeletionRequest = {
      id: this.generateId(),
      childId,
      requestedAt: Date.now(),
      requestedBy: parentId,
      scheduledDeletionAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      status: 'pending',
    };
    
    useSafetyStore.getState().createDeletionRequest(request);
    
    // Log this sensitive action
    this.logActivity(childId, 'deletion_request_created', { parentId }, false);
    
    return request;
  },

  /**
   * Confirm account deletion (after 30-day period)
   */
  confirmAccountDeletion(requestId: string): void {
    useSafetyStore.getState().confirmDeletion(requestId);
    // In real app: trigger data deletion job
  },

  /**
   * Check if account is scheduled for deletion
   */
  isScheduledForDeletion(childId: string): boolean {
    const requests = useSafetyStore.getState().getDeletionRequests(childId);
    return requests.some((r) => r.status !== 'cancelled');
  },

  /**
   * Get recent activity summary for parent dashboard
   */
  getActivitySummary(
    childId: string,
    daysBack: number = 7
  ): {
    totalActions: number;
    actionsByType: Record<string, number>;
    lastActivity?: ActivityLog;
  } {
    const logs = useSafetyStore.getState().getParentVisibleLogs(childId);
    const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
    
    const filtered = logs.filter((log) => log.timestamp >= cutoff);
    
    const actionsByType: Record<string, number> = {};
    filtered.forEach((log) => {
      actionsByType[log.action] = (actionsByType[log.action] ?? 0) + 1;
    });
    
    return {
      totalActions: filtered.length,
      actionsByType,
      lastActivity: filtered[filtered.length - 1],
    };
  },

  // Helpers

  private generateId(): string {
    return `safety_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
