import { EmailMessage, EmailResult, IEmailProvider } from './email-contract';
import { EmailTemplateService } from './email-template-service';

/**
 * Enterprise Email Service.
 * Coordinates template rendering and delivery via the injected provider adapter.
 * This is the primary class used by the background Queue Workers.
 */
export class EmailService {
  constructor(
    private readonly provider: IEmailProvider,
    private readonly templateEngine: EmailTemplateService
  ) {}

  /**
   * Dispatches an email message.
   * If a template is specified in the message, it automatically compiles the 
   * subject and HTML body before handing it off to the provider.
   */
  public async send(message: EmailMessage): Promise<EmailResult> {
    try {
      // Step 1: Process template if provided
      if (message.template) {
        const rendered = this.templateEngine.render(
          message.template, 
          message.dynamicTemplateData
        );
        
        // Override or set the subject and HTML body from the rendered template
        message.subject = rendered.subject;
        message.htmlBody = rendered.htmlBody;
      }

      // Step 2: Validation
      if (!message.htmlBody && !message.textBody) {
        throw new Error('Email message must contain either an HTML body or a Text body.');
      }

      if (!message.subject) {
        throw new Error('Email message must contain a subject.');
      }

      // Step 3: Delegate the actual delivery to the provider adapter (Resend, SES, Mock, etc.)
      const result = await this.provider.send(message);

      // Step 4: Internal logging based on provider's result
      if (!result.success) {
        console.error(`[EmailService] Failed to deliver email to <${message.to.email}>. Provider error: ${result.error}`);
      } else {
        console.log(`[EmailService] Email successfully queued/sent to <${message.to.email}> via [${result.provider}]`);
      }

      return result;
      
    } catch (error: any) {
      console.error(`[EmailService] Critical exception during email processing:`, error.message);
      
      // Return a standard failure result to trigger BullMQ retry logic
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }
}