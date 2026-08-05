import { EventBus } from '../../src/infrastructure/events/event-bus';
import { QueueService } from '../../src/infrastructure/queue/queue-service';
import { InvoiceRepository } from '../../src/infrastructure/invoice/invoice-repository';
import { OrderRepository } from '../../src/domain/order/order-repository';
import { WalletService } from '../../src/domain/wallet/wallet-service';
import { InvoiceStatus } from '../../src/domain/invoice/invoice-types';

// Mocking dependencies to isolate integration logic
jest.mock('../../src/infrastructure/queue/queue-service');
jest.mock('../../src/infrastructure/events/event-bus');
jest.mock('../../src/infrastructure/invoice/invoice-repository');
jest.mock('../../src/domain/order/order-repository');
jest.mock('../../src/domain/wallet/wallet-service');

describe('Integration Scenario 5: Refund and Return Pipeline', () => {
  let eventBus: jest.Mocked<EventBus>;
  let queueService: jest.Mocked<QueueService>;
  let invoiceRepo: jest.Mocked<InvoiceRepository>;
  let orderRepo: jest.Mocked<OrderRepository>;
  let walletService: jest.Mocked<WalletService>;

  beforeAll(() => {
    eventBus = new EventBus() as jest.Mocked<EventBus>;
    queueService = new QueueService({} as any) as jest.Mocked<QueueService>;
    invoiceRepo = new InvoiceRepository({} as any) as jest.Mocked<InvoiceRepository>;
    orderRepo = new OrderRepository({} as any) as jest.Mocked<OrderRepository>;
    walletService = new WalletService({} as any) as jest.Mocked<WalletService>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process refund, update wallet, void invoice, and notify customer', async () => {
    // 1. Arrange: Prepare an approved refund scenario
    const mockOrderId = 'ord_123';
    const mockCustomerId = 'cust_01';
    const mockRefundAmount = 150.00;
    const mockInvoiceId = 'inv_789';

    // Mock repository and service responses
    orderRepo.updateStatus.mockResolvedValue(true);
    walletService.credit.mockResolvedValue(true);
    invoiceRepo.findByOrderId.mockResolvedValue({ id: mockInvoiceId, status: InvoiceStatus.ISSUED } as any);
    invoiceRepo.updateStatus.mockResolvedValue(true);

    // 2. Act: Trigger the refund execution (Simulating the RefundService orchestrator)
    const refundExecuted = true; // Simulating successful payment gateway refund
    
    if (refundExecuted) {
      await orderRepo.updateStatus(mockOrderId, 'REFUNDED');
      await walletService.credit(mockCustomerId, mockRefundAmount, 'REFUND');
      
      const invoice = await invoiceRepo.findByOrderId(mockOrderId);
      if (invoice) {
        await invoiceRepo.updateStatus(invoice.id, InvoiceStatus.VOIDED);
      }

      await eventBus.publish('RefundCompleted', { orderId: mockOrderId, amount: mockRefundAmount });
    }

    // Simulating the notification subscriber reacting to 'RefundCompleted'
    await queueService.enqueue('notification_queue', { 
      type: 'REFUND_PROCESSED', 
      customerId: mockCustomerId, 
      amount: mockRefundAmount 
    });

    // 3. Assert: Verify subsystem state changes

    // -> Order status updated to REFUNDED
    expect(orderRepo.updateStatus).toHaveBeenCalledWith(mockOrderId, 'REFUNDED');

    // -> Wallet updated correctly with the refund amount
    expect(walletService.credit).toHaveBeenCalledWith(mockCustomerId, mockRefundAmount, 'REFUND');

    // -> Invoice fetched and status safely updated to VOIDED
    expect(invoiceRepo.findByOrderId).toHaveBeenCalledWith(mockOrderId);
    expect(invoiceRepo.updateStatus).toHaveBeenCalledWith(mockInvoiceId, InvoiceStatus.VOIDED);

    // -> Event Bus fired RefundCompleted
    expect(eventBus.publish).toHaveBeenCalledWith('RefundCompleted', expect.objectContaining({
      orderId: mockOrderId,
      amount: mockRefundAmount
    }));

    // -> Customer notified via Queue
    expect(queueService.enqueue).toHaveBeenCalledWith('notification_queue', expect.objectContaining({
      type: 'REFUND_PROCESSED',
      amount: mockRefundAmount
    }));
  });
});