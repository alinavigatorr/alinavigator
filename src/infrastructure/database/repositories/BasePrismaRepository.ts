import { PrismaErrorHandler } from '../errors/PrismaErrorHandler';

export abstract class BasePrismaRepository {
  protected abstract entityName: string;

  protected async execute<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await operation();
      this.logExecution(operationName, startTime);
      return result;
    } catch (error) {
      this.logError(operationName, error);
      PrismaErrorHandler.handle(error, this.entityName);
    }
  }

  private logExecution(operation: string, startTime: number): void {
    const duration = performance.now() - startTime;
    if (duration > 300) {
      console.warn(`[SLOW QUERY] ${this.entityName}.${operation} took ${duration.toFixed(2)}ms`);
    } else {
      console.debug(`[DB EXEC] ${this.entityName}.${operation} executed in ${duration.toFixed(2)}ms`);
    }
  }

  private logError(operation: string, error: any): void {
    console.error(`[DB ERROR] Failed at ${this.entityName}.${operation}:`, error.message);
  }
}