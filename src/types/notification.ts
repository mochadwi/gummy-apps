/**
 * Notification and reminder domain model
 */

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'goal_milestone'
  | 'challenge_invite'
  | 'challenge_checkpoint_reminder'
  | 'daily_digest'
  | 'goal_progress'
  | 'streak_milestone'
  | 'portfolio_update';

export type NotificationChannel = 'push' | 'email' | 'in_app';
export type ReminderFrequency = 'never' | 'daily' | 'weekly' | 'on_event';

export interface Notification {
  id: string;
  userId: string; // parent or child
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: string; // app navigation
  imageUrl?: string;
  sentAt: number;
  readAt?: number;
  channel: NotificationChannel;
}

export interface ReminderPreferences {
  id: string;
  userId: string;
  taskAssignedNotification: boolean;
  taskCompletedNotification: boolean;
  goalProgressNotification: ReminderFrequency;
  challengeReminders: ReminderFrequency;
  dailyDigestTime?: string; // HH:mm format, e.g., "19:00"
  streakMilestoneNotification: boolean;
  portfolioUpdateFrequency: ReminderFrequency;
  doNotDisturbStart?: string; // HH:mm
  doNotDisturbEnd?: string; // HH:mm
  channels: NotificationChannel[];
  updatedAt: number;
}

export interface ScheduledReminder {
  id: string;
  userId: string;
  type: NotificationType;
  scheduledFor: number;
  triggerData: Record<string, unknown>;
  sentAt?: number;
  failedAttempts: number;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
}

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  bodyTemplate: string; // template with {{placeholders}}
  icon?: string;
  defaultChannel: NotificationChannel;
  actionUrl?: string;
}
