/**
 * Returns Engine
 * Core validation and resolution rules for the Commerce Growth Platform Returns.
 */

 import { ReturnEvaluationContext, ReturnResult } from './return-types';

 export class ReturnsEngine {
   /**
    * Evaluates if a new return request is allowed based on the order and product context.
    * Enforces business rules regarding return windows, digital goods, and active requests.
    */
   public static evaluateEligibility(
     returnWindowDays: number,
     context: ReturnEvaluationContext
   ): ReturnResult {
     // 1. کالاهای دیجیتال قابل مرجوعی نیستند (Digital products cannot be returned)
     if (context.isDigitalProduct) {
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'DIGITAL_PRODUCT_NOT_ELIGIBLE',
         message: 'کالاهای دیجیتال و دانلودی قابل مرجوعی نیستند.',
         refundEligibility: false
       };
     }
 
     // 2. فقط سفارش‌های تکمیل شده یا تحویل داده شده (Completed orders only)
     if (context.orderStatus !== 'delivered' && context.orderStatus !== 'completed') {
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'INVALID_ORDER_STATUS',
         message: 'درخواست مرجوعی فقط برای سفارش‌های تحویل داده شده مجاز است.',
         refundEligibility: false
       };
     }
 
     // 3. جلوگیری از ثبت درخواست‌های تکراری (Only one active return request per order item)
     if (context.hasActiveReturnForOrderItem) {
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'ACTIVE_RETURN_EXISTS',
         message: 'یک درخواست مرجوعی فعال برای این کالا در جریان است.',
         refundEligibility: false
       };
     }
 
     // 4. درخواست‌های رد شده قبلی قابل بازگشایی نیستند (Rejected requests cannot be reopened)
     if (context.previousReturnStatus === 'rejected') {
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'PREVIOUSLY_REJECTED',
         message: 'درخواست مرجوعی قبلی برای این کالا رد شده است و قابل بررسی مجدد نیست.',
         refundEligibility: false
       };
     }
 
     // 5. بررسی مهلت مرجوعی کالا (Return must be inside the allowed return window)
     if (!context.orderDeliveryDate) {
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'MISSING_DELIVERY_DATE',
         message: 'تاریخ تحویل کالا جهت محاسبه مهلت مرجوعی در دسترس نیست.',
         refundEligibility: false
       };
     }
 
     const now = context.currentTime ? new Date(context.currentTime) : new Date();
     const deliveryDate = new Date(context.orderDeliveryDate);
     
     // محاسبه اختلاف زمان به روز
     const diffTime = now.getTime() - deliveryDate.getTime();
     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
 
     if (diffDays > returnWindowDays) {
       return {
         isAllowed: false,
         status: 'rejected',
         reason: 'RETURN_WINDOW_EXPIRED',
         message: `مهلت ${returnWindowDays} روزه ثبت مرجوعی این کالا به پایان رسیده است.`,
         refundEligibility: false
       };
     }
 
     // در صورتی که تمامی قوانین رعایت شده باشند
     return {
       isAllowed: true,
       status: 'requested',
       reason: 'ELIGIBLE_FOR_RETURN',
       message: 'کالا واجد شرایط ثبت درخواست مرجوعی می‌باشد.',
       refundEligibility: true
     };
   }
 }