export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    details: Record<string, { status: 'up' | 'down'; latencyMs?: number; message?: string }>;
  }
  
  export interface MetricPoint {
    name: string;
    value: number;
    tags?: Record<string, string | number>;
    timestamp: number;
  }
  
  export interface IMetricsService {
    incrementCounter(name: string, tags?: Record<string, string | number>): void;
    recordTiming(name: string, durationMs: number, tags?: Record<string, string | number>): void;
    getMetrics(): MetricPoint[];
  }
  
  export interface ITracingService {
    startTrace(operationName: string): string; // Returns trace/correlation ID
    endTrace(traceId: string, metadata?: Record<string, any>): void;
  }