import { CheckoutOrchestrator, CheckoutInitializationInput } from '../checkout/checkout-orchestrator';
import { PaymentEngine } from '../payment/payment-engine';
import { IPaymentContract } from '../payment/payment-contract';
import { PurchasePipeline } from './purchase-pipeline';
import { PurchaseResult, PurchaseResultFactory, PurchaseSuccessData } from './purchase-result';

export interface PurchaseCommandInput extends CheckoutInitializationInput {
  // Can include additional high-level purchase routing metadata if needed
}

/**
 * Enterprise Purchase Orchestrator.
 * The single entry point for executing full end-to-end purchases, 
 * bridging Checkout preparation with the Purchase Pipeline and Payment Engine.
 */
export class PurchaseOrchestrator {
  constructor(
    private readonly checkoutOrchestrator: CheckoutOrchestrator,
    private readonly paymentEngine: PaymentEngine,
    private readonly paymentProvider: IPaymentContract
  ) {}

  /**
   * Executes a complete purchase workflow from cart validation to final order and payment.
   */
  public async executePurchase(input: PurchaseCommandInput): Promise<PurchaseResult<PurchaseSuccessData>> {
    try {
      // 1. Initialize and validate Checkout Session
      const checkoutResult = await this.checkoutOrchestrator.initializeSession({
        userId: input.userId,
        shippingAddress: input.shippingAddress,
        shippingMethod: input.shippingMethod,
        couponCode: input.couponCode,
        campaignId: input.campaignId,
        useWallet: input.useWallet,
      });

      if (!checkoutResult.success) {
        return PurchaseResultFactory.failure(
          'CHECKOUT_PREPARATION_FAILED',
          checkoutResult.error.message,
          [],
          checkoutResult.error
        );
      }

      const session = checkoutResult.data;

      // 2. Execute Purchase Pipeline (Saga Pattern)
      const pipeline = new PurchasePipeline({
        session,
        paymentEngine: this.paymentEngine,
        paymentProvider: this.paymentProvider,
      });

      const pipelineResult = await pipeline.execute();

      if (!pipelineResult.success || !pipelineResult.orderId) {
        return PurchaseResultFactory.failure(
          'PURCHASE_EXECUTION_FAILED',
          pipelineResult.error || 'Purchase pipeline failed during execution.',
          pipelineResult.events,
          { executedSteps: pipelineResult.events.map(e => e.type) }
        );
      }

      // 3. Finalize Session (Clear cart and commit order)
      const finalizationResult = await this.checkoutOrchestrator.finalizeSession(session);
      if (!finalizationResult.success) {
        return PurchaseResultFactory.failure(
          'ORDER_FINALIZATION_FAILED',
          finalizationResult.error.message,
          pipelineResult.events,
          finalizationResult.error
        );
      }

      // 4. Return Successful Purchase Data
      const successData: PurchaseSuccessData = {
        orderId: pipelineResult.orderId,
        paymentId: pipelineResult.paymentId,
        totalPaid: session.summary.paymentRequired + session.summary.walletApplied,
        completedAt: new Date(),
      };

      return PurchaseResultFactory.success(successData, pipelineResult.events);

    } catch (error: any) {
      return PurchaseResultFactory.failure(
        'PURCHASE_ORCHESTRATION_ERROR',
        error.message || 'An unexpected error occurred in PurchaseOrchestrator.',
        [],
        error
      );
    }
  }
}