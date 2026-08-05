import { IMetricsService, MetricPoint } from './observability-contract';

export class MetricsService implements IMetricsService {
  private counters = new Map<string, number>();
  private timings = new Map<string, number[]>();

  incrementCounter(name: string, tags?: Record<string, string | number>): void {
    const key = this.formatKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + 1);
  }

  recordTiming(name: string, durationMs: number, tags?: Record<string, string | number>): void {
    const key = this.formatKey(name, tags);
    if (!this.timings.has(key)) {
      this.timings.set(key, []);
    }
    this.timings.get(key)!.push(durationMs);
  }

  getMetrics(): MetricPoint[] {
    const points: MetricPoint[] = [];
    const now = Date.now();

    for (const [key, value] of this.counters.entries()) {
      points.push({ name: key, value, timestamp: now });
    }

    for (const [key, values] of this.timings.entries()) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      points.push({ name: `${key}_avg_ms`, value: Number(avg.toFixed(2)), timestamp: now });
    }

    return points;
  }

  private formatKey(name: string, tags?: Record<string, string | number>): string {
    if (!tags || Object.keys(tags).length === 0) return name;
    const tagString = Object.entries(tags)
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${tagString}}`;
  }
}