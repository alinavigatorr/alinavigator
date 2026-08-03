// src/services/price-protection/protection-policy.ts

import { PriceProtectionPolicy } from './price-protection-types';

export class ProtectionPolicyManager {
  private static defaultPolicy: PriceProtectionPolicy = {
    windowDays: 14,                // مهلت ۱۴ روزه استاندارد پس از خرید
    minDifferenceThreshold: 10.0,  // حداقل ۱۰ واحد اختلاف قیمت
    maxRefundLimit: 500.0,         // سقف ۵۰۰ واحد بازپرداخت
    allowOneTimeClaimOnly: true,   // محدودیت یک‌بار ادعا برای هر آیتم/سفارش
    isEnabled: true,               // فعال بودن پیش‌فرض سیاست
  };

  private currentPolicy: PriceProtectionPolicy;

  constructor(customPolicy?: Partial<PriceProtectionPolicy>) {
    this.currentPolicy = {
      ...ProtectionPolicyManager.defaultPolicy,
      ...customPolicy,
    };
  }

  public getPolicy(): PriceProtectionPolicy {
    return { ...this.currentPolicy };
  }

  public updatePolicy(newPolicy: Partial<PriceProtectionPolicy>): void {
    this.currentPolicy = {
      ...this.currentPolicy,
      ...newPolicy,
    };
  }
}

// Singleton export پیش‌فرض
export const defaultProtectionPolicyManager = new ProtectionPolicyManager();