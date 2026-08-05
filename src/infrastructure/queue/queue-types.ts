/**
 * Core types and enums for the distributed queue architecture.
 */

export enum QueueName {
    EMAIL = 'email_queue',
    NOTIFICATION = 'notification_queue',
    BACKGROUND_TASKS = 'background_tasks_queue',
  }
  
  export enum JobStatus {
    WAITING = 'waiting',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    FAILED = 'failed',
    DELAYED = 'delayed',
  }
  
  export interface QueueJobOptions {
    jobId?: string;
    delay?: number; // Delay in milliseconds
    attempts?: number; // Number of retries
    backoff?: {
      type: 'fixed' | 'exponential';
      delay: number;
    };
    priority?: number;
  }
  
  export interface EnqueueResult {
    jobId: string;
    queueName: QueueName;
    status: JobStatus;
  }
  
  export interface IJobPayload {
    [key: string]: any;
  }