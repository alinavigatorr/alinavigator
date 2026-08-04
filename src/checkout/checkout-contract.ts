import { 
    CheckoutItem, 
    CheckoutAddress, 
    ShippingMethod, 
    TaxSummary 
  } from './checkout-types';
  
  /**
   * Contract for interacting with the Cart bounded context.
   */
  export interface ICartProvider {
    fetchUserCart(userId: string): Promise<CheckoutItem[]>;
    clearCart(userId: string): Promise<void>;
  }
  
  /**
   * Contract for interacting with the Inventory/Warehouse bounded context.
   */
  export interface IInventoryProvider {
    verifyAvailability(items: CheckoutItem[]): Promise<boolean>;
    reserveItems(items: CheckoutItem[], sessionId: string): Promise<void>;
    releaseItems(sessionId: string): Promise<void>;
  }
  
  /**
   * Contract for interacting with Promotions (Coupons and Campaigns).
   */
  export interface IPromotionProvider {
    validateCoupon(couponCode: string, userId: string): Promise<boolean>;
    validateCampaign(campaignId: string): Promise<boolean>;
    calculateDiscount(items: CheckoutItem[], couponCode?: string, campaignId?: string): Promise<number>;
  }
  
  /**
   * Contract for interacting with the User's Wallet.
   */
  export interface IWalletProvider {
    getUserBalance(userId: string): Promise<number>;
    lockFunds(userId: string, amount: number, sessionId: string): Promise<void>;
    releaseFunds(sessionId: string): Promise<void>;
  }
  
  /**
   * Contract for Logistics and Tax calculations.
   */
  export interface ILogisticsProvider {
    calculateTaxes(items: CheckoutItem[], address?: CheckoutAddress): Promise<TaxSummary>;
    validateShippingMethod(method: ShippingMethod, address: CheckoutAddress): Promise<boolean>;
  }
  
  /**
   * Contract for interacting with the Order module to finalize the session.
   */
  export interface IOrderProvider {
    createPendingOrder(
      userId: string, 
      items: CheckoutItem[], 
      summary: any // Will be strongly typed with CheckoutSummary in actual implementation
    ): Promise<string>;
  }