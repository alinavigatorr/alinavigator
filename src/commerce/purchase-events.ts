/**
 * Defines all domain events emitted throughout the purchase execution lifecycle.
 * Used for event-driven communication and saga orchestration tracking.
 */
export enum PurchaseEventType {
    ORDER_CREATED = 'ORDER_CREATED',
    PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    INVENTORY_RESERVED = 'INVENTORY_RESERVED',
    WALLET_UPDATED = 'WALLET_UPDATED',
    NOTIFICATION_CREATED = 'NOTIFICATION_CREATED',
    PURCHASE_FAILED = 'PURCHASE_FAILED',
    PURCHASE_ROLLED_BACK = 'PURCHASE_ROLLED_BACK',
  }
  
  export interface PurchaseEventPayloadMap {
    [PurchaseEventType.ORDER_CREATED]: { orderId: string; userId: string; timestamp: Date };
    [PurchaseEventType.PAYMENT_SUCCEEDED]: { paymentId: string; amount: number; timestamp: Date };
    [PurchaseEventType.PAYMENT_FAILED]: { reason: string; timestamp: Date };
    [PurchaseEventType.INVENTORY_RESERVED]: { sessionId: string; itemCount: number; timestamp: Date };
    [PurchaseEventType.WALLET_UPDATED]: { userId: string; deductedAmount: number; timestamp: Date };
    [PurchaseEventType.NOTIFICATION_CREATED]: { userId: string; notificationType: string; timestamp: Date };
    [PurchaseEventType.PURCHASE_FAILED]: { step: string; error: string; timestamp: Date };
    [PurchaseEventType.PURCHASE_ROLLED_BACK]: { affectedSteps: string[]; timestamp: Date };
  }
  
  export interface PurchaseEvent<T extends PurchaseEventType = PurchaseEventType> {
    eventId: string;
    type: T;
    payload: PurchaseEventPayloadMap[T];
    createdAt: Date;
  }
  
  /**
   * Factory class to cleanly instantiate strongly-typed purchase events.
   */
  export class PurchaseEventFactory {
    static create<T extends PurchaseEventType>(
      type: T, 
      payload: PurchaseEventPayloadMap[T]
    ): PurchaseEvent<T> {
      return {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type,
        payload,
        createdAt: new Date(),
      };
    }
  }