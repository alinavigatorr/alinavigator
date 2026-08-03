// src/services/wallet/wallet-data-source.ts

import {
  WalletBalanceSummary,
  WalletTransaction,
  WalletOperationPayload,
  RewardTransaction,
  RewardOperationPayload,
  CashbackEntry
} from './wallet-types';

/**
 * The unified result wrapper for all wallet and reward data operations.
 */
export interface WalletDataSourceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Abstract Data Source Interface for the Wallet & Rewards Domain.
 * Any backend implementation (Mock, REST, GraphQL) MUST implement this interface.
 */
export interface WalletDataSource {
  // ==========================================
  // WALLET OPERATIONS
  // ==========================================
  getWalletBalance(): Promise<WalletDataSourceResult<WalletBalanceSummary>>;
  getWalletTransactions(): Promise<WalletDataSourceResult<WalletTransaction[]>>;
  creditWallet(payload: WalletOperationPayload): Promise<WalletDataSourceResult<WalletTransaction>>;
  debitWallet(payload: WalletOperationPayload): Promise<WalletDataSourceResult<WalletTransaction>>;
  refundWallet(payload: WalletOperationPayload): Promise<WalletDataSourceResult<WalletTransaction>>;

  // ==========================================
  // REWARD OPERATIONS
  // ==========================================
  getRewardHistory(): Promise<WalletDataSourceResult<RewardTransaction[]>>;
  addRewardPoints(payload: RewardOperationPayload): Promise<WalletDataSourceResult<RewardTransaction>>;
  consumeRewardPoints(payload: RewardOperationPayload): Promise<WalletDataSourceResult<RewardTransaction>>;

  // ==========================================
  // CASHBACK OPERATIONS
  // ==========================================
  getCashbackHistory(): Promise<WalletDataSourceResult<CashbackEntry[]>>;
}