/**
 * Core Domain Types for the Invoice context.
 */

export enum InvoiceStatus {
    PENDING = 'PENDING',
    GENERATED = 'GENERATED',
    ISSUED = 'ISSUED',
    VOIDED = 'VOIDED',
  }
  
  export interface InvoiceCustomer {
    customerId: string;
    name: string;
    email: string;
    taxId?: string; // Optional VAT or National ID
  }
  
  export interface InvoiceAddress {
    country: string;
    city: string;
    street: string;
    zipCode: string;
  }
  
  export interface InvoiceItem {
    productId: string;
    sku: string;
    title: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }
  
  export interface InvoiceTotals {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    finalAmount: number;
  }
  
  export interface Invoice {
    id: string;
    orderId: string;
    paymentId?: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    customer: InvoiceCustomer;
    billingAddress: InvoiceAddress;
    items: InvoiceItem[];
    totals: InvoiceTotals;
    createdAt: Date;
    issuedAt?: Date;
  }
  
  /**
   * Represents the final rendered document prepared for email or download.
   */
  export interface InvoiceAttachment {
    filename: string;
    mimeType: string;
    content: Buffer; // PDF or HTML payload
  }
  
  /**
   * Abstraction for rendering engines (PDF, HTML, External Providers).
   */
  export interface IInvoiceRenderer {
    render(invoice: Invoice): Promise<InvoiceAttachment>;
  }
  
  /**
   * Repository interface to persist and retrieve Invoices.
   */
  export interface IInvoiceRepository {
    save(invoice: Invoice): Promise<Invoice>;
    findById(invoiceId: string): Promise<Invoice | null>;
    findByOrderId(orderId: string): Promise<Invoice | null>;
    updateStatus(invoiceId: string, status: InvoiceStatus): Promise<boolean>;
  }