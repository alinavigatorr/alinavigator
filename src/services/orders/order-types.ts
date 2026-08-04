// src/services/orders/order-types.ts

// ==========================================
// ENUMS & BASIC TYPES
// ==========================================
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 'SNAP_PAY' | 'DIGIPAY' | 'TOROB_PAY' | 'WALLET' | 'CREDIT_CARD';

// ==========================================
// ORDER MODELS
// ==========================================
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  taxAmount: number;
  shippingCost: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddressId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shippingAddressId: string;
  paymentMethod: PaymentMethod;
  // در دنیای واقعی معمولاً اقلام سفارش از Cart بک‌اند خوانده می‌شود، اما برای انعطاف این فیلد اضافه شده است
  items?: Array<{
    productId: string;
    quantity: number;
  }>;
}

// ==========================================
// TIMELINE & TRACKING TYPES
// ==========================================
export interface OrderTimelineEvent {
  id: string;
  status: OrderStatus;
  description: string;
  timestamp: string;
}

export interface OrderTracking {
  trackingNumber: string;
  courierName: string;
  courierUrl?: string;
  estimatedDeliveryDate?: string;
  events: Array<{
    location: string;
    description: string;
    timestamp: string;
  }>;
}

// ==========================================
// INVOICE TYPES
// ==========================================
export interface InvoiceDetails {
  invoiceId: string;
  orderId: string;
  issuedAt: string;
  billingAddress: string;
  taxId?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  downloadUrl: string;
}