/**
 * Coupon Engine
 * Core validation and calculation rules for the Commerce Growth Platform.
 */

 import { Coupon, CouponValidationContext, CouponResult, ValidationReasonCode } from './coupon-types';

 export class CouponEngine {
   /**
    * Validates a coupon against cart and user context, and calculates the applicable discount.
    */
   public static evaluate(coupon: Coupon | null, context: CouponValidationContext): CouponResult {
     // 1. بررسی وجود کوپن
     if (!coupon) {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'NOT_FOUND',
         message: 'کد تخفیف معتبر نیست یا وجود ندارد.'
       };
     }
 
     // 2. بررسی وضعیت فعال بودن
     if (coupon.status !== 'active') {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'INACTIVE',
         message: 'این کد تخفیف در حال حاضر غیرفعال است.',
         coupon
       };
     }
 
     const now = new Date();
 
     // 3. بررسی تاریخ شروع
     if (new Date(coupon.startDate) > now) {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'NOT_STARTED',
         message: 'هنوز زمان استفاده از این کد تخفیف فرا نرسیده است.',
         coupon
       };
     }
 
     // 4. بررسی انقضا
     if (new Date(coupon.expirationDate) < now || coupon.status === 'expired') {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'EXPIRED',
         message: 'مهلت استفاده از این کد تخفیف به پایان رسیده است.',
         coupon
       };
     }
 
     // 5. بررسی سقف کل استفاده
     if (coupon.usageCount >= coupon.usageLimit) {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'MAX_USAGE_EXCEEDED',
         message: 'ظرفیت استفاده از این کد تخفیف تکمیل شده است.',
         coupon
       };
     }
 
     // 6. بررسی محدودیت تعداد استفاده هر کاربر
     const userUsage = context.userUsageCount || 0;
     if (userUsage >= coupon.perUserLimit) {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'PER_USER_LIMIT_EXCEEDED',
         message: 'شما بیش از حد مجاز از این کد تخفیف استفاده کرده‌اید.',
         coupon
       };
     }
 
     // 7. بررسی حداقل مبلغ سبد خرید
     if (coupon.minPurchaseAmount && context.cartSubtotal < coupon.minPurchaseAmount) {
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'MIN_CART_NOT_MET',
         message: `حداقل مبلغ خرید برای استفاده از این کد ${coupon.minPurchaseAmount.toLocaleString('fa-IR')} تومان است.`,
         coupon
       };
     }
 
     // 8. محاسبه مبلغ تخفیف
     let discountAmount = 0;
 
     if (coupon.discountType === 'percentage') {
       discountAmount = (context.cartSubtotal * coupon.discountValue) / 100;
       
       // اعمال سقف تخفیف درصدی (در صورت وجود)
       if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
         discountAmount = coupon.maxDiscountAmount;
       }
     } else if (coupon.discountType === 'fixed') {
       discountAmount = coupon.discountValue;
       // تخفیف ثابت نباید از کل مبلغ سبد خرید بیشتر شود
       if (discountAmount > context.cartSubtotal) {
         discountAmount = context.cartSubtotal;
       }
     } else if (coupon.discountType === 'free_shipping') {
       // تخفیف ارسال رایگان (مقدار تخفیف روی هزینه ارسال اعمال می‌شود که اینجا صفر فرض شده یا به عنوان فلگ استفاده می‌شود)
       discountAmount = 0; 
     }
 
     return {
       isValid: true,
       discountAmount: Math.round(discountAmount),
       reason: 'VALID',
       message: 'کد تخفیف با موفقیت اعمال شد.',
       coupon
     };
   }
 }