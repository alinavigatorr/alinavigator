// src/services/loyalty/loyalty-policy.ts

import { LoyaltyPolicyConfig } from './loyalty-types';

export class LoyaltyPolicyManager {
  private static defaultPolicy: LoyaltyPolicyConfig = {
    pointsPerCurrencyUnit: 1,      // به ازای هر ۱ واحد ارز، ۱ امتیاز (مثبت) داده می‌شود
    pointValueInCurrency: 0.01,    // هر ۱ امتیاز برابر با ۰.۰۱ واحد ارز است (۱٪ کش‌بک پایه)
    defaultExpirationDays: 365,    // انقضای امتیازات به طور پیش‌فرض یک سال
    maxDailyRewardLimit: 5000,     // حداکثر ۵۰۰۰ امتیاز پاداش در یک روز
    maxMonthlyRewardLimit: 50000,  // حداکثر ۵۰۰۰۰ امتیاز پاداش در یک ماه
  };

  private currentPolicy: LoyaltyPolicyConfig;

  constructor(customPolicy?: Partial<LoyaltyPolicyConfig>) {
    this.currentPolicy = {
      ...LoyaltyPolicyManager.defaultPolicy,
      ...customPolicy,
    };
  }

  public getPolicy(): LoyaltyPolicyConfig {
    return { ...this.currentPolicy };
  }

  public updatePolicy(newPolicy: Partial<LoyaltyPolicyConfig>): void {
    this.currentPolicy = {
      ...this.currentPolicy,
      ...newPolicy,
    };
  }
}

// Singleton export پیش‌فرض
export const defaultLoyaltyPolicy = new LoyaltyPolicyManager();