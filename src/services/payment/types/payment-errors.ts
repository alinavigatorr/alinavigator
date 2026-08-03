import { PaymentError } from './payment-types';

export class BasePaymentError extends Error implements PaymentError {
  constructor(public code: string, message: string, public details?: unknown) {
    super(message);
    this.name = 'BasePaymentError';
  }
}

export class GatewayConnectionError extends BasePaymentError {
  constructor(details?: unknown) {
    super('GATEWAY_CONNECTION_FAILED', 'Failed to connect to the payment gateway.', details);
    this.name = 'GatewayConnectionError';
  }
}

export class PaymentTimeoutError extends BasePaymentError {
  constructor(details?: unknown) {
    super('PAYMENT_TIMEOUT', 'The payment request timed out.', details);
    this.name = 'PaymentTimeoutError';
  }
}

export class InvalidPaymentRequestError extends BasePaymentError {
  constructor(details?: unknown) {
    super('INVALID_REQUEST', 'The payment request is invalid or missing required fields.', details);
    this.name = 'InvalidPaymentRequestError';
  }
}