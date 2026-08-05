import { QueueName, QueueJobOptions, EnqueueResult, JobStatus, IJobPayload } from './queue-types';

/**
 * Enterprise Queue Provider Contract.
 * Defines standard operations for distributed background job processing.
 * Ensures the core application remains agnostic of the underlying queue technology.
 */
export interface IQueueContract {
  /**
   * Enqueues a new job into the specified queue.
   */
  enqueue<T extends IJobPayload>(
    queueName: QueueName,
    payload: T,
    options?: QueueJobOptions
  ): Promise<EnqueueResult>;

  /**
   * Registers a processor function (Worker) to handle jobs from a specific queue.
   * The handler contains no business logic, only task execution rules.
   */
  process<T extends IJobPayload>(
    queueName: QueueName,
    handler: (jobId: string, payload: T) => Promise<void>
  ): void;

  /**
   * Retries a failed job (Dead Letter Placeholder recovery).
   */
  retry(queueName: QueueName, jobId: string): Promise<boolean>;

  /**
   * Removes a job from the queue permanently.
   */
  remove(queueName: QueueName, jobId: string): Promise<boolean>;

  /**
   * Retrieves the current status of a specific job.
   */
  getStatus(queueName: QueueName, jobId: string): Promise<JobStatus | null>;
}