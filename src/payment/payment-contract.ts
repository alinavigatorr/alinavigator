import { 
    PaymentRequest, 
    PaymentResponse, 
    RefundRequest, 
    RefundResponse 
  } from './payment-types';
  
  /**
   * The core contract that ANY payment provider (Stripe, Zarinpal, Mellat, etc.) MUST implement.
   * This ensures the application remains completely agnostic to the underlying payment gateway,
   * enforcing the Strategy Pattern and Dependency Inversion Principle.
   */
  export interface IPaymentContract {
    /**
     * Returns the unique identifier of the provider (e.g., 'stripe', 'zarinpal').
     */
    getProviderId(): string;
  
    /**
     * Initializes the payment provider (e.g., configuring API keys, setting environments).
     * Typically called once during application startup or provider registration.
     */
    initialize(): Promise<void>;
  
    /**
     * Initiates a new payment request with the external gateway.
     * May return a redirect URL or a client secret depending on the provider.
     */
    createPayment(request: PaymentRequest): Promise<PaymentResponse>;
  
    /**
     * Captures a previously authorized payment.
     * Essential for two-step payment flows (Authorize & Capture).
     */
    capture(paymentId: string): Promise<PaymentResponse>;
  
    /**
     * Cancels a pending or authorized payment before it is captured.
     */
    cancel(paymentId: string): Promise<PaymentResponse>;
  
    /**
     * Refunds a captured payment (partially or fully) back to the customer.
     */
    refund(request: RefundRequest): Promise<RefundResponse>;
  
    /**
     * Verifies the status of a transaction directly with the provider's API.
     * Used as a fallback or confirmation step.
     */
    verify(paymentId: string, providerTransactionId?: string): Promise<PaymentResponse>;
  
    /**
     * Parses and validates incoming webhook events from the payment gateway.
     * Translates provider-specific events into domain events.
     */
    webhook(payload: unknown, signature?: string): Promise<void>;
  }