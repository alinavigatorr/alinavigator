// src/services/price-protection/eligibility-checker.ts

import { OrderItemForProtection, PriceProtectionPolicy, EligibilityResult } from './price-protection-types';

export class EligibilityChecker {
  /**
   * بررسی کامل شرایط احراز صلاحیت برای محافظت قیمت
   */
  public static checkEligibility(
    orderId: string,
    item: OrderItemForProtection,
    policy: PriceProtectionPolicy,
    isAlreadyClaimed: boolean = false
  ): EligibilityResult {
    // ۱. بررسی فعال بودن کلی سیاست
    if (!policy.isEnabled) {
      return {
        isEligible: false,
        reason: 'Price protection policy is currently disabled.',
        orderId,
        productId: item.productId,
        originalPrice: item.originalPurchasePrice,
        currentPrice: item.currentProductPrice,
        priceDifference: 0,
        potentialRefundAmount: 0,
      };
    }

    // ۲. بررسی ادعای قبلی
    if (policy.allowOneTimeClaimOnly && isAlreadyClaimed) {
      return {
        isEligible: false,
        reason: 'Price protection claim has already been used for this item/order.',
        orderId,
        productId: item.productId,
        originalPrice: item.originalPurchasePrice,
        currentPrice: item.currentProductPrice,
        priceDifference: 0,
        potentialRefundAmount: 0,
      };
    }

    // ۳. بررسی بازه زمانی (Window Days)
    const purchaseTime = typeof item.purchaseDate === 'string' ? new Date(item.purchaseDate).getTime() : item.purchaseDate;
    const currentTime = Date.now();
    const diffTimeInMs = currentTime - purchaseTime;
    const diffDays = diffTimeInMs / (1000 * 60 * 60 * 24);

    if (diffDays > policy.windowDays) {
      return {
        isEligible: false,
        reason: `Protection window of ${policy.windowDays} days has expired. (Elapsed: ${Math.floor(diffDays)} days)`,
        orderId,
        productId: item.productId,
        originalPrice: item.originalPurchasePrice,
        currentPrice: item.currentProductPrice,
        priceDifference: 0,
        potentialRefundAmount: 0,
      };
    }

    // ۴. محاسبه اختلاف قیمت
    const priceDifference = item.originalPurchasePrice - item.currentProductPrice;

    if (priceDifference <= 0) {
      return {
        isEligible: false,
        reason: 'Current price is higher than or equal to the original purchase price.',
        orderId,
        productId: item.productId,
        originalPrice: item.originalPurchasePrice,
        currentPrice: item.currentProductPrice,
        priceDifference,
        potentialRefundAmount: 0,
      };
    }

    // ۵. بررسی حداقل آستانه اختلاف قیمت (Threshold)
    if (priceDifference < policy.minDifferenceThreshold) {
      return {
        isEligible: false,
        reason: `Price difference (${priceDifference}) is below the minimum threshold (${policy.minDifferenceThreshold}).`,
        orderId,
        productId: item.productId,
        originalPrice: item.originalPurchasePrice,
        currentPrice: item.currentProductPrice,
        priceDifference,
        potentialRefundAmount: 0,
      };
    }

    // ۶. تعیین مبلغ نهایی با اعمال سقف مجاز (Max Refund Limit)
    const potentialRefundAmount = Math.min(priceDifference * item.quantity, policy.maxRefundLimit);

    return {
      isEligible: true,
      orderId,
      productId: item.productId,
      originalPrice: item.originalPurchasePrice,
      currentPrice: item.currentProductPrice,
      priceDifference,
      potentialRefundAmount,
    };
  }
}