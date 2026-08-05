import { IInvoiceRenderer, Invoice, InvoiceAttachment } from '../../domain/invoice/invoice-types';
import { generateInvoiceHtml } from './invoice-template';

/**
 * Standard Invoice Renderer.
 * Implements IInvoiceRenderer to convert an Invoice domain entity into a downloadable attachment.
 * 
 * NOTE: Currently configured to return an HTML buffer simulating a PDF generation process.
 * To integrate a real PDF engine (e.g., Puppeteer, PDFKit, or an external API), 
 * inject the library here without modifying the core InvoiceService.
 */
export class StandardInvoiceRenderer implements IInvoiceRenderer {
  /**
   * Renders the invoice into a document attachment.
   */
  public async render(invoice: Invoice): Promise<InvoiceAttachment> {
    try {
      console.log(`[InvoiceRenderer] Starting document generation for Invoice: ${invoice.invoiceNumber}`);
      
      // Step 1: Generate the raw HTML structure using our template engine
      const htmlContent = generateInvoiceHtml(invoice);
      
      // Step 2: Convert HTML to PDF Buffer. 
      // (Placeholder: We convert the HTML string directly to a Buffer. A real PDF library goes here.)
      const documentBuffer = Buffer.from(htmlContent, 'utf-8');

      console.log(`[InvoiceRenderer] Successfully generated document for Invoice: ${invoice.invoiceNumber}`);

      // Step 3: Return the standardized attachment contract ready for Email or Download
      return {
        filename: `${invoice.invoiceNumber}.pdf`,
        mimeType: 'application/pdf', // Simulated PDF mime-type
        content: documentBuffer,
      };
    } catch (error: any) {
      console.error(`[InvoiceRenderer] Failed to render invoice ${invoice.invoiceNumber}:`, error.message);
      throw new Error(`Invoice rendering failed: ${error.message}`);
    }
  }
}