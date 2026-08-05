import { IInvoiceRepository, Invoice, InvoiceStatus } from '../../domain/invoice/invoice-types';
import { InvoiceDataSource } from './invoice-data-source';

/**
 * Enterprise Invoice Repository.
 * Implements the domain contract and acts as a bridge between the business logic 
 * and the low-level database operations. It maps database schemas to domain entities.
 */
export class InvoiceRepository implements IInvoiceRepository {
  constructor(private readonly dataSource: InvoiceDataSource) {}

  /**
   * Maps a raw database record to the clean Domain Invoice entity.
   */
  private mapToDomain(raw: any): Invoice {
    return {
      id: raw.id,
      orderId: raw.orderId,
      paymentId: raw.paymentId,
      invoiceNumber: raw.invoiceNumber,
      status: raw.status as InvoiceStatus,
      customer: raw.customerSnapshot,
      billingAddress: raw.billingAddressSnapshot,
      items: raw.itemsSnapshot,
      totals: raw.totalsSnapshot,
      createdAt: raw.createdAt,
      issuedAt: raw.issuedAt,
    };
  }

  public async save(invoice: Invoice): Promise<Invoice> {
    const savedRecord = await this.dataSource.create(invoice);
    return this.mapToDomain(savedRecord);
  }

  public async findById(invoiceId: string): Promise<Invoice | null> {
    const raw = await this.dataSource.findById(invoiceId);
    if (!raw) return null;
    return this.mapToDomain(raw);
  }

  public async findByOrderId(orderId: string): Promise<Invoice | null> {
    const raw = await this.dataSource.findByOrderId(orderId);
    if (!raw) return null;
    return this.mapToDomain(raw);
  }

  public async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<boolean> {
    try {
      await this.dataSource.updateStatus(invoiceId, status);
      return true;
    } catch (error) {
      console.error(`[InvoiceRepository] Failed to update status for invoice ${invoiceId}:`, error);
      return false;
    }
  }
}