import { EmailTemplate } from './email-contract';

export interface RenderedTemplate {
  subject: string;
  htmlBody: string;
}

/**
 * Enterprise Email Template Engine.
 * Responsible for compiling dynamic data into standardized HTML email templates.
 */
export class EmailTemplateService {
  
  /**
   * Compiles the requested template with the provided dynamic data.
   */
  public render(template: EmailTemplate, data: Record<string, any> = {}): RenderedTemplate {
    switch (template) {
      case EmailTemplate.ORDER_CONFIRMATION:
        return this.renderOrderConfirmation(data);
      case EmailTemplate.PAYMENT_SUCCESS:
        return this.renderPaymentSuccess(data);
      case EmailTemplate.INVOICE_DELIVERY:
        return this.renderInvoiceDelivery(data);
      case EmailTemplate.SYSTEM_NOTIFICATION:
        return this.renderSystemNotification(data);
      default:
        throw new Error(`[EmailTemplateService] Template not found: ${template}`);
    }
  }

  private renderOrderConfirmation(data: Record<string, any>): RenderedTemplate {
    return {
      subject: `Order Confirmation - #${data.orderNumber}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Thank you for your order!</h2>
          <p>Dear ${data.customerName || 'Customer'},</p>
          <p>We have successfully received your order <strong>#${data.orderNumber}</strong>.</p>
          <p>We will notify you once your items are on their way.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Marketplace Platform Team</p>
        </div>
      `,
    };
  }

  private renderPaymentSuccess(data: Record<string, any>): RenderedTemplate {
    return {
      subject: `Payment Received - Order #${data.orderNumber}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Payment Successful</h2>
          <p>Your payment of <strong>$${data.amount}</strong> for order <strong>#${data.orderNumber}</strong> has been processed securely.</p>
          <p>Thank you for shopping with us.</p>
        </div>
      `,
    };
  }

  private renderInvoiceDelivery(data: Record<string, any>): RenderedTemplate {
    return {
      subject: `Your Invoice for Order #${data.orderNumber}`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>Invoice Attached</h2>
          <p>Dear ${data.customerName || 'Customer'},</p>
          <p>Please find attached the official invoice for your recent purchase (Order #${data.orderNumber}).</p>
          <p>If you have any questions, feel free to reply to this email.</p>
        </div>
      `,
    };
  }

  private renderSystemNotification(data: Record<string, any>): RenderedTemplate {
    return {
      subject: data.customSubject || `System Notification`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h3>Notification</h3>
          <p>${data.message}</p>
        </div>
      `,
    };
  }
}