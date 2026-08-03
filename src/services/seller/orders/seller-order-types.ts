/**
 * Seller Order Domain Types
 * تعریف مدل داده‌ای سفارشات مختص پنل فروشندگان.
 */

// وضعیت‌های ۹ گانه سفارش طبق مانیفست
export type SellerOrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned' 
  | 'refunded';

// وضعیت‌های ۴ گانه پرداخت طبق مانیفست
export type SellerPaymentStatus = 
  | 'paid' 
  | 'pending' 
  | 'failed' 
  | 'refunded';

// تایپ‌های Quick Actions (فقط برای استفاده در UI)
export type OrderQuickAction = 
  | 'view' 
  | 'print_invoice' 
  | 'tracking' 
  | 'refund' 
  | 'return' 
  | 'support';

// خلاصه اطلاعات مشتری (Customer Summary)
export interface OrderCustomerSummary {
  name: string;
  phone?: string;
  city?: string;
}

// خلاصه اطلاعات محصولات داخل سفارش (Products Summary)
export interface OrderProductSummary {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  thumbnailUrl?: string;
}

// مدل اصلی سفارش برای فروشنده
export interface SellerOrderModel {
  id: string;
  orderNumber: string; // شماره پیگیری سفارش
  orderDate: string; // ISO Date String
  totalAmount: number; // Order Total
  status: SellerOrderStatus; // Order Status
  paymentStatus: SellerPaymentStatus; // Payment Status
  shipmentTrackingCode?: string; // Shipment Status / Tracking
  customer: OrderCustomerSummary;
  products: OrderProductSummary[];
}