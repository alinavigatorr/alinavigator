// src/lib/exchange-rate.ts

export interface ExchangeRateConfig {
  usdRate: number; // نرخ لحظه‌ای دلار به تومان
  aedRate: number; // نرخ لحظه‌ای درهم به تومان
  lastUpdated: string;
}

// در یک پروژه واقعی این مقدار از API یا دیتابیس خوانده می‌شود
let currentRates: ExchangeRateConfig = {
  usdRate: 61500, // مثال: ۶۱,۵۰۰ تومان
  aedRate: 16750, // مثال: ۱۶,۷۵۰ تومان
  lastUpdated: new Date().toISOString(),
};

export function getExchangeRates(): ExchangeRateConfig {
  return currentRates;
}

export function updateExchangeRates(newRates: Partial<ExchangeRateConfig>) {
  currentRates = {
    ...currentRates,
    ...newRates,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * محاسبه قیمت نهایی ریالی بر اساس قیمت پایه ارزی و ضریب سود
 */
export function calculateDynamicPrice(basePriceInUSD: number, profitMarginPercent: number = 15): number {
  const baseInToman = basePriceInUSD * currentRates.usdRate;
  const withMargin = baseInToman * (1 + profitMarginPercent / 100);
  // رند کردن به تومان (مثلاً به سمت نزدیک‌ترین ۱۰۰۰ تومان)
  return Math.round(withMargin / 1000) * 1000;
}