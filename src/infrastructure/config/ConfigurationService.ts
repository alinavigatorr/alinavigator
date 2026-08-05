import { EnvironmentProvider } from './EnvironmentProvider';

export interface FeatureFlags {
  useRealDatabase: boolean;
  useRealCache: boolean;
  useRealSearch: boolean;
  useRealPayment: boolean;
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