import { EmailTemplate, EmailTemplateType } from './email-types';

/**
 * Enterprise Email Template Engine.
 * Responsible for rendering structured HTML and text contents for all supported commerce notifications.
 */
export class EmailTemplateEngine {
  /**
   * Renders a given email template into subject, HTML body, and plain text body.
   */
  public static render(template: EmailTemplate): { subject: string; html: string; text: string } {
    const { templateType, variables } = template;

    switch (templateType) {
      case EmailTemplateType.ORDER_CONFIRMATION:
        return {
          subject: `Order Confirmation #${variables.orderId || 'N/A'}`,
          html: `<h1>Thank you for your order!</h1><p>Your order #${variables.orderId} has been successfully placed. Total: $${variables.totalAmount || '0.00'}.</p>`,
          text: `Thank you for your order! Your order #${variables.orderId} has been successfully placed. Total: $${variables.totalAmount || '0.00'}.`,
        };

      case EmailTemplateType.PAYMENT_SUCCESS:
        return {
          subject: `Payment Successful - Transaction #${variables.paymentId || 'N/A'}`,
          html: `<h1>Payment Received</h1><p>We successfully processed your payment of $${variables.amount || '0.00'} for order #${variables.orderId}.</p>`,
          text: `Payment Received. We successfully processed your payment of $${variables.amount || '0.00'} for order #${variables.orderId}.`,
        };

      case EmailTemplateType.PAYMENT_FAILURE:
        return {
          subject: `Payment Failed for Order #${variables.orderId || 'N/A'}`,
          html: `<h1>Payment Unsuccessful</h1><p>Unfortunately, your payment for order #${variables.orderId} failed. Reason: ${variables.reason || 'Unknown'}.</p>`,
          text: `Payment Unsuccessful. Unfortunately, your payment for order #${variables.orderId} failed. Reason: ${variables.reason || 'Unknown'}.`,
        };

      case EmailTemplateType.WALLET_UPDATE:
        return {
          subject: `Wallet Balance Update`,
          html: `<h1>Wallet Updated</h1><p>Your wallet balance has changed by $${variables.delta || '0.00'}. New balance: $${variables.newBalance || '0.00'}.</p>`,
          text: `Wallet Updated. Your wallet balance has changed by $${variables.delta || '0.00'}. New balance: $${variables.newBalance || '0.00'}.`,
        };

      case EmailTemplateType.RETURN_APPROVED:
        return {
          subject: `Return Request Approved #${variables.returnId || 'N/A'}`,
          html: `<h1>Return Approved</h1><p>Your return request for order #${variables.orderId} has been approved. Reason: ${variables.reason || 'N/A'}.</p>`,
          text: `Return Approved. Your return request for order #${variables.orderId} has been approved.`,
        };

      case EmailTemplateType.COUPON_RECEIVED:
        return {
          subject: `Special Coupon Received: ${variables.couponCode || ''}`,
          html: `<h1>You got a coupon!</h1><p>Use code <b>${variables.couponCode}</b> on your next purchase.</p>`,
          text: `You got a coupon! Use code ${variables.couponCode} on your next purchase.`,
        };

      case EmailTemplateType.CAMPAIGN_STARTED:
        return {
          subject: `New Campaign Live: ${variables.title || ''}`,
          html: `<h1>Campaign Started!</h1><p>${variables.title} is now active. Check out the latest offers!</p>`,
          text: `Campaign Started! ${variables.title} is now active. Check out the latest offers!`,
        };

      default:
        return {
          subject: `Notification from Enterprise Platform`,
          html: `<p>You have a new notification.</p>`,
          text: `You have a new notification.`,
        };
    }
  }
}