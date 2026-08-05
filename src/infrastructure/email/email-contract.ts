/**
 * Core Types and Interfaces for the Email Infrastructure.
 * Decouples the application from any specific email provider.
 */

export interface EmailRecipient {
    name?: string;
    email: string;
  }
  
  export interface EmailAttachment {
    filename: string;
    content: Buffer;
    mimeType: string;
  }
  
  export enum EmailTemplate {
    ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    INVOICE_DELIVERY = 'INVOICE_DELIVERY',
    SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  }
  
  export interface EmailMessage {
    to: EmailRecipient;
    subject: string;
    template?: EmailTemplate;
    htmlBody?: string;
    textBody?: string;
    dynamicTemplateData?: Record<string, any>;
    attachments?: EmailAttachment[];
  }
  
  export interface EmailResult {
    success: boolean;
    messageId?: string;
    provider?: string;
    error?: string;
    timestamp: Date;
  }
  
  /**
   * The strict contract that every provider adapter (Resend, SendGrid, SMTP, etc.) must implement.
   */
  export interface IEmailProvider {
    send(message: EmailMessage): Promise<EmailResult>;
  }