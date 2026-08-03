// src/services/membership/membership-types.ts

export type MembershipTier = 'STANDARD' | 'PLUS' | 'VIP' | 'ELITE';
export type MembershipStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'NONE';

export interface MembershipBenefit {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface PremiumMembership {
  status: MembershipStatus;
  tier: MembershipTier;
  planId?: string;
  startedAt?: string;
  expiresAt?: string;
  autoRenew: boolean;
  benefits: MembershipBenefit[];
}

export interface CustomerWallet {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface LoyaltyPoints {
  currentPoints: number;
  lifetimePoints: number;
  pointsToNextTier?: number;
  nextTier?: MembershipTier;
}

export interface CashbackBalance {
  availableAmount: number;
  pendingAmount: number;
  currency: string;
}

export interface UpgradeMembershipPayload {
  planId: string;
  paymentMethodId?: string; // Optional for cases where payment is handled separately
}

export interface RenewMembershipPayload {
  autoRenew: boolean;
}