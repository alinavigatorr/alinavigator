// src/services/loyalty/loyalty-levels.ts

import { LoyaltyTier, TierConfig, TierProgress } from './loyalty-types';

export class LoyaltyLevelsManager {
  private tiers: TierConfig[] = [
    { tier: 'STANDARD', minPointsRequired: 0, rewardMultiplier: 1.0, bonusEligibility: false },
    { tier: 'SILVER', minPointsRequired: 1000, rewardMultiplier: 1.2, bonusEligibility: true },
    { tier: 'GOLD', minPointsRequired: 5000, rewardMultiplier: 1.5, bonusEligibility: true },
    { tier: 'PLATINUM', minPointsRequired: 20000, rewardMultiplier: 2.0, bonusEligibility: true },
  ];

  constructor() {
    // مرتب‌سازی سطوح به صورت نزولی برای پیدا کردن سریع‌ترین تطبیق
    this.tiers.sort((a, b) => b.minPointsRequired - a.minPointsRequired);
  }

  /**
   * دریافت اطلاعات سطح کاربری بر اساس مجموع امتیازات کسب شده در طول زمان (Lifetime Points)
   */
  public getTierByPoints(lifetimePoints: number): TierConfig {
    const tier = this.tiers.find(t => lifetimePoints >= t.minPointsRequired);
    // اگر یافت نشد (که با وجود استاندارد صفر نباید رخ دهد)، پایین‌ترین سطح برگردانده می‌شود
    return tier || this.tiers[this.tiers.length - 1];
  }

  /**
   * دریافت تنظیمات اختصاصی یک سطح خاص با نام آن
   */
  public getTierConfig(tierName: LoyaltyTier): TierConfig {
    const config = this.tiers.find(t => t.tier === tierName);
    if (!config) {
      throw new Error(`Loyalty tier '${tierName}' not found.`);
    }
    return config;
  }

  /**
   * محاسبه وضعیت پیشرفت کاربر برای رسیدن به سطح بعدی (Next Tier)
   */
  public calculateProgress(lifetimePoints: number): TierProgress {
    const currentTierConfig = this.getTierByPoints(lifetimePoints);
    
    // مرتب‌سازی صعودی برای پیدا کردن اولین سطحی که نیازمند امتیازی بیشتر از امتیاز فعلی است
    const ascendingTiers = [...this.tiers].reverse();
    const nextTierConfig = ascendingTiers.find(t => t.minPointsRequired > lifetimePoints);

    if (!nextTierConfig) {
      // کاربر در بالاترین سطح قرار دارد
      return {
        currentTier: currentTierConfig.tier,
        nextTier: null,
        currentLifetimePoints: lifetimePoints,
        pointsNeededForUpgrade: 0,
        progressPercentage: 100,
      };
    }

    const pointsNeeded = nextTierConfig.minPointsRequired - lifetimePoints;
    const tierPointRange = nextTierConfig.minPointsRequired - currentTierConfig.minPointsRequired;
    const pointsGainedInCurrentTier = lifetimePoints - currentTierConfig.minPointsRequired;
    
    const progressPercentage = (pointsGainedInCurrentTier / tierPointRange) * 100;

    return {
      currentTier: currentTierConfig.tier,
      nextTier: nextTierConfig.tier,
      currentLifetimePoints: lifetimePoints,
      pointsNeededForUpgrade: pointsNeeded,
      progressPercentage: Number(Math.max(0, Math.min(100, progressPercentage)).toFixed(2)),
    };
  }
}

// Singleton export پیش‌فرض
export const defaultLoyaltyLevels = new LoyaltyLevelsManager();