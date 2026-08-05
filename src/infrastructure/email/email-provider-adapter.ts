import { EmailMessage, EmailResult, IEmailProvider } from './email-contract';
import { emailConfig } from './email-config';

/**
 * Mock Adapter for local development and testing.
 * Prevents actual emails from being sent and logs them to the console instead.
 */
class MockEmailAdapter implements IEmailProvider {
  public async send(message: EmailMessage): Promise<EmailResult> {
    console.log('\n================ MOCK EMAIL SENT ================');
    console.log(`To: ${message.to.email}`);
    console.log(`Subject: ${message.subject}`);
    console.log(`Attachments: ${message.attachments?.length || 0}`);
    console.log('=================================================\n');

    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      provider: 'mock',
      timestamp: new Date(),
    };
  }
}

/**
 * Resend.com Adapter Implementation (Example of a real production provider).
 * Translates our internal EmailMessage contract into Resend's API format.
 */
class ResendEmailAdapter implements IEmailProvider {
  public async send(message: EmailMessage): Promise<EmailResult> {
    try {
      // Format attachments for Resend API
      const formattedAttachments = message.attachments?.map(att => ({
        filename: att.filename,
        content: att.content.toString('base64'), // Resend requires base64 or buffer formats based on SDK
      }));

      // In a real scenario, you would use the 'resend' npm package here.
      // Using native fetch for architectural demonstration to avoid locking into SDKs.
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${emailConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${emailConfig.fromName} <${emailConfig.fromAddress}>`,
          to: [message.to.email],
          reply_to: emailConfig.replyTo,
          subject: message.subject,
          html: message.htmlBody,
          text: message.textBody,
          attachments: formattedAttachments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();

      return {
        success: true,
        messageId: data.id,
        provider: 'resend',
        timestamp: new Date(),
      };
    } catch (error: any) {
      console.error('[ResendEmailAdapter] Delivery failed:', error.message);
      return {
        success: false,
        error: error.message,
        provider: 'resend',
        timestamp: new Date(),
      };
    }
  }
}

/**
 * Factory class to instantiate the correct email provider adapter
 * based on the current environment configuration.
 */
export class EmailProviderFactory {
  public static createProvider(): IEmailProvider {
    switch (emailConfig.provider.toLowerCase()) {
      case 'resend':
        if (!emailConfig.apiKey) throw new Error('Missing EMAIL_API_KEY for Resend provider');
        return new ResendEmailAdapter();
      
      // Future providers can be added here seamlessly:
      // case 'sendgrid': return new SendGridEmailAdapter();
      // case 'ses': return new AwsSesEmailAdapter();
      
      case 'mock':
      default:
        return new MockEmailAdapter();
    }
  }
}