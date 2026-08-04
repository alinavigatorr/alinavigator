// src/services/comparison/comparison-policy.ts

import { ComparisonPolicyConfig, ComparisonProduct } from './comparison-types';

export class ComparisonPolicyManager {
  private static defaultPolicy: ComparisonPolicyConfig = {
    maxProducts: 4,               // حداکثر ۴ محصول برای مقایسه همزمان
    requireSameCategory: true,    // الزام به یکسان بودن دسته‌بندی محصولات
  };

  private currentPolicy: ComparisonPolicyConfig;

  constructor(customPolicy?: Partial<ComparisonPolicyConfig>) {
    this.currentPolicy = {
      ...ComparisonPolicyManager.defaultPolicy,
      ...customPolicy,
    };
  }

  public getPolicy(): ComparisonPolicyConfig {
    return { ...this.currentPolicy };
  }

  public updatePolicy(newPolicy: Partial<ComparisonPolicyConfig>): void {
    this.currentPolicy = {
      ...this.currentPolicy,
      ...newPolicy,
    };
  }

  /**
   * بررسی واجد شرایط بودن محصولات برای ورود به موتور مقایسه
   */
  public validateEligibility(products: ComparisonProduct[]): { isEligible: boolean; reason?: string } {
    if (products.length < 2) {
      return { 
        isEligible: false, 
        reason: 'At least 2 products are required to perform a comparison.' 
      };
    }

    if (products.length > this.currentPolicy.maxProducts) {
      return { 
        isEligible: false, 
        reason: `A maximum of ${this.currentPolicy.maxProducts} products can be compared at once.` 
      };
    }

    if (this.currentPolicy.requireSameCategory) {
      const referenceCategory = products[0].categoryId;
      const allSameCategory = products.every(p => p.categoryId === referenceCategory);
      
      if (!allSameCategory) {
        return { 
          isEligible: false, 
          reason: 'Products must belong to the same category to be compared.' 
        };
      }
    }

    return { isEligible: true };
  }
}

// Singleton export پیش‌فرض
export const defaultComparisonPolicy = new ComparisonPolicyManager();