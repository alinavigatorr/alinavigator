// src/services/price-protection/price-protection-types.ts

export interface PriceProtectionPolicy {
  windowDays: number;               // مثلاً ۱۵ یا ۳۰ روز مهلت پس از خرید
  minDifferenceThreshold: number;   // حداقل اختلاف قیمت برای فعال شدن مشمولیت
  maxRefundLimit: number;           // سقف حداکثر مبلغ قابل بازپرداخت
  allowOneTimeClaimOnly: boolean;   // آیا فقط یک بار برای هر سفارش قابل استفاده است؟
  isEnabled: boolean;               // سوئیچ کلی فعال/غیرفعال بودن سیاست
}

export interface OrderItemForProtection {
  productId: string;
  originalPurchasePrice: number;
  currentProductPrice: number;
  purchaseDate: string | number; // ISO string یا Unix timestamp
  quantity: number;
}

export interface PriceProtectionClaim {
  orderId: string;
  productId: string;
  originalPrice: number;
  currentPrice: number;
  priceDifference: number;
  refundAmount: number;
  claimedAt?: string | number;
  isAlreadyClaimed: boolean;
}

export interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
  orderId: string;
  productId: string;
  originalPrice: number;
  currentPrice: number;
  priceDifference: number;
  potentialRefundAmount: number;
}