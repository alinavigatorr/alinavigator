import React, { createContext, useContext, useMemo } from 'react';

// 1. Import real database implementation instead of the Mock one
import { PrismaNotificationRepository } from '../database/prisma/repositories/prisma-notification-repository';
import { PrismaNotificationDataSource } from '../services/notifications/prisma-notification-data-source';

// 2. Import the unchanging Business Service
import { NotificationService } from '../services/notifications/notification-service';

// Context definition (Unchanged)
interface NotificationContextType {
  notificationService: NotificationService;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const MountedNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 3. Dependency Injection Wiring (Singleton instance per app lifecycle)
  const notificationService = useMemo(() => {
    // Step A: Instantiate Repository
    const notificationRepository = new PrismaNotificationRepository();

    // Step B: Inject Repository into the Real Data Source
    // This used to be: new MockNotificationDataSource()
    const notificationDataSource = new PrismaNotificationDataSource(notificationRepository);

    // Step C: Inject Data Source into the Business Service
    return new NotificationService(notificationDataSource);
  }, []);

  return (
    <NotificationContext.Provider value={{ notificationService }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook for UI components (Unchanged)
export const useNotificationEngine = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationEngine must be used within a MountedNotificationProvider');
  }
  return context.notificationService;
};