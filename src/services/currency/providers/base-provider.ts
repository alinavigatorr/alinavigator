// src/services/currency/providers/base-provider.ts

import { CurrencyCode } from '../currency-types';

export interface IExchangeRateProvider {
  getSourceName(): string;
  isAvailable(): boolean;
  getCurrentRate(base: CurrencyCode, target: CurrencyCode): number | Promise<number>;
}

export abstract class BaseExchangeRateProvider implements IExchangeRateProvider {
  protected sourceName: string;
  protected available: boolean;

  constructor(sourceName: string, available: boolean = true) {
    this.sourceName = sourceName;
    this.available = available;
  }

  public getSourceName(): string {
    return this.sourceName;
  }

  public isAvailable(): boolean {
    return this.available;
  }

  public abstract getCurrentRate(base: CurrencyCode, target: CurrencyCode): number | Promise<number>;
}