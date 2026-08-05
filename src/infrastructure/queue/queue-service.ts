import { IQueueContract } from './queue-contract';
import { EnqueueResult, IJobPayload, JobStatus, QueueJobOptions, QueueName } from './queue-types';

/**
 * Enterprise Queue Service.
 * Acts as the application-facing facade for background job processing.
 * Injects the queue adapter (Redis/BullMQ) to decouple application logic from infrastructure.
 */
export class QueueService {
  constructor(private readonly queueAdapter: IQueueContract) {}

  /**
   * Pushes a new job into the specified distributed queue.
   * @param queueName Target queue (e.g., EMAIL, NOTIFICATION)
   * @param payload The data required to process the job
   * @param options Configuration for retries, backoff, and delays
   */
  public async enqueue<T extends IJobPayload>(
    queueName: QueueName,
    payload: T,
    options?: QueueJobOptions
  ): Promise<EnqueueResult> {
    return this.queueAdapter.enqueue(queueName, payload, options);
  }

  /**
   * Retries a job that has failed and is in the dead-letter state.
   */
  public async retry(queueName: QueueName, jobId: string): Promise<boolean> {
    return this.queueAdapter.retry(queueName, jobId);
  }

  /**
   * Permanently removes a job from the queue.
   */
  public async remove(queueName: QueueName, jobId: string): Promise<boolean> {
    return this.queueAdapter.remove(queueName, jobId);
  }

  /**
   * Checks the current processing status of a job.
   */
  public async getStatus(queueName: QueueName, jobId: string): Promise<JobStatus | null> {
    return this.queueAdapter.getStatus(queueName, jobId);
  }
}