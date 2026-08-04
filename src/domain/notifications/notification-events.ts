export const NotificationEvent = {
    ORDER_CREATED: 'OrderCreated',
    ORDER_PAID: 'OrderPaid',
    ORDER_SHIPPED: 'OrderShipped',
    ORDER_DELIVERED: 'OrderDelivered',
    ORDER_CANCELLED: 'OrderCancelled',
    RETURN_REQUESTED: 'ReturnRequested',
    RETURN_APPROVED: 'ReturnApproved',
    REFUND_COMPLETED: 'RefundCompleted',
    WALLET_CHARGED: 'WalletCharged',
    WALLET_WITHDRAWN: 'WalletWithdrawn',
    REVIEW_APPROVED: 'ReviewApproved',
    REVIEW_REJECTED: 'ReviewRejected',
    COUPON_RECEIVED: 'CouponReceived',
    CAMPAIGN_STARTED: 'CampaignStarted',
    CAMPAIGN_ENDED: 'CampaignEnded',
    PRICE_DROPPED: 'PriceDropped',
    INVENTORY_LOW: 'InventoryLow',
    SELLER_MESSAGE: 'SellerMessage',
    ADMIN_ANNOUNCEMENT: 'AdminAnnouncement',
  } as const;
  
  export type NotificationEvent = typeof NotificationEvent[keyof typeof NotificationEvent];
  
  export interface NotificationPayload {
    eventId?: string;
    referenceId?: string;
    metadata?: Record<string, unknown>;
  }