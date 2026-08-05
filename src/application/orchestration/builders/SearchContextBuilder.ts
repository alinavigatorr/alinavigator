import { SearchContext } from '../entities/OrchestrationDomain';

export class SearchContextBuilder {
  private context: Partial<SearchContext> = {};

  public withUser(userId?: string, sessionId?: string): this {
    this.context.userId = userId;
    this.context.sessionId = sessionId || crypto.randomUUID();
    return this;
  }

  public withEnvironment(device: 'DESKTOP' | 'MOBILE' | 'TABLET', region: string, language: string): this {
    this.context.deviceType = device;
    this.context.region = region;
    this.context.language = language;
    return this;
  }

  public withCategory(categoryId?: string): this {
    this.context.currentCategoryId = categoryId;
    return this;
  }

  public build(): SearchContext {
    return {
      userId: this.context.userId,
      sessionId: this.context.sessionId || crypto.randomUUID(),
      deviceType: this.context.deviceType || 'DESKTOP',
      region: this.context.region || 'GLOBAL',
      language: this.context.language || 'fa',
      currentCategoryId: this.context.currentCategoryId
    };
  }
}