// src/services/currency/currency-provider.ts

import { CurrencyCode } from './currency-types';
import { ExchangeRateRecord } from './exchange-rate-types';

export class CurrencyProvider {
  private ratesMap: Map<string, ExchangeRateRecord> = new Map();
  private defaultBase: CurrencyCode = 'AED';

  constructor(initialRates?: ExchangeRateRecord[]) {
    if (initialRates) {
      initialRates.forEach(record => {
        this.ratesMap.set(record.pair, record);
      });
    }
  }

  /**
   * ثبت یا به‌روزرسانی نرخ تبدیل یک جفت ارز
   */
  public setRate(base: CurrencyCode, target: CurrencyCode, rate: number, source: string = 'MANUAL'): void {
    const pair: `${CurrencyCode}_${CurrencyCode}` = `${base}_${target}`;
    const record: ExchangeRateRecord = {
      pair,
      rate,
      source,
      timestamp: Date.now(),
    };
    this.ratesMap.set(pair, record);
  }

  /**
   * دریافت نرخ تبدیل بین دو ارز با پشتیبانی از معکوس‌سازی خودکار
   */
  public getRate(base: CurrencyCode, target: CurrencyCode): number {
    if (base === target) return 1.0;

    const directPair: `${CurrencyCode}_${CurrencyCode}` = `${base}_${target}`;
    if (this.ratesMap.has(directPair)) {
      return this.ratesMap.get(directPair)!.rate;
    }

    // بررسی حالت معکوس (Inverse)
    const inversePair: `${CurrencyCode}_${CurrencyCode}` = `${target}_${base}`;
    if (this.ratesMap.has(inversePair)) {
      const inverseRate = this.ratesMap.get(inversePair)!.rate;
      if (inverseRate > 0) {
        return Number((1 / inverseRate).toFixed(6));
      }
    }

    // نرخ پیش‌فرض در صورت عدم یافتن
    return 1.0;
  }

  /**
   * دریافت تمام نرخ‌های ثبت‌شده
   */
  public getAllRates(): ExchangeRateRecord[] {
    return Array.from(this.ratesMap.values());
  }

  /**
   * پاکسازی کش نرخ‌ها
   */
  public clearRates(): void {
    this.ratesMap.clear();
  }
}

// Singleton export پیش‌فرض
export const currencyProvider = new CurrencyProvider([
  { pair: 'USD_AED', rate: 3.6725, source: 'CENTRAL_BANK', timestamp: Date.now() },
  { pair: 'EUR_AED', rate: 4.0200, source: 'CENTRAL_BANK', timestamp: Date.now() },
  { pair: 'GBP_AED', rate: 4.7500, source: 'CENTRAL_BANK', timestamp: Date.now() },
]);