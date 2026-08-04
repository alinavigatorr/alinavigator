/**
 * Enum representing all domain events supported across the enterprise application.
 */
export enum DomainEventType {
    ORDER_CREATED = 'ORDER_CREATED',
    PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    WALLET_UPDATED = 'WALLET_UPDATED',
    INVENTORY_RESERVED = 'INVENTORY_RESERVED',
    NOTIFICATION_CREATED = 'NOTIFICATION_CREATED',
    REVIEW_SUBMITTED = 'REVIEW_SUBMITTED',
    RETURN_REQUESTED = 'RETURN_REQUESTED',
    COUPON_APPLIED = 'COUPON_APPLIED',
    CAMPAIGN_STARTED = 'CAMPAIGN_STARTED',
  }
  
  /**
   * Strongly typed payload mapping for each domain event type.
   */
  export interface DomainEventPayloadMap {
    [DomainEventType.ORDER_CREATED]: { orderId: string; userId: string; totalAmount: number };
    [DomainEventType.PAYMENT_SUCCEEDED]: { paymentId: string; orderId: string; amount: number };
    [DomainEventType.PAYMENT_FAILED]: { orderId: string; reason: string };
    [DomainEventType.WALLET_UPDATED]: { userId: string; newBalance: number; delta: number };
    [DomainEventType.INVENTORY_RESERVED]: { sessionId: string; itemCount: number };
    [DomainEventType.NOTIFICATION_CREATED]: { userId: string; message: string; type: string };
    [DomainEventType.REVIEW_SUBMITTED]: { reviewId: string; productId: string; rating: number };
    [DomainEventType.RETURN_REQUESTED]: { returnId: string; orderId: string; reason: string };
    [DomainEventType.COUPON_APPLIED]: { couponCode: string; userId: string };
    [DomainEventType.CAMPAIGN_STARTED]: { campaignId: string; title: string };
  }
  
  /**
   * Standardized Domain Event structure.
   */
  export interface DomainEvent<T extends DomainEventType = DomainEventType> {
    eventId: string;
    type: T;
    payload: DomainEventPayloadMap[T];
    timestamp: Date;
  }