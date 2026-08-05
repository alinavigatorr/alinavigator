import { PrismaClient } from '@prisma/client';

/**
 * Low-level Prisma database interactions for Invoices.
 * This class abstracts away the Prisma ORM specifics so the Repository 
 * doesn't have to deal with raw database queries directly.
 */
export class InvoiceDataSource {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Persists a new invoice record into the PostgreSQL database.
   * Note: Complex objects (customer, address, items, totals) are stored as JSONB 
   * in this design to ensure the invoice remains an immutable snapshot.
   */
  public async create(data: any): Promise<any> {
    return this.prisma.invoice.create({
      data: {
        id: data.id,
        orderId: data.orderId,
        paymentId: data.paymentId,
        invoiceNumber: data.invoiceNumber,
        status: data.status,
        customerSnapshot: data.customer,       // JSONB column
        billingAddressSnapshot: data.billingAddress, // JSONB column
        itemsSnapshot: data.items,             // JSONB column
        totalsSnapshot: data.totals,           // JSONB column
        createdAt: data.createdAt,
        issuedAt: data.issuedAt,
      },
    });
  }

  /**
   * Fetches an invoice by its primary ID.
   */
  public async findById(id: string): Promise<any | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
    });
  }

  /**
   * Fetches an invoice by its associated Order ID.
   */
  public async findByOrderId(orderId: string): Promise<any | null> {
    return this.prisma.invoice.findUnique({
      where: { orderId },
    });
  }

  /**
   * Updates only the status field of an existing invoice.
   */
  public async updateStatus(id: string, status: string): Promise<any> {
    return this.prisma.invoice.update({
      where: { id },
      data: { status },
    });
  }
}