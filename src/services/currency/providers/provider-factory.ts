// src/services/currency/providers/provider-factory.ts

import { IExchangeRateProvider } from './base-provider';
import { ManualExchangeRateProvider } from './manual-provider';

export type ProviderType = 'MANUAL' | 'REST_API' | 'CENTRAL_BANK' | 'ERP' | 'CACHED';

export class ExchangeRateProviderFactory {
  public static createProvider(
    type: ProviderType,
    config?: Record<string, any>
  ): IExchangeRateProvider {
    switch (type) {
      case 'MANUAL':
        return new ManualExchangeRateProvider(config?.initialRates);

      case 'REST_API':
      case 'CENTRAL_BANK':
      case 'ERP':
      case 'CACHED':
        // برای این فاز، پرووایدرهای پلاس‌بل آینده به صورت دستی یا فالبک برگردانده می‌شوند
        // تا زمان پیاده‌سازی واقعی شبکه در فازهای بعدی
        return new ManualExchangeRateProvider(config?.initialRates);

      default:
        throw new Error(`Unsupported exchange rate provider type: ${type}`);
    }
  }
}