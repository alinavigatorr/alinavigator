// src/services/loyalty/loyalty-engine.ts

import { RewardCalculationResult, RewardSource, TierProgress } from './loyalty-types';
import { LoyaltyPolicyManager, defaultLoyaltyPolicy } from './loyalty-policy';
import { LoyaltyLevelsManager, defaultLoyaltyLevels } from './loyalty-levels';
import { RewardCalculator } from './reward-calculator';

export class LoyaltyEngine {
  private policyManager: LoyaltyPolicyManager;
  private levelsManager: LoyaltyLevelsManager;

  constructor(
    policyManager: LoyaltyPolicyManager = defaultLoyaltyPolicy,
    levelsManager: LoyaltyLevelsManager = defaultLoyaltyLevels
  ) {
    this.policyManager = policyManager;
    this.levelsManager = levelsManager;
  }

  /**
   * محاسبه پاداش یک تراکنش خرید بر اساس سطح وفاداری کاربر
   */
  public calculatePurchaseReward(purchaseAmount: number, currentLifetimePoints: number): RewardCalculationResult {
    return RewardCalculator.calculatePurchaseReward(
      purchaseAmount,
      currentLifetimePoints,
      this.policyManager.getPolicy(),
      this.levelsManager
    );
  }

  /**
   * محاسبه پاداش ثابت برای پروموشن‌ها یا ارجاع (Referral)
   */
  public calculateFixedReward(
    points: number, 
    source: RewardSource, 
    applyTierMultiplier: boolean, 
    currentLifetimePoints: number = 0
  ): RewardCalculationResult {
    return RewardCalculator.calculateFixedReward(
      points,
      source,
      this.policyManager.getPolicy(),
      applyTierMultiplier,
      currentLifetimePoints,
      this.levelsManager
    );
  }

  /**
   * اعمال و کنترل سقف‌های روزانه و ماهانه روی پاداش محاسبه شده
   */
  public enforceRewardCaps(
    calculatedReward: RewardCalculationResult,
    dailyAccumulatedPoints: number,
    monthlyAccumulatedPoints: number
  ): RewardCalculationResult {
    const policy = this.policyManager.getPolicy();
    let allowedTotal = calculatedReward.totalPoints;

    // اعمال سقف روزانه
    if (dailyAccumulatedPoints + allowedTotal > policy.maxDailyRewardLimit) {
      allowedTotal = Math.max(0, policy.maxDailyRewardLimit - dailyAccumulatedPoints);
    }

    // اعمال سقف ماهانه (پس از اعمال سقف روزانه)
    if (monthlyAccumulatedPoints + allowedTotal > policy.maxMonthlyRewardLimit) {
      allowedTotal = Math.min(allowedTotal, Math.max(0, policy.maxMonthlyRewardLimit - monthlyAccumulatedPoints));
    }

    // اگر پاداش به دلیل سقف‌ها محدود شد، ارقام تعدیل می‌شوند
    if (allowedTotal !== calculatedReward.totalPoints) {
      const reductionRatio = allowedTotal / calculatedReward.totalPoints;
      return {
        ...calculatedReward,
        totalPoints: allowedTotal,
        basePoints: Math.floor(calculatedReward.basePoints * reductionRatio),
        bonusPoints: allowedTotal - Math.floor(calculatedReward.basePoints * reductionRatio),
      };
    }

    return calculatedReward;
  }

  /**
   * تبدیل امتیاز به ارزش مالی (Cashback / تخفیف)
   */
  public calculateCashbackValue(pointsToRedeem: number): number {
    const policy = this.policyManager.getPolicy();
    return pointsToRedeem * policy.pointValueInCurrency;
  }

  /**
   * دریافت وضعیت پیشرفت کاربر در سطوح وفاداری (Tier Progress)
   */
  public getCustomerProgress(currentLifetimePoints: number): TierProgress {
    return this.levelsManager.calculateProgress(currentLifetimePoints);
  }
}

// Singleton export پیش‌فرض برای استفاده سراسری در برنامه
export const loyaltyEngine = new LoyaltyEngine();