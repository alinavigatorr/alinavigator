'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { membershipService } from '../services/membership/membership-service';
import { walletService } from '../services/wallet/wallet-service';
import { PremiumMembership, LoyaltyPoints } from '../services/membership/membership-types';
import { WalletBalanceSummary, RewardTransaction, CashbackEntry } from '../services/wallet/wallet-types';

interface MembershipContextState {
  membership: PremiumMembership | null;
  wallet: WalletBalanceSummary | null;
  points: LoyaltyPoints | null;
  rewardHistory: RewardTransaction[];
  cashbackHistory: CashbackEntry[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextState | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const [membership, setMembership] = useState<PremiumMembership | null>(null);
  const [wallet, setWallet] = useState<WalletBalanceSummary | null>(null);
  const [points, setPoints] = useState<LoyaltyPoints | null>(null);
  const [rewardHistory, setRewardHistory] = useState<RewardTransaction[]>([]);
  const [cashbackHistory, setCashbackHistory] = useState<CashbackEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // فراخوانی موازی تمام سرویس‌های مرتبط با وفاداری، کیف پول و کش‌بک
      const [membershipRes, walletRes, pointsRes, rewardsRes, cashbackRes] = await Promise.all([
        membershipService.getMembership(),
        walletService.getWalletBalance(),
        membershipService.getPoints(),
        walletService.getRewardHistory(),
        walletService.getCashbackHistory()
      ]);

      if (membershipRes.success && membershipRes.data) {
        setMembership(membershipRes.data);
      }
      
      if (walletRes.success && walletRes.data) {
        setWallet(walletRes.data);
      }
      
      if (pointsRes.success && pointsRes.data) {
        setPoints(pointsRes.data);
      }

      if (rewardsRes.success && rewardsRes.data) {
        setRewardHistory(rewardsRes.data);
      }

      if (cashbackRes.success && cashbackRes.data) {
        setCashbackHistory(cashbackRes.data);
      }

    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <MembershipContext.Provider value={{ 
      membership, 
      wallet, 
      points, 
      rewardHistory, 
      cashbackHistory, 
      isLoading, 
      error, 
      refreshData 
    }}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership باید درون MembershipProvider استفاده شود');
  }
  return context;
}