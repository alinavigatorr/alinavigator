import { IEventHandler } from '../event-handler';
import { DomainEvent, DomainEventType } from '../event-types';
import { EventDispatcher } from '../event-dispatcher';

/**
 * Handles the InventoryReserved domain event.
 * Responsibilities:
 * - Update stock projection
 * - Emit inventory activity event
 */
export class InventoryReservedHandler implements IEventHandler<DomainEventType.INVENTORY_RESERVED> {
  public readonly handlerName = 'InventoryReservedHandler';
  public readonly handledEventType = DomainEventType.INVENTORY_RESERVED;

  public async handle(event: DomainEvent<DomainEventType.INVENTORY_RESERVED>): Promise<void> {
    const { sessionId, itemCount } = event.payload;

    // 1. Update stock projection / warehouse hold (Simulated inventory ledger update)
    console.log(`[Inventory] Successfully reserved stock for checkout session ${sessionId}. Total items locked: ${itemCount}`);

    // 2. Emit internal tracking notification if needed
    console.log(`[Inventory Activity] Stock projection updated for active reservation session.`);
  }
}