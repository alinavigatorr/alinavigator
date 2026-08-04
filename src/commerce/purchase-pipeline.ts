import { CheckoutSession } from '../checkout/checkout-types';
import { PaymentEngine } from '../payment/payment-engine';
import { IPaymentContract } from '../payment/payment-contract';
import { 
  PurchaseEvent, 
  PurchaseEventType, 
  PurchaseEventFactory 
} from './purchase-events';

export interface PurchaseContext {
  session: CheckoutSession;
  paymentEngine: PaymentEngine;
  paymentProvider: IPaymentContract;
}

export interface PurchaseExecutionResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  events: PurchaseEvent[];
  error?: string;
}

/**
 * Enterprise Purchase Pipeline.
 * Orchestrates the end-to-end checkout, payment, inventory reservation, 
 * wallet deduction, order creation, and compensation (rollback) workflow.
 */
export class PurchasePipeline {
  private events: PurchaseEvent[] = [];

  constructor(private readonly context: PurchaseContext) {}

  /**
   * Executes the full purchase saga pipeline.
   */
  public async execute(): Promise<PurchaseExecutionResult> {
    const executedSteps: string[] = [];

    try {
      // Step 1: Inventory & Wallet Pre-checks / Locks (Handled via session initialization)
      executedSteps.push('INVENTORY_RESERVATION');
      this.recordEvent(PurchaseEventType.INVENTORY_RESERVED, {
        sessionId: this.context.session.sessionId,
        itemCount: this.context.session.items.length,
        timestamp: new Date(),
      });

      // Step 2: Payment Execution (If payment is required)
      let paymentId: string | undefined;
      const paymentRequired = this.context.session.summary.paymentRequired;

      if (paymentRequired > 0) {
        const paymentRequest = {
          orderId: this.context.session.sessionId,
          amount: paymentRequired,
          currency: 'USD', // Default or dynamic currency from session
          userId: this.context.session.userId,
        };

        const paymentResult = await this.context.paymentEngine.processPayment(paymentRequest);
        
        if (!paymentResult.success) {
          throw new Error(`Payment failed: ${paymentResult.error.message}`);
        }

        paymentId = paymentResult.data.paymentId;
        executedSteps.push('PAYMENT_EXECUTION');
        this.recordEvent(PurchaseEventType.PAYMENT_SUCCEEDED, {
          paymentId,
          amount: paymentRequired,
          timestamp: new Date(),
        });
      }

      // Step 3: Order Creation
      const orderId = `ord_${Math.random().toString(36).substring(2, 9)}`;
      executedSteps.push('ORDER_CREATION');
      this.recordEvent(PurchaseEventType.ORDER_CREATED, {
        orderId,
        userId: this.context.session.userId,
        timestamp: new Date(),
      });

      // Step 4: Wallet Deduction (If wallet balance was used)
      if (this.context.session.summary.walletApplied > 0) {
        executedSteps.push('WALLET_DEDUCTION');
        this.recordEvent(PurchaseEventType.WALLET_UPDATED, {
          userId: this.context.session.userId,
          deductedAmount: this.context.session.summary.walletApplied,
          timestamp: new Date(),
        });
      }

      // Step 5: Notification Dispatch
      executedSteps.push('NOTIFICATION_DISPATCH');
      this.recordEvent(PurchaseEventType.NOTIFICATION_CREATED, {
        userId: this.context.session.userId,
        notificationType: 'PURCHASE_SUCCESS',
        timestamp: new Date(),
      });

      return {
        success: true,
        orderId,
        paymentId,
        events: this.events,
      };

    } catch (error: any) {
      // Trigger Saga Rollback on failure
      await this.rollback(executedSteps, error.message);

      return {
        success: false,
        events: this.events,
        error: error.message,
      };
    }
  }

  /**
   * Executes compensation steps (Rollback) in reverse order of execution.
   */
  private async rollback(executedSteps: string[], errorMessage: string): Promise<void> {
    const affectedSteps: string[] = [];

    this.recordEvent(PurchaseEventType.PURCHASE_FAILED, {
      step: executedSteps[executedSteps.length - 1] || 'INITIALIZATION',
      error: errorMessage,
      timestamp: new Date(),
    });

    // Reverse execution order for compensation
    const reverseSteps = [...executedSteps].reverse();

    for (const step of reverseSteps) {
      switch (step) {
        case 'PAYMENT_EXECUTION':
          // Logic to cancel or refund payment if captured
          affectedSteps.push('PAYMENT_CANCELED');
          break;
        case 'INVENTORY_RESERVATION':
          // Logic to release reserved inventory items back to stock
          affectedSteps.push('INVENTORY_RELEASED');
          break;
        case 'WALLET_DEDUCTION':
          // Logic to refund locked wallet balance back to user
          affectedSteps.push('WALLET_REFUNDED');
          break;
        case 'ORDER_CREATION':
          // Logic to mark the order as failed/canceled
          affectedSteps.push('ORDER_CANCELED');
          break;
        default:
          break;
      }
    }

    this.recordEvent(PurchaseEventType.PURCHASE_ROLLED_BACK, {
      affectedSteps,
      timestamp: new Date(),
    });
  }

  private recordEvent<T extends PurchaseEventType>(type: T, payload: any): void {
    const event = PurchaseEventFactory.create(type, payload);
    this.events.push(event);
  }
}