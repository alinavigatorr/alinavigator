import { NotificationPriority } from './notification-priority';
import { NotificationChannel } from './notification-channels';
import { NotificationEvent, NotificationPayload } from './notification-events';

export const NotificationType = {
  TRANSACTIONAL: 'TRANSACTIONAL',
  PROMOTIONAL: 'PROMOTIONAL',
  SYSTEM: 'SYSTEM',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED',
} as const;

export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  event: NotificationEvent;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  status: NotificationStatus;
  title: string;
  message: string;
  payload?: NotificationPayload;
  createdAt: Date;
  sentAt?: Date;
  readAt?: Date;
}