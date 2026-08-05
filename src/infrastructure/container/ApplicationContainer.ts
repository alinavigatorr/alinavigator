import { IntegrationRegistry, IApplicationContainer } from './IntegrationRegistry';
import { EnvironmentProvider } from '../config/EnvironmentProvider';
import { ConfigurationService } from '../config/ConfigurationService';
import { PrismaProductRepository } from '../database/repositories/PrismaProductRepository'; // اضافه شده برای فاز ۲
// اضافه شده برای فاز ۳: رجیستری وضعیت و لاگ‌گیری مهاجرت
import { MigrationStatusRegistry, MigrationState } from '../config/MigrationStatusRegistry';
import { MigrationTelemetry, MigrationEvent } from '../telemetry/MigrationTelemetry';
// اضافه شده برای فاز ۴: کلاینت یکپارچه API
import { ApiClient } from '../api/ApiClient';

export class ApplicationContainer implements IApplicationContainer {
  private static instance: ApplicationContainer;
  public readonly registry: IntegrationRegistry;
  
  private constructor() {
    // 1. Core Bootstrapping
    const envProvider = new EnvironmentProvider();
    const configService = new ConfigurationService(envProvider);
    
    this.registry = new IntegrationRegistry(configService);

    // 2. Register Core Services
    this.registry.registerSingleton(EnvironmentProvider, envProvider);
    this.registry.registerSingleton(ConfigurationService, configService);

    this.wireProviders(configService);
    // ارسال configService برای دسترسی به Feature Flags در مخازن
    this.wireRepositories(configService);
    this.wireServices();
  }

  public static getInstance(): ApplicationContainer {
    if (!ApplicationContainer.instance) {
      ApplicationContainer.instance = new ApplicationContainer();
    }
    return ApplicationContainer.instance;
  }

  public resolve<T>(token: any): T {
    // Check singletons first
    const singleton = this.registry.getSingleton<T>(token);
    if (singleton) return singleton;

    // Check factories
    const factory = this.registry.getBinding<T>(token);
    if (!factory) {
      throw new Error(`Dependency injection failed: No provider registered for token ${token.toString()}`);
    }

    return factory(this);
  }

  private wireProviders(config: ConfigurationService): void {
    const flags = config.getFeatureFlags();

    // اضافه شده در فاز ۴: ثبت ApiClient برای استفاده در لایه فرانت‌اند
    this.registry.registerFactory('ApiClient', (c) => {
      return new ApiClient({
        timeoutMs: 5000, // پیش‌فرض ۵ ثانیه تایم‌اوت
        useRealApi: flags.useRealApi
      });
    });

    // Example Provider Resolution Strategy via Feature Flags
    this.registry.registerFactory('IDatabaseProvider', (c) => {
      if (flags.useRealDatabase) {
        // return new PrismaDatabaseProvider(); // Phase 2 Implementation
        throw new Error('Real Database Provider not yet implemented.');
      }
      // Return existing mock provider to preserve operational stability
      return { connect: () => console.log('Mock DB Connected') }; 
    });

    this.registry.registerFactory('ISearchProvider', (c) => {
      if (flags.useRealSearch) {
         // return new PgVectorSearchProvider(); // Phase 2 Implementation
         throw new Error('Real Search Provider not yet implemented.');
      }
      return { searchByKeyword: () => Promise.resolve([]) }; // Mock fallback
    });
  }

  private wireRepositories(config: ConfigurationService): void {
    const flags = config.getFeatureFlags();

    // ثبت کلاینت پریزما به عنوان Factory (فقط در زمان نیاز ساخته می‌شود)
    this.registry.registerFactory('PrismaClient', () => {
      // در واقعیت اینجا return new PrismaClient() خواهد بود
      return { product: {} }; // آبجکت موقت برای جلوگیری از خطای کامپایل تا زمان نصب پریزما
    });

    // Repositories rely on Providers and Feature Flags
    this.registry.registerFactory('IProductRepository', (c) => {
      // تغییر در فاز ۳: بررسی پرچم اختصاصی ماژول محصولات و ثبت وضعیت مهاجرت
      if (flags.usePrismaProducts) {
        MigrationStatusRegistry.track('Products', MigrationState.PRODUCTION);
        MigrationTelemetry.log(MigrationEvent.STARTED, 'Products');

        const prismaClient = c.resolve('PrismaClient');
        return new PrismaProductRepository(prismaClient);
      }
      
      // در غیر این صورت Fallback به حالت Mock برای حفظ پایداری سیستم
      MigrationStatusRegistry.track('Products', MigrationState.MOCK);
      const dbProvider = c.resolve('IDatabaseProvider');
      return { 
        findById: (id: string) => Promise.resolve(null),
        save: (product: any) => Promise.resolve()
      }; 
    });
  }

  private wireServices(): void {
    // Services rely on Repositories and external Providers
    this.registry.registerFactory('SearchService', (c) => {
      // Wiring exactly as architected in Version 1.1 Phase 1
      const searchProvider = c.resolve('ISearchProvider');
      // return new SearchService(searchProvider, ...);
      return {}; 
    });
  }
}