import { WalletTransaction, LoyaltyLedgerEntry, CashbackTransaction } from './history-types';

// تاریخ‌های شبیه‌سازی شده برای نمایش در داشبورد
const DATE_1 = '2026-07-28T14:30:00Z';
const DATE_2 = '2026-07-20T09:15:00Z';
const DATE_3 = '2026-07-10T18:45:00Z';
const DATE_4 = '2026-06-25T11:20:00Z';
const DATE_5 = '2026-02-15T10:00:00Z';

export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'wt-101',
    userId: 'u-1',
    amount: 15000000,
    currency: 'IRR',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    description: 'شارژ مستقیم کیف پول',
    referenceId: 'REF-889922',
    createdAt: DATE_4,
  },
  {
    id: 'wt-102',
    userId: 'u-1',
    amount: -2100000,
    currency: 'IRR',
    type: 'PURCHASE',
    status: 'COMPLETED',
    description: 'خرید پایه اسپیکر رومیزی لیزرکات',
    referenceId: 'ORD-773311',
    createdAt: DATE_3,
  },
  {
    id: 'wt-103',
    userId: 'u-1',
    amount: 850000,
    currency: 'IRR',
    type: 'CASHBACK',
    status: 'COMPLETED',
    description: 'تسویه کش‌بک سفارش قطعات اسکوتر',
    referenceId: 'CB-5544',
    createdAt: DATE_2,
  },
  {
    id: 'wt-104',
    userId: 'u-1',
    amount: -850000,
    currency: 'IRR',
    type: 'PURCHASE',
    status: 'PENDING',
    description: 'خرید کیت تعمیر موتور هاب اسکوتر',
    referenceId: 'ORD-998877',
    createdAt: DATE_1,
  }
];

export const mockLoyaltyLedger: LoyaltyLedgerEntry[] = [
  {
    id: 'll-201',
    userId: 'u-1',
    points: 500,
    type: 'EARN',
    status: 'COMPLETED',
    description: 'پاداش ثبت‌نام و تکمیل پروفایل',
    createdAt: '2026-01-15T10:00:00Z',
    expiresAt: '2027-01-15T10:00:00Z'
  },
  {
    id: 'll-202',
    userId: 'u-1',
    points: 1200,
    type: 'EARN',
    status: 'COMPLETED',
    description: 'پاداش خرید مانیتور LG 32GQ950',
    referenceId: 'ORD-445566',
    createdAt: DATE_5,
    expiresAt: '2027-02-15T10:00:00Z'
  },
  {
    id: 'll-203',
    userId: 'u-1',
    points: -400,
    type: 'REDEEM',
    status: 'COMPLETED',
    description: 'تبدیل امتیاز به کد تخفیف',
    referenceId: 'ORD-773311',
    createdAt: DATE_3,
  },
  {
    id: 'll-204',
    userId: 'u-1',
    points: 350,
    type: 'EARN',
    status: 'PENDING',
    description: 'پاداش در انتظار (خرید قطعات کاستوم)',
    referenceId: 'ORD-998877',
    createdAt: DATE_1,
    expiresAt: '2027-07-28T14:30:00Z'
  }
];

export const mockCashbackHistory: CashbackTransaction[] = [
  {
    id: 'cb-301',
    userId: 'u-1',
    amount: 1400000,
    currency: 'IRR',
    status: 'COMPLETED',
    description: 'کش‌بک ویژه سطح Gold (خرید مانیتور)',
    orderId: 'ORD-445566',
    createdAt: DATE_5,
    settledAt: '2026-02-17T12:00:00Z'
  },
  {
    id: 'cb-302',
    userId: 'u-1',
    amount: 850000,
    currency: 'IRR',
    status: 'COMPLETED',
    description: 'کش‌بک قطعات اسکوتر',
    orderId: 'ORD-556677',
    createdAt: DATE_2,
    settledAt: DATE_2,
  },
  {
    id: 'cb-303',
    userId: 'u-1',
    amount: 450000,
    currency: 'IRR',
    status: 'PENDING',
    description: 'کش‌بک در انتظار تایید (قطعات لیزرکات)',
    orderId: 'ORD-998877',
    createdAt: DATE_1,
  }
];