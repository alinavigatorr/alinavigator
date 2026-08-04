import { NotificationChannel } from '../../domain/notifications/notification-channels';
import { NotificationEvent } from '../../domain/notifications/notification-events';
import { NotificationPriority } from '../../domain/notifications/notification-priority';
import { NotificationPreference } from '../../domain/notifications/notification-preferences';

export interface NotificationRoutingResult {
  allowedChannels: NotificationChannel[];
}

export class NotificationRouter {
  public static determineChannels(
    event: NotificationEvent,
    priority: NotificationPriority,
    preference?: NotificationPreference,
    enforcedChannels: NotificationChannel[] = []
  ): NotificationRoutingResult {
    const channels = new Set<NotificationChannel>();

    // 1. Apply Priority Rules (Overrides general rules)
    if (priority === NotificationPriority.CRITICAL) {
      channels.add(NotificationChannel.IN_APP);
      channels.add(NotificationChannel.EMAIL);
      channels.add(NotificationChannel.SMS);
    } 
    // 2. Apply Event-Based Default Rules
    else {
      switch (event) {
        case NotificationEvent.ORDER_CREATED:
          channels.add(NotificationChannel.IN_APP);
          channels.add(NotificationChannel.EMAIL);
          break;
        case NotificationEvent.WALLET_CHARGED:
          channels.add(NotificationChannel.IN_APP);
          break;
        case NotificationEvent.PRICE_DROPPED:
          channels.add(NotificationChannel.IN_APP);
          break;
        default:
          // Default fallback for unmapped events
          channels.add(NotificationChannel.IN_APP);
      }
    }

    // 3. Apply User Preferences (if provided)
    if (preference) {
      if (preference.optOut && priority !== NotificationPriority.CRITICAL) {
        // Clear all channels if user opted out, unless it's a critical notification
        channels.clear();
      } else if (!preference.optOut) {
        const userEnabledSet = new Set(preference.enabledChannels);
        
        // Special Case: PriceDropped allows Email if explicitly opted-in
        if (event === NotificationEvent.PRICE_DROPPED && userEnabledSet.has(NotificationChannel.EMAIL)) {
          channels.add(NotificationChannel.EMAIL);
        }

        // Filter current channels by user preferences (intersection), 
        // but never filter out Critical priority channels.
        if (priority !== NotificationPriority.CRITICAL) {
          for (const channel of Array.from(channels)) {
            if (!userEnabledSet.has(channel)) {
              channels.delete(channel);
            }
          }
        }
      }
    }

    // 4. Apply Enforced Channels (from Policy)
    for (const channel of enforcedChannels) {
      channels.add(channel);
    }

    return {
      allowedChannels: Array.from(channels),
    };
  }
}