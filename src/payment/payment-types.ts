/**
 * Defines the standard lifecycle statuses of a payment.
 */
export enum PaymentStatus {
    PENDING = 'PENDING',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    FAILED = 'FAILED',
    CANCELED = 'CANCELED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  }
  
  /**
   * Supported payment methods abstracted from the actual providers.
   */
  export enum PaymentMethod {
    CREDIT_CARD = 'CREDIT_CARD',
    ONLINE_GATEWAY = 'ONLINE_GATEWAY',
    DIGITAL_WALLET = 'DIGITAL_WALLET',
    BANK_TRANSFER = 'BANK_TRANSFER',
    CRYPTO = 'CRYPTO',
  }
  
  /**
   * The core Payment Entity representing a transaction in the system.
   */
  export interface Payment {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    providerId: string; // Identifier of the specific provider used (e.g., 'stripe', 'zarinpal')
    providerTransactionId?: string; // The ID returned by the external provider
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Standardized payload required to initiate a payment.
   */
  export interface PaymentRequest {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    metadata?: Record<string, string | number | boolean>;
    returnUrl?: string;
    cancelUrl?: string;
  }
  
  /**
   * Standardized response returned when a payment is initiated.
   */
  export interface PaymentResponse {
    paymentId: string;
    status: PaymentStatus;
    providerTransactionId?: string;
    redirectUrl?: string;
    clientSecret?: string; // Used for flows like Stripe Element
    rawResponse?: unknown; // Original response from the provider for audit logging
  }
  
  /**
   * Standardized payload required to refund a payment.
   */
  export interface RefundRequest {
    paymentId: string;
    amount: number;
    reason?: string;
    metadata?: Record<string, string>;
  }
  
  /**
   * Standardized response returned when a refund is processed.
   */
  export interface RefundResponse {
    refundId: string;
    status: PaymentStatus; // E.g., REFUNDED or PARTIALLY_REFUNDED
    amountRefunded: number;
    providerRefundId?: string;
    rawResponse?: unknown;
  }