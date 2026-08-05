export interface ICacheAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    invalidate(pattern: string): Promise<void>;
    invalidateTag(tag: string): Promise<void>;
    clear(): Promise<void>;
  }
  
  export interface CacheMetrics {
    hits: number;
    misses: number;
    hitRatio: number;
    avgLookupTimeMs: number;
  }