// src/services/comparison/comparison-engine.ts

import { ComparisonProduct, ComparisonResult } from './comparison-types';
import { ComparisonPolicyManager, defaultComparisonPolicy } from './comparison-policy';
import { SpecComparator } from './spec-comparator';

export class ComparisonEngine {
  private policyManager: ComparisonPolicyManager;

  constructor(policyManager: ComparisonPolicyManager = defaultComparisonPolicy) {
    this.policyManager = policyManager;
  }

  /**
   * اجرای عملیات مقایسه روی لیستی از محصولات
   * این متد ابتدا قوانین (نظیر سقف ۴ محصول و یکسان بودن دسته‌بندی) را بررسی کرده 
   * و سپس خروجی نرمال‌سازی شده را برمی‌گرداند.
   */
  public compareProducts(products: ComparisonProduct[]): ComparisonResult {
    const productIds = products.map(p => p.id);

    // ۱. بررسی واجد شرایط بودن (Eligibility)
    const eligibility = this.policyManager.validateEligibility(products);
    
    if (!eligibility.isEligible) {
      return {
        isEligible: false,
        reason: eligibility.reason,
        productIds,
        groups: [],
      };
    }

    // ۲. اجرای مقایسه دقیق مشخصات
    const groups = SpecComparator.compare(products);

    // ۳. بازگرداندن نتیجه نهایی
    return {
      isEligible: true,
      productIds,
      groups,
    };
  }
}

// Singleton export پیش‌فرض برای استفاده سراسری در برنامه
export const comparisonEngine = new ComparisonEngine();