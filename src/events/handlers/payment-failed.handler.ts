import { IEventHandler } from '../event-handler';
import { DomainEvent, DomainEventType } from '../event-types';
import { EventDispatcher } from '../event-dispatcher';

/**
 * Handles the PaymentFailed domain event.
 * Responsibilities:
 * - Rollback checkout session
 * - Emit failure notification
 */
export class PaymentFailedHandler implements IEventHandler<DomainEventType.PAYMENT_FAILED> {
  public readonly handlerName = 'PaymentFailedHandler';
  public readonly handledEventType = DomainEventType.PAYMENT_FAILED;

  public async handle(event: DomainEvent<DomainEventType.PAYMENT_FAILED>): Promise<void> {
    const { orderId, reason } = event.payload;

    // 1. Rollback checkout session or release locks (Simulated)
    console.log(`[Checkout] Rolling back session / releasing resources for failed order ${orderId}. Reason: ${reason}`);

    // 2. Emit failure notification event via Event Dispatcher
    await EventDispatcher.dispatch(DomainEventType.NOTIFICATION_CREATED, {
      userId: 'system_user_placeholder',
      message: `Payment failed for order #${orderId}. Reason: ${reason}`,
      type: 'PAYMENT_FAILURE',
    });
  }
}