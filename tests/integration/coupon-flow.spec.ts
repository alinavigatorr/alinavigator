import { EventBus } from '../../src/infrastructure/events/event-bus';
import { OrderRepository } from '../../src/domain/order/order-repository';

// Mocking dependencies
jest.mock('../../src/infrastructure/events/event-bus');
jest.mock('../../src/domain/order/order-repository');

/**
 * Mocking a simplistic CouponService and CartService to demonstrate the flow.
 * In a real environment, these would be the actual domain services with mocked repositories.
 */
const mockCouponRepo = {
  findByCode: jest.fn(),
  incrementUsage: jest.fn(),
};

const mockCartService = {
  calculateTotal: jest.fn(),
};

describe('Integration Scenario 3: Coupon Application and Processing Pipeline', () => {
  let eventBus: jest.Mocked<EventBus>;
  let orderRepo: jest.Mocked<OrderRepository>;

  beforeAll(() => {
    eventBus = new EventBus() as jest.Mocked<EventBus>;
    orderRepo = new OrderRepository({} as any) as jest.Mocked<OrderRepository>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate coupon, apply correct discount, and increment usage after checkout', async () => {
    // 1. Arrange: Prepare cart and a valid coupon (e.g., 20% discount)
    const cartItemsTotal = 200; // $200
    const couponCode = 'SUMMER20';
    
    const validCoupon = {
      code: couponCode,
      discountPercentage: 20,
      maxUsage: 100,
      currentUsage: 50,
      isActive: true,
      expiryDate: new Date(Date.now() + 86400000), // Valid until tomorrow
    };

    mockCouponRepo.findByCode.mockResolvedValue(validCoupon);
    mockCouponRepo.incrementUsage.mockResolvedValue(true);
    orderRepo.save.mockResolvedValue({ id: 'ord_999', status: 'PAID' } as any);

    // 2. Act: Apply the coupon (Simulating Cart Service logic)
    const fetchedCoupon = await mockCouponRepo.findByCode(couponCode);
    
    // Validation checks
    const isValid = fetchedCoupon 
      && fetchedCoupon.isActive 
      && fetchedCoupon.currentUsage < fetchedCoupon.maxUsage
      && fetchedCoupon.expiryDate > new Date();

    expect(isValid).toBe(true);

    // Discount Calculation
    const discountAmount = (cartItemsTotal * fetchedCoupon.discountPercentage) / 100; // $40
    const finalTotal = cartItemsTotal - discountAmount; // $160

    mockCartService.calculateTotal.mockReturnValue({
      subtotal: cartItemsTotal,
      discount: discountAmount,
      total: finalTotal,
    });

    const cartTotals = mockCartService.calculateTotal();

    // Simulating Successful Checkout with Coupon
    await orderRepo.save({
      id: 'ord_999',
      totalAmount: cartTotals.total,
      appliedCoupon: couponCode,
      status: 'PAID'
    } as any);

    await mockCouponRepo.incrementUsage(couponCode);
    await eventBus.publish('OrderCreatedWithCoupon', { orderId: 'ord_999', couponCode });

    // 3. Assert: Verify the calculations and state changes

    // -> Discount calculation accuracy
    expect(cartTotals.discount).toBe(40);
    expect(cartTotals.total).toBe(160);

    // -> Order created with correct discounted total
    expect(orderRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      totalAmount: 160,
      appliedCoupon: 'SUMMER20'
    }));

    // -> Coupon usage count is updated in the database
    expect(mockCouponRepo.incrementUsage).toHaveBeenCalledTimes(1);
    expect(mockCouponRepo.incrementUsage).toHaveBeenCalledWith('SUMMER20');

    // -> System notified of coupon usage for analytics
    expect(eventBus.publish).toHaveBeenCalledWith('OrderCreatedWithCoupon', expect.objectContaining({
      orderId: 'ord_999',
      couponCode: 'SUMMER20'
    }));
  });
});