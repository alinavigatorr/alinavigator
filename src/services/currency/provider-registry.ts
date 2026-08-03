// src/services/currency/provider-registry.ts

import { IExchangeRateProvider } from './providers/base-provider';
import { ManualExchangeRateProvider } from './providers/manual-provider';
import { CurrencyCode } from './currency-types';

export class ExchangeRateProviderRegistry {
  private providers: Map<string, IExchangeRateProvider> = new Map();
  private activeProviderName: string | null = null;

  /**
   * ثبت یک پرووایدر جدید در رجیستری
   */
  public registerProvider(name: string, provider: IExchangeRateProvider, setAsActive: boolean = false): void {
    this.providers.set(name, provider);
    if (setAsActive || !this.activeProviderName) {
      this.activeProviderName = name;
    }
  }

  /**
   * دریافت پرووایدر بر اساس نام
   */
  public getProvider(name: string): IExchangeRateProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * تنظیم پرووایدر فعال فعلی
   */
  public setActiveProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider with name '${name}' is not registered.`);
    }
    this.activeProviderName = name;
  }

  /**
   * دریافت پرووایدر فعال فعلی
   */
  public getActiveProvider(): IExchangeRateProvider {
    if (!this.activeProviderName || !this.providers.has(this.activeProviderName)) {
      // بازگرداندن پرووایدر پیش‌فرض دستی در صورت عدم تنظیم
      const defaultProvider = new ManualExchangeRateProvider();
      return defaultProvider;
    }
    return this.providers.get(this.activeProviderName)!;
  }

  /**
   * دریافت نرخ ارز از طریق پرووایدر فعال با قابلیت فالبک
   */
  public getCurrentRate(base: CurrencyCode, target: CurrencyCode): number | Promise<number> {
    const provider = this.getActiveProvider();
    if (provider.isAvailable()) {
      return provider.getCurrentRate(base, target);
    }
    return 1.0;
  }
}

// Export یک نمونه پیش‌فرض از رجیستری
export const exchangeRateRegistry = new ExchangeRateProviderRegistry();

// ثبت پرووایدر پیش‌فرض دستی به عنوان نمونه اولیه
exchangeRateRegistry.registerProvider(
  'DEFAULT_MANUAL',
  new ManualExchangeRateProvider({
    USD_AED: 3.6725,
    EUR_AED: 4.0200,
    GBP_AED: 4.7500,
  }),
  true
);