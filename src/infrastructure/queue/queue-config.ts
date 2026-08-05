/**
 * Configuration for Redis connection and BullMQ default settings.
 * Uses environment variables with safe fallbacks for local development.
 */

export const queueConfig = {
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      // BullMQ requires maxRetriesPerRequest to be strictly set to null
      maxRetriesPerRequest: null,
    },
    prefix: process.env.QUEUE_PREFIX || 'marketplace_queue',
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000, // Starts with 2s delay, then 4s, 8s, etc.
      },
      // Automatically clean up successfully completed jobs to save Redis memory
      removeOnComplete: true, 
      // Keep failed jobs in Redis for debugging and manual retry (Dead Letter Placeholder)
      removeOnFail: false,
    },
  };