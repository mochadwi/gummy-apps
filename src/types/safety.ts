/**
 * Safety and privacy domain model
 */

export type ConsentLevel = 'no_consent' | 'parental_consent_only' | 'parental_and_child_consent';

export interface PrivacyPolicy {
  id: string;
  version: string;
  effectiveDate: number;
  content: string; // markdown
  requiresConsent: boolean;
}

export interface ConsentRecord {
  id: string;
  userId: string; // parent or child
  policyId: string;
  consentedAt: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface SafetyGuardrail {
  id: string;
  childId: string;
  type: 'spend_limit' | 'screen_time' | 'content_filter' | 'notification_control';
  enabled: boolean;
  value: number | string; // e.g., max coins per week, max notifications per day
  createdAt: number;
  updatedBy: string; // parent ID
}

export interface DataExport {
  id: string;
  childId: string;
  requestedAt: number;
  requestedBy: string; // parent ID
  completedAt?: number;
  expiresAt: number;
  format: 'json' | 'csv';
  status: 'pending' | 'completed' | 'expired';
}

export interface DeletionRequest {
  id: string;
  childId: string;
  requestedAt: number;
  requestedBy: string; // parent ID
  scheduledDeletionAt: number; // 30-day delay for safety
  confirmedAt?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ActivityLog {
  id: string;
  childId: string;
  action: string; // e.g., 'task_completed', 'goal_created', 'challenge_started'
  details: Record<string, unknown>;
  timestamp: number;
  visibleToParent: boolean; // false for highly sensitive logs
}
