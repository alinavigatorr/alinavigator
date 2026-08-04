import { PaymentStatus, PaymentRequest, PaymentResponse } from '../types/payment-types';
import { BasePaymentError, PaymentTimeoutError } from '../types/payment-errors';
import { PaymentStateMachine } from './payment-state-machine';
import { SimulationConfig } from './payment-simulation-config';

export type StateChangeListener = (state: PaymentStatus) => void;

export class PaymentSimulationEngine {
  private stateMachine: PaymentStateMachine;
  private config: SimulationConfig;
  private listeners: Set<StateChangeListener> = new Set();
  private activeTimer: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.stateMachine = new PaymentStateMachine();
    this.log('ENGINE_INITIALIZED', `Mode: ${config.mode}`);
  }

  subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    // Immediately emit current state to new subscriber
    listener(this.stateMachine.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const state = this.stateMachine.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  private changeState(newState: PaymentStatus): void {
    this.stateMachine.transitionTo(newState);
    this.log(`PAYMENT_${newState}`);
    this.notifyListeners();
  }

  private log(event: string, details?: string): void {
    const timestamp = new Date().toISOString();
    // Centralized structured logging for the architecture
    console.log(`[PaymentEngine] ${timestamp} | ${event} ${details ? `| ${details}` : ''}`);
  }

  async process(request: PaymentRequest): Promise<PaymentResponse> {
    if (this.isProcessing) {
      const error = new BasePaymentError('CONCURRENT_REQUEST', 'A payment is already being processed.');
      this.log('ERROR', error.message);
      throw error;
    }

    try {
      this.isProcessing = true;
      this.log('PAYMENT_STARTED', `Order: ${request.orderId} | Amount: ${request.amount}`);
      
      this.changeState(PaymentStatus.VALIDATING);
      
      // Simulate validation latency
      await new Promise(resolve => setTimeout(resolve, 300));
      this.log('PAYMENT_VALIDATED');

      this.changeState(PaymentStatus.PROCESSING);

      return await new Promise((resolve, reject) => {
        let delay = this.config.processingDelay;
        if (this.config.mode === 'FAILURE') delay = this.config.failureDelay;
        if (this.config.mode === 'TIMEOUT') delay = this.config.timeoutDelay;

        this.activeTimer = setTimeout(() => {
          this.activeTimer = null;
          this.isProcessing = false;

          if (this.config.mode === 'SUCCESS') {
            this.changeState(PaymentStatus.SUCCESS);
            resolve({
              status: PaymentStatus.SUCCESS,
              result: { transactionId: `TXN-SIM-${Date.now()}` },
              timestamp: Date.now()
            });
          } else if (this.config.mode === 'FAILURE') {
            this.changeState(PaymentStatus.FAILED);
            resolve({
              status: PaymentStatus.FAILED,
              error: new BasePaymentError('SIMULATED_FAILURE', 'Payment declined deterministically.'),
              timestamp: Date.now()
            });
          } else if (this.config.mode === 'TIMEOUT') {
            this.changeState(PaymentStatus.TIMEOUT);
            resolve({
              status: PaymentStatus.TIMEOUT,
              error: new PaymentTimeoutError('Payment gateway timed out.'),
              timestamp: Date.now()
            });
          }
        }, delay);
      });
    } catch (error: any) {
      this.isProcessing = false;
      throw error;
    }
  }

  reset(): void {
    if (this.isProcessing) {
      throw new BasePaymentError('RESET_REJECTED', 'Cannot reset state while a payment is processing.');
    }
    
    const currentState = this.stateMachine.getState();
    if ((currentState === PaymentStatus.FAILED || currentState === PaymentStatus.TIMEOUT) && !this.config.allowRetry) {
      throw new BasePaymentError('RETRY_REJECTED', 'Retries are disabled by configuration.');
    }

    this.stateMachine.reset();
    this.log('PAYMENT_RESET');
    this.notifyListeners();
  }
}