// src/services/membership/membership-data-source.ts

import {
  PremiumMembership,
  MembershipBenefit,
  CustomerWallet,
  LoyaltyPoints,
  CashbackBalance,
  UpgradeMembershipPayload,
  RenewMembershipPayload
} from './membership-types';

/**
 * The unified result wrapper for all membership data operations.
 */
export interface MembershipDataSourceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Abstract Data Source Interface for the Membership Domain.
 * Any backend implementation MUST implement this interface.
 */
export interface MembershipDataSource {
  // ==========================================
  // MEMBERSHIP INFO & BENEFITS
  // ==========================================
  getMembership(): Promise<MembershipDataSourceResult<PremiumMembership>>;
  getBenefits(): Promise<MembershipDataSourceResult<MembershipBenefit[]>>;
  
  // ==========================================
  // FINANCIAL & REWARDS
  // ==========================================
  getWallet(): Promise<MembershipDataSourceResult<CustomerWallet>>;
  getPoints(): Promise<MembershipDataSourceResult<LoyaltyPoints>>;
  getCashback(): Promise<MembershipDataSourceResult<CashbackBalance>>;
  
  // ==========================================
  // MEMBERSHIP ACTIONS
  // ==========================================
  upgradeMembership(payload: UpgradeMembershipPayload): Promise<MembershipDataSourceResult<PremiumMembership>>;
  renewMembership(payload: RenewMembershipPayload): Promise<MembershipDataSourceResult<PremiumMembership>>;
}