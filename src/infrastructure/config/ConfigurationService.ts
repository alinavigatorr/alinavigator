import { EnvironmentProvider } from './EnvironmentProvider';

export interface FeatureFlags {
  useRealDatabase: boolean;
  useRealCache: boolean;
  useRealSearch: boolean;
  useRealPayment: boolean;
  usePrismaRepositories: boolean; // اضافه شده برای فاز ۲: کنترل مخازن پریزما
  // اضافه شده برای فاز ۳: کنترل دقیق و تفکیک‌شده برای مهاجرت هیبریدی
  usePrismaProducts: boolean;
  usePrismaCategories: boolean;
  usePrismaUsers: boolean;
}

export interface AppConfiguration {
  env: EnvironmentProvider;
  flags: FeatureFlags;
  ports: {
    http: number;
  };
}

export class ConfigurationService {
  private readonly config: AppConfiguration;

  constructor(private readonly envProvider: EnvironmentProvider) {
    this.config = {
      env: this.envProvider,
      flags: {
        // Feature flags fallback to false ensuring safe migration (Mock by default)
        useRealDatabase: process.env.FLAG_REAL_DATABASE === 'true',
        useRealCache: process.env.FLAG_REAL_CACHE === 'true',
        useRealSearch: process.env.FLAG_REAL_SEARCH === 'true',
        useRealPayment: process.env.FLAG_REAL_PAYMENT === 'true',
        // فعال‌سازی مخازن واقعی دیتابیس بر اساس تنظیمات محیطی
        usePrismaRepositories: process.env.USE_PRISMA_REPOSITORIES === 'true',
        // اضافه شده برای فاز ۳: کنترل مستقل هر ماژول
        usePrismaProducts: process.env.USE_PRISMA_PRODUCTS === 'true',
        usePrismaCategories: process.env.USE_PRISMA_CATEGORIES === 'true',
        usePrismaUsers: process.env.USE_PRISMA_USERS === 'true',
      },
      ports: {
        http: parseInt(process.env.PORT || '3000', 10),
      }
    };
  }

  public getFeatureFlags(): FeatureFlags {
    return this.config.flags;
  }

  public getConfig(): AppConfiguration {
    return this.config;
  }
}