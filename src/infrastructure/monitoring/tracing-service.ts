import { ITracingService } from './observability-contract';

export class TracingService implements ITracingService {
  private activeTraces = new Map<string, { name: string; startTime: number }>();

  startTrace(operationName: string): string {
    // اصلاح نحوه تولید شناسه تصادفی برای جلوگیری از خطای کامپایلر
    const randomStr = Math.random().toString(36).substring(2, 11);
    const traceId = `trc_${randomStr}_${Date.now()}`;
    
    this.activeTraces.set(traceId, { name: operationName, startTime: performance.now() });
    return traceId;
  }

  endTrace(traceId: string, metadata?: Record<string, any>): void {
    const trace = this.activeTraces.get(traceId);
    if (!trace) return;

    const duration = performance.now() - trace.startTime;
    this.activeTraces.delete(traceId);

    // Securely structured trace output matching Phase 5 specifications
    console.log(JSON.stringify({
      level: 'INFO',
      module: 'Tracing',
      operation: trace.name,
      traceId,
      durationMs: Number(duration.toFixed(2)),
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    }));
  }
}