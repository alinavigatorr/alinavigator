/**
 * Standardized Result Pattern for Payment Operations.
 * Prevents the application from throwing unhandled exceptions for expected business failures
 * (e.g., insufficient funds, card declined) and ensures predictable responses.
 */
export type PaymentResult<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; error: { code: string; message: string; details?: unknown }; data?: never };

/**
 * Factory utility to generate consistent PaymentResult objects across the Payment Engine.
 */
export class PaymentResultFactory {
  
  /**
   * Creates a successful payment result.
   */
  static success<T>(data: T): PaymentResult<T> {
    return { 
      success: true, 
      data 
    };
  }

  /**
   * Creates a failed payment result with structured error information.
   */
  static failure(code: string, message: string, details?: unknown): PaymentResult<never> {
    return { 
      success: false, 
      error: { 
        code, 
        message, 
        ...(details ? { details } : {}) 
      } 
    };
  }
}