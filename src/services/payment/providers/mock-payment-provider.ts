import { PaymentProvider } from './payment-provider';
import { PaymentRequest, PaymentResponse, PaymentStatus, GatewayResult } from '../types/payment-types';
import { PaymentTimeoutError, BasePaymentError } from '../types/payment-errors';

export type MockOutcome = 'SUCCESS' | 'FAILURE' | 'CANCELLED' | 'TIMEOUT';

export class MockPaymentProvider implements PaymentProvider {
  private deterministicOutcome: MockOutcome;

  constructor(outcome: MockOutcome = 'SUCCESS') {
    this.deterministicOutcome = outcome;
  }

  getName(): string {
    return 'MOCK_PROVIDER';
  }

  /**
   * Change the deterministic outcome for testing purposes.
   */
  setOutcome(outcome: MockOutcome): void {
    this.deterministicOutcome = outcome;
  }

  async process(request: PaymentRequest): Promise<PaymentResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = Date.now();

        switch (this.deterministicOutcome) {
          case 'SUCCESS':
            resolve({
              status: PaymentStatus.SUCCESS,
              result: {
                transactionId: `TXN-MOCK-${Date.now()}`,
                referenceCode: `REF-${Math.floor(Math.random() * 900000)}`,
                rawResponse: { message: 'Approved deterministically' }
              },
              timestamp
            });
            break;

          case 'FAILURE':
            resolve({
              status: PaymentStatus.FAILED,
              error: new BasePaymentError('INSUFFICIENT_FUNDS', 'The mock transaction was declined deterministically.'),
              timestamp
            });
            break;

          case 'CANCELLED':
            resolve({
              status: PaymentStatus.CANCELLED,
              error: new BasePaymentError('USER_CANCELLED', 'The mock transaction was cancelled by the user.'),
              timestamp
            });
            break;

          case 'TIMEOUT':
            resolve({
              status: PaymentStatus.TIMEOUT,
              error: new PaymentTimeoutError('Mock timeout forced.'),
              timestamp
            });
            break;
        }
      }, 1000); // 1 second mock network delay
    });
  }

  async cancel(transactionId: string): Promise<PaymentResponse> {
    return {
      status: PaymentStatus.CANCELLED,
      result: { transactionId },
      timestamp: Date.now()
    };
  }
}