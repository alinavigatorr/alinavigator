/**
 * Seller Wallet Domain Types
 * تعریف مدل داده‌ای کیف پول و تراکنش‌های مالی مختص پنل فروشندگان.
 */

// وضعیت‌های ۴ گانه کیف پول طبق مانیفست
export type WalletStatus = 
  | 'active' 
  | 'pending_settlement' 
  | 'blocked' 
  | 'suspended';

// انواع تراکنش‌های مالی طبق مانیفست
export type WalletTransactionType = 
  | 'sale_income' 
  | 'refund' 
  | 'commission' 
  | 'settlement' 
  | 'adjustment' 
  | 'bonus' 
  | 'cashback';

// اکشن‌های سریع (فقط Placeholder برای UI)
export type WalletQuickAction = 
  | 'request_settlement' 
  | 'view_transactions' 
  | 'export_report' 
  | 'download_statement';

// وضعیت یک تراکنش خاص
export type TransactionStatus = 'success' | 'pending' | 'failed';

// مدل داده‌ای تراکنش مالی
export interface WalletTransactionModel {
  id: string;
  type: WalletTransactionType;
  amount: number; // مبلغ تراکنش (مثبت برای واریز، منفی برای برداشت/کسر)
  status: TransactionStatus;
  description: string;
  referenceId?: string; // شناسه مرجع مانند شماره سفارش یا شماره درخواست تسویه
  date: string; // ISO Date String
}

// مدل داده‌ای خلاصه کیف پول
export interface WalletSummaryModel {
  status: WalletStatus;
  availableBalance: number; // موجودی قابل برداشت
  pendingBalance: number; // موجودی در انتظار تسویه یا بلوکه موقت
  blockedBalance: number; // موجودی مسدود شده (مثلاً بابت شکایات)
  totalCashback: number; // مجموع کش‌بک‌های دریافتی
  currency: string;
  lastUpdated: string; // ISO Date String
}