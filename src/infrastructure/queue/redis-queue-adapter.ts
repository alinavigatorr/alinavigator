import { Queue, Worker, Job } from 'bullmq';
import { IQueueContract } from './queue-contract';
import { EnqueueResult, IJobPayload, JobStatus, QueueJobOptions, QueueName } from './queue-types';
import { queueConfig } from './queue-config';

/**
 * Redis and BullMQ Implementation of the Queue Contract.
 * Responsible for physical connection, job persistence, and worker instantiation.
 */
export class RedisQueueAdapter implements IQueueContract {
  private queues: Map<QueueName, Queue> = new Map();
  private workers: Map<QueueName, Worker> = new Map();

  /**
   * Retrieves an existing BullMQ queue or creates a new one if it doesn't exist.
   */
  private getQueue(queueName: QueueName): Queue {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
        connection: queueConfig.redis,
        defaultJobOptions: queueConfig.defaultJobOptions,
        prefix: queueConfig.prefix,
      });
      this.queues.set(queueName, queue);
    }
    return this.queues.get(queueName)!;
  }

  public async enqueue<T extends IJobPayload>(
    queueName: QueueName,
    payload: T,
    options?: QueueJobOptions
  ): Promise<EnqueueResult> {
    const queue = this.getQueue(queueName);
    
    // Default job name is the queue name, can be overridden by options.jobId
    const jobName = options?.jobId || `${queueName}_job_${Date.now()}`;
    
    const job = await queue.add(jobName, payload, {
      jobId: options?.jobId,
      delay: options?.delay,
      attempts: options?.attempts,
      backoff: options?.backoff,
      priority: options?.priority,
    });

    return {
      jobId: job.id!,
      queueName,
      status: JobStatus.WAITING,
    };
  }

  public process<T extends IJobPayload>(
    queueName: QueueName,
    handler: (jobId: string, payload: T) => Promise<void>
  ): void {
    if (this.workers.has(queueName)) {
      console.warn(`[RedisQueueAdapter] A worker is already processing queue: ${queueName}`);
      return;
    }

    const worker = new Worker(
      queueName,
      async (job: Job) => {
        await handler(job.id!, job.data as T);
      },
      {
        connection: queueConfig.redis,
        prefix: queueConfig.prefix,
      }
    );

    worker.on('completed', (job) => {
      console.log(`[Queue Worker] Job ${job.id} completed successfully in queue: ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[Queue Worker] Job ${job?.id} failed in queue: ${queueName}. Error: ${err.message}`);
    });

    this.workers.set(queueName, worker);
    console.log(`[RedisQueueAdapter] Worker initialized and listening to queue: ${queueName}`);
  }

  public async retry(queueName: QueueName, jobId: string): Promise<boolean> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);
    if (job && await job.isFailed()) {
      await job.retry();
      return true;
    }
    return false;
  }

  public async remove(queueName: QueueName, jobId: string): Promise<boolean> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }

  public async getStatus(queueName: QueueName, jobId: string): Promise<JobStatus | null> {
    const queue = this.getQueue(queueName);
    const job = await queue.getJob(jobId);
    
    if (!job) return null;

    const state = await job.getState();
    
    // Map BullMQ states to internal JobStatus
    switch (state) {
      case 'waiting': return JobStatus.WAITING;
      case 'active': return JobStatus.ACTIVE;
      case 'completed': return JobStatus.COMPLETED;
      case 'failed': return JobStatus.FAILED;
      case 'delayed': return JobStatus.DELAYED;
      default: return null;
    }
  }
}