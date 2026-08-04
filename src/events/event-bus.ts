import { DomainEvent, DomainEventType } from './event-types';
import { IEventHandler } from './event-handler';

/**
 * In-Memory Enterprise Event Bus.
 * Handles internal publish/subscribe mechanics following the Observer Pattern.
 * Designed to be easily replaceable with RabbitMQ or Kafka adapters in the future.
 */
export class EventBus {
  private static instance: EventBus;
  private handlers: Map<DomainEventType, IEventHandler<any>[]> = new Map();

  private constructor() {}

  /**
   * Singleton instance accessor to maintain a unified event routing hub.
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribes an event handler to a specific domain event type.
   */
  public subscribe<T extends DomainEventType>(handler: IEventHandler<T>): void {
    const eventType = handler.handledEventType;
    const existingHandlers = this.handlers.get(eventType) || [];
    
    // Prevent duplicate registration of the same handler instance
    if (!existingHandlers.some(h => h.handlerName === handler.handlerName)) {
      existingHandlers.push(handler);
      this.handlers.set(eventType, existingHandlers);
    }
  }

  /**
   * Unsubscribes a specific handler by its name and event type.
   */
  public unsubscribe(eventType: DomainEventType, handlerName: string): void {
    const existingHandlers = this.handlers.get(eventType);
    if (!existingHandlers) return;

    const filtered = existingHandlers.filter(h => h.handlerName !== handlerName);
    this.handlers.set(eventType, filtered);
  }

  /**
   * Publishes a domain event, notifying all subscribed handlers asynchronously.
   */
  public async publish<T extends DomainEventType>(event: DomainEvent<T>): Promise<void> {
    const targetHandlers = this.handlers.get(event.type);
    if (!targetHandlers || targetHandlers.length === 0) {
      return; // No listeners for this event
    }

    // Execute all registered handlers concurrently and robustly
    const executionPromises = targetHandlers.map(async (handler) => {
      try {
        await handler.handle(event);
      } catch (error) {
        console.error(`Error handling event [${event.type}] in handler [${handler.handlerName}]:`, error);
        // In enterprise production, this can push to a Dead Letter Queue (DLQ)
      }
    });

    await Promise.allSettled(executionPromises);
  }

  /**
   * Clears all subscriptions (useful for testing suites).
   */
  public clear(): void {
    this.handlers.clear();
  }
}