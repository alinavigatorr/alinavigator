/**
 * Represents an individual item moving through the checkout process.
 */
export interface CheckoutItem {
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number; // unitPrice * quantity
    isDigital: boolean;
  }
  
  /**
   * Standardized address structure for physical deliveries.
   */
  export interface CheckoutAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }
  
  /**
   * Represents the selected shipping method and its associated costs.
   */
  export interface ShippingMethod {
    id: string;
    name: string;
    cost: number;
    estimatedDeliveryDays: number;
  }
  
  /**
   * Encapsulates the calculated tax information for the session.
   */
  export interface TaxSummary {
    taxRate: number;
    totalTax: number;
  }
  
  /**
   * The financial breakdown of the entire checkout session.
   */
  export interface CheckoutSummary {
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    shippingTotal: number;
    walletApplied: number;
    grandTotal: number;       // (subtotal - discountTotal) + taxTotal + shippingTotal
    paymentRequired: number;  // grandTotal - walletApplied
  }
  
  /**
   * Represents the cumulative validation state of the checkout pipeline.
   */
  export interface CheckoutValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }
  
  /**
   * The core Domain Model representing an active checkout process.
   * Contains all the state required to finalize an order.
   */
  export interface CheckoutSession {
    sessionId: string;
    userId: string;
    items: CheckoutItem[];
    shippingAddress?: CheckoutAddress;
    shippingMethod?: ShippingMethod;
    appliedCouponCode?: string;
    appliedCampaignId?: string;
    useWalletBalance: boolean;
    summary: CheckoutSummary;
    validationState: CheckoutValidation;
    createdAt: Date;
    expiresAt: Date;
  }