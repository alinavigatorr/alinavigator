// src/services/wallet/mock-wallet-data-source.ts

import {
  WalletBalanceSummary,
  WalletTransaction,
  WalletOperationPayload,
  RewardTransaction,
  RewardOperationPayload,
  CashbackEntry
} from './wallet-types';
import { WalletDataSource, WalletDataSourceResult } from './wallet-data-source';

export class MockWalletDataSource implements WalletDataSource {
  // ==========================================
  // IN-MEMORY DATABASE
  // ==========================================
  private mockBalance: WalletBalanceSummary = {
    currentBalance: 2500000,
    availableBalance: 2000000,
    pendingBalance: 500000,
    expiredBalance: 0
  };

  private mockWalletTransactions: WalletTransaction[] = [
    {
      id: 'wt-1',
      userId: 'user-123',
      type: 'CREDIT',
      source: 'REFUND',
      amount: 500000,
      createdAt: Date.now() - 86400000, // روز گذشته
      status: 'COMPLETED',
      description: 'استرداد وجه سفارش #1020'
    }
  ];

  private mockRewardTransactions: RewardTransaction[] = [
    {
      id: 'rt-1',
      type: 'EARN',
      points: 150,
      createdAt: Date.now() - 172800000, // دو روز پیش
      description: 'امتیاز خرید سفارش #1015'
    }
  ];

  private mockCashbackHistory: CashbackEntry[] = [
    {
      id: 'cb-1',
      amount: 100000,
      currency: 'IRR',
      status: 'COMPLETED',
      orderId: 'ORD-1015',
      createdAt: Date.now() - 172800000,
      description: 'کش‌بک کمپین تابستانه'
    }
  ];

  // Simulate network latency (500ms)
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // WALLET OPERATIONS
  // ==========================================
  async getWalletBalance(): Promise<WalletDataSourceResult<WalletBalanceSummary>> {
    await this.delay();
    return { success: true, data: { ...this.mockBalance } };
  }

  async getWalletTransactions(): Promise<WalletDataSourceResult<WalletTransaction[]>> {
    await this.delay();
    return { success: true, data: [...this.mockWalletTransactions] };
  }

  async creditWallet(payload: WalletOperationPayload): Promise<WalletDataSourceResult<WalletTransaction>> {
    await this.delay();
    const tx: WalletTransaction = {
      id: `wt-${Date.now()}`,
      userId: 'user-123',
      type: 'CREDIT',
      source: payload.source,
      amount: payload.amount,
      referenceId: payload.referenceId,
      createdAt: Date.now(),
      status: 'COMPLETED',
      description: payload.description
    };
    this.mockWalletTransactions.unshift(tx);
    this.mockBalance.availableBalance += payload.amount;
    this.mockBalance.currentBalance += payload.amount;
    return { success: true, data: tx };
  }

  async debitWallet(payload: WalletOperationPayload): Promise<WalletDataSourceResult<WalletTransaction>> {
    await this.delay();
    if (this.mockBalance.availableBalance < payload.amount) {
      return { success: false, error: { code: 'INSUFFICIENT_FUNDS', message: 'موجودی کافی نیست' } };
    }
    const tx: WalletTransaction = {
      id: `wt-${Date.now()}`,
      userId: 'user-123',
      type: 'DEBIT',
      source: payload.source,
      amount: payload.amount,
      referenceId: payload.referenceId,
      createdAt: Date.now(),
      status: 'COMPLETED',
      description: payload.description
    };
    this.mockWalletTransactions.unshift(tx);
    this.mockBalance.availableBalance -= payload.amount;
    this.mockBalance.currentBalance -= payload.amount;
    return { success: true, data: tx };
  }

  async refundWallet(payload: WalletOperationPayload): Promise<WalletDataSourceResult<WalletTransaction>> {
    // بازگشت وجه از نظر منطقی همان واریز (Credit) است، اما با سورس متفاوت
    return this.creditWallet({ ...payload, source: 'REFUND' });
  }

  // ==========================================
  // REWARD OPERATIONS
  // ==========================================
  async getRewardHistory(): Promise<WalletDataSourceResult<RewardTransaction[]>> {
    await this.delay();
    return { success: true, data: [...this.mockRewardTransactions] };
  }

  async addRewardPoints(payload: RewardOperationPayload): Promise<WalletDataSourceResult<RewardTransaction>> {
    await this.delay();
    const tx: RewardTransaction = {
      id: `rt-${Date.now()}`,
      type: 'EARN',
      points: payload.points,
      referenceId: payload.referenceId,
      createdAt: Date.now(),
      description: payload.description
    };
    this.mockRewardTransactions.unshift(tx);
    return { success: true, data: tx };
  }

  async consumeRewardPoints(payload: RewardOperationPayload): Promise<WalletDataSourceResult<RewardTransaction>> {
    await this.delay();
    const tx: RewardTransaction = {
      id: `rt-${Date.now()}`,
      type: 'REDEEM',
      points: payload.points,
      referenceId: payload.referenceId,
      createdAt: Date.now(),
      description: payload.description
    };
    this.mockRewardTransactions.unshift(tx);
    return { success: true, data: tx };
  }

  // ==========================================
  // CASHBACK OPERATIONS
  // ==========================================
  async getCashbackHistory(): Promise<WalletDataSourceResult<CashbackEntry[]>> {
    await this.delay();
    return { success: true, data: [...this.mockCashbackHistory] };
  }
}