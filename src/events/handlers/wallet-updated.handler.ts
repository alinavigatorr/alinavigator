import { IEventHandler } from '../event-handler';
import { DomainEvent, DomainEventType } from '../event-types';
import { EventDispatcher } from '../event-dispatcher';

/**
 * Handles the WalletUpdated domain event.
 * Responsibilities:
 * - Create wallet history record
 * - Emit wallet activity event
 */
export class WalletUpdatedHandler implements IEventHandler<DomainEventType.WALLET_UPDATED> {
  public readonly handlerName = 'WalletUpdatedHandler';
  public readonly handledEventType = DomainEventType.WALLET_UPDATED;

  public async handle(event: DomainEvent<DomainEventType.WALLET_UPDATED>): Promise<void> {
    const { userId, newBalance, delta } = event.payload;

    // 1. Create wallet history record (Simulated ledger entry)
    console.log(`[Wallet Ledger] User ${userId} wallet updated. Delta: ${delta}, New Balance: ${newBalance}`);

    // 2. Emit internal activity notification or audit event
    await EventDispatcher.dispatch(DomainEventType.NOTIFICATION_CREATED, {
      userId,
      message: `Your wallet balance has been updated. New balance: $${newBalance}`,
      type: 'WALLET_UPDATE',
    });
  }
}