import { CheckoutSession, CheckoutValidation } from './checkout-types';

/**
 * Standardized Result Pattern for Checkout Operations.
 * Wraps either a successfully processed checkout session or structured validation/execution errors.
 */
export type CheckoutResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: { code: string; message: string; validationState?: CheckoutValidation; details?: unknown }; data?: never };

/**
 * Factory utility to generate consistent CheckoutResult objects across the Checkout Orchestrator.
 */
export class CheckoutResultFactory {
  
  /**
   * Creates a successful checkout result wrapping the session data.
   */
  static success<T>(data: T): CheckoutResult<T> {
    return {
      success: true,
      data,
    };
  }

  /**
   * Creates a failed checkout result with structured error codes and optional validation states.
   */
  static failure(
    code: string, 
    message: string, 
    validationState?: CheckoutValidation, 
    details?: unknown
  ): CheckoutResult<never> {
    return {
      success: false,
      error: {
        code,
        message,
        ...(validationState ? { validationState } : {}),
        ...(details ? { details } : {}),
      },
    };
  }
}