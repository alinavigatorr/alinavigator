'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { HistoryService } from '../services/history/history-service';
import { 
  WalletTransaction, 
  LoyaltyLedgerEntry, 
  CashbackTransaction, 
  HistorySummary 
} from '../services/history/history-types';

interface HistoryContextType {
  walletTransactions: WalletTransaction[];
  loyaltyLedger: LoyaltyLedgerEntry[];
  cashbackHistory: CashbackTransaction[];
  summary: HistorySummary | null;
  isLoading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

interface HistoryProviderProps {
  children: ReactNode;
  userId: string; // شناسه کاربر برای دریافت اطلاعات اختصاصی او
}

export function HistoryProvider({ children, userId }: HistoryProviderProps) {
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [loyaltyLedger, setLoyaltyLedger] = useState<LoyaltyLedgerEntry[]>([]);
  const [cashbackHistory, setCashbackHistory] = useState<CashbackTransaction[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryData = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // دریافت تمام تاریخچه‌ها به صورت موازی (Concurrent Fetching)
      const [walletData, loyaltyData, cashbackData, summaryData] = await Promise.all([
        HistoryService.getWalletHistory(userId),
        HistoryService.getLoyaltyHistory(userId),
        HistoryService.getCashbackHistory(userId),
        HistoryService.getHistorySummary(userId)
      ]);

      setWalletTransactions(walletData);
      setLoyaltyLedger(loyaltyData);
      setCashbackHistory(cashbackData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching history data:', err);
      setError('خطا در دریافت اطلاعات تاریخچه. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // فراخوانی اولیه داده‌ها هنگام Mount شدن Provider
  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  return (
    <HistoryContext.Provider 
      value={{
        walletTransactions,
        loyaltyLedger,
        cashbackHistory,
        summary,
        isLoading,
        error,
        refreshHistory: fetchHistoryData
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}