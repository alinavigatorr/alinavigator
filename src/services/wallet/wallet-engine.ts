// src/services/wallet/wallet-engine.ts

import { 
  WalletTransaction, 
  WalletTransactionSource, 
  WalletBalanceSummary 
} from './wallet-types';
import { WalletPolicyManager, defaultWalletPolicy } from './wallet-policy';
import { WalletLedger } from './wallet-ledger';
import { WalletBalanceCalculator } from './wallet-balance';

export class WalletEngine {
  private policyManager: WalletPolicyManager;
  private ledger: WalletLedger;

  constructor(
    policyManager: WalletPolicyManager = defaultWalletPolicy,
    ledger: WalletLedger = new WalletLedger()
  ) {
    this.policyManager = policyManager;
    this.ledger = ledger;
  }

  /**
   * دریافت خلاصه وضعیت موجودی کیف پول کاربر
   */
  public getBalance(userId: string): WalletBalanceSummary {
    return WalletBalanceCalculator.calculateSummary(userId, this.ledger);
  }

  /**
   * واریز (شارژ) کیف پول از منابع مختلف (مانند Price Protection، پروموشن یا بازپرداخت)
   */
  public credit(
    userId: string,
    amount: number,
    source: WalletTransactionSource,
    referenceId?: string,
    expirationDays?: number
  ): WalletTransaction {
    if (amount <= 0) {
      throw new Error('Credit amount must be strictly positive.');
    }

    const currentSummary = this.getBalance(userId);
    
    // بررسی محدودیت‌های سیاست تجاری کیف پول
    if (!this.policyManager.canAcceptCredit(currentSummary.currentBalance, amount)) {
      throw new Error('Wallet balance limit exceeded. Cannot accept credit.');
    }

    const policy = this.policyManager.getPolicy();
    const daysToExpiry = expirationDays !== undefined ? expirationDays : policy.defaultExpirationDays;
    
    const expiresAt = daysToExpiry > 0 
      ? Date.now() + (daysToExpiry * 24 * 60 * 60 * 1000) 
      : undefined;

    const transaction: WalletTransaction = {
      id: `tx_cr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'CREDIT',
      source,
      amount,
      referenceId,
      createdAt: Date.now(),
      expiresAt,
      status: 'COMPLETED'
    };

    this.ledger.addTransaction(transaction);
    return transaction;
  }

  /**
   * برداشت از کیف پول (برای پرداخت سفارش یا تسویه)
   */
  public debit(
    userId: string,
    amount: number,
    referenceId?: string
  ): WalletTransaction {
    if (amount <= 0) {
      throw new Error('Debit amount must be strictly positive.');
    }

    const currentSummary = this.getBalance(userId);
    const policy = this.policyManager.getPolicy();

    // بررسی موجودی برای برداشت (مگر اینکه اجازه موجودی منفی صادر شده باشد)
    if (currentSummary.availableBalance < amount && !policy.allowNegativeBalance) {
      throw new Error('Insufficient available balance for this debit transaction.');
    }

    const transaction: WalletTransaction = {
      id: `tx_db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: 'DEBIT',
      source: 'MANUAL', 
      amount,
      referenceId,
      createdAt: Date.now(),
      status: 'COMPLETED'
    };

    this.ledger.addTransaction(transaction);
    return transaction;
  }
  
  /**
   * استخراج تاریخچه تراکنش‌های کاربر به صورت مستقیم
   */
  public getHistory(userId: string): WalletTransaction[] {
    return this.ledger.getHistory(userId);
  }
}

// Singleton export پیش‌فرض برای استفاده سراسری در برنامه
export const walletEngine = new WalletEngine();