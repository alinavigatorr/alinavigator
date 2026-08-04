import { IPaymentContract } from './payment-contract';
import {
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse
} from './payment-types';

/**
 * Base Abstract Class for all Payment Providers.
 * Enforces the IPaymentContract and provides a foundation for shared logic.
 * 
 * Future implementations (e.g., StripeProvider, ZarinpalProvider, MellatProvider) 
 * MUST extend this class and implement the underlying gateway logic.
 */
export abstract class PaymentProvider implements IPaymentContract {
  protected readonly providerId: string;

  /**
   * @param providerId - The unique identifier of the concrete provider (e.g., 'stripe')
   */
  constructor(providerId: string) {
    this.providerId = providerId;
  }

  /**
   * Returns the registered identifier for this provider.
   */
  public getProviderId(): string {
    return this.providerId;
  }

  // ------------------------------------------------------------------------
  // Abstract methods to be implemented by specific gateway providers
  // ------------------------------------------------------------------------

  abstract initialize(): Promise<void>;

  abstract createPayment(request: PaymentRequest): Promise<PaymentResponse>;

  abstract capture(paymentId: string): Promise<PaymentResponse>;

  abstract cancel(paymentId: string): Promise<PaymentResponse>;

  abstract refund(request: RefundRequest): Promise<RefundResponse>;

  abstract verify(paymentId: string, providerTransactionId?: string): Promise<PaymentResponse>;

  abstract webhook(payload: unknown, signature?: string): Promise<void>;
}