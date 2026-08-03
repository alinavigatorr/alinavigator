// src/services/wallet/wallet-ledger.ts

import { WalletTransaction, TransactionStatus } from './wallet-types';

export class WalletLedger {
  private transactions: WalletTransaction[] = [];

  constructor(initialTransactions: WalletTransaction[] = []) {
    this.transactions = [...initialTransactions];
  }

  /**
   * ثبت یک تراکنش جدید در دفتر کل
   */
  public addTransaction(transaction: WalletTransaction): void {
    this.transactions.push(transaction);
  }

  /**
   * دریافت تمامی تراکنش‌های یک کاربر خاص به ترتیب زمان (جدیدترین در ابتدا)
   */
  public getHistory(userId: string): WalletTransaction[] {
    return this.transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * دریافت تراکنش‌ها بر اساس وضعیت (مانند PENDING یا COMPLETED)
   */
  public getByStatus(userId: string, status: TransactionStatus): WalletTransaction[] {
    return this.transactions.filter(t => t.userId === userId && t.status === status);
  }

  /**
   * دریافت تراکنش‌های اعتباری که تاریخ انقضای آن‌ها گذشته است
   */
  public getExpiredCredits(userId: string, currentTime: number = Date.now()): WalletTransaction[] {
    return this.transactions.filter(
      t => t.userId === userId &&
           t.type === 'CREDIT' &&
           t.status === 'COMPLETED' &&
           t.expiresAt !== undefined &&
           t.expiresAt < currentTime
    );
  }

  /**
   * به‌روزرسانی وضعیت یک تراکنش خاص
   */
  public updateTransactionStatus(transactionId: string, newStatus: TransactionStatus): boolean {
    const index = this.transactions.findIndex(t => t.id === transactionId);
    if (index !== -1) {
      this.transactions[index].status = newStatus;
      return true;
    }
    return false;
  }
}