export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'PACKED' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'RETURNED' 
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  fullAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
}

export interface PriceSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  priceSummary: PriceSummary;
  trackingTimeline: TrackingEvent[];
}