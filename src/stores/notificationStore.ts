/**
 * Notification state management
 */

import { create } from 'zustand';
import { Notification, ReminderPreferences, ScheduledReminder } from '@types/notification';

interface NotificationStore {
  notifications: Map<string, Notification[]>; // userId -> notifications
  preferences: Map<string, ReminderPreferences>; // userId -> preferences
  scheduledReminders: Map<string, ScheduledReminder[]>; // userId -> scheduled reminders
  
  // Notification actions
  addNotification: (notification: Notification) => void;
  getNotifications: (userId: string) => Notification[];
  markAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  
  // Preference actions
  setPreferences: (preferences: ReminderPreferences) => void;
  getPreferences: (userId: string) => ReminderPreferences | null;
  updatePreferences: (userId: string, updates: Partial<ReminderPreferences>) => void;
  
  // Scheduled reminder actions
  scheduleReminder: (reminder: ScheduledReminder) => void;
  getScheduledReminders: (userId: string) => ScheduledReminder[];
  updateReminderStatus: (reminderId: string, status: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: new Map(),
  preferences: new Map(),
  scheduledReminders: new Map(),
  
  // Notification actions
  addNotification: (notification) => {
    set((state) => {
      const newNotifications = new Map(state.notifications);
      const existing = newNotifications.get(notification.userId) ?? [];
      newNotifications.set(notification.userId, [notification, ...existing]);
      return { notifications: newNotifications };
    });
  },
  
  getNotifications: (userId) => {
    return get().notifications.get(userId) ?? [];
  },
  
  markAsRead: (notificationId) => {
    set((state) => {
      const newNotifications = new Map(state.notifications);
      
      for (const [userId, notifs] of newNotifications) {
        const updated = notifs.map((n) =>
          n.id === notificationId ? { ...n, readAt: Date.now() } : n
        );
        newNotifications.set(userId, updated);
      }
      
      return { notifications: newNotifications };
    });
  },
  
  deleteNotification: (notificationId) => {
    set((state) => {
      const newNotifications = new Map(state.notifications);
      
      for (const [userId, notifs] of newNotifications) {
        newNotifications.set(
          userId,
          notifs.filter((n) => n.id !== notificationId)
        );
      }
      
      return { notifications: newNotifications };
    });
  },
  
  // Preference actions
  setPreferences: (preferences) => {
    set((state) => {
      const newPreferences = new Map(state.preferences);
      newPreferences.set(preferences.userId, preferences);
      return { preferences: newPreferences };
    });
  },
  
  getPreferences: (userId) => {
    return get().preferences.get(userId) ?? null;
  },
  
  updatePreferences: (userId, updates) => {
    set((state) => {
      const newPreferences = new Map(state.preferences);
      const existing = newPreferences.get(userId);
      if (existing) {
        newPreferences.set(userId, { ...existing, ...updates, updatedAt: Date.now() });
      }
      return { preferences: newPreferences };
    });
  },
  
  // Scheduled reminder actions
  scheduleReminder: (reminder) => {
    set((state) => {
      const newScheduled = new Map(state.scheduledReminders);
      const existing = newScheduled.get(reminder.userId) ?? [];
      newScheduled.set(reminder.userId, [...existing, reminder]);
      return { scheduledReminders: newScheduled };
    });
  },
  
  getScheduledReminders: (userId) => {
    return get().scheduledReminders.get(userId) ?? [];
  },
  
  updateReminderStatus: (reminderId, status) => {
    set((state) => {
      const newScheduled = new Map(state.scheduledReminders);
      
      for (const [userId, reminders] of newScheduled) {
        const updated = reminders.map((r) =>
          r.id === reminderId ? { ...r, status: status as any } : r
        );
        newScheduled.set(userId, updated);
      }
      
      return { scheduledReminders: newScheduled };
    });
  },
}));
