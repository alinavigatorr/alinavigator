import { PaymentStatus } from '../types/payment-types';
import { BasePaymentError } from '../types/payment-errors';

export class PaymentStateMachine {
  private currentState: PaymentStatus = PaymentStatus.IDLE;

  // Strict deterministic transition map
  private allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
    [PaymentStatus.IDLE]: [PaymentStatus.VALIDATING],
    [PaymentStatus.VALIDATING]: [PaymentStatus.PROCESSING, PaymentStatus.IDLE], // Back to IDLE if validation fails
    [PaymentStatus.PROCESSING]: [PaymentStatus.SUCCESS, PaymentStatus.FAILED, PaymentStatus.TIMEOUT, PaymentStatus.CANCELLED],
    [PaymentStatus.SUCCESS]: [], // Terminal state
    [PaymentStatus.FAILED]: [PaymentStatus.IDLE], // Retry allowed
    [PaymentStatus.TIMEOUT]: [PaymentStatus.IDLE], // Retry allowed
    [PaymentStatus.CANCELLED]: [PaymentStatus.IDLE], // Retry allowed
  };

  getState(): PaymentStatus {
    return this.currentState;
  }

  transitionTo(newState: PaymentStatus): void {
    const allowed = this.allowedTransitions[this.currentState] || [];
    if (allowed.includes(newState)) {
      this.currentState = newState;
    } else {
      throw new BasePaymentError(
        'INVALID_STATE_TRANSITION',
        `Cannot transition from ${this.currentState} to ${newState}`
      );
    }
  }

  reset(): void {
    this.currentState = PaymentStatus.IDLE;
  }
}