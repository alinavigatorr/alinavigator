import { DomainEvent, DomainEventType } from './event-types';

/**
 * Contract for all event handlers in the system.
 * Follows the Single Responsibility Principle: One handler handles one specific event type.
 */
export interface IEventHandler<T extends DomainEventType = DomainEventType> {
  /**
   * The unique identifier or name of the handler for tracking purposes.
   */
  readonly handlerName: string;

  /**
   * The specific event type this handler is subscribed to.
   */
  readonly handledEventType: T;

  /**
   * Executes the business logic when the event is published.
   */
  handle(event: DomainEvent<T>): Promise<void>;
}