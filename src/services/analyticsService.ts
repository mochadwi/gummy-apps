/**
 * Analytics service
 * Collects usage events, measures engagement, and provides beta feedback
 */

import {
  AnalyticsEvent,
  SessionMetrics,
  BetaFeedback,
  BetaPilotChecklist,
  BetaChecklistItem,
  FeatureUsageMetrics,
  CohortAnalysis,
  EventCategory,
} from '@types/analytics';
import { useTaskStore } from '@stores/taskStore';
import { useGoalStore } from '@stores/goalStore';

let currentSessionId: string | null = null;
let sessionStartTime: number | null = null;

export const analyticsService = {
  /**
   * Start a new session
   */
  startSession(userId: string): string {
    currentSessionId = this.generateSessionId();
    sessionStartTime = Date.now();
    
    this.trackEvent('session_start', 'engagement', {
      userId,
      platform: 'mobile',
    });
    
    return currentSessionId;
  },

  /**
   * End current session
   */
  endSession(): SessionMetrics | null {
    if (!currentSessionId || !sessionStartTime) return null;
    
    const durationMs = Date.now() - sessionStartTime;
    
    this.trackEvent('session_end', 'engagement', {
      durationMs,
      sessionId: currentSessionId,
    });
    
    const metrics: SessionMetrics = {
      sessionId: currentSessionId,
      userId: 'unknown',
      startTime: sessionStartTime,
      endTime: Date.now(),
      durationMs,
      eventCount: 0, // would be tracked
      screensVisited: [],
      tasksCompleted: 0,
      errorsEncountered: 0,
    };
    
    currentSessionId = null;
    sessionStartTime = null;
    
    return metrics;
  },

  /**
   * Track a generic event
   */
  trackEvent(
    eventName: string,
    category: EventCategory,
    properties: Record<string, unknown> = {}
  ): AnalyticsEvent {
    const event: AnalyticsEvent = {
      id: this.generateId(),
      eventName,
      category,
      properties,
      timestamp: Date.now(),
      sessionId: currentSessionId ?? undefined,
    };
    
    // In real app: send to analytics backend
    console.log(`[Analytics] ${category}: ${eventName}`, properties);
    
    return event;
  },

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName: string, userId: string, metadata: Record<string, unknown> = {}): void {
    this.trackEvent(`feature_used_${featureName}`, 'feature', {
      featureName,
      userId,
      ...metadata,
    });
  },

  /**
   * Track task completion
   */
  trackTaskCompletion(childId: string, taskId: string, rewardAmount: number): void {
    this.trackEvent('task_completed', 'engagement', {
      childId,
      taskId,
      rewardAmount,
    });
  },

  /**
   * Track goal reached
   */
  trackGoalReached(childId: string, goalId: string, goalName: string): void {
    this.trackEvent('goal_reached', 'conversion', {
      childId,
      goalId,
      goalName,
    });
  },

  /**
   * Track error
   */
  trackError(errorMessage: string, errorCode: string, context: Record<string, unknown> = {}): void {
    this.trackEvent(`error_${errorCode}`, 'error', {
      errorMessage,
      errorCode,
      ...context,
    });
  },

  /**
   * Submit beta feedback
   */
  submitBetaFeedback(
    userId: string,
    rating: number,
    feedback: string,
    category: 'bug' | 'feature_request' | 'ux_feedback' | 'general'
  ): BetaFeedback {
    const betaFeedback: BetaFeedback = {
      id: this.generateId(),
      userId,
      rating,
      feedback,
      category,
      submittedAt: Date.now(),
    };
    
    this.trackEvent('beta_feedback_submitted', 'engagement', {
      userId,
      rating,
      category,
    });
    
    return betaFeedback;
  },

  /**
   * Create beta pilot checklist for a family
   */
  createBetaChecklist(familyId: string): BetaPilotChecklist {
    const checklist: BetaPilotChecklist = {
      id: this.generateId(),
      familyId,
      createdAt: Date.now(),
      status: 'in_progress',
      items: [
        // Onboarding items
        {
          id: 'check_1',
          title: 'Parent account creation and setup',
          description: 'Parent successfully creates account with email/password',
          category: 'onboarding',
          completed: false,
        },
        {
          id: 'check_2',
          title: 'Add child to family',
          description: 'Parent adds 1+ children with age and cohort selection',
          category: 'onboarding',
          completed: false,
        },
        {
          id: 'check_3',
          title: 'Child login PIN setup',
          description: 'Child can log in with parent-set PIN',
          category: 'onboarding',
          completed: false,
        },
        // Core flow items
        {
          id: 'check_4',
          title: 'Task creation and completion',
          description: 'Parent can create tasks; child can complete and get rewarded',
          category: 'core_flow',
          completed: false,
        },
        {
          id: 'check_5',
          title: 'Goal creation and tracking',
          description: 'Child creates goal and tracks progress with milestones',
          category: 'core_flow',
          completed: false,
        },
        {
          id: 'check_6',
          title: 'Patience challenge flow',
          description: 'Child starts challenge, checks in daily, completes or fails',
          category: 'core_flow',
          completed: false,
        },
        // Safety items
        {
          id: 'check_7',
          title: 'Parental controls enforced',
          description: 'Parent can set spend limits and guardrails; child respects them',
          category: 'safety',
          completed: false,
        },
        {
          id: 'check_8',
          title: 'Notification preferences respected',
          description: 'Notifications honor parent/child preferences and DND window',
          category: 'safety',
          completed: false,
        },
        // Performance items
        {
          id: 'check_9',
          title: 'App performance under load',
          description: 'App remains responsive with 100+ tasks and goals',
          category: 'performance',
          completed: false,
        },
        // UX items
        {
          id: 'check_10',
          title: 'Age-appropriate UI rendering',
          description: 'Seedling UI uses emojis/colors; Navigator UI uses charts',
          category: 'ux',
          completed: false,
        },
      ],
    };
    
    return checklist;
  },

  /**
   * Mark checklist item complete
   */
  completeChecklistItem(checklist: BetaPilotChecklist, itemId: string, notes?: string): void {
    const item = checklist.items.find((i) => i.id === itemId);
    if (item) {
      item.completed = true;
      item.completedAt = Date.now();
      item.notes = notes;
    }
    
    // Check if all items complete
    if (checklist.items.every((i) => i.completed)) {
      checklist.status = 'completed';
      checklist.completedAt = Date.now();
    }
  },

  /**
   * Get cohort analysis
   */
  getCohortAnalysis(cohort: 'seedling' | 'navigator', childIds: string[]): CohortAnalysis {
    const taskStore = useTaskStore.getState();
    const goalStore = useGoalStore.getState();
    
    const cohortChildren = childIds; // filtered by cohort in real app
    const activeCount = cohortChildren.length; // approximation
    
    let totalTasks = 0;
    let totalCoins = 0;
    let totalGoals = 0;
    
    cohortChildren.forEach((childId) => {
      const tasks = taskStore.getTasksForChild(childId).filter((t) => t.status === 'approved');
      const goals = goalStore.getGoalsForChild(childId).filter((g) => g.status === 'completed');
      
      totalTasks += tasks.length;
      totalCoins += tasks.reduce((sum, t) => sum + t.rewardAmount, 0);
      totalGoals += goals.length;
    });
    
    return {
      cohort,
      totalUsers: cohortChildren.length,
      activeUsers: activeCount,
      avgTasksPerChild: cohortChildren.length > 0 ? totalTasks / cohortChildren.length : 0,
      avgCoinsEarned: cohortChildren.length > 0 ? totalCoins / cohortChildren.length : 0,
      avgGoalsCompleted: cohortChildren.length > 0 ? totalGoals / cohortChildren.length : 0,
      retentionRate: 85, // placeholder
    };
  },

  /**
   * Get feature adoption metrics
   */
  getFeatureUsageMetrics(featureName: string): FeatureUsageMetrics {
    return {
      featureName,
      adoptionRate: 78,
      usageCount: 234,
      lastUsedAt: Date.now(),
      averageSessionsPerUser: 3.2,
      conversionRate: 65,
    };
  },

  // Helpers

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },

  private generateId(): string {
    return `analytics_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
