import { ICacheAdapter } from './cache-contract';

interface CacheItem<T> {
  value: T;
  expiry: number | null;
  tags: Set<string>;
}

export class MemoryCacheAdapter implements ICacheAdapter {
  private cache = new Map<string, CacheItem<any>>();
  private tagIndex = new Map<string, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && Date.now() > item.expiry) {
      await this.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number, tags: string[] = []): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    const tagSet = new Set(tags);
    
    this.cache.set(key, { value, expiry, tags: tagSet });

    tagSet.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });
  }

  async delete(key: string): Promise<void> {
    const item = this.cache.get(key);
    if (item) {
      item.tags.forEach(tag => {
        this.tagIndex.get(tag)?.delete(key);
      });
      this.cache.delete(key);
    }
  }

  async exists(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== null;
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        await this.delete(key);
      }
    }
  }

  async invalidateTag(tag: string): Promise<void> {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      for (const key of keys) {
        this.cache.delete(key);
      }
      this.tagIndex.delete(tag);
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.tagIndex.clear();
  }
}