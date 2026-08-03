// src/services/currency/pricing-strategy.ts

import { PriceModifier, RoundingStrategyType } from './currency-types';

export class PricingStrategyEngine {
  /**
   * اعمال استراتژی گرد کردن قیمت بر اساس نوع قانون مشخص‌شده
   */
  public static applyRounding(amount: number, strategy: RoundingStrategyType = 'NONE', decimalPlaces: number = 2): number {
    if (isNaN(amount)) return 0;

    switch (strategy) {
      case 'ROUND_UP':
        return Math.ceil(amount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
      case 'ROUND_DOWN':
        return Math.floor(amount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
      case 'NEAREST_5':
        return Math.round(amount / 5) * 5;
      case 'NEAREST_10':
        return Math.round(amount / 10) * 10;
      case 'NONE':
      default:
        return Number(amount.toFixed(decimalPlaces));
    }
  }

  /**
   * محاسبه قیمت نهایی با اعمال تمامی مودیفایرها (تخفیف، مالیات، محافظت قیمت و غیره)
   */
  public static calculateModifiedPrice(
    basePrice: number,
    modifiers?: PriceModifier[]
  ): { finalAmount: number; breakdown: Array<{ type: string; value: number; description?: string }> } {
    let currentAmount = basePrice;
    const breakdown: Array<{ type: string; value: number; description?: string }> = [];

    if (!modifiers || modifiers.length === 0) {
      return { finalAmount: currentAmount, breakdown };
    }

    for (const mod of modifiers) {
      let calculatedValue = 0;

      if (mod.isPercentage) {
        calculatedValue = (basePrice * mod.amount) / 100;
      } else {
        calculatedValue = mod.amount;
      }

      // تعیین تاثیر مودیفایر روی قیمت کل (تخفیف منفی، اضافه‌بها مثبت)
      if (mod.type === 'DISCOUNT') {
        currentAmount -= calculatedValue;
        breakdown.push({ type: mod.type, value: -calculatedValue, description: mod.description });
      } else {
        // برای MARKUP, TAX, SHIPPING, PRICE_PROTECTION, WALLET_DIFF
        currentAmount += calculatedValue;
        breakdown.push({ type: mod.type, value: calculatedValue, description: mod.description });
      }
    }

    return {
      finalAmount: Math.max(0, currentAmount),
      breakdown,
    };
  }
}