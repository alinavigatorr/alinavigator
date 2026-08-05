export enum ApplicationEnvironment {
    DEVELOPMENT = 'development',
    TESTING = 'testing',
    STAGING = 'staging',
    PRODUCTION = 'production'
  }
  
  export class EnvironmentProvider {
    private readonly currentEnv: ApplicationEnvironment;
  
    constructor() {
      const envString = process.env.NODE_ENV || 'development';
      this.currentEnv = this.parseEnvironment(envString);
    }
  
    public getEnvironment(): ApplicationEnvironment {
      return this.currentEnv;
    }
  
    public isProduction(): boolean {
      return this.currentEnv === ApplicationEnvironment.PRODUCTION;
    }
  
    public isDevelopment(): boolean {
      return this.currentEnv === ApplicationEnvironment.DEVELOPMENT;
    }
  
    private parseEnvironment(env: string): ApplicationEnvironment {
      switch (env.toLowerCase()) {
        case 'production': return ApplicationEnvironment.PRODUCTION;
        case 'staging': return ApplicationEnvironment.STAGING;
        case 'testing': return ApplicationEnvironment.TESTING;
        default: return ApplicationEnvironment.DEVELOPMENT;
      }
    }
  }