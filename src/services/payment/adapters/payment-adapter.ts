import { PaymentRequest, PaymentStatus } from '../types/payment-types';
import { PaymentResult } from './payment-gateway-types';

export type StateChangeListener = (state: PaymentStatus) => void;

export interface PaymentAdapter {
  validate(request: PaymentRequest): PaymentResult;
  startPayment(request: PaymentRequest): Promise<PaymentResult>;
  cancelPayment(transactionId: string): Promise<PaymentResult>;
  retryPayment(request: PaymentRequest): Promise<PaymentResult>;
  getStatus(): PaymentStatus;
  subscribe(listener: StateChangeListener): () => void;
}

/**
 * FUTURE GATEWAY READY - PLACEHOLDERS ONLY
 * 
 * Future gateways MUST implement the exact same PaymentAdapter interface above.
 * 
 * class StripeAdapter implements PaymentAdapter { ... }
 * class PayPalAdapter implements PaymentAdapter { ... }
 * class ZarinPalAdapter implements PaymentAdapter { ... }
 * class MellatAdapter implements PaymentAdapter { ... }
 * 
 * No UI components will ever need to change when swapping adapters.
 */