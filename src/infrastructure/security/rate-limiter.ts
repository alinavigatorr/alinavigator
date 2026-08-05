export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
  }
  
  export interface IRateLimiter {
    consume(identifier: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
  }
  
  export class MemoryRateLimiter implements IRateLimiter {
    private storage = new Map<string, { count: number; resetTime: number }>();
  
    async consume(identifier: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
      const now = Date.now();
      const windowMs = windowSeconds * 1000;
      
      let record = this.storage.get(identifier);
  
      if (!record || now > record.resetTime) {
        record = { count: 0, resetTime: now + windowMs };
        this.storage.set(identifier, record);
      }
  
      record.count++;
      const remaining = Math.max(0, limit - record.count);
      const success = record.count <= limit;
  
      return {
        success,
        limit,
        remaining,
        resetTime: record.resetTime,
      };
    }
  }