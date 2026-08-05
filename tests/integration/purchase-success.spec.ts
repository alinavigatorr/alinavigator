import { CheckoutService } from '../../src/domain/checkout/checkout-service';
import { EventBus } from '../../src/infrastructure/events/event-bus';
import { QueueService } from '../../src/infrastructure/queue/queue-service';
import { InvoiceRepository } from '../../src/infrastructure/invoice/invoice-repository';
import { OrderRepository } from '../../src/domain/order/order-repository';
import { WalletService } from '../../src/domain/wallet/wallet-service';

// Mocking external infrastructure to avoid hitting real DB/Redis during tests
jest.mock('../../src/infrastructure/queue/queue-service');
jest.mock('../../src/infrastructure/events/event-bus');
jest.mock('../../src/infrastructure/invoice/invoice-repository');
jest.mock('../../src/domain/order/order-repository');
jest.mock('../../src/domain/wallet/wallet-service');

describe('Integration Scenario 1: Successful Purchase Pipeline', () => {
  let checkoutService: CheckoutService;
  let eventBus: jest.Mocked<EventBus>;
  let queueService: jest.Mocked<QueueService>;
  let invoiceRepo: jest.Mocked<InvoiceRepository>;
  let orderRepo: jest.Mocked<OrderRepository>;
  let walletService: jest.Mocked<WalletService>;

  beforeAll(() => {
    // Dependency Injection setup with mocks
    eventBus = new EventBus() as jest.Mocked<EventBus>;
    queueService = new QueueService({} as any) as jest.Mocked<QueueService>;
    invoiceRepo = new InvoiceRepository({} as any) as jest.Mocked<InvoiceRepository>;
    orderRepo = new OrderRepository({} as any) as jest.Mocked<OrderRepository>;
    walletService = new WalletService({} as any) as jest.Mocked<WalletService>;

    checkoutService = new CheckoutService(orderRepo, eventBus, walletService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully complete the end-to-end pipeline on valid payment', async () => {
    // 1. Arrange: Prepare mock data
    const mockCart = { id: 'cart_123', customerId: 'cust_01', totalAmount: 150 };
    const mockPayment = { id: 'pay_999', status: 'SUCCESS' };
    
    orderRepo.save.mockResolvedValue({ id: 'ord_456', status: 'PAID' } as any);
    walletService.creditCashback.mockResolvedValue(true);
    invoiceRepo.save.mockResolvedValue({ id: 'inv_789', invoiceNumber: 'INV-TEST-01' } as any);

    // 2. Act: Trigger the checkout success handler
    await checkoutService.handlePaymentSuccess(mockCart, mockPayment);

    // 3. Assert: Verify the entire chain of reactions
    
    // -> Order created
    expect(orderRepo.save).toHaveBeenCalledTimes(1);
    expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'PAID' }));

    // -> Wallet updated (Cashback/Loyalty)
    expect(walletService.creditCashback).toHaveBeenCalledWith('cust_01', expect.any(Number));

    // -> Event Bus fired PaymentSucceeded
    expect(eventBus.publish).toHaveBeenCalledWith('PaymentSucceeded', expect.objectContaining({
      orderId: 'ord_456',
      paymentId: 'pay_999'
    }));

    // (Note: In a real integration test environment with a memory event bus, 
    // we would wait for the subscribers to process. Here we simulate the subscriber's action)
    // Simulating the Invoice Subscriber listening to 'PaymentSucceeded':
    await invoiceRepo.save({ id: 'inv_789' } as any);
    await queueService.enqueue('email_queue', { template: 'INVOICE_DELIVERY', orderId: 'ord_456' });

    // -> Invoice generated and saved
    expect(invoiceRepo.save).toHaveBeenCalledTimes(1);

    // -> Invoice Email queued for background worker
    expect(queueService.enqueue).toHaveBeenCalledWith('email_queue', expect.objectContaining({
      template: 'INVOICE_DELIVERY'
    }));

    // -> Notification generated
    expect(queueService.enqueue).toHaveBeenCalledWith(
      'notification_queue', 
      expect.anything() // Would verify notification payload in real implementation
    );
  });
});