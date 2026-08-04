import { 
    CheckoutItem, 
    CheckoutSummary, 
    CheckoutValidation, 
    TaxSummary, 
    ShippingMethod 
  } from './checkout-types';
  
  /**
   * Pure Business Logic Engine for Checkout Calculations and Validation.
   * Free of database or HTTP dependencies.
   */
  export class CheckoutEngine {
  
    /**
     * Validates cart items, quantities, and pricing structures.
     */
    public static validateItems(items: CheckoutItem[]): CheckoutValidation {
      const errors: string[] = [];
      const warnings: string[] = [];
  
      if (!items || items.length === 0) {
        errors.push('Checkout session cannot proceed with an empty cart.');
        return { isValid: false, errors, warnings };
      }
  
      for (const item of items) {
        if (item.quantity <= 0) {
          errors.push(`Invalid quantity for product ID ${item.productId}. Quantity must be greater than zero.`);
        }
        if (item.unitPrice < 0) {
          errors.push(`Invalid unit price for product ID ${item.productId}. Price cannot be negative.`);
        }
        const expectedTotal = item.unitPrice * item.quantity;
        if (Math.abs(item.totalPrice - expectedTotal) > 0.01) {
          errors.push(`Price calculation mismatch for product ID ${item.productId}. Total price does not match unit price * quantity.`);
        }
      }
  
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    }
  
    /**
     * Calculates the comprehensive financial summary of the checkout session.
     */
    public static calculateSummary(
      items: CheckoutItem[],
      discountTotal: number = 0,
      taxSummary: TaxSummary = { taxRate: 0, totalTax: 0 },
      shippingMethod?: ShippingMethod,
      walletBalanceToUse: number = 0
    ): CheckoutSummary {
      // 1. Calculate Subtotal
      const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  
      // 2. Ensure discounts don't exceed subtotal
      const safeDiscountTotal = Math.min(discountTotal, subtotal);
  
      // 3. Shipping cost
      const shippingTotal = shippingMethod ? shippingMethod.cost : 0;
  
      // 4. Tax amount (calculated on discounted subtotal or standard base)
      const taxableAmount = Math.max(0, subtotal - safeDiscountTotal);
      const taxTotal = taxSummary.totalTax > 0 ? taxSummary.totalTax : taxableAmount * taxSummary.taxRate;
  
      // 5. Grand Total Calculation
      const grandTotal = Math.max(0, (subtotal - safeDiscountTotal) + taxTotal + shippingTotal);
  
      // 6. Wallet Application (Cannot exceed grand total)
      const walletApplied = Math.min(walletBalanceToUse, grandTotal);
  
      // 7. Remaining amount required from external payment gateway
      const paymentRequired = Math.max(0, grandTotal - walletApplied);
  
      return {
        subtotal,
        discountTotal: safeDiscountTotal,
        taxTotal,
        shippingTotal,
        walletApplied,
        grandTotal,
        paymentRequired,
      };
    }
  
    /**
     * Validates if the user's wallet has sufficient funds for the requested allocation.
     */
    public static validateWalletAllocation(requestedAmount: number, availableBalance: number): CheckoutValidation {
      const errors: string[] = [];
      const warnings: string[] = [];
  
      if (requestedAmount < 0) {
        errors.push('Requested wallet allocation cannot be negative.');
      }
  
      if (requestedAmount > availableBalance) {
        errors.push('Insufficient wallet balance to cover the requested amount.');
      }
  
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    }
  }