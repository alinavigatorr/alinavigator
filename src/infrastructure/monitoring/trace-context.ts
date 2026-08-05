import { AsyncLocalStorage } from 'async_hooks';

/**
 * Structure of the Context traveling through the application.
 */
export interface TraceContextPayload {
  requestId: string;
  correlationId: string;
  userId?: string;
  environment: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Enterprise Trace Context Manager.
 * Uses AsyncLocalStorage to propagate request state across asynchronous operations
 * without the need for manual parameter drilling.
 * Ready for OpenTelemetry integration.
 */
export class TraceContext {
  private static storage = new AsyncLocalStorage<TraceContextPayload>();

  /**
   * Initializes a new trace context for the duration of the callback execution.
   */
  static run<T>(payload: TraceContextPayload, callback: () => T): T {
    return this.storage.run(payload, callback);
  }

  /**
   * Retrieves the current trace context, if any.
   */
  static get(): TraceContextPayload | undefined {
    return this.storage.getStore();
  }

  /**
   * Retrieves the current Request ID.
   */
  static getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  /**
   * Retrieves the current Correlation ID.
   */
  static getCorrelationId(): string | undefined {
    return this.storage.getStore()?.correlationId;
  }

  /**
   * Merges current trace context with new metadata, useful for centralized logging.
   */
  static enrichLogContext(logEntry: Record<string, unknown>): Record<string, unknown> {
    const context = this.get();
    if (!context) {
      return logEntry;
    }

    return {
      ...logEntry,
      traceId: context.requestId,
      correlationId: context.correlationId,
      userId: context.userId || 'anonymous',
      environment: context.environment,
    };
  }
}