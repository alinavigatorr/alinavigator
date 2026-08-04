// src/services/currency/currency-engine.ts

import { CurrencyCode, PricingContext, CalculatedPrice, Currency } from './currency-types';
import { currencyProvider, CurrencyProvider } from './currency-provider';
import { PricingStrategyEngine } from './pricing-strategy';

export class CurrencyEngine {
  private provider: CurrencyProvider;

  constructor(provider: CurrencyProvider = currencyProvider) {
    this.provider = provider;
  }

  // تعریف متادیتای ارزهای پشتیبانی‌شده
  private currencies: Record<CurrencyCode, Currency> = {
    AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimalPlaces: 2 },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimalPlaces: 2 },
    IRR: { code: 'IRR', symbol: 'IRR', name: 'Iranian Rial', decimalPlaces: 0 },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2 },
    SAR: { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal', decimalPlaces: 2 },
  };

  /**
   * محاسبه کامل قیمت بر اساس کانتکست ارسالی
   */
  public calculate(context: PricingContext): CalculatedPrice {
    const { basePrice, baseCurrency, targetCurrency, exchangeRate, modifiers, roundingStrategy } = context;

    // ۱. تعیین نرخ تبدیل (اگر به صورت دستی در کانتکست نباشد، از پرایدر می‌گیرد)
    const rate = exchangeRate > 0 ? exchangeRate : this.provider.getRate(baseCurrency, targetCurrency);

    // ۲. تبدیل ارز
    const convertedPrice = basePrice * rate;

    // ۳. اعمال مودیفایرهای قیمت‌گذاری (تخفیف، مالیات، محافظت قیمت، والت و غیره)
    const targetCurrencyMeta = this.currencies[targetCurrency] || { decimalPlaces: 2 };
    const { finalAmount: modifiedPrice, breakdown } = PricingStrategyEngine.calculateModifiedPrice(
      convertedPrice,
      modifiers
    );

    // ۴. اعمال استراتژی گرد کردن
    const finalPrice = PricingStrategyEngine.applyRounding(
      modifiedPrice,
      roundingStrategy || 'NONE',
      targetCurrencyMeta.decimalPlaces
    );

    return {
      originalPrice: basePrice,
      convertedPrice: Number(convertedPrice.toFixed(targetCurrencyMeta.decimalPlaces)),
      modifiedPrice: Number(modifiedPrice.toFixed(targetCurrencyMeta.decimalPlaces)),
      finalPrice,
      currency: targetCurrency,
      breakdown,
    };
  }

  /**
   * فرمت کردن مبلغ پولی به همراه نماد ارز
   */
  public format(amount: number, currencyCode: CurrencyCode): string {
    const currency = this.currencies[currencyCode];
    if (!currency) return `${amount} ${currencyCode}`;

    const formattedNumber = amount.toLocaleString('en-US', {
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces,
    });

    return `${formattedNumber} ${currency.symbol}`;
  }

  public getCurrencyMeta(code: CurrencyCode): Currency | undefined {
    return this.currencies[code];
  }
}

// Singleton export
export const currencyEngine = new CurrencyEngine();