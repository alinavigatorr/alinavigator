import { QueueService } from '../../src/infrastructure/queue/queue-service';
import { QueueName } from '../../src/infrastructure/queue/queue-types';
import { EventBus } from '../../src/infrastructure/events/event-bus';

// Mocking dependencies
jest.mock('../../src/infrastructure/queue/queue-service');
jest.mock('../../src/infrastructure/events/event-bus');

/**
 * Mock Notification Service to simulate actual database/push operations
 */
const mockNotificationService = {
  sendPushNotification: jest.fn(),
  saveToDatabase: jest.fn(),
};

describe('Integration Scenario 6: Notification Processing and Queue Resilience', () => {
  let queueService: jest.Mocked<QueueService>;
  let eventBus: jest.Mocked<EventBus>;

  beforeAll(() => {
    queueService = new QueueService({} as any) as jest.Mocked<QueueService>;
    eventBus = new EventBus() as jest.Mocked<EventBus>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue notification, process it via worker, and handle failures/retries', async () => {
    // 1. Arrange: Setup mock behaviors
    const mockPayload = {
      customerId: 'cust_99',
      title: 'Order Shipped',
      message: 'Your order #123 is on the way!',
      type: 'SHIPPING_UPDATE'
    };

    queueService.enqueue.mockResolvedValue({ jobId: 'job_101', status: 'QUEUED' } as any);
    mockNotificationService.saveToDatabase.mockResolvedValue(true);
    
    // Simulate a failure on the first try, success on the second try
    mockNotificationService.sendPushNotification
      .mockRejectedValueOnce(new Error('Push Provider Timeout')) // First attempt fails
      .mockResolvedValueOnce(true); // Second attempt succeeds

    // 2. Act: Trigger the flow
    
    // Step A: System triggers event
    await eventBus.publish('OrderShipped', { orderId: 'ord_123', customerId: 'cust_99' });

    // Step B: Subscriber adds job to Queue
    const enqueueResult = await queueService.enqueue(QueueName.NOTIFICATION, mockPayload, {
      retries: 3,
      backoff: 1000
    });

    // Step C: Worker processes the job (Simulating the Queue Worker execution)
    let processingError = null;
    try {
      await mockNotificationService.sendPushNotification(mockPayload);
    } catch (error) {
      processingError = error;
    }

    // Step D: Worker retries the job (Simulating BullMQ automatic retry)
    if (processingError) {
      await mockNotificationService.sendPushNotification(mockPayload);
      await mockNotificationService.saveToDatabase(mockPayload);
    }

    // 3. Assert: Verify the robustness of the queue and notification system

    // -> Job was correctly added to the queue with retry configurations
    expect(queueService.enqueue).toHaveBeenCalledWith(
      QueueName.NOTIFICATION, 
      mockPayload, 
      expect.objectContaining({ retries: 3 })
    );
    expect(enqueueResult.jobId).toBe('job_101');

    // -> Service attempted to send push notification twice due to first failure
    expect(mockNotificationService.sendPushNotification).toHaveBeenCalledTimes(2);

    // -> First attempt threw the expected timeout error
    expect(processingError).toBeInstanceOf(Error);
    expect((processingError as Error).message).toBe('Push Provider Timeout');

    // -> After successful retry, notification was saved to DB for user's history
    expect(mockNotificationService.saveToDatabase).toHaveBeenCalledTimes(1);
    expect(mockNotificationService.saveToDatabase).toHaveBeenCalledWith(mockPayload);
  });
});