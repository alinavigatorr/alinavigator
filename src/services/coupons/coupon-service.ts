/**
 * Coupon Service
 * Business service layer for coupon operations and engine integration.
 */

 import { Coupon, CouponValidationContext, CouponResult } from '../../domain/coupons/coupon-types';
 import { CouponEngine } from '../../domain/coupons/coupon-engine';
 
 export interface CouponDataSource {
   getCouponByCode(code: string): Promise<Coupon | null>;
   getAllCoupons(): Promise<Coupon[]>;
 }
 
 /**
  * Mock Data Source for Coupon Development & Testing
  */
 export class MockCouponDataSource implements CouponDataSource {
   private coupons: Coupon[] = [
     {
       id: 'coup-1',
       code: 'WELCOME20',
       title: 'تخفیف خوش‌آمدگویی',
       type: 'public',
       status: 'active',
       discountType: 'percentage',
       discountValue: 20,
       minPurchaseAmount: 100000,
       maxDiscountAmount: 500000,
       startDate: '2026-01-01T00:00:00.000Z',
       expirationDate: '2026-12-31T23:59:59.000Z',
       usageLimit: 1000,
       usageCount: 45,
       perUserLimit: 1,
       isStackable: false
     },
     {
       id: 'coup-2',
       code: 'FLAT50K',
       title: 'تخفیف نقدی ۵۰ هزار تومانی',
       type: 'public',
       status: 'active',
       discountType: 'fixed',
       discountValue: 50000,
       minPurchaseAmount: 200000,
       startDate: '2026-01-01T00:00:00.000Z',
       expirationDate: '2026-12-31T23:59:59.000Z',
       usageLimit: 500,
       usageCount: 120,
       perUserLimit: 2,
       isStackable: true
     }
   ];
 
   async getCouponByCode(code: string): Promise<Coupon | null> {
     const normalizedCode = code.trim().toUpperCase();
     const coupon = this.coupons.find(c => c.code.toUpperCase() === normalizedCode);
     return coupon || null;
   }
 
   async getAllCoupons(): Promise<Coupon[]> {
     return this.coupons;
   }
 }
 
 export class CouponService {
   private dataSource: CouponDataSource;
 
   constructor(dataSource: CouponDataSource = new MockCouponDataSource()) {
     this.dataSource = dataSource;
   }
 
   /**
    * Validates and evaluates a coupon code for a given cart and user context.
    */
   public async validateAndApply(context: CouponValidationContext): Promise<CouponResult> {
     try {
       const coupon = await this.dataSource.getCouponByCode(context.couponCode);
       return CouponEngine.evaluate(coupon, context);
     } catch (error) {
       console.error('[CouponService] Failed to validate coupon:', error);
       return {
         isValid: false,
         discountAmount: 0,
         reason: 'NOT_FOUND',
         message: 'خطایی در پردازش کد تخفیف رخ داد.'
       };
     }
   }
 
   /**
    * Retrieves all available active public coupons.
    */
   public async getAvailableCoupons(): Promise<Coupon[]> {
     try {
       const all = await this.dataSource.getAllCoupons();
       const now = new Date();
       return all.filter(c => c.status === 'active' && new Date(c.expirationDate) > now);
     } catch (error) {
       console.error('[CouponService] Failed to fetch available coupons:', error);
       return [];
     }
   }
 }
 
 // Singleton instance for convenience
 export const couponService = new CouponService();