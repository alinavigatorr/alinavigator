// src/services/wallet/wallet-service.ts

import {
  WalletBalanceSummary,
  WalletTransaction,
  WalletOperationPayload,
  RewardTransaction,
  RewardOperationPayload,
  CashbackEntry
} from './wallet-types';
import { WalletDataSource } from './wallet-data-source';
import { MockWalletDataSource } from './mock-wallet-data-source';

// الگوی استاندارد پاسخ سرویس برای سازگاری با سایر دامنه‌های پلتفرم
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class WalletService {
  private dataSource: WalletDataSource;

  /**
   * Dependency Injection: 
   * سرویس وابسته به پیاده‌سازی خاصی نیست و فقط اینترفیس را می‌شناسد.
   */
  constructor(dataSource: WalletDataSource) {
    this.dataSource = dataSource;
  }

  // ==========================================
  // WALLET OPERATIONS
  // ==========================================
  async getWalletBalance(): Promise<ServiceResult<WalletBalanceSummary>> {
    return this.dataSource.getWalletBalance();
  }

  async getWalletTransactions(): Promise<ServiceResult<WalletTransaction[]>> {
    return this.dataSource.getWalletTransactions();
  }

  async creditWallet(payload: WalletOperationPayload): Promise<ServiceResult<WalletTransaction>> {
    return this.dataSource.creditWallet(payload);
  }

  async debitWallet(payload: WalletOperationPayload): Promise<ServiceResult<WalletTransaction>> {
    return this.dataSource.debitWallet(payload);
  }

  async refundWallet(payload: WalletOperationPayload): Promise<ServiceResult<WalletTransaction>> {
    return this.dataSource.refundWallet(payload);
  }

  // ==========================================
  // REWARD OPERATIONS
  // ==========================================
  async getRewardHistory(): Promise<ServiceResult<RewardTransaction[]>> {
    return this.dataSource.getRewardHistory();
  }

  async addRewardPoints(payload: RewardOperationPayload): Promise<ServiceResult<RewardTransaction>> {
    return this.dataSource.addRewardPoints(payload);
  }

  async consumeRewardPoints(payload: RewardOperationPayload): Promise<ServiceResult<RewardTransaction>> {
    return this.dataSource.consumeRewardPoints(payload);
  }

  // ==========================================
  // CASHBACK OPERATIONS
  // ==========================================
  async getCashbackHistory(): Promise<ServiceResult<CashbackEntry[]>> {
    return this.dataSource.getCashbackHistory();
  }
}

// Singleton export 
// در این مرحله، نسخه Mock را به سرویس تزریق می‌کنیم تا بدون بک‌اند کار کند.
// در آینده برای اتصال واقعی، فقط کافیست ApiWalletDataSource جایگزین این بخش شود.
export const walletService = new WalletService(new MockWalletDataSource());