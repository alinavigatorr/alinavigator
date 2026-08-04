import { IEmailContract } from './email-contract';
import { EmailMessage, EmailPriority, EmailResult, EmailTemplateType } from './email-types';
import { EmailQueue } from './email-queue';
import { EmailTemplateEngine } from './email-template-engine';
import { IEventHandler } from '../../events/event-handler';
import { DomainEvent, DomainEventType } from '../../events/event-types';

/**
 * Enterprise Email Service.
 * Implements IEmailContract and acts as an event subscriber to automatically 
 * consume commerce events, render email templates, and queue them for delivery.
 */
export class EmailService implements IEmailContract, IEventHandler<any> {
  public readonly handlerName = 'EmailServiceHandler';
  public handledEventType: DomainEventType = DomainEventType.ORDER_CREATED; // Default primary, overridden dynamically if needed

  private queue: EmailQueue = new EmailQueue();

  constructor() {}

  /**
   * Handles incoming domain events from the Event Bus and triggers email generation.
   */
  public async handle(event: DomainEvent<any>): Promise<void> {
    try {
      let templateType: EmailTemplateType;
      let variables = event.payload;
      let recipientEmail = variables.email || 'customer@example.com';
      let recipientName = variables.name || 'Valued Customer';

      switch (event.type) {
        case DomainEventType.ORDER_CREATED:
          templateType = EmailTemplateType.ORDER_CONFIRMATION;
          break;
        case DomainEventType.PAYMENT_SUCCEEDED:
          templateType = EmailTemplateType.PAYMENT_SUCCESS;
          break;
        case DomainEventType.PAYMENT_FAILED:
          templateType = EmailTemplateType.PAYMENT_FAILURE;
          break;
        case DomainEventType.WALLET_UPDATED:
          templateType = EmailTemplateType.WALLET_UPDATE;
          break;
        case DomainEventType.NOTIFICATION_CREATED:
          // Generic notification fallback mapping
          return;
        default:
          return;
      }

      const rendered = this.render({ templateType, variables });

      const message: EmailMessage = {
        id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        recipient: { email: recipientEmail, name: recipientName },
        subject: rendered.subject,
        bodyHtml: rendered.html,
        bodyText: rendered.text,
        priority: EmailPriority.NORMAL,
        createdAt: new Date(),
        retryCount: 0,
      };

      await this.queue(message);
    } catch (error: any) {
      console.error(`[EmailService] Failed to handle event [${event.type}] for email dispatch:`, error.message);
    }
  }

  /**
   * Immediately sends an email message (Simulated transport layer).
   */
  public async send(message: EmailMessage): Promise<EmailResult> {
    try {
      console.log(`[EmailService Transport] Sending email to <${message.recipient.email}> | Subject: "${message.subject}"`);
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        timestamp: new Date(),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown delivery error',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Enqueues an email message into the internal queue.
   */
  public async queue(message: EmailMessage): Promise<void> {
    await this.queue.enqueue(message);
    console.log(`[EmailService] Email message ${message.id} enqueued successfully.`);
  }

  /**
   * Cancels a queued email message.
   */
  public async cancel(messageId: string): Promise<boolean> {
    return await this.queue.cancel(messageId);
  }

  /**
   * Retries sending a failed email message.
   */
  public async retry(messageId: string): Promise<EmailResult> {
    // Placeholder for manual retry trigger
    const dummyMsg: EmailMessage = {
      id: messageId,
      recipient: { email: 'retry@example.com', name: 'User' },
      subject: 'Retry Subject',
      bodyHtml: '<p>Retry body</p>',
      priority: EmailPriority.HIGH,
      createdAt: new Date(),
      retryCount: 0,
    };
    return await this.send(dummyMsg);
  }

  /**
   * Renders a given email template.
   */
  public render(template: Parameters<IEmailContract['render']>[0]) {
    return EmailTemplateEngine.render(template);
  }
}