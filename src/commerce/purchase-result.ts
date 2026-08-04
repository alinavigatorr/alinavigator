import { PurchaseEvent } from './purchase-events';

/**
 * Standardized Result Pattern for Enterprise Purchase Operations.
 * Wraps final order confirmation details or structured saga execution failures.
 */
export type PurchaseResult<T> =
  | { success: true; data: T; events: PurchaseEvent[]; error?: never }
  | { success: false; error: { code: string; message: string; events: PurchaseEvent[]; details?: unknown }; data?: never };

export interface PurchaseSuccessData {
  orderId: string;
  paymentId?: string;
  totalPaid: number;
  completedAt: Date;
}

/**
 * Factory utility to generate consistent PurchaseResult objects.
 */
export class PurchaseResultFactory {
  
  /**
   * Creates a successful purchase result containing order and transaction data.
   */
  static success(data: PurchaseSuccessData, events: PurchaseEvent[]): PurchaseResult<PurchaseSuccessData> {
    return {
      success: true,
      data,
      events,
    };
  }

  /**
   * Creates a failed purchase result with complete event history and failure diagnostics.
   */
  static failure(
    code: string, 
    message: string, 
    events: PurchaseEvent[], 
    details?: unknown
  ): PurchaseResult<never> {
    return {
      success: false,
      error: {
        code,
        message,
        events,
        ...(details ? { details } : {}),
      },
    };
  }
}