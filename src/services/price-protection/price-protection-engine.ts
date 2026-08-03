// src/services/price-protection/price-protection-engine.ts

import { OrderItemForProtection, PriceProtectionPolicy, EligibilityResult, PriceProtectionClaim } from './price-protection-types';
import { ProtectionPolicyManager, defaultProtectionPolicyManager } from './protection-policy';
import { EligibilityChecker } from './eligibility-checker';
import { RefundCalculator } from './refund-calculator';

export class PriceProtectionEngine {
  private policyManager: ProtectionPolicyManager;

  constructor(policyManager: ProtectionPolicyManager = defaultProtectionPolicyManager) {
    this.policyManager = policyManager;
  }

  /**
   * ارزیابی کامل یک سفارش/آیتم برای محافظت قیمت
   */
  public evaluateClaim(
    orderId: string,
    item: OrderItemForProtection,
    isAlreadyClaimed: boolean = false
  ): EligibilityResult {
    const policy = this.policyManager.getPolicy();
    return EligibilityChecker.checkEligibility(orderId, item, policy, isAlreadyClaimed);
  }

  /**
   * پردازش و محاسبه نهایی مبلغ بازپرداخت برای درخواست تایید شده
   */
  public processRefund(
    orderId: string,
    item: OrderItemForProtection
  ): PriceProtectionClaim {
    const policy = this.policyManager.getPolicy();
    return RefundCalculator.calculateRefund(orderId, item, policy);
  }

  /**
   * دریافت سیاست فعال فعلی سیستم
   */
  public getCurrentPolicy(): PriceProtectionPolicy {
    return this.policyManager.getPolicy();
  }

  /**
   * به‌روزرسانی دینامیک سیاست محافظت قیمت
   */
  public updatePolicy(newPolicy: Partial<PriceProtectionPolicy>): void {
    this.policyManager.updatePolicy(newPolicy);
  }
}

// Singleton export پیش‌فرض
export const priceProtectionEngine = new PriceProtectionEngine();