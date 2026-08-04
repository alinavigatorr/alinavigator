// src/services/wallet/wallet-balance.ts

import { WalletBalanceSummary } from './wallet-types';
import { WalletLedger } from './wallet-ledger';

export class WalletBalanceCalculator {
  /**
   * محاسبه خلاصه وضعیت موجودی کیف پول یک کاربر
   */
  public static calculateSummary(
    userId: string,
    ledger: WalletLedger,
    currentTime: number = Date.now()
  ): WalletBalanceSummary {
    const history = ledger.getHistory(userId);

    let currentBalance = 0;
    let pendingBalance = 0;
    let expiredBalance = 0;

    for (const tx of history) {
      if (tx.status === 'PENDING') {
        if (tx.type === 'CREDIT') {
          pendingBalance += tx.amount;
        }
        continue;
      }

      if (tx.status === 'COMPLETED') {
        if (tx.type === 'CREDIT') {
          // بررسی انقضای اعتبار به صورت داینامیک
          if (tx.expiresAt && tx.expiresAt < currentTime) {
            expiredBalance += tx.amount;
          } else {
            currentBalance += tx.amount;
          }
        } else if (tx.type === 'DEBIT' || tx.type === 'REVERSAL') {
          currentBalance -= tx.amount;
        } else if (tx.type === 'EXPIRE') {
          // در صورتی که تراکنش انقضا به صورت صریح (Explicit) ثبت شده باشد
          currentBalance -= tx.amount;
          expiredBalance += tx.amount;
        }
      }
    }

    // موجودی در دسترس (Available Balance) برابر با موجودی فعلی است 
    // مگر اینکه قوانین مسدودی یا رزرو در آینده اضافه شود
    const availableBalance = Math.max(0, currentBalance);

    return {
      currentBalance: Math.max(0, currentBalance),
      availableBalance,
      pendingBalance,
      expiredBalance,
    };
  }
}