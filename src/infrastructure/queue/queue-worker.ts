import { IQueueContract } from './queue-contract';
import { QueueName } from './queue-types';
import { IEmailContract } from '../../notifications/email/email-contract';
import { EmailMessage } from '../../notifications/email/email-types';

/**
 * Enterprise Queue Worker Manager.
 * Initializes background workers to consume jobs from Redis/BullMQ.
 * Delegates the actual task execution to the respective injected services.
 */
export class QueueWorker {
  constructor(
    private readonly queueAdapter: IQueueContract,
    private readonly emailService: IEmailContract
  ) {}

  /**
   * Bootstraps and starts all isolated background workers.
   */
  public start(): void {
    console.log('[QueueWorker] Starting background workers...');
    this.setupEmailWorker();
    // Additional workers (e.g., BackgroundTasks, Notifications) can be initialized here
  }

  /**
   * Configures the worker responsible for consuming the EMAIL queue.
   */
  private setupEmailWorker(): void {
    this.queueAdapter.process<EmailMessage>(
      QueueName.EMAIL,
      async (jobId, payload) => {
        console.log(`[EmailWorker] Processing email job [${jobId}] for <${payload.recipient.email}>`);
        
        // Delegate execution to the real Email Service
        const result = await this.emailService.send(payload);

        // If the service reports a failure, throw an error to trigger BullMQ's automatic retry/backoff mechanism
        if (!result.success) {
          throw new Error(`Email delivery failed: ${result.error}`);
        }
      }
    );
  }
}