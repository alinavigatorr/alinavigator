import { EventBus } from './event-bus';
import { IEventHandler } from './event-handler';

/**
 * Central Event Registry.
 * Responsible for auto-registering and managing all domain event handlers 
 * during the application bootstrap phase.
 */
export class EventRegistry {
  private static eventBus: EventBus = EventBus.getInstance();

  /**
   * Registers a collection of event handlers into the global event bus.
   */
  public static registerHandlers(handlers: IEventHandler<any>[]): void {
    for (const handler of handlers) {
      this.eventBus.subscribe(handler);
    }
  }

  /**
   * Registers a single event handler.
   */
  public static registerHandler(handler: IEventHandler<any>): void {
    this.eventBus.subscribe(handler);
  }
}