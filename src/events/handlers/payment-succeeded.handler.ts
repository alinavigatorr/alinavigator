import { IEventHandler } from '../event-handler';
import { DomainEvent, DomainEventType } from '../event-types';
import { EventDispatcher } from '../event-dispatcher';

/**
 * Handles the PaymentSucceeded domain event.
 * Responsibilities:
 * - Update payment status
 * - Emit order confirmation event
 * - Prepare email event
 */
export class PaymentSucceededHandler implements IEventHandler<DomainEventType.PAYMENT_SUCCEEDED> {
  public readonly handlerName = 'PaymentSucceededHandler';
  public readonly handledEventType = DomainEventType.PAYMENT_SUCCEEDED;

  public async handle(event: DomainEvent<DomainEventType.PAYMENT_SUCCEEDED>): Promise<void> {
    const { paymentId, orderId, amount } = event.payload;

    // 1. Update payment status (Simulated state transition)
    console.log(`[Payment] Payment ${paymentId} for order ${orderId} marked as CAPTURED (Amount: ${amount})`);

    // 2. Emit order confirmation event
    console.log(`[Order] Emitting confirmation notice for order ${orderId}...`);

    // 3. Prepare email notification event via Event Dispatcher
    await EventDispatcher.dispatch(DomainEventType.NOTIFICATION_CREATED, {
      userId: 'system_user_placeholder', // Can be mapped if user ID is included in payload
      message: `Payment successful for order #${orderId}. Transaction ID: ${paymentId}`,
      type: 'PAYMENT_SUCCESS',
    });
  }
}