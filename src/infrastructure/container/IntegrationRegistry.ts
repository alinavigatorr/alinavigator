import { ConfigurationService } from '../config/ConfigurationService';

// Placeholder types for the abstract registry
type Token<T> = symbol | string | { new (...args: any[]): T };
type Factory<T> = (container: IApplicationContainer) => T;

export interface IApplicationContainer {
  resolve<T>(token: Token<T>): T;
}

export class IntegrationRegistry {
  private bindings = new Map<Token<any>, Factory<any>>();
  private singletons = new Map<Token<any>, any>();

  constructor(private readonly configService: ConfigurationService) {}

  public registerSingleton<T>(token: Token<T>, instance: T): void {
    this.singletons.set(token, instance);
  }

  public registerFactory<T>(token: Token<T>, factory: Factory<T>): void {
    this.bindings.set(token, factory);
  }

  public getBinding<T>(token: Token<T>): Factory<T> | undefined {
    return this.bindings.get(token);
  }

  public getSingleton<T>(token: Token<T>): T | undefined {
    return this.singletons.get(token);
  }
}