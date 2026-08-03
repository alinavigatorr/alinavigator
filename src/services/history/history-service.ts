import { HistoryRepository } from './history-repository';
import { 
  WalletTransaction, 
  LoyaltyLedgerEntry, 
  CashbackTransaction, 
  HistorySummary 
} from './history-types';

export const HistoryService = {
  
  /**
   * دریافت تاریخچه کیف پول با مرتب‌سازی نزولی (جدیدترین به قدیمی‌ترین)
   */
  async getWalletHistory(userId: string): Promise<WalletTransaction[]> {
    const transactions = await HistoryRepository.fetchWalletTransactions(userId);
    return transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * دریافت دفتر کل امتیازات با مرتب‌سازی نزولی
   */
  async getLoyaltyHistory(userId: string): Promise<LoyaltyLedgerEntry[]> {
    const ledger = await HistoryRepository.fetchLoyaltyLedger(userId);
    return ledger.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * دریافت تاریخچه کش‌بک با مرتب‌سازی نزولی
   */
  async getCashbackHistory(userId: string): Promise<CashbackTransaction[]> {
    const history = await HistoryRepository.fetchCashbackHistory(userId);
    return history.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * محاسبه یک خلاصه کلی از تمام تاریخچه‌ها برای نمایش در داشبورد
   */
  async getHistorySummary(userId: string): Promise<HistorySummary> {
    const [walletTxs, loyaltyTxs, cashbackTxs] = await Promise.all([
      HistoryRepository.fetchWalletTransactions(userId),
      HistoryRepository.fetchLoyaltyLedger(userId),
      HistoryRepository.fetchCashbackHistory(userId)
    ]);

    // محاسبه موجودی کل کیف پول (فقط تراکنش‌های موفق)
    const totalWalletBalance = walletTxs
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((acc, curr) => acc + curr.amount, 0);

    // محاسبه امتیازات موجود (جمع EARN ها منهای REDEEM ها و EXPIRE ها برای موارد موفق)
    const totalPointsAvailable = loyaltyTxs
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((acc, curr) => acc + curr.points, 0);

    // محاسبه کل کش‌بک دریافت شده
    const totalCashbackEarned = cashbackTxs
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((acc, curr) => acc + curr.amount, 0);

    // پیدا کردن امتیازاتی که در شرف انقضا هستند (مثلاً تا ۳۰ روز آینده)
    const now = new Date().getTime();
    const thirtyDaysLater = now + (30 * 24 * 60 * 60 * 1000);
    
    let expiringAmount = 0;
    let closestExpireDate: string | undefined = undefined;

    loyaltyTxs.forEach(tx => {
      if (tx.status === 'COMPLETED' && tx.type === 'EARN' && tx.expiresAt) {
        const expTime = new Date(tx.expiresAt).getTime();
        if (expTime > now && expTime <= thirtyDaysLater) {
          expiringAmount += tx.points;
          if (!closestExpireDate || expTime < new Date(closestExpireDate).getTime()) {
            closestExpireDate = tx.expiresAt;
          }
        }
      }
    });

    return {
      totalWalletBalance,
      totalPointsAvailable,
      totalCashbackEarned,
      expiringPointsAmount: expiringAmount,
      expiringPointsDate: closestExpireDate
    };
  }
};