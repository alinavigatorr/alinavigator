import { PaymentStatus } from '../types/payment-types';

export interface PaymentResult<T = any> {
  success: boolean;
  status: PaymentStatus;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}