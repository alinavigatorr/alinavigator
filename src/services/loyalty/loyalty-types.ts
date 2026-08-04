// src/services/loyalty/loyalty-types.ts

export type LoyaltyTier = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type RewardSource = 'PURCHASE' | 'PROMOTION' | 'REFERRAL' | 'BONUS';

export interface LoyaltyPolicyConfig {
  pointsPerCurrencyUnit: number;  // تعداد امتیازی که به ازای هر واحد ارز تعلق می‌گیرد
  pointValueInCurrency: number;   // ارزش ریالی/ارزی هر امتیاز در زمان تبدیل (Cashback)
  defaultExpirationDays: number;  // مهلت انقضای امتیازات
  maxDailyRewardLimit: number;    // سقف پاداش روزانه
  maxMonthlyRewardLimit: number;  // سقف پاداش ماهانه
}

export interface TierConfig {
  tier: LoyaltyTier;
  minPointsRequired: number;      // حداقل امتیاز برای رسیدن به این سطح
  rewardMultiplier: number;       // ضریب پاداش (مثلاً ۱.۵ برای گلد)
  bonusEligibility: boolean;      // آیا این سطح شامل بونوس‌های ویژه می‌شود؟
}

export interface RewardCalculationResult {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  source: RewardSource;
  willExpire: boolean;
  expirationDays: number;
}

export interface TierProgress {
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  currentLifetimePoints: number;
  pointsNeededForUpgrade: number;
  progressPercentage: number;
}