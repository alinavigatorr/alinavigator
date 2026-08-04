// src/services/loyalty/reward-calculator.ts

import { RewardCalculationResult, RewardSource, LoyaltyPolicyConfig } from './loyalty-types';
import { LoyaltyLevelsManager } from './loyalty-levels';

export class RewardCalculator {
  /**
   * محاسبه پاداش حاصل از یک خرید بر اساس مبلغ تراکنش و سطح فعلی کاربر
   */
  public static calculatePurchaseReward(
    purchaseAmount: number,
    currentLifetimePoints: number,
    policy: LoyaltyPolicyConfig,
    levelsManager: LoyaltyLevelsManager
  ): RewardCalculationResult {
    // ۱. محاسبه امتیاز پایه (Base Points)
    const basePoints = purchaseAmount * policy.pointsPerCurrencyUnit;

    // ۲. دریافت تنظیمات سطح فعلی کاربر
    const currentTier = levelsManager.getTierByPoints(currentLifetimePoints);
    
    // ۳. اعمال ضریب پاداش سطح (Tier Multiplier) برای محاسبه بونوس
    let bonusPoints = 0;
    if (currentTier.rewardMultiplier > 1.0) {
      bonusPoints = (basePoints * currentTier.rewardMultiplier) - basePoints;
    }

    const totalPoints = basePoints + bonusPoints;

    return {
      basePoints: Math.floor(basePoints),
      bonusPoints: Math.floor(bonusPoints),
      totalPoints: Math.floor(totalPoints),
      source: 'PURCHASE',
      willExpire: policy.defaultExpirationDays > 0,
      expirationDays: policy.defaultExpirationDays,
    };
  }

  /**
   * محاسبه پاداش‌های ثابت (مثل ثبت‌نام، دعوت از دوستان، یا پروموشن‌های ویژه)
   */
  public static calculateFixedReward(
    fixedPoints: number,
    source: RewardSource,
    policy: LoyaltyPolicyConfig,
    applyTierMultiplier: boolean = false,
    currentLifetimePoints: number = 0,
    levelsManager?: LoyaltyLevelsManager
  ): RewardCalculationResult {
    let bonusPoints = 0;

    // در برخی سناریوها، پاداش‌های ثابت هم ممکن است بر اساس سطح کاربر ضریب بخورند
    if (applyTierMultiplier && levelsManager) {
      const currentTier = levelsManager.getTierByPoints(currentLifetimePoints);
      if (currentTier.bonusEligibility && currentTier.rewardMultiplier > 1.0) {
        bonusPoints = (fixedPoints * currentTier.rewardMultiplier) - fixedPoints;
      }
    }

    const totalPoints = fixedPoints + bonusPoints;

    return {
      basePoints: Math.floor(fixedPoints),
      bonusPoints: Math.floor(bonusPoints),
      totalPoints: Math.floor(totalPoints),
      source,
      willExpire: policy.defaultExpirationDays > 0,
      expirationDays: policy.defaultExpirationDays,
    };
  }
}