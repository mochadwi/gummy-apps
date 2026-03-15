/**
 * Analytics and instrumentation domain model
 */

export type EventCategory = 'engagement' | 'feature' | 'performance' | 'error' | 'conversion';

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  category: EventCategory;
  userId?: string;
  childId?: string;
  parentId?: string;
  properties: Record<string, unknown>;
  timestamp: number;
  sessionId?: string;
  platform?: 'ios' | 'android' | 'web';
}

export interface SessionMetrics {
  sessionId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  durationMs: number;
  eventCount: number;
  screensVisited: string[];
  tasksCompleted: number;
  errorsEncountered: number;
}

export interface BetaFeedback {
  id: string;
  userId: string;
  rating: number; // 1-5
  feedback: string;
  category: 'bug' | 'feature_request' | 'ux_feedback' | 'general';
  attachments?: string[]; // screenshot URLs
  submittedAt: number;
}

export interface BetaPilotChecklist {
  id: string;
  familyId: string;
  createdAt: number;
  items: BetaChecklistItem[];
  status: 'in_progress' | 'completed' | 'failed';
  completedAt?: number;
}

export interface BetaChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'core_flow' | 'safety' | 'performance' | 'ux';
  completed: boolean;
  completedAt?: number;
  notes?: string;
  evidenceUrl?: string;
}

export interface FeatureUsageMetrics {
  featureName: string;
  adoptionRate: number; // percentage of users
  usageCount: number;
  lastUsedAt: number;
  averageSessionsPerUser: number;
  conversionRate?: number; // if applicable
}

export interface CohortAnalysis {
  cohort: 'seedling' | 'navigator';
  totalUsers: number;
  activeUsers: number;
  avgTasksPerChild: number;
  avgCoinsEarned: number;
  avgGoalsCompleted: number;
  retentionRate: number; // percentage
}
