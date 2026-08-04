import { PaymentAdapter, StateChangeListener } from './payment-adapter';
import { PaymentResult } from './payment-gateway-types';
import { PaymentRequest, PaymentStatus } from '../types/payment-types';
import { PaymentStateMachine } from '../simulation/payment-state-machine';
import { SimulationConfig } from '../simulation/payment-simulation-config';

export class SimulationAdapter implements PaymentAdapter {
  private stateMachine: PaymentStateMachine;
  private config: SimulationConfig;
  private listeners: Set<StateChangeListener> = new Set();
  private isProcessing: boolean = false;
  private activeTransactionId: string | null = null;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.stateMachine = new PaymentStateMachine();
  }

  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.stateMachine.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const state = this.stateMachine.getState();
    this.listeners.forEach((l) => l(state));
  }

  private changeState(newState: PaymentStatus): void {
    this.stateMachine.transitionTo(newState);
    console.log(`[SimulationAdapter] PAYMENT_${newState}`);
    this.notifyListeners();
  }

  validate(request: PaymentRequest): PaymentResult {
    if (!request.amount || request.amount <= 0) {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: { code: 'INVALID_AMOUNT', message: 'Amount must be greater than 0' }
      };
    }
    return { success: true, status: PaymentStatus.VALIDATING };
  }

  async startPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (this.isProcessing) {
      return {
        success: false,
        status: this.stateMachine.getState(),
        error: { code: 'CONCURRENT_REQUEST', message: 'A payment is already processing' }
      };
    }

    const validation = this.validate(request);
    if (!validation.success) return validation;

    this.isProcessing = true;
    this.changeState(PaymentStatus.VALIDATING);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    this.changeState(PaymentStatus.PROCESSING);

    return new Promise((resolve) => {
      let delay = this.config.processingDelay;
      if (this.config.mode === 'FAILURE') delay = this.config.failureDelay;
      if (this.config.mode === 'TIMEOUT') delay = this.config.timeoutDelay;

      setTimeout(() => {
        this.isProcessing = false;
        
        if (this.config.mode === 'SUCCESS') {
          this.activeTransactionId = `SIM-TXN-${Date.now()}`;
          this.changeState(PaymentStatus.SUCCESS);
          resolve({
            success: true,
            status: PaymentStatus.SUCCESS,
            data: { transactionId: this.activeTransactionId }
          });
        } else if (this.config.mode === 'FAILURE') {
          this.changeState(PaymentStatus.FAILED);
          resolve({
            success: false,
            status: PaymentStatus.FAILED,
            error: { code: 'SIMULATED_FAILURE', message: 'Payment declined deterministically' }
          });
        } else {
          this.changeState(PaymentStatus.TIMEOUT);
          resolve({
            success: false,
            status: PaymentStatus.TIMEOUT,
            error: { code: 'TIMEOUT', message: 'Gateway timed out' }
          });
        }
      }, delay);
    });
  }

  async cancelPayment(transactionId: string): Promise<PaymentResult> {
    this.isProcessing = false;
    this.activeTransactionId = null;
    this.changeState(PaymentStatus.CANCELLED);
    return { success: true, status: PaymentStatus.CANCELLED };
  }

  async retryPayment(request: PaymentRequest): Promise<PaymentResult> {
    this.stateMachine.reset();
    this.notifyListeners();
    return this.startPayment(request);
  }

  getStatus(): PaymentStatus {
    return this.stateMachine.getState();
  }
}