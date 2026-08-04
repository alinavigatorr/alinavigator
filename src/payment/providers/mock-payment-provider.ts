import { PaymentProvider } from '../payment-provider';
import { 
  PaymentRequest, 
  PaymentResponse, 
  RefundRequest, 
  RefundResponse, 
  PaymentStatus 
} from '../payment-types';
import { 
  PaymentDeclinedError, 
  PaymentProviderConnectionError, 
  PaymentStateTransitionError 
} from '../payment-errors';
import * as crypto from 'crypto';

/**
 * Mock Payment Provider Adapter.
 * Implements the PaymentProvider abstract class to simulate end-to-end payment flows 
 * without requiring real third-party SDK integration (Stripe, Zarinpal, etc.).
 */
export class MockPaymentProvider extends PaymentProvider {
  private isInitialized: boolean = false;
  // In-memory store for simulation purposes
  private transactions: Map<string, { status: PaymentStatus; amount: number; currency: string }> = new Map();

  constructor() {
    super('mock-gateway');
  }

  public async initialize(): Promise<void> {
    // Simulate async configuration loading (e.g., API keys, webhooks)
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.isInitialized = true;
  }

  public async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    this.ensureInitialized();

    // Simulate failure scenario based on metadata or specific test amounts
    if (request.amount === 666) {
      throw new PaymentDeclinedError('Mock payment was declined due to test card restrictions.');
    }

    if (request.amount === 504) {
      throw new PaymentProviderConnectionError('Mock gateway timed out while processing payment.');
    }

    const paymentId = `pay_mock_${crypto.randomUUID()}`;
    const providerTransactionId = `txn_${crypto.randomBytes(6).toString('hex')}`;

    // Store transaction state for simulation
    this.transactions.set(paymentId, {
      status: PaymentStatus.AUTHORIZED,
      amount: request.amount,
      currency: request.currency,
    });

    return {
      paymentId,
      status: PaymentStatus.AUTHORIZED,
      providerTransactionId,
      redirectUrl: `https://mock-gateway.local/checkout/${paymentId}`,
      clientSecret: `seti_${crypto.randomBytes(8).toString('hex')}`,
      rawResponse: { simulated: true, timestamp: new Date().toISOString() },
    };
  }

  public async capture(paymentId: string): Promise<PaymentResponse> {
    this.ensureInitialized();
    const tx = this.transactions.get(paymentId);

    if (!tx) {
      throw new PaymentStateTransitionError(`Payment ID ${paymentId} not found in mock gateway.`);
    }

    if (tx.status !== PaymentStatus.AUTHORIZED) {
      throw new PaymentStateTransitionError(`Cannot capture payment in status: ${tx.status}`);
    }

    tx.status = PaymentStatus.CAPTURED;
    this.transactions.set(paymentId, tx);

    return {
      paymentId,
      status: PaymentStatus.CAPTURED,
      rawResponse: { capturedAt: new Date().toISOString() },
    };
  }

  public async cancel(paymentId: string): Promise<PaymentResponse> {
    this.ensureInitialized();
    const tx = this.transactions.get(paymentId);

    if (!tx) {
      throw new PaymentStateTransitionError(`Payment ID ${paymentId} not found in mock gateway.`);
    }

    if (tx.status === PaymentStatus.CAPTURED) {
      throw new PaymentStateTransitionError('Cannot cancel a payment that has already been captured.');
    }

    tx.status = PaymentStatus.CANCELED;
    this.transactions.set(paymentId, tx);

    return {
      paymentId,
      status: PaymentStatus.CANCELED,
      rawResponse: { canceledAt: new Date().toISOString() },
    };
  }

  public async refund(request: RefundRequest): Promise<RefundResponse> {
    this.ensureInitialized();
    const tx = this.transactions.get(request.paymentId);

    if (!tx) {
      throw new PaymentStateTransitionError(`Payment ID ${request.paymentId} not found for refund.`);
    }

    if (tx.status !== PaymentStatus.CAPTURED && tx.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new PaymentStateTransitionError(`Cannot refund payment in status: ${tx.status}`);
    }

    const newStatus = request.amount >= tx.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;
    tx.status = newStatus;
    this.transactions.set(request.paymentId, tx);

    return {
      refundId: `ref_mock_${crypto.randomUUID()}`,
      status: newStatus,
      amountRefunded: request.amount,
      providerRefundId: `pref_${crypto.randomBytes(6).toString('hex')}`,
      rawResponse: { refundedAt: new Date().toISOString() },
    };
  }

  public async verify(paymentId: string, providerTransactionId?: string): Promise<PaymentResponse> {
    this.ensureInitialized();
    const tx = this.transactions.get(paymentId);

    if (!tx) {
      throw new PaymentStateTransitionError(`Payment ID ${paymentId} could not be verified.`);
    }

    return {
      paymentId,
      status: tx.status,
      providerTransactionId,
      rawResponse: { verified: true, currentStatus: tx.status },
    };
  }

  public async webhook(payload: unknown, signature?: string): Promise<void> {
    this.ensureInitialized();
    // Simulate webhook processing for mock provider events
    if (!payload) {
      throw new PaymentProviderConnectionError('Invalid mock webhook payload received.');
    }
    // In real implementation, this would parse events like charge.captured, charge.failed
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new PaymentProviderConnectionError('MockPaymentProvider has not been initialized. Call initialize() first.');
    }
  }
}