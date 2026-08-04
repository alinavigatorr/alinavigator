/**
 * Coupon Domain Types
 * Core data structures for the Commerce Growth Platform Coupon Engine.
 */

 export type CouponType = 'public' | 'private' | 'automatic' | 'seller' | 'marketplace';

 export type CouponStatus = 'active' | 'inactive' | 'expired' | 'depleted';
 
 export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';
 
 export type ValidationReasonCode = 
   | 'VALID'
   | 'EXPIRED'
   | 'NOT_STARTED'
   | 'INACTIVE'
   | 'MIN_CART_NOT_MET'
   | 'MAX_USAGE_EXCEEDED'
   | 'PER_USER_LIMIT_EXCEEDED'
   | 'NOT_FOUND';
 
 export interface Coupon {
   id: string;
   code: string;
   title: string;
   type: CouponType;
   status: CouponStatus;
   discountType: DiscountType;
   discountValue: number; // درصد (مثلاً 20 برای 20٪) یا مقدار ثابت به تومان
   minPurchaseAmount?: number; // حداقل مبلغ سبد خرید
   maxDiscountAmount?: number; // سقف تخفیف برای تخفیف‌های درصدی
   startDate: string; // ISO Date String
   expirationDate: string; // ISO Date String
   usageLimit: number; // کل دفعات قابل استفاده
   usageCount: number; // دفعات استفاده شده تا کنون
   perUserLimit: number; // حداکثر استفاده برای هر کاربر
   isStackable: boolean; // قابل ترکیب با سایر کوپن‌ها
   sellerId?: string; // مخصوص کوپن‌های فروشنده
 }
 
 export interface CouponValidationContext {
   couponCode: string;
   cartSubtotal: number;
   userId: string;
   userUsageCount?: number; // تعداد دفعات استفاده این کاربر خاص
 }
 
 export interface CouponResult {
   isValid: boolean;
   discountAmount: number;
   reason: ValidationReasonCode;
   message: string;
   coupon?: Coupon;
 }