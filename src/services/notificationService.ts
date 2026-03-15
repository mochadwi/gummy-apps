/**
 * Notification service
 * Handles notifications, reminders, and notification preferences
 */

import { useNotificationStore } from '@stores/notificationStore';
import {
  Notification,
  ReminderPreferences,
  ScheduledReminder,
  NotificationType,
  NotificationChannel,
  ReminderFrequency,
  NotificationTemplate,
} from '@types/notification';

const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  task_assigned: {
    type: 'task_assigned',
    title: 'New task available!',
    bodyTemplate: '{{taskName}} is waiting for you. Earn {{reward}} coins!',
    defaultChannel: 'push',
  },
  task_completed: {
    type: 'task_completed',
    title: 'Great job!',
    bodyTemplate: 'You completed {{taskName}}! 🎉 +{{reward}} coins',
    defaultChannel: 'push',
  },
  goal_milestone: {
    type: 'goal_milestone',
    title: 'Milestone reached!',
    bodyTemplate: 'You\'re {{percentage}}% towards {{goalName}}!',
    defaultChannel: 'push',
  },
  challenge_invite: {
    type: 'challenge_invite',
    title: 'New challenge!',
    bodyTemplate: '{{challengeName}} - hold for {{days}} days to earn {{reward}} bonus coins',
    defaultChannel: 'push',
  },
  challenge_checkpoint_reminder: {
    type: 'challenge_checkpoint_reminder',
    title: 'Daily check-in reminder',
    bodyTemplate: 'Check in for {{challengeName}} to maintain your streak!',
    defaultChannel: 'push',
  },
  daily_digest: {
    type: 'daily_digest',
    title: 'Your daily summary',
    bodyTemplate: 'You earned {{coinsEarned}} coins, completed {{tasksCompleted}} tasks',
    defaultChannel: 'push',
  },
  goal_progress: {
    type: 'goal_progress',
    title: 'Goal progress',
    bodyTemplate: 'Weekly update: {{goalName}} is at {{percentage}}%',
    defaultChannel: 'push',
  },
  streak_milestone: {
    type: 'streak_milestone',
    title: 'Streak milestone!',
    bodyTemplate: '🔥 {{streakCount}}-day streak! Keep it up!',
    defaultChannel: 'push',
  },
  portfolio_update: {
    type: 'portfolio_update',
    title: 'Your portfolio updated',
    bodyTemplate: 'Portfolio value: {{value}} ({{changePercent}}%)',
    defaultChannel: 'push',
  },
};

export const notificationService = {
  /**
   * Send notification to user
   */
  sendNotification(
    userId: string,
    type: NotificationType,
    data: Record<string, unknown> = {},
    channel: NotificationChannel = 'push'
  ): Notification {
    const template = NOTIFICATION_TEMPLATES[type];
    
    // Render template with data
    const title = template.title;
    const body = this.renderTemplate(template.bodyTemplate, data);
    
    const notification: Notification = {
      id: this.generateId(),
      userId,
      type,
      title,
      body,
      sentAt: Date.now(),
      channel,
    };
    
    useNotificationStore.getState().addNotification(notification);
    
    // In real app: call native push notification API
    console.log(`[Notification] ${channel}: ${title} - ${body}`);
    
    return notification;
  },

  /**
   * Schedule a reminder for a specific time
   */
  scheduleReminder(
    userId: string,
    type: NotificationType,
    scheduledFor: number,
    data: Record<string, unknown> = {}
  ): ScheduledReminder {
    const reminder: ScheduledReminder = {
      id: this.generateId(),
      userId,
      type,
      scheduledFor,
      triggerData: data,
      failedAttempts: 0,
      status: 'pending',
    };
    
    useNotificationStore.getState().scheduleReminder(reminder);
    return reminder;
  },

  /**
   * Set or update notification preferences
   */
  setPreferences(userId: string, preferences: Partial<ReminderPreferences>): ReminderPreferences {
    const existing = useNotificationStore.getState().getPreferences(userId);
    
    const updated: ReminderPreferences = {
      id: existing?.id ?? this.generateId(),
      userId,
      taskAssignedNotification: preferences.taskAssignedNotification ?? existing?.taskAssignedNotification ?? true,
      taskCompletedNotification: preferences.taskCompletedNotification ?? existing?.taskCompletedNotification ?? true,
      goalProgressNotification: preferences.goalProgressNotification ?? existing?.goalProgressNotification ?? 'weekly',
      challengeReminders: preferences.challengeReminders ?? existing?.challengeReminders ?? 'daily',
      dailyDigestTime: preferences.dailyDigestTime ?? existing?.dailyDigestTime,
      streakMilestoneNotification: preferences.streakMilestoneNotification ?? existing?.streakMilestoneNotification ?? true,
      portfolioUpdateFrequency: preferences.portfolioUpdateFrequency ?? existing?.portfolioUpdateFrequency ?? 'daily',
      doNotDisturbStart: preferences.doNotDisturbStart ?? existing?.doNotDisturbStart,
      doNotDisturbEnd: preferences.doNotDisturbEnd ?? existing?.doNotDisturbEnd,
      channels: preferences.channels ?? existing?.channels ?? ['push'],
      updatedAt: Date.now(),
    };
    
    useNotificationStore.getState().setPreferences(updated);
    return updated;
  },

  /**
   * Get notification preferences
   */
  getPreferences(userId: string): ReminderPreferences | null {
    return useNotificationStore.getState().getPreferences(userId);
  },

  /**
   * Check if notification is allowed based on preferences
   */
  isNotificationAllowed(userId: string, type: NotificationType): boolean {
    const prefs = this.getPreferences(userId);
    if (!prefs) return true; // default to allow
    
    switch (type) {
      case 'task_assigned':
        return prefs.taskAssignedNotification;
      case 'task_completed':
        return prefs.taskCompletedNotification;
      case 'goal_milestone':
      case 'goal_progress':
        return prefs.goalProgressNotification !== 'never';
      case 'challenge_invite':
      case 'challenge_checkpoint_reminder':
        return prefs.challengeReminders !== 'never';
      case 'streak_milestone':
        return prefs.streakMilestoneNotification;
      case 'portfolio_update':
        return prefs.portfolioUpdateFrequency !== 'never';
      default:
        return true;
    }
  },

  /**
   * Check if user is in do-not-disturb window
   */
  isInDND(userId: string): boolean {
    const prefs = this.getPreferences(userId);
    if (!prefs || !prefs.doNotDisturbStart || !prefs.doNotDisturbEnd) return false;
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    return currentTime >= prefs.doNotDisturbStart && currentTime <= prefs.doNotDisturbEnd;
  },

  /**
   * Get unread notifications count
   */
  getUnreadCount(userId: string): number {
    const notifications = useNotificationStore.getState().getNotifications(userId);
    return notifications.filter((n) => !n.readAt).length;
  },

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    useNotificationStore.getState().markAsRead(notificationId);
  },

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): void {
    useNotificationStore.getState().deleteNotification(notificationId);
  },

  /**
   * Process pending scheduled reminders (run periodically)
   */
  processPendingReminders(): void {
    const store = useNotificationStore.getState();
    const now = Date.now();
    
    for (const [userId, reminders] of store.scheduledReminders) {
      reminders.forEach((reminder) => {
        if (
          reminder.status === 'pending' &&
          reminder.scheduledFor <= now &&
          this.isNotificationAllowed(userId, reminder.type) &&
          !this.isInDND(userId)
        ) {
          this.sendNotification(userId, reminder.type, reminder.triggerData);
          store.updateReminderStatus(reminder.id, 'sent');
        }
      });
    }
  },

  /**
   * Schedule daily digest for user
   */
  scheduleDailyDigest(userId: string, dailyTime: string): void {
    const [hours, minutes] = dailyTime.split(':').map(Number);
    const today = new Date();
    const digestTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
    
    // If time has passed today, schedule for tomorrow
    if (digestTime.getTime() < Date.now()) {
      digestTime.setDate(digestTime.getDate() + 1);
    }
    
    this.scheduleReminder(userId, 'daily_digest', digestTime.getTime(), {
      dailyTime,
    });
  },

  // Helpers

  private renderTemplate(template: string, data: Record<string, unknown>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(data[key] ?? match);
    });
  },

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  },
};
