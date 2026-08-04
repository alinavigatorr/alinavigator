import { IPaymentContract } from './payment-contract';
import { 
  Payment, 
  PaymentRequest, 
  PaymentResponse, 
  RefundRequest, 
  RefundResponse, 
  PaymentStatus 
} from './payment-types';
import { PaymentValidationError, PaymentStateTransitionError } from './payment-errors';
import { PaymentResult, PaymentResultFactory } from './payment-result';

/**
 * Enterprise Payment Engine.
 * Orchestrates payment business rules and delegates actual processing to the injected provider.
 * Completely agnostic to UI, Database, or specific payment gateways.
 */
export class PaymentEngine {
  
  /**
   * @param provider The chosen payment strategy (e.g., StripeProvider) injected at runtime.
   */
  constructor(private readonly provider: IPaymentContract) {}

  /**
   * Validates and processes a new payment request.
   */
  public async processPayment(
    request: PaymentRequest,
    existingOrderPayments: Payment[] = []
  ): Promise<PaymentResult<PaymentResponse>> {
    try {
      // 1. Business Logic Validations
      this.validatePaymentRequest(request);
      this.ensureNoDuplicatePayment(request.orderId, existingOrderPayments);

      // 2. Delegate to the underlying strategy (Provider)
      const response = await this.provider.createPayment(request);

      // 3. Return a standardized success result
      return PaymentResultFactory.success(response);
    } catch (error) {
      if (error instanceof Error) {
        return PaymentResultFactory.failure('PAYMENT_PROCESSING_FAILED', error.message, error);
      }
      return PaymentResultFactory.failure('UNKNOWN_ERROR', 'An unknown error occurred during payment creation.');
    }
  }

  /**
   * Validates and processes a refund request.
   */
  public async processRefund(
    request: RefundRequest,
    originalPayment: Payment
  ): Promise<PaymentResult<RefundResponse>> {
    try {
      // 1. Refund Eligibility Validations
      this.validateRefundEligibility(request, originalPayment);

      // 2. Delegate to the underlying strategy (Provider)
      const response = await this.provider.refund(request);

      return PaymentResultFactory.success(response);
    } catch (error) {
      if (error instanceof Error) {
        return PaymentResultFactory.failure('REFUND_PROCESSING_FAILED', error.message, error);
      }
      return PaymentResultFactory.failure('UNKNOWN_ERROR', 'An unknown error occurred during refund processing.');
    }
  }

  // ------------------------------------------------------------------------
  // Pure Business Rules & Validations
  // ------------------------------------------------------------------------

  private validatePaymentRequest(request: PaymentRequest): void {
    if (request.amount <= 0) {
      throw new PaymentValidationError('Payment amount must be strictly greater than zero.');
    }
    if (!request.currency || request.currency.trim() === '') {
      throw new PaymentValidationError('Currency code must be specified (e.g., USD, IRR).');
    }
    if (!request.orderId || !request.userId) {
      throw new PaymentValidationError('Both Order ID and User ID are strictly required.');
    }
  }

  private ensureNoDuplicatePayment(orderId: string, existingPayments: Payment[]): void {
    const hasSuccessfulPayment = existingPayments.some(
      (p) => p.status === PaymentStatus.CAPTURED || p.status === PaymentStatus.AUTHORIZED
    );

    if (hasSuccessfulPayment) {
      throw new PaymentValidationError(`Order ${orderId} already has a successful or authorized payment to prevent double billing.`);
    }
  }

  private validateRefundEligibility(request: RefundRequest, originalPayment: Payment): void {
    if (request.amount <= 0) {
      throw new PaymentValidationError('Refund amount must be greater than zero.');
    }

    if (request.amount > originalPayment.amount) {
      throw new PaymentValidationError('Refund amount cannot logically exceed the original payment amount.');
    }

    // A payment can only be refunded if it has actually been captured (money secured)
    if (originalPayment.status !== PaymentStatus.CAPTURED && originalPayment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new PaymentStateTransitionError(
        `Cannot refund payment in status: ${originalPayment.status}. Payment must be CAPTURED first.`
      );
    }
  }
}