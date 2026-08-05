import { ICacheAdapter, CacheMetrics } from './cache-contract';

export class CacheService {
  private hits = 0;
  private misses = 0;
  private totalLookupTimeMs = 0;
  private lookupCount = 0;

  constructor(private adapter: ICacheAdapter) {}

  async get<T>(key: string): Promise<T | null> {
    const start = performance.now();
    try {
      const result = await this.adapter.get<T>(key);
      if (result !== null) {
        this.hits++;
      } else {
        this.misses++;
      }
      return result;
    } finally {
      const duration = performance.now() - start;
      this.totalLookupTimeMs += duration;
      this.lookupCount++;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.adapter.set(key, value, ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.adapter.delete(key);
  }

  async invalidateTag(tag: string): Promise<void> {
    await this.adapter.invalidateTag(tag);
  }

  getMetrics(): CacheMetrics {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio: total === 0 ? 0 : Number((this.hits / total).toFixed(2)),
      avgLookupTimeMs: this.lookupCount === 0 ? 0 : Number((this.totalLookupTimeMs / this.lookupCount).toFixed(2)),
    };
  }
}