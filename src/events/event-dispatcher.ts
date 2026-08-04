import { EventBus } from './event-bus';
import { DomainEvent, DomainEventType, DomainEventPayloadMap } from './event-types';

/**
 * Event Dispatcher Utility.
 * Provides a clean, developer-friendly interface to create and publish domain events 
 * through the underlying EventBus without exposing singleton boilerplates everywhere.
 */
export class EventDispatcher {
  private static eventBus: EventBus = EventBus.getInstance();

  /**
   * Dispatches a strongly-typed domain event onto the event bus.
   */
  public static async dispatch<T extends DomainEventType>(
    type: T, 
    payload: DomainEventPayloadMap[T]
  ): Promise<void> {
    const event: DomainEvent<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload,
      timestamp: new Date(),
    };

    await this.eventBus.publish(event);
  }
}