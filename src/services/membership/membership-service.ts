// src/services/membership/membership-service.ts

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
import { MockMembershipDataSource } from './mock-membership-data-source';

// الگوی استاندارد پاسخ سرویس برای سازگاری با سایر دامنه‌های پلتفرم
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class MembershipService {
  private dataSource: MembershipDataSource;

  /**
   * Dependency Injection: 
   * سرویس وابسته به پیاده‌سازی خاصی نیست و فقط اینترفیس را می‌شناسد.
   */
  constructor(dataSource: MembershipDataSource) {
    this.dataSource = dataSource;
  }

  // ==========================================
  // MEMBERSHIP INFO & BENEFITS
  // ==========================================
  async getMembership(): Promise<ServiceResult<PremiumMembership>> {
    return this.dataSource.getMembership();
  }

  async getBenefits(): Promise<ServiceResult<MembershipBenefit[]>> {
    return this.dataSource.getBenefits();
  }

  // ==========================================
  // FINANCIAL & REWARDS
  // ==========================================
  async getWallet(): Promise<ServiceResult<CustomerWallet>> {
    return this.dataSource.getWallet();
  }

  async getPoints(): Promise<ServiceResult<LoyaltyPoints>> {
    return this.dataSource.getPoints();
  }

  async getCashback(): Promise<ServiceResult<CashbackBalance>> {
    return this.dataSource.getCashback();
  }

  // ==========================================
  // MEMBERSHIP ACTIONS
  // ==========================================
  async upgradeMembership(payload: UpgradeMembershipPayload): Promise<ServiceResult<PremiumMembership>> {
    return this.dataSource.upgradeMembership(payload);
  }

  async renewMembership(payload: RenewMembershipPayload): Promise<ServiceResult<PremiumMembership>> {
    return this.dataSource.renewMembership(payload);
  }
}

// Singleton export 
// در این مرحله، نسخه Mock را به سرویس تزریق می‌کنیم تا بدون بک‌اند کار کند.
// در آینده برای اتصال واقعی، فقط کافیست ApiMembershipDataSource جایگزین این بخش شود.
export const membershipService = new MembershipService(new MockMembershipDataSource());