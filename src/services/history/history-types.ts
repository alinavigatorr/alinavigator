// Enums & Literal Types برای وضعیت‌ها و انواع تراکنش‌ها

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export type WalletTransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PURCHASE' | 'REFUND' | 'CASHBACK';

export type LoyaltyTransactionType = 'EARN' | 'REDEEM' | 'EXPIRE' | 'ADJUSTMENT';

// مدل‌های اصلی داده (Data Models)

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: WalletTransactionType;
  status: TransactionStatus;
  description: string;
  referenceId?: string; // شناسه سفارش یا درگاه
  createdAt: string;
  updatedAt?: string;
}

export interface LoyaltyLedgerEntry {
  id: string;
  userId: string;
  points: number;
  type: LoyaltyTransactionType;
  status: TransactionStatus;
  description: string;
  referenceId?: string; // شناسه سفارش مرتبط با دریافت/مصرف امتیاز
  createdAt: string;
  expiresAt?: string; // تاریخ انقضای امتیازات (فقط برای نوع EARN)
}

export interface CashbackTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  orderId?: string;
  createdAt: string;
  settledAt?: string; // تاریخ تسویه و واریز نهایی به کیف پول
}

// مدل‌های خلاصه‌سازی (Summaries)

export interface HistorySummary {
  totalWalletBalance: number;
  totalPointsAvailable: number;
  totalCashbackEarned: number;
  expiringPointsAmount: number;
  expiringPointsDate?: string;
}

// مدل‌های پاسخ سرور (API Responses)

export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HistoryApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}