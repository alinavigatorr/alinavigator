import { ICacheAdapter } from './cache-contract';

export class RedisCacheAdapter implements ICacheAdapter {
  // این آداپتور مستقل پیاده‌سازی شده و در صورت عدم وجود کلاینت فیزیکی، به عنوان الگو عمل می‌کند
  constructor(private client?: any) {}

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.client) return;
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) return;
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;
    const res = await this.client.exists(key);
    return res === 1;
  }

  async invalidate(pattern: string): Promise<void> {
    if (!this.client) return;
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  async invalidateTag(tag: string): Promise<void> {
    // پیاده‌سازی بر اساس ساختار تگ‌ها در Redis
    await this.invalidate(`tag:${tag}:*`);
  }

  async clear(): Promise<void> {
    if (!this.client) return;
    await this.client.flushAll();
  }
}