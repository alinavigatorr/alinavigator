import * as crypto from 'crypto';

export interface RequestPayload {
  url: string;
  method: string;
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
}

export interface TrackedRequestResult {
  requestId: string;
  correlationId: string;
  timestamp: string;
  durationMs: number;
  responseCode: number;
}

/**
 * Enterprise Request Tracker.
 * Responsible for generating trace identifiers, measuring request duration,
 * and capturing standard request/response telemetry.
 */
export class RequestTracker {
  
  /**
   * Wraps a request execution to generate trace IDs and measure duration.
   */
  static async track(
    request: RequestPayload,
    handler: (requestId: string, correlationId: string) => Promise<{ statusCode: number }>
  ): Promise<TrackedRequestResult> {
    const startTime = process.hrtime.bigint();
    const timestamp = new Date().toISOString();
    
    // Generate a unique ID for this specific request
    const requestId = crypto.randomUUID();
    
    // Preserve correlation ID if it came from an upstream microservice, otherwise generate a new one
    const incomingCorrelationId = request.headers['x-correlation-id'] || request.headers['x-request-id'];
    const correlationId = (incomingCorrelationId as string) || crypto.randomUUID();

    let responseCode = 500;

    try {
      // Execute the actual request handler/controller
      const response = await handler(requestId, correlationId);
      responseCode = response.statusCode;
    } catch (error) {
      responseCode = 500;
      throw error; // Let the Global Error Handler catch it
    } finally {
      const endTime = process.hrtime.bigint();
      // Convert nanoseconds to milliseconds for standard telemetry
      const durationMs = Number(endTime - startTime) / 1_000_000;

      const result: TrackedRequestResult = {
        requestId,
        correlationId,
        timestamp,
        durationMs,
        responseCode,
      };

      this.recordTelemetry(request, result);
      
      // eslint-disable-next-line no-unsafe-finally
      return result;
    }
  }

  /**
   * Internal hook to ship telemetry data to a log aggregator or metrics collector
   * (e.g., OpenTelemetry, Prometheus, or the centralized Logger).
   */
  private static recordTelemetry(request: RequestPayload, result: TrackedRequestResult): void {
    // Implementation ready for external logger injection.
    // Example: Logger.info(`HTTP ${request.method} ${request.url}`, { result });
  }
}