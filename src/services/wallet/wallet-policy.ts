// src/services/wallet/wallet-policy.ts

import { WalletPolicyConfig } from './wallet-types';

export class WalletPolicyManager {
  private static defaultPolicy: WalletPolicyConfig = {
    maxBalanceLimit: 10000,          // سقف مجاز موجودی کیف پول (مثال: ۱۰,۰۰۰ واحد)
    allowNegativeBalance: false,     // عدم اجازه برای منفی شدن موجودی به صورت پیش‌فرض
    defaultExpirationDays: 365,      // انقضای پیش‌فرض اعتبارات (یک سال)
  };

  private currentPolicy: WalletPolicyConfig;

  constructor(customPolicy?: Partial<WalletPolicyConfig>) {
    this.currentPolicy = {
      ...WalletPolicyManager.defaultPolicy,
      ...customPolicy,
    };
  }

  public getPolicy(): WalletPolicyConfig {
    return { ...this.currentPolicy };
  }

  public updatePolicy(newPolicy: Partial<WalletPolicyConfig>): void {
    this.currentPolicy = {
      ...this.currentPolicy,
      ...newPolicy,
    };
  }

  /**
   * بررسی اینکه آیا کیف پول ظرفیت دریافت مبلغ جدید را با توجه به سقف مجاز دارد یا خیر
   */
  public canAcceptCredit(currentBalance: number, amountToAdd: number): boolean {
    return (currentBalance + amountToAdd) <= this.currentPolicy.maxBalanceLimit;
  }
}

// Singleton export پیش‌فرض
export const defaultWalletPolicy = new WalletPolicyManager();