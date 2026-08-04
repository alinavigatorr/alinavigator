// src/services/currency/exchange-rate-types.ts

import { CurrencyCode } from './currency-types';

export interface ExchangeRateSourceConfig {
  sourceId: string;
  name: string;
  priority: number;
  isActive: boolean;
  fetchIntervalMinutes?: number;
}

export interface ExchangeRateRecord {
  pair: `${CurrencyCode}_${CurrencyCode}`; // مثل "USD_AED" یا "EUR_USD"
  rate: number;
  source: string;
  timestamp: number; // Unix Epoch برای مدیریت انقضا (TTL)
  expiresAt?: number;
}

export interface ExchangeRateBatchRequest {
  baseCurrency: CurrencyCode;
  targetCurrencies: CurrencyCode[];
}

export interface ExchangeRateResponse {
  success: boolean;
  baseCurrency: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  fetchedAt: string;
  sourceUsed: string;
}