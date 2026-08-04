import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Notification } from '../../../domain/notifications/notification-types';
import { NotificationPreference } from '../../../domain/notifications/notification-preferences';
import { NotificationService } from '../../../services/notifications/notification-service';

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference | null;
  isLoading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  updatePreferences: (preferences: NotificationPreference) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export interface NotificationProviderProps {
  children: React.ReactNode;
  service: NotificationService;
  userId: string; // The active user's ID
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children, 
  service,
  userId 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calculateUnreadCount = (notifs: Notification[]) => {
    return notifs.filter(n => n.status !== 'READ').length;
  };

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await service.loadNotifications(userId);
      setNotifications(data);
      setUnreadCount(calculateUnreadCount(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [service, userId]);

  const loadPreferences = useCallback(async () => {
    try {
      const prefs = await service.getPreferences(userId);
      if (prefs) setPreferences(prefs);
    } catch (err) {
      console.error('Failed to load notification preferences', err);
    }
  }, [service, userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await service.markRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'READ', readAt: new Date() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await service.markAllRead(userId);
      setNotifications(prev => 
        prev.map(n => ({ ...n, status: 'READ', readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await service.delete(notificationId);
      setNotifications(prev => {
        const filtered = prev.filter(n => n.id !== notificationId);
        setUnreadCount(calculateUnreadCount(filtered));
        return filtered;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  };

  const updatePreferences = async (newPrefs: NotificationPreference) => {
    try {
      const updated = await service.updatePreferences(newPrefs);
      setPreferences(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  };

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, [loadNotifications, loadPreferences]);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};