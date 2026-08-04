// src/services/wallet/wallet-types.ts

// ==========================================
// EXISTING TYPES (Preserved)
// ==========================================
export type WalletTransactionType = 'CREDIT' | 'DEBIT' | 'EXPIRE' | 'REVERSAL';

export type WalletTransactionSource = 
  | 'PRICE_PROTECTION' 
  | 'REFUND' 
  | 'LOYALTY' 
  | 'PROMOTION' 
  | 'ADMIN' 
  | 'MANUAL';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: WalletTransactionType;
  source: WalletTransactionSource;
  amount: number; // مقادیر مثبت (Absolute value)
  referenceId?: string;
  createdAt: number; // Unix timestamp
  expiresAt?: number; // Unix timestamp (optional for credits that expire)
  status: TransactionStatus;
  description?: string;
}

export interface WalletBalanceSummary {
  currentBalance: number;     // کل موجودی (شامل مواردی که هنوز قابل برداشت/استفاده نیستند)
  availableBalance: number;   // موجودی قطعی و قابل استفاده
  pendingBalance: number;     // موجودی در انتظار تایید
  expiredBalance: number;     // مجموع اعتبارات منقضی شده
}

export interface WalletPolicyConfig {
  maxBalanceLimit: number;
  allowNegativeBalance: boolean;
  defaultExpirationDays: number; // 0 به معنای بدون انقضا
}

// ==========================================
// NEW TYPES (Rewards, Cashback, Operations)
// ==========================================

export type RewardTransactionType = 'EARN' | 'REDEEM' | 'EXPIRE' | 'REVERT';

export interface RewardTransaction {
  id: string;
  type: RewardTransactionType;
  points: number; // مقادیر مطلق (بدون علامت منفی)
  referenceId?: string;
  createdAt: number;
  description?: string;
}

export interface CashbackEntry {
  id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  orderId?: string;
  createdAt: number;
  availableAt?: number; // تاریخ (Timestamp) در دسترس قرار گرفتن کش‌بک
  description?: string;
}

// Payloads for Wallet & Reward Service Operations
export interface WalletOperationPayload {
  amount: number;
  source: WalletTransactionSource;
  referenceId?: string;
  description?: string;
}

export interface RewardOperationPayload {
  points: number;
  referenceId?: string;
  description?: string;
}