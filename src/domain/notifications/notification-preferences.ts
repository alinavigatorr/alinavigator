import { NotificationChannel } from './notification-channels';
import { NotificationEvent } from './notification-events';

export interface NotificationTarget {
  channel: NotificationChannel;
  destination: string;
  isActive: boolean;
}

export interface NotificationPreference {
  userId: string;
  eventId: NotificationEvent;
  enabledChannels: NotificationChannel[];
  optOut: boolean;
}