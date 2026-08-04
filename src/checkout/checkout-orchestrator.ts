import { 
    ICartProvider, 
    IInventoryProvider, 
    IPromotionProvider, 
    IWalletProvider, 
    ILogisticsProvider, 
    IOrderProvider 
  } from './checkout-contract';
  import { CheckoutEngine } from './checkout-engine';
  import { CheckoutSession, CheckoutAddress, ShippingMethod } from './checkout-types';
  import { CheckoutResult, CheckoutResultFactory } from './checkout-result';
  import { CheckoutValidationFailedError, InventoryUnavailableError, InsufficientWalletBalanceError } from './checkout-errors';
  import * as crypto from 'crypto';
  
  export interface CheckoutInitializationInput {
    userId: string;
    shippingAddress?: CheckoutAddress;
    shippingMethod?: ShippingMethod;
    couponCode?: string;
    campaignId?: string;
    useWallet: boolean;
  }
  
  /**
   * Enterprise Checkout Orchestrator.
   * Coordinates Cart, Inventory, Promotions, Logistics, Wallet, and Order creation 
   * into a single unified transactional checkout pipeline.
   */
  export class CheckoutOrchestrator {
    constructor(
      private readonly cartProvider: ICartProvider,
      private readonly inventoryProvider: IInventoryProvider,
      private readonly promotionProvider: IPromotionProvider,
      private readonly walletProvider: IWalletProvider,
      private readonly logisticsProvider: ILogisticsProvider,
      private readonly orderProvider: IOrderProvider
    ) {}
  
    /**
     * Executes the full checkout preparation and validation pipeline.
     */
    public async initializeSession(input: CheckoutInitializationInput): Promise<CheckoutResult<CheckoutSession>> {
      try {
        // 1. Fetch Cart Items
        const items = await this.cartProvider.fetchUserCart(input.userId);
        
        // 2. Validate Cart Items via Engine
        const itemValidation = CheckoutEngine.validateItems(items);
        if (!itemValidation.isValid) {
          throw new CheckoutValidationFailedError('Cart items failed validation checks.', itemValidation);
        }
  
        // 3. Verify Inventory Availability
        const isAvailable = await this.inventoryProvider.verifyAvailability(items);
        if (!isAvailable) {
          throw new InventoryUnavailableError('One or more items in the cart are currently out of stock.');
        }
  
        // 4. Calculate Discounts (Coupons / Campaigns)
        let discountTotal = 0;
        if (input.couponCode || input.campaignId) {
          if (input.couponCode) {
            await this.promotionProvider.validateCoupon(input.couponCode, input.userId);
          }
          if (input.campaignId) {
            await this.promotionProvider.validateCampaign(input.campaignId);
          }
          discountTotal = await this.promotionProvider.calculateDiscount(items, input.couponCode, input.campaignId);
        }
  
        // 5. Calculate Taxes and Shipping
        const taxSummary = await this.logisticsProvider.calculateTaxes(items, input.shippingAddress);
        
        if (input.shippingAddress && input.shippingMethod) {
          await this.logisticsProvider.validateShippingMethod(input.shippingMethod, input.shippingAddress);
        }
  
        // 6. Handle Wallet Allocation if requested
        let walletBalanceToUse = 0;
        if (input.useWallet) {
          const availableBalance = await this.walletProvider.getUserBalance(input.userId);
          // Pre-calculate partial summary to know max needed
          const preliminarySummary = CheckoutEngine.calculateSummary(items, discountTotal, taxSummary, input.shippingMethod, 0);
          
          walletBalanceToUse = Math.min(availableBalance, preliminarySummary.grandTotal);
          
          const walletValidation = CheckoutEngine.validateWalletAllocation(walletBalanceToUse, availableBalance);
          if (!walletValidation.isValid) {
            throw new InsufficientWalletBalanceError('Requested wallet allocation exceeds available balance.', walletValidation);
          }
        }
  
        // 7. Final Financial Summary Calculation
        const summary = CheckoutEngine.calculateSummary(
          items, 
          discountTotal, 
          taxSummary, 
          input.shippingMethod, 
          walletBalanceToUse
        );
  
        // 8. Construct Session Object
        const sessionId = crypto.randomUUID();
        const session: CheckoutSession = {
          sessionId,
          userId: input.userId,
          items,
          shippingAddress: input.shippingAddress,
          shippingMethod: input.shippingMethod,
          appliedCouponCode: input.couponCode,
          appliedCampaignId: input.campaignId,
          useWalletBalance: input.useWallet,
          summary,
          validationState: { isValid: true, errors: [], warnings: [] },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Expires in 30 minutes
        };
  
        // 9. Reserve Inventory & Lock Funds (Transactional Preparation)
        await this.inventoryProvider.reserveItems(items, sessionId);
        if (walletBalanceToUse > 0) {
          await this.walletProvider.lockFunds(input.userId, walletBalanceToUse, sessionId);
        }
  
        return CheckoutResultFactory.success(session);
      } catch (error) {
        if (error instanceof Error) {
          return CheckoutResultFactory.failure(
            'CHECKOUT_INITIALIZATION_FAILED', 
            error.message, 
            (error as any).validationState, 
            error
          );
        }
        return CheckoutResultFactory.failure('UNKNOWN_ERROR', 'An unexpected error occurred during checkout orchestration.');
      }
    }
  
    /**
     * Finalizes the checkout session and converts it into a pending order.
     */
    public async finalizeSession(session: CheckoutSession): Promise<CheckoutResult<string>> {
      try {
        // Create pending order via Order Provider
        const orderId = await this.orderProvider.createPendingOrder(
          session.userId, 
          session.items, 
          session.summary
        );
  
        // Clear the user's cart upon successful order creation
        await this.cartProvider.clearCart(session.userId);
  
        return CheckoutResultFactory.success(orderId);
      } catch (error) {
        if (error instanceof Error) {
          return CheckoutResultFactory.failure('CHECKOUT_FINALIZATION_FAILED', error.message, undefined, error);
        }
        return CheckoutResultFactory.failure('UNKNOWN_ERROR', 'Failed to finalize checkout session into an order.');
      }
    }
  }