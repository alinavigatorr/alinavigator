import { useContext } from 'react';
import { NotificationContext, NotificationContextValue } from '../context/NotificationContext';

export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider. Ensure your component is wrapped by MountedNotificationCenter.');
  }

  return context;
};