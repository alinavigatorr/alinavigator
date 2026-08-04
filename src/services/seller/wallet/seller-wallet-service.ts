/**
 * Seller Wallet Service
 * لایه سرویس برای مدیریت کیف پول و تراکنش‌های فروشنده (Mock Data for Sprint 29)
 */

 import { WalletSummaryModel, WalletTransactionModel } from './seller-wallet-types';

 const MOCK_WALLET_SUMMARY: WalletSummaryModel = {
   status: 'active',
   availableBalance: 45000000, // 45 میلیون تومان قابل برداشت
   pendingBalance: 12500000,   // 12.5 میلیون در انتظار (فروش‌های اخیر)
   blockedBalance: 0,          // 0 مسدود
   totalCashback: 1200000,     // 1.2 میلیون کش‌بک
   currency: 'IRR',
   lastUpdated: '2026-08-01T09:00:00Z'
 };
 
 const MOCK_TRANSACTIONS: WalletTransactionModel[] = [
   {
     id: 'trx-001',
     type: 'sale_income',
     amount: 8500000,
     status: 'success',
     description: 'درآمد حاصل از فروش سفارش ORD-982375-B',
     referenceId: 'ORD-982375-B',
     date: '2026-07-31T14:15:00Z'
   },
   {
     id: 'trx-002',
     type: 'commission',
     amount: -850000,
     status: 'success',
     description: 'کسر کارمزد پلتفرم (۱۰٪)',
     referenceId: 'ORD-982375-B',
     date: '2026-07-31T14:15:00Z'
   },
   {
     id: 'trx-003',
     type: 'settlement',
     amount: -25000000,
     status: 'pending',
     description: 'درخواست تسویه حساب به شبای بانکی IR250...',
     referenceId: 'STL-992211',
     date: '2026-07-30T10:00:00Z'
   },
   {
     id: 'trx-004',
     type: 'refund',
     amount: -2800000,
     status: 'success',
     description: 'استرداد وجه به خریدار (سفارش مرجوعی)',
     referenceId: 'ORD-982378-E',
     date: '2026-07-20T16:20:00Z'
   },
   {
     id: 'trx-005',
     type: 'cashback',
     amount: 150000,
     status: 'success',
     description: 'پاداش کش‌بک کمپین فروش تابستانه',
     referenceId: 'CMP-SUMMER-26',
     date: '2026-07-15T12:00:00Z'
   }
 ];
 
 export class SellerWalletService {
   /**
    * دریافت خلاصه وضعیت کیف پول فروشنده
    */
   static getWalletSummary(): WalletSummaryModel {
     return MOCK_WALLET_SUMMARY;
   }
 
   /**
    * دریافت لیست تراکنش‌های اخیر
    */
   static getRecentTransactions(): WalletTransactionModel[] {
     return MOCK_TRANSACTIONS;
   }
 }