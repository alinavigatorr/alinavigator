// src/services/currency/currency-types.ts

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'IRR' | 'GBP' | 'SAR';

export type RoundingStrategyType = 'NONE' | 'ROUND_UP' | 'ROUND_DOWN' | 'NEAREST_5' | 'NEAREST_10';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalPlaces: number;
}

export interface ExchangeRate {
  baseCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  rate: number;
  source: 'MANUAL' | 'API' | 'CENTRAL_BANK' | 'ADMIN';
  updatedAt: string;
}

export interface PriceModifier {
  type: 'MARKUP' | 'DISCOUNT' | 'TAX' | 'SHIPPING' | 'PRICE_PROTECTION' | 'WALLET_DIFF';
  amount: number;
  isPercentage: boolean;
  description?: string;
}

export interface MonetaryAmount {
  amount: number;
  currency: CurrencyCode;
  formatted?: string;
}

export interface PricingContext {
  basePrice: number;
  baseCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  exchangeRate: number;
  modifiers?: PriceModifier[];
  roundingStrategy?: RoundingStrategyType;
}

export interface CalculatedPrice {
  originalPrice: number;
  convertedPrice: number;
  modifiedPrice: number;
  finalPrice: number;
  currency: CurrencyCode;
  breakdown: Array<{
    type: string;
    value: number;
    description?: string;
  }>;
}