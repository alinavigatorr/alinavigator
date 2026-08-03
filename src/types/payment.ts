export type PaymentStatus = 'IDLE' | 'VALIDATING' | 'READY' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'CREDIT_CARD' | 'COD' | 'BANK_TRANSFER' | 'WALLET';
  icon: string;
  isAvailable: boolean;
  description?: string;
}

export interface BillingAddress {
  id: string;
  fullName: string;
  nationalId?: string;
  fullAddress: string;
  postalCode: string;
  phone: string;
}

export interface Coupon {
  code: string;
  discountAmount: number;
  isValid: boolean;
  message?: string;
}

export interface PaymentSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}