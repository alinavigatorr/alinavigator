import { EmailMessage } from './email-types';

/**
 * Enterprise In-Memory Email Queue.
 * Manages asynchronous email buffering, retry logic, and a dead-letter placeholder 
 * for undeliverable messages.
 */
export class EmailQueue {
  private queue: EmailMessage[] = [];
  private deadLetterQueue: { message: EmailMessage; failedAt: Date; error: string }[] = [];
  private maxRetries: number = 3;

  /**
   * Enqueues an email message for delivery.
   */
  public async enqueue(message: EmailMessage): Promise<void> {
    this.queue.push({
      ...message,
      retryCount: message.retryCount ?? 0,
    });
  }

  /**
   * Dequeues the next pending email message for processing.
   */
  public async dequeue(): Promise<EmailMessage | null> {
    if (this.queue.length === 0) {
      return null;
    }
    return this.queue.shift() || null;
  }

  /**
   * Handles failed delivery by either re-queueing (if retry limit permits) 
   * or moving the message to the dead-letter queue.
   */
  public async handleFailure(message: EmailMessage, error: string): Promise<void> {
    if (message.retryCount < this.maxRetries) {
      const retriedMessage: EmailMessage = {
        ...message,
        retryCount: message.retryCount + 1,
      };
      // Push back to the front or end of queue for retry
      this.queue.push(retriedMessage);
      console.warn(`[EmailQueue] Message ${message.id} failed delivery. Re-queuing (Attempt ${retriedMessage.retryCount}/${this.maxRetries})...`);
    } else {
      this.deadLetterQueue.push({
        message,
        failedAt: new Date(),
        error,
      });
      console.error(`[EmailQueue] Message ${message.id} exceeded max retries (${this.maxRetries}). Moved to Dead-Letter Queue.`);
    }
  }

  /**
   * Cancels a queued message by its ID.
   */
  public async cancel(messageId: string): Promise<boolean> {
    const index = this.queue.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Returns current active queue size.
   */
  public size(): number {
    return this.queue.length;
  }

  /**
   * Returns items currently in the Dead-Letter Queue.
   */
  public getDeadLetterQueue() {
    return [...this.deadLetterQueue];
  }
}