export enum PaymentStatus {
  IDLE = 'IDLE',
  VALIDATING = 'VALIDATING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  TIMEOUT = 'TIMEOUT'
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  customerInfo: {
    fullName: string;
    phone: string;
    email?: string;
  };
  callbackUrl?: string;
}

export interface GatewayResult {
  transactionId?: string;
  referenceCode?: string;
  rawResponse?: unknown;
  redirectUrl?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaymentResponse {
  status: PaymentStatus;
  result?: GatewayResult;
  error?: PaymentError;
  timestamp: number;
}