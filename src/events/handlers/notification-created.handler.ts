import { IEventHandler } from '../event-handler';
import { DomainEvent, DomainEventType } from '../event-types';

/**
 * Handles the NotificationCreated domain event.
 * Responsibilities:
 * - Normalize notification payload
 * - Dispatch notification internally (simulate push/SMS/email delivery)
 */
export class NotificationCreatedHandler implements IEventHandler<DomainEventType.NOTIFICATION_CREATED> {
  public readonly handlerName = 'NotificationCreatedHandler';
  public readonly handledEventType = DomainEventType.NOTIFICATION_CREATED;

  public async handle(event: DomainEvent<DomainEventType.NOTIFICATION_CREATED>): Promise<void> {
    const { userId, message, type } = event.payload;

    // 1. Normalize notification payload
    const normalizedNotification = {
      recipientId: userId,
      category: type,
      content: message.trim(),
      deliveredAt: new Date(),
    };

    // 2. Dispatch internal notification (Simulate push / dispatch service)
    console.log(`[Notification Dispatcher] Type: [${normalizedNotification.category}] -> User: [${normalizedNotification.recipientId}] -> Message: "${normalizedNotification.content}"`);
  }
}