import { Notification } from '../../domain/notifications/notification-types';
import { NotificationPreference } from '../../domain/notifications/notification-preferences';

export interface NotificationDataSource {
  getNotifications(userId: string): Promise<Notification[]>;
  
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  
  markAsRead(notificationId: string): Promise<void>;
  
  markAllAsRead(userId: string): Promise<void>;
  
  deleteNotification(notificationId: string): Promise<void>;
  
  createNotification(notification: Notification): Promise<Notification>;
  
  getNotificationPreferences(userId: string): Promise<NotificationPreference | null>;
  
  updateNotificationPreferences(preferences: NotificationPreference): Promise<NotificationPreference>;
}