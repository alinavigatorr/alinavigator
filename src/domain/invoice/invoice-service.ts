import {
    Invoice,
    InvoiceItem,
    InvoiceStatus,
    InvoiceCustomer,
    InvoiceAddress,
    InvoiceTotals,
    IInvoiceRepository,
    IInvoiceRenderer,
    InvoiceAttachment,
  } from './invoice-types';
  
  /**
   * Enterprise Invoice Service.
   * Orchestrates the creation, calculation, and status management of invoices.
   * Completely decoupled from specific ORMs (Prisma) and document renderers (PDFKit).
   */
  export class InvoiceService {
    constructor(
      private readonly repository: IInvoiceRepository,
      private readonly renderer: IInvoiceRenderer
    ) {}
  
    /**
     * Generates a new invoice record and calculates all financial totals.
     */
    public async createInvoice(
      orderId: string,
      paymentId: string | undefined,
      customer: InvoiceCustomer,
      billingAddress: InvoiceAddress,
      items: InvoiceItem[],
      discountAmount: number = 0,
      taxRatePercentage: number = 0,
      shippingCost: number = 0
    ): Promise<Invoice> {
      const totals = this.calculateTotals(items, discountAmount, taxRatePercentage, shippingCost);
      const invoiceNumber = this.generateInvoiceNumber();
  
      const invoice: Invoice = {
        id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        orderId,
        paymentId,
        invoiceNumber,
        status: InvoiceStatus.PENDING,
        customer,
        billingAddress,
        items,
        totals,
        createdAt: new Date(),
      };
  
      return this.repository.save(invoice);
    }
  
    /**
     * Retrieves an invoice by its unique ID.
     */
    public async getInvoice(invoiceId: string): Promise<Invoice | null> {
      return this.repository.findById(invoiceId);
    }
  
    /**
     * Updates the lifecycle status of an invoice.
     */
    public async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<boolean> {
      return this.repository.updateStatus(invoiceId, status);
    }
  
    /**
     * Calculates subtotal, taxable amounts, and final totals ensuring precision.
     * Business rule: Tax is applied AFTER discounts.
     */
    public calculateTotals(
      items: InvoiceItem[],
      discountAmount: number,
      taxRatePercentage: number,
      shippingCost: number
    ): InvoiceTotals {
      const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      
      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const tax = (taxableAmount * taxRatePercentage) / 100;
      const finalAmount = taxableAmount + tax + shippingCost;
  
      return {
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        shipping: Number(shippingCost.toFixed(2)),
        finalAmount: Number(finalAmount.toFixed(2)),
      };
    }
  
    /**
     * Generates a legally compliant, unique sequential invoice number.
     * Format: INV-YYYYMMDD-XXXX
     */
    public generateInvoiceNumber(): string {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      
      return `INV-${year}${month}${day}-${randomSuffix}`;
    }
  
    /**
     * Delegates the document rendering process to the abstract renderer (PDF/HTML engine).
     * Transitions invoice status to GENERATED.
     */
    public async generateDocument(invoiceId: string): Promise<InvoiceAttachment> {
      const invoice = await this.getInvoice(invoiceId);
      if (!invoice) {
        throw new Error(`[InvoiceService] Cannot render document. Invoice not found: ${invoiceId}`);
      }
  
      const attachment = await this.renderer.render(invoice);
      
      await this.updateStatus(invoiceId, InvoiceStatus.GENERATED);
      
      return attachment;
    }
  }