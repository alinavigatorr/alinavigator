import { NotificationChannel } from '../../domain/notifications/notification-channels';
import { NotificationPriority } from '../../domain/notifications/notification-priority';
import { NotificationEvent } from '../../domain/notifications/notification-events';
import { Notification } from '../../domain/notifications/notification-types';

export interface NotificationDecision {
  isAllowed: boolean;
  reason?: string;
  enforcedChannels?: NotificationChannel[];
}

export interface PolicyContext {
  userRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  hasOptedInToPriceDrops: boolean;
  previousOrderEvents: NotificationEvent[];
}

export class NotificationPolicy {
  public static evaluate(
    notification: Partial<Notification>,
    context: PolicyContext
  ): NotificationDecision {
    const channels = new Set<NotificationChannel>(notification.channels || []);

    // Rule 1: Critical notifications must always include InApp.
    if (notification.priority === NotificationPriority.CRITICAL) {
      channels.add(NotificationChannel.IN_APP);
    }

    // Rule 2: OrderDelivered cannot be sent before OrderShipped.
    if (notification.event === NotificationEvent.ORDER_DELIVERED) {
      if (!context.previousOrderEvents.includes(NotificationEvent.ORDER_SHIPPED)) {
        return {
          isAllowed: false,
          reason: 'OrderDelivered notification cannot be sent before OrderShipped.',
        };
      }
    }

    // Rule 3: PriceDropped notifications only allowed if user subscribed.
    if (notification.event === NotificationEvent.PRICE_DROPPED) {
      if (!context.hasOptedInToPriceDrops) {
        return {
          isAllowed: false,
          reason: 'User has not opted in to PriceDropped notifications.',
        };
      }
    }

    // Rule 4: InventoryLow only targets seller/admin.
    if (notification.event === NotificationEvent.INVENTORY_LOW) {
      if (context.userRole !== 'SELLER' && context.userRole !== 'ADMIN') {
        return {
          isAllowed: false,
          reason: 'InventoryLow notifications are restricted to SELLER or ADMIN roles.',
        };
      }
    }

    // Return successful decision with enforced channels
    return {
      isAllowed: true,
      enforcedChannels: Array.from(channels),
    };
  }
}