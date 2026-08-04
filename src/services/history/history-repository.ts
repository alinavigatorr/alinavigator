import { WalletTransaction, LoyaltyLedgerEntry, CashbackTransaction } from './history-types';
import { mockWalletTransactions, mockLoyaltyLedger, mockCashbackHistory } from './history-mock-data';

// یک تاخیر مصنوعی برای شبیه‌سازی زمان پاسخگویی سرور (Network Latency)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const HistoryRepository = {
  
  /**
   * دریافت تاریخچه تراکنش‌های کیف پول کاربر
   */
  async fetchWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    await delay(600); // شبیه‌سازی لودینگ
    // در آینده: return await fetch(`/api/wallet/transactions?userId=${userId}`).then(res => res.json());
    return mockWalletTransactions.filter(tx => tx.userId === userId);
  },

  /**
   * دریافت دفتر کل (Ledger) امتیازات وفاداری کاربر
   */
  async fetchLoyaltyLedger(userId: string): Promise<LoyaltyLedgerEntry[]> {
    await delay(700);
    // در آینده: return await fetch(`/api/loyalty/ledger?userId=${userId}`).then(res => res.json());
    return mockLoyaltyLedger.filter(entry => entry.userId === userId);
  },

  /**
   * دریافت تاریخچه کش‌بک‌های کاربر
   */
  async fetchCashbackHistory(userId: string): Promise<CashbackTransaction[]> {
    await delay(500);
    // در آینده: return await fetch(`/api/cashback/history?userId=${userId}`).then(res => res.json());
    return mockCashbackHistory.filter(cb => cb.userId === userId);
  }

};