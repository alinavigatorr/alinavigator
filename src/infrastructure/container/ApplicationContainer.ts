import { IntegrationRegistry, IApplicationContainer } from './IntegrationRegistry';
import { EnvironmentProvider } from '../config/EnvironmentProvider';
import { ConfigurationService } from '../config/ConfigurationService';

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
    this.wireRepositories();
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

  private wireRepositories(): void {
    // Repositories rely on Providers
    this.registry.registerFactory('IProductRepository', (c) => {
      const dbProvider = c.resolve('IDatabaseProvider');
      // return new ProductRepository(dbProvider);
      return { findById: (id: string) => Promise.resolve(null) }; // Mock fallback
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