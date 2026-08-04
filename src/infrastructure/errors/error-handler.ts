/**
 * Base Application Error
 */
export abstract class AppError extends Error {
    abstract readonly statusCode: number;
    abstract readonly errorCode: string;
  
    constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Thrown when business rules are violated.
   */
  export class BusinessError extends AppError {
    readonly statusCode = 400;
    readonly errorCode = 'BUSINESS_RULE_VIOLATION';
  }
  
  /**
   * Thrown when input validation fails.
   */
  export class ValidationError extends AppError {
    readonly statusCode = 422;
    readonly errorCode = 'VALIDATION_ERROR';
  
    constructor(message: string, public readonly errors?: Record<string, string[]>) {
      super(message);
    }
  }
  
  /**
   * Thrown when database operations fail.
   */
  export class DatabaseError extends AppError {
    readonly statusCode = 500;
    readonly errorCode = 'DATABASE_ERROR';
  }
  
  /**
   * Standardized Error Response Structure
   */
  export interface ErrorResponseDTO {
    success: false;
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
    timestamp: string;
  }
  
  /**
   * Global Error Normalizer and Handler
   */
  export class ErrorHandler {
    static handle(error: unknown): { statusCode: number; body: ErrorResponseDTO } {
      let statusCode = 500;
      let errorCode = 'INTERNAL_SERVER_ERROR';
      let message = 'An unexpected internal server error occurred.';
      let details: unknown = undefined;
  
      if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorCode = error.errorCode;
        message = error.message;
        if (error instanceof ValidationError) {
          details = error.errors;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
  
      return {
        statusCode,
        body: {
          success: false,
          error: {
            code: errorCode,
            message,
            ...(details ? { details } : {}),
          },
          timestamp: new Date().toISOString(),
        },
      };
    }
  }