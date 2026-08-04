import React, { useMemo } from 'react';
import { MockNotificationDataSource } from '../../../services/notifications/mock-notification-data-source';
import { NotificationService } from '../../../services/notifications/notification-service';
import { NotificationProvider } from '../context/NotificationContext';
import { NotificationCenter } from '../presentation/NotificationCenter';

export interface MountedNotificationCenterProps {
  userId: string; // Passed down from your auth context or layout
}

export const MountedNotificationCenter: React.FC<MountedNotificationCenterProps> = ({ userId }) => {
  // useMemo ensures we only instantiate the services once per mount,
  // preventing unnecessary re-creations on re-renders.
  const notificationService = useMemo(() => {
    // 1. Instantiate the mock data source (backend replacement point)
    const dataSource = new MockNotificationDataSource();
    
    // 2. Inject data source into the core service
    return new NotificationService(dataSource);
  }, []);

  return (
    /* 3. Provide the service and state to the UI tree */
    <NotificationProvider service={notificationService} userId={userId}>
      {/* 4. Render the purely presentational orchestrator */}
      <NotificationCenter />
    </NotificationProvider>
  );
};