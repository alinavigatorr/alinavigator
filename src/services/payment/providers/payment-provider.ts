import { PaymentRequest, PaymentResponse } from '../types/payment-types';

/**
 * Provider interface that standardizes how the service interacts with adapters.
 */
export interface PaymentProvider {
  /**
   * Provider name identifier
   */
  getName(): string;

  /**
   * Executes the payment flow using the underlying adapter.
   */
  process(request: PaymentRequest): Promise<PaymentResponse>;

  /**
   * Cancels a processing payment.
   */
  cancel(transactionId: string): Promise<PaymentResponse>;
}