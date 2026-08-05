import { Invoice } from '../../domain/invoice/invoice-types';

/**
 * Generates a clean, professional HTML representation of the invoice.
 * Designed to be agnostic of UI frameworks (No React) so it can be safely 
 * executed in background workers for PDF conversion.
 */
export function generateInvoiceHtml(invoice: Invoice): string {
  const issueDate = invoice.issuedAt ? invoice.issuedAt.toLocaleDateString() : invoice.createdAt.toLocaleDateString();

  const itemsHtml = invoice.items.map(item => `
    <tr>
      <td class="left">${item.title} (SKU: ${item.sku})</td>
      <td class="right">$${item.unitPrice.toFixed(2)}</td>
      <td class="center">${item.quantity}</td>
      <td class="right">$${item.totalPrice.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 40px; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .header h1 { margin: 0; color: #2c3e50; }
        .details { margin-bottom: 40px; display: flex; justify-content: space-between; }
        .details h3 { margin-top: 0; margin-bottom: 10px; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        th, td { padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; color: #333; text-align: left; }
        .left { text-align: left; }
        .center { text-align: center; }
        .right { text-align: right; }
        .totals { width: 50%; float: right; border-collapse: collapse; }
        .totals td { padding: 8px 12px; border-bottom: none; }
        .totals .final-amount { font-size: 1.2em; font-weight: bold; border-top: 2px solid #333; }
        .footer { clear: both; margin-top: 50px; text-align: center; font-size: 0.85em; color: #777; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        
        <div class="header">
          <div>
            <h1>INVOICE</h1>
            <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}<br>
            <strong>Date:</strong> ${issueDate}</p>
          </div>
          <div class="right">
            <h2>Marketplace Inc.</h2>
            <p>123 Business Road<br>Enterprise City, 10010<br>contact@marketplace.com</p>
          </div>
        </div>

        <div class="details">
          <div>
            <h3>Billed To:</h3>
            <p>${invoice.customer.name}<br>
            ${invoice.customer.email}<br>
            ${invoice.customer.taxId ? `Tax ID: ${invoice.customer.taxId}` : ''}</p>
          </div>
          <div>
            <h3>Billing Address:</h3>
            <p>${invoice.billingAddress.street}<br>
            ${invoice.billingAddress.city}, ${invoice.billingAddress.zipCode}<br>
            ${invoice.billingAddress.country}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="left">Item Description</th>
              <th class="right">Unit Price</th>
              <th class="center">Qty</th>
              <th class="right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table class="totals">
          <tr>
            <td class="left">Subtotal</td>
            <td class="right">$${invoice.totals.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="left">Discount</td>
            <td class="right">-$${invoice.totals.discount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="left">Tax</td>
            <td class="right">$${invoice.totals.tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="left">Shipping</td>
            <td class="right">$${invoice.totals.shipping.toFixed(2)}</td>
          </tr>
          <tr class="final-amount">
            <td class="left">Total Due</td>
            <td class="right">$${invoice.totals.finalAmount.toFixed(2)}</td>
          </tr>
        </table>

        <div class="footer">
          <p>Thank you for your business. If you have any questions about this invoice, please contact support.</p>
        </div>

      </div>
    </body>
    </html>
  `;
}