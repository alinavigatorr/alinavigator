import { NotificationChannel } from '../../domain/notifications/notification-channels';
import { NotificationPriority } from '../../domain/notifications/notification-priority';
import { NotificationType, Notification } from '../../domain/notifications/notification-types';
import { NotificationEvent } from '../../domain/notifications/notification-events';

export interface NotificationValidationResult {
  isValid: boolean;
  errors: string[];
}

export class NotificationValidator {
  public static validate(notification: Partial<Notification>): NotificationValidationResult {
    const errors: string[] = [];

    if (!notification.id) {
      errors.push('Notification ID is required.');
    }

    if (!notification.userId) {
      errors.push('Recipient User ID is required.');
    }

    if (!notification.type || !Object.values(NotificationType).includes(notification.type as NotificationType)) {
      errors.push(`Invalid or missing notification type: ${notification.type}`);
    }

    if (!notification.event || !Object.values(NotificationEvent).includes(notification.event as NotificationEvent)) {
      errors.push(`Invalid or missing notification event: ${notification.event}`);
    }

    if (!notification.priority || !Object.values(NotificationPriority).includes(notification.priority as NotificationPriority)) {
      errors.push(`Invalid or missing notification priority: ${notification.priority}`);
    }

    if (!notification.channels || !Array.isArray(notification.channels) || notification.channels.length === 0) {
      errors.push('At least one notification channel must be specified.');
    } else {
      for (const channel of notification.channels) {
        if (!Object.values(NotificationChannel).includes(channel as NotificationChannel)) {
          errors.push(`Unsupported notification channel: ${channel}`);
        }
      }
    }

    if (!notification.title || notification.title.trim() === '') {
      errors.push('Notification title cannot be empty.');
    }

    if (!notification.message || notification.message.trim() === '') {
      errors.push('Notification message cannot be empty.');
    }

    // Payload completeness checks based on specific events
    if (notification.event === NotificationEvent.ORDER_CREATED || notification.event === NotificationEvent.ORDER_SHIPPED) {
      if (!notification.payload || !notification.payload.referenceId) {
        errors.push(`Payload with referenceId is required for event: ${notification.event}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}