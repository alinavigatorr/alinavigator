/**
 * Defines all core data structures, enums, and types for the Email Notification Layer.
 */

export enum EmailPriority {
    LOW = 'LOW',
    NORMAL = 'NORMAL',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
  }
  
  export enum EmailTemplateType {
    ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    PAYMENT_FAILURE = 'PAYMENT_FAILURE',
    WALLET_UPDATE = 'WALLET_UPDATE',
    RETURN_APPROVED = 'RETURN_APPROVED',
    COUPON_RECEIVED = 'COUPON_RECEIVED',
    CAMPAIGN_STARTED = 'CAMPAIGN_STARTED',
  }
  
  export interface EmailRecipient {
    email: string;
    name: string;
  }
  
  export interface EmailAttachment {
    filename: string;
    contentType: string;
    contentBase64: string;
  }
  
  export interface EmailTemplate {
    templateType: EmailTemplateType;
    variables: Record<string, unknown>;
  }
  
  export interface EmailMessage {
    id: string;
    recipient: EmailRecipient;
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    priority: EmailPriority;
    attachments?: EmailAttachment[];
    createdAt: Date;
    retryCount: number;
  }
  
  export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
    timestamp: Date;
  }