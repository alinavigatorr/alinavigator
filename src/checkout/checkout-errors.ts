import { CheckoutValidation } from './checkout-types';

/**
 * Base Abstract Error for all Checkout Operations.
 */
export abstract class CheckoutError extends Error {
  public readonly errorCode: string;
  public readonly validationState?: CheckoutValidation;
  public readonly details?: unknown;

  constructor(
    message: string, 
    errorCode: string = 'CHECKOUT_GENERAL_ERROR', 
    validationState?: CheckoutValidation, 
    details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.validationState = validationState;
    this.details = details;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when the cart fails validation rules (e.g., empty cart, invalid quantities).
 */
export class CheckoutValidationFailedError extends CheckoutError {
  constructor(message: string, validationState: CheckoutValidation) {
    super(message, 'CHECKOUT_VALIDATION_FAILED', validationState);
  }
}

/**
 * Thrown when items in the cart are out of stock or inventory reservation fails.
 */
export class InventoryUnavailableError extends CheckoutError {
  constructor(message: string = 'One or more items are out of stock or unavailable.', details?: unknown) {
    super(message, 'INVENTORY_UNAVAILABLE', undefined, details);
  }
}

/**
 * Thrown when a coupon or campaign code is invalid, expired, or doesn't meet conditions.
 */
export class InvalidPromotionError extends CheckoutError {
  constructor(message: string = 'The applied promotion code is invalid or expired.', details?: unknown) {
    super(message, 'INVALID_PROMOTION', undefined, details);
  }
}

/**
 * Thrown when the wallet balance is insufficient for the requested allocation.
 */
export class InsufficientWalletBalanceError extends CheckoutError {
  constructor(message: string = 'Insufficient wallet balance for this transaction.', details?: unknown) {
    super(message, 'INSUFFICIENT_WALLET_BALANCE', undefined, details);
  }
}