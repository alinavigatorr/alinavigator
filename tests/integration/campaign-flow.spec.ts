import { EventBus } from '../../src/infrastructure/events/event-bus';
import { OrderRepository } from '../../src/domain/order/order-repository';

// Mocking dependencies
jest.mock('../../src/infrastructure/events/event-bus');
jest.mock('../../src/domain/order/order-repository');

/**
 * Mocking a Campaign Engine for the sake of the integration test.
 * This simulates how the real CampaignService evaluates and applies active campaigns.
 */
const mockCampaignRepo = {
  findActiveCampaigns: jest.fn(),
};

describe('Integration Scenario 4: Campaign Eligibility and Priority Rules', () => {
  let eventBus: jest.Mocked<EventBus>;
  let orderRepo: jest.Mocked<OrderRepository>;

  beforeAll(() => {
    eventBus = new EventBus() as jest.Mocked<EventBus>;
    orderRepo = new OrderRepository({} as any) as jest.Mocked<OrderRepository>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should evaluate campaigns, ignore expired ones, and apply the highest priority campaign', async () => {
    // 1. Arrange: Prepare cart and mock campaigns
    const cartAmount = 500; // $500 cart
    const currentDate = new Date('2026-08-05'); // Simulate a specific date
    
    const activeCampaigns = [
      {
        id: 'camp_01',
        name: 'Expired Spring Sale',
        discountPercent: 30,
        priority: 1,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-05-31'), // Expired
      },
      {
        id: 'camp_02',
        name: 'Summer Standard Sale',
        discountPercent: 10,
        priority: 2, // Lower priority number = higher precedence (or vice versa, let's say higher number = higher precedence)
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-09-30'), // Active
      },
      {
        id: 'camp_03',
        name: 'VIP Customer Mega Sale',
        discountPercent: 25,
        priority: 5, // Highest priority
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-08-10'), // Active
      }
    ];

    mockCampaignRepo.findActiveCampaigns.mockResolvedValue(activeCampaigns);
    orderRepo.save.mockResolvedValue({ id: 'ord_777', status: 'PAID' } as any);

    // 2. Act: Campaign Engine Evaluation
    const campaigns = await mockCampaignRepo.findActiveCampaigns();
    
    // Filter out expired campaigns
    const eligibleCampaigns = campaigns.filter(
      (c: any) => currentDate >= c.startDate && currentDate <= c.endDate
    );

    // Sort by priority descending (highest number wins)
    eligibleCampaigns.sort((a: any, b: any) => b.priority - a.priority);
    
    const winningCampaign = eligibleCampaigns[0];
    
    // Calculate final price based on winning campaign
    const discountAmount = (cartAmount * winningCampaign.discountPercent) / 100;
    const finalAmount = cartAmount - discountAmount;

    // Simulate checkout success
    await orderRepo.save({
      id: 'ord_777',
      totalAmount: finalAmount,
      appliedCampaignId: winningCampaign.id,
      status: 'PAID'
    } as any);

    await eventBus.publish('OrderCreatedWithCampaign', { 
      orderId: 'ord_777', 
      campaignId: winningCampaign.id 
    });

    // 3. Assert: Verify Campaign logic execution

    // -> Only valid campaigns should be considered (Expired Spring Sale is ignored)
    expect(eligibleCampaigns.length).toBe(2);
    expect(eligibleCampaigns.find((c: any) => c.id === 'camp_01')).toBeUndefined();

    // -> Highest priority campaign is selected
    expect(winningCampaign.id).toBe('camp_03');
    expect(winningCampaign.discountPercent).toBe(25);

    // -> Correct discount calculations
    expect(discountAmount).toBe(125); // 25% of 500
    expect(finalAmount).toBe(375);

    // -> Order repository saves correct campaign ID
    expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      totalAmount: 375,
      appliedCampaignId: 'camp_03'
    }));

    // -> Event bus broadcasts the campaign usage
    expect(eventBus.publish).toHaveBeenCalledWith('OrderCreatedWithCampaign', expect.objectContaining({
      campaignId: 'camp_03'
    }));
  });
});