// src/services/membership/mock-membership-data-source.ts

import {
  PremiumMembership,
  MembershipBenefit,
  CustomerWallet,
  LoyaltyPoints,
  CashbackBalance,
  UpgradeMembershipPayload,
  RenewMembershipPayload
} from './membership-types';
import { MembershipDataSource, MembershipDataSourceResult } from './membership-data-source';

export class MockMembershipDataSource implements MembershipDataSource {
  // ==========================================
  // IN-MEMORY DATABASE
  // ==========================================
  private mockMembership: PremiumMembership = {
    status: 'ACTIVE',
    tier: 'PLUS',
    planId: 'plan-plus-yearly',
    startedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    expiresAt: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(), // 275 days from now
    autoRenew: true,
    benefits: [
      { id: 'b1', title: 'ارسال رایگان', description: 'ارسال رایگان برای تمام سفارشات بالای ۵۰۰ هزار تومان', isActive: true },
      { id: 'b2', title: 'پشتیبانی ویژه', description: 'اولویت در پاسخگویی تیکت‌ها', isActive: true },
      { id: 'b3', title: 'دسترسی زودهنگام', description: 'دسترسی به تخفیف‌ها ۲۴ ساعت زودتر', isActive: false }
    ]
  };

  private mockWallet: CustomerWallet = {
    balance: 1500000,
    currency: 'IRR',
    lastUpdated: new Date().toISOString()
  };

  private mockPoints: LoyaltyPoints = {
    currentPoints: 2450,
    lifetimePoints: 5000,
    pointsToNextTier: 550,
    nextTier: 'VIP'
  };

  private mockCashback: CashbackBalance = {
    availableAmount: 250000,
    pendingAmount: 50000,
    currency: 'IRR'
  };

  // Simulate network latency (500ms)
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // MEMBERSHIP INFO & BENEFITS
  // ==========================================
  async getMembership(): Promise<MembershipDataSourceResult<PremiumMembership>> {
    await this.delay();
    return { success: true, data: { ...this.mockMembership } };
  }

  async getBenefits(): Promise<MembershipDataSourceResult<MembershipBenefit[]>> {
    await this.delay();
    return { success: true, data: [...this.mockMembership.benefits] };
  }

  // ==========================================
  // FINANCIAL & REWARDS
  // ==========================================
  async getWallet(): Promise<MembershipDataSourceResult<CustomerWallet>> {
    await this.delay();
    return { success: true, data: { ...this.mockWallet } };
  }

  async getPoints(): Promise<MembershipDataSourceResult<LoyaltyPoints>> {
    await this.delay();
    return { success: true, data: { ...this.mockPoints } };
  }

  async getCashback(): Promise<MembershipDataSourceResult<CashbackBalance>> {
    await this.delay();
    return { success: true, data: { ...this.mockCashback } };
  }

  // ==========================================
  // MEMBERSHIP ACTIONS
  // ==========================================
  async upgradeMembership(payload: UpgradeMembershipPayload): Promise<MembershipDataSourceResult<PremiumMembership>> {
    await this.delay(1000); // شبیه‌سازی زمان بیشتر برای تراکنش ارتقا
    this.mockMembership = {
      ...this.mockMembership,
      status: 'ACTIVE',
      tier: 'VIP',
      planId: payload.planId,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true
    };
    return { success: true, data: { ...this.mockMembership } };
  }

  async renewMembership(payload: RenewMembershipPayload): Promise<MembershipDataSourceResult<PremiumMembership>> {
    await this.delay();
    this.mockMembership.autoRenew = payload.autoRenew;
    return { success: true, data: { ...this.mockMembership } };
  }
}