import { IEventHandler } from '../event-handler';
import { DomainEvent, DomainEventType } from '../event-types';
import { EventDispatcher } from '../event-dispatcher';

/**
 * Handles the OrderCreated domain event.
 * Responsibilities:
 * - Create audit entry
 * - Prepare invoice request
 * - Trigger notification event
 */
export class OrderCreatedHandler implements IEventHandler<DomainEventType.ORDER_CREATED> {
  public readonly handlerName = 'OrderCreatedHandler';
  public readonly handledEventType = DomainEventType.ORDER_CREATED;

  public async handle(event: DomainEvent<DomainEventType.ORDER_CREATED>): Promise<void> {
    const { orderId, userId, totalAmount } = event.payload;

    // 1. Create audit entry (Simulated internal logging/audit)
    console.log(`[Audit] Order created: ${orderId} for user ${userId} with total amount: ${totalAmount}`);

    // 2. Prepare invoice request (Simulated background task)
    console.log(`[Invoice] Preparing invoice for order ${orderId}...`);

    // 3. Trigger notification event via Event Dispatcher
    await EventDispatcher.dispatch(DomainEventType.NOTIFICATION_CREATED, {
      userId,
      message: `Your order #${orderId} has been successfully created.`,
      type: 'ORDER_CREATION',
    });
  }
}