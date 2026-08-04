// src/services/currency/providers/manual-provider.ts

import { BaseExchangeRateProvider } from './base-provider';
import { CurrencyCode } from '../currency-types';

export class ManualExchangeRateProvider extends BaseExchangeRateProvider {
  private rates: Map<string, number> = new Map();

  constructor(initialRates?: Record<string, number>) {
    super('MANUAL_PROVIDER', true);
    if (initialRates) {
      for (const [pair, rate] of Object.entries(initialRates)) {
        this.rates.set(pair.toUpperCase(), rate);
      }
    }
  }

  public setRate(base: CurrencyCode, target: CurrencyCode, rate: number): void {
    const pair = `${base}_${target}`.toUpperCase();
    this.rates.set(pair, rate);
  }

  public getCurrentRate(base: CurrencyCode, target: CurrencyCode): number {
    if (base === target) return 1.0;

    const directPair = `${base}_${target}`.toUpperCase();
    if (this.rates.has(directPair)) {
      return this.rates.get(directPair)!;
    }

    const inversePair = `${target}_${base}`.toUpperCase();
    if (this.rates.has(inversePair)) {
      const inverseRate = this.rates.get(inversePair)!;
      if (inverseRate > 0) {
        return Number((1 / inverseRate).toFixed(6));
      }
    }

    return 1.0;
  }
}