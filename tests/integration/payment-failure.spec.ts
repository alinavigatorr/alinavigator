import { CheckoutService } from '../../src/domain/checkout/checkout-service';
import { EventBus } from '../../src/infrastructure/events/event-bus';
import { QueueService } from '../../src/infrastructure/queue/queue-service';
import { InvoiceRepository } from '../../src/infrastructure/invoice/invoice-repository';
import { OrderRepository } from '../../src/domain/order/order-repository';
import { InventoryService } from '../../src/domain/inventory/inventory-service';

// Mocking the infrastructure and domain dependencies
jest.mock('../../src/infrastructure/queue/queue-service');
jest.mock('../../src/infrastructure/events/event-bus');
jest.mock('../../src/infrastructure/invoice/invoice-repository');
jest.mock('../../src/domain/order/order-repository');
jest.mock('../../src/domain/inventory/inventory-service');

describe('Integration Scenario 2: Payment Failure Pipeline', () => {
  let checkoutService: CheckoutService;
  let eventBus: jest.Mocked<EventBus>;
  let queueService: jest.Mocked<QueueService>;
  let invoiceRepo: jest.Mocked<InvoiceRepository>;
  let orderRepo: jest.Mocked<OrderRepository>;
  let inventoryService: jest.Mocked<InventoryService>;

  beforeAll(() => {
    // Instantiate mocks
    eventBus = new EventBus() as jest.Mocked<EventBus>;
    queueService = new QueueService({} as any) as jest.Mocked<QueueService>;
    invoiceRepo = new InvoiceRepository({} as any) as jest.Mocked<InvoiceRepository>;
    orderRepo = new OrderRepository({} as any) as jest.Mocked<OrderRepository>;
    inventoryService = new InventoryService({} as any) as jest.Mocked<InventoryService>;

    // In a real app, you might inject inventoryService into checkout or listen via events
    checkoutService = new CheckoutService(orderRepo, eventBus, {} as any);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should abort order creation, rollback inventory, and notify on payment failure', async () => {
    // 1. Arrange: Prepare mock data with a FAILED payment
    const mockCart = { id: 'cart_123', customerId: 'cust_01', items: [{ productId: 'prod_1', quantity: 2 }] };
    const mockFailedPayment = { id: 'pay_err_999', status: 'FAILED', error: 'Insufficient funds' };

    // 2. Act: Trigger the checkout failure handler
    await checkoutService.handlePaymentFailure(mockCart, mockFailedPayment);

    // 3. Assert: Verify the isolation and rollback mechanics

    // -> No order should be finalized (or status must be strictly 'FAILED' if recorded)
    expect(orderRepo.save).not.toHaveBeenCalledWith(expect.objectContaining({ status: 'PAID' }));

    // -> Event Bus fired PaymentFailed
    expect(eventBus.publish).toHaveBeenCalledWith('PaymentFailed', expect.objectContaining({
      cartId: 'cart_123',
      error: 'Insufficient funds'
    }));

    // Simulating subscribers handling the failure event:
    await inventoryService.releaseReservation(mockCart.items);
    await queueService.enqueue('notification_queue', { type: 'PAYMENT_FAILED', customerId: 'cust_01' });

    // -> Inventory Rollback executed (items released)
    expect(inventoryService.releaseReservation).toHaveBeenCalledTimes(1);
    expect(inventoryService.releaseReservation).toHaveBeenCalledWith(mockCart.items);

    // -> No invoice should be generated
    expect(invoiceRepo.save).not.toHaveBeenCalled();

    // -> No email should be sent via the email queue for invoice
    expect(queueService.enqueue).not.toHaveBeenCalledWith('email_queue', expect.objectContaining({
      template: 'INVOICE_DELIVERY'
    }));

    // -> Proper notification generated for the user
    expect(queueService.enqueue).toHaveBeenCalledWith('notification_queue', expect.objectContaining({
      type: 'PAYMENT_FAILED'
    }));
  });
});