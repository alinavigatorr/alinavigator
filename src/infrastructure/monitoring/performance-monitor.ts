import { TraceContext } from './trace-context';

export enum OperationType {
  REPOSITORY = 'REPOSITORY',
  SERVICE = 'SERVICE',
  REQUEST = 'REQUEST',
  EXTERNAL_API = 'EXTERNAL_API',
}

export interface PerformanceMetric {
  operationName: string;
  operationType: OperationType;
  durationMs: number;
  isSlow: boolean;
}

/**
 * Enterprise Performance Monitor.
 * Measures execution duration of critical paths and identifies performance bottlenecks.
 * Ready to export metrics to Prometheus (Histograms) or OpenTelemetry.
 */
export class PerformanceMonitor {
  // Default threshold for identifying a slow operation (e.g., 500ms)
  private static readonly SLOW_QUERY_THRESHOLD_MS = 500;

  /**
   * Wraps an asynchronous operation to precisely measure its execution time.
   * 
   * @param operationName The descriptive name of the operation (e.g., 'UserRepository.findById')
   * @param operationType The architectural layer of the operation
   * @param operation The actual asynchronous function to execute
   * @param customThresholdMs Optional override for the slow query threshold
   */
  static async measure<T>(
    operationName: string,
    operationType: OperationType,
    operation: () => Promise<T>,
    customThresholdMs: number = this.SLOW_QUERY_THRESHOLD_MS
  ): Promise<T> {
    const startTime = process.hrtime.bigint();
    
    try {
      // Execute the injected operation
      return await operation();
    } finally {
      const endTime = process.hrtime.bigint();
      
      // Convert nanoseconds to milliseconds
      const durationMs = Number(endTime - startTime) / 1_000_000;
      const isSlow = durationMs > customThresholdMs;

      this.recordMetric({
        operationName,
        operationType,
        durationMs,
        isSlow,
      });
    }
  }

  /**
   * Internal telemetry recorder.
   */
  private static recordMetric(metric: PerformanceMetric): void {
    const traceContext = TraceContext.get();
    
    const telemetryPayload = {
      ...metric,
      traceId: traceContext?.requestId || 'UNTRACKED',
      environment: traceContext?.environment || process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // If the operation exceeds the threshold, emit a high-priority warning
    if (metric.isSlow) {
      console.warn(`[PERF_WARN] SLOW OPERATION DETECTED: ${JSON.stringify(telemetryPayload)}`);
    } else {
      // For standard metrics, we output as info or directly ship to a metrics collector
      // Example: MetricsCollector.observe(metric.durationMs, { type: metric.operationType })
      if (process.env.NODE_ENV !== 'production') {
        console.info(`[PERF_METRIC] ${JSON.stringify(telemetryPayload)}`);
      }
    }
  }
}