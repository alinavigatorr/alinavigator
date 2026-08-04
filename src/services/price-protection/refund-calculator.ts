// src/services/price-protection/refund-calculator.ts

import { OrderItemForProtection, PriceProtectionPolicy, PriceProtectionClaim } from './price-protection-types';

export class RefundCalculator {
  /**
   * محاسبه و تولید اطلاعات ادعای بازپرداخت (Claim) بر اساس اختلاف قیمت و سیاست‌ها
   */
  public static calculateRefund(
    orderId: string,
    item: OrderItemForProtection,
    policy: PriceProtectionPolicy
  ): PriceProtectionClaim {
    const originalPrice = item.originalPurchasePrice;
    const currentPrice = item.currentProductPrice;
    const priceDifference = Math.max(0, originalPrice - currentPrice);
    
    // محاسبه مجموع اختلاف برای کل تعداد خریداری شده
    const totalDifference = priceDifference * item.quantity;

    // اعمال سقف حداکثر بازپرداخت تعیین شده در سیاست
    const refundAmount = Math.min(totalDifference, policy.maxRefundLimit);

    return {
      orderId,
      productId: item.productId,
      originalPrice,
      currentPrice,
      priceDifference,
      refundAmount: Number(refundAmount.toFixed(2)),
      claimedAt: Date.now(),
      isAlreadyClaimed: true,
    };
  }
}