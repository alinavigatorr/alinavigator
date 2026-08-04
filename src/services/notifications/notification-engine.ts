import { Notification, NotificationStatus } from '../../domain/notifications/notification-types';
import { NotificationPreference } from '../../domain/notifications/notification-preferences';
import { NotificationValidator } from './notification-validator';
import { NotificationPolicy, PolicyContext } from './notification-policy';
import { NotificationRouter } from './notification-router';

export interface NotificationResult {
  success: boolean;
  notification?: Notification;
  errors?: string[];
  reason?: string;
}

export class NotificationEngine {
  public static process(
    rawNotification: Partial<Notification>,
    context: PolicyContext,
    preference?: NotificationPreference
  ): NotificationResult {
    // 1. Validation Pipeline
    const validation = NotificationValidator.validate(rawNotification);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // 2. Policy Pipeline
    const decision = NotificationPolicy.evaluate(rawNotification, context);
    if (!decision.isAllowed) {
      return {
        success: false,
        reason: decision.reason,
      };
    }

    // 3. Routing Pipeline
    // We can safely assert event and priority exist because validation passed.
    const routing = NotificationRouter.determineChannels(
      rawNotification.event!,
      rawNotification.priority!,
      preference,
      decision.enforcedChannels
    );

    if (routing.allowedChannels.length === 0) {
      return {
        success: false,
        reason: 'No channels available for delivery after applying routing rules and preferences.',
      };
    }

    // 4. Final Construction
    const finalNotification: Notification = {
      ...(rawNotification as Notification),
      channels: routing.allowedChannels,
      status: NotificationStatus.PENDING,
    };

    return {
      success: true,
      notification: finalNotification,
    };
  }
}