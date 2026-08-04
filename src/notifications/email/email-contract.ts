import { EmailMessage, EmailResult, EmailTemplate } from './email-types';

/**
 * Enterprise Email Provider Contract.
 * Defines standard operations for dispatching, queueing, and rendering emails 
 * without binding to any specific transport technology (e.g., SMTP, SendGrid).
 */
export interface IEmailContract {
  /**
   * Immediately sends an email message.
   */
  send(message: EmailMessage): Promise<EmailResult>;

  /**
   * Enqueues an email message for asynchronous delivery.
   */
  queue(message: EmailMessage): Promise<void>;

  /**
   * Cancels a queued or pending email by its identifier.
   */
  cancel(messageId: string): Promise<boolean>;

  /**
   * Retries sending a failed email message.
   */
  retry(messageId: string): Promise<EmailResult>;

  /**
   * Renders an email template with given variables into HTML/Text content.
   */
  render(template: EmailTemplate): { subject: string; html: string; text: string };
}