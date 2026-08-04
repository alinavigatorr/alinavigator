/**
 * Base Abstract Error for all Payment Operations.
 * Isolates payment domain errors from the rest of the application infrastructure.
 */
export abstract class PaymentError extends Error {
    public readonly errorCode: string;
    public readonly details?: unknown;
  
    constructor(message: string, errorCode: string = 'PAYMENT_GENERAL_ERROR', details?: unknown) {
      super(message);
      this.name = this.constructor.name;
      this.errorCode = errorCode;
      this.details = details;
      
      // Maintain proper stack trace for V8 engines
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  /**
   * Thrown when the payment payload is invalid (e.g., negative amount, missing order ID).
   */
  export class PaymentValidationError extends PaymentError {
    constructor(message: string, details?: unknown) {
      super(message, 'PAYMENT_VALIDATION_ERROR', details);
    }
  }
  
  /**
   * Thrown when the external provider (e.g., Stripe, Zarinpal) is unreachable or returns an HTTP error.
   */
  export class PaymentProviderConnectionError extends PaymentError {
    constructor(message: string = 'Failed to connect to the payment provider.', details?: unknown) {
      super(message, 'PROVIDER_CONNECTION_ERROR', details);
    }
  }
  
  /**
   * Thrown when the transaction is explicitly declined by the bank or gateway 
   * (e.g., insufficient funds, expired card).
   */
  export class PaymentDeclinedError extends PaymentError {
    constructor(message: string = 'Payment was declined by the provider.', details?: unknown) {
      super(message, 'PAYMENT_DECLINED', details);
    }
  }
  
  /**
   * Thrown when attempting an invalid state transition 
   * (e.g., trying to refund a payment that is still PENDING).
   */
  export class PaymentStateTransitionError extends PaymentError {
    constructor(message: string, details?: unknown) {
      super(message, 'INVALID_PAYMENT_STATE', details);
    }
  }