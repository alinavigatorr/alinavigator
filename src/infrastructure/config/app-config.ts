/**
 * Centralized Application Configuration Service.
 * Validates and provides type-safe access to environment variables.
 */
export class AppConfig {
    static get nodeEnv(): string {
      return process.env.NODE_ENV || 'development';
    }
  
    static get isProduction(): boolean {
      return this.nodeEnv === 'production';
    }
  
    static get port(): number {
      return parseInt(process.env.PORT || '3000', 10);
    }
  
    static get apiBaseUrl(): string {
      return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
    }
  
    static get databaseUrl(): string {
      const url = process.env.DATABASE_URL;
      if (!url && this.isProduction) {
        throw new Error('DATABASE_URL is required in production environment.');
      }
      return url || 'postgresql://postgres:postgres@localhost:5432/db';
    }
  
    static get storageUrl(): string {
      return process.env.STORAGE_URL || 'https://storage.local';
    }
  
    static get featureFlags(): {
      enableNewCheckout: boolean;
      enableAnalytics: boolean;
    } {
      return {
        enableNewCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
        enableAnalytics: process.env.FEATURE_ANALYTICS !== 'false', // Default true
      };
    }
  }