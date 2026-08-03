// src/services/user/mock-user-data-source.ts

import {
  UserProfile,
  UpdateProfilePayload,
  UserAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
  UserPreferences,
  UpdatePreferencesPayload,
  AvatarUploadResult
} from './user-types';
import { UserDataSource, UserDataSourceResult } from './user-data-source';

export class MockUserDataSource implements UserDataSource {
  // ==========================================
  // IN-MEMORY DATABASE
  // ==========================================
  private profile: UserProfile = {
    id: 'user-123',
    firstName: 'علی',
    lastName: 'کاربر',
    email: 'ali@example.com',
    phoneNumber: '+989120000000',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-123',
    createdAt: '2023-01-01T10:00:00Z',
    loyalty: {
      tier: 'GOLD',
      points: 1250,
      joinedAt: '2023-01-15T08:30:00Z'
    },
    premium: {
      status: 'ACTIVE',
      expiresAt: '2026-12-31T23:59:59Z'
    }
  };

  private addresses: UserAddress[] = [
    {
      id: 'addr-1',
      title: 'خانه',
      fullName: 'علی کاربر',
      phoneNumber: '+989120000000',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1234567890',
      addressLine: 'خیابان ولیعصر، کوچه نمونه، پلاک ۱',
      isDefault: true
    }
  ];

  private preferences: UserPreferences = {
    theme: 'SYSTEM',
    language: 'fa',
    currency: 'IRR',
    newsletterOptIn: true,
    smsNotifications: true,
    detailedNotifications: {
      orderUpdates: { email: true, sms: true, push: true },
      promotions: { email: true, sms: false, push: false },
      security: { email: true, sms: true, push: true }
    }
  };

  // Simulate network latency
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // PROFILE METHODS
  // ==========================================
  async getProfile(): Promise<UserDataSourceResult<UserProfile>> {
    await this.delay();
    return { success: true, data: { ...this.profile } };
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserDataSourceResult<UserProfile>> {
    await this.delay();
    this.profile = { ...this.profile, ...payload };
    return { success: true, data: { ...this.profile } };
  }

  async uploadAvatar(file: File): Promise<UserDataSourceResult<AvatarUploadResult>> {
    await this.delay(1000); // شبیه‌سازی زمان بیشتر برای آپلود فایل
    const newAvatarUrl = `https://i.pravatar.cc/150?u=${Date.now()}`;
    this.profile.avatarUrl = newAvatarUrl;
    return { success: true, data: { avatarUrl: newAvatarUrl } };
  }

  // ==========================================
  // ADDRESS METHODS
  // ==========================================
  async getAddresses(): Promise<UserDataSourceResult<UserAddress[]>> {
    await this.delay();
    return { success: true, data: [...this.addresses] };
  }

  async createAddress(payload: CreateAddressPayload): Promise<UserDataSourceResult<UserAddress>> {
    await this.delay();
    const newAddress: UserAddress = {
      ...payload,
      id: `addr-${Date.now()}`,
      isDefault: this.addresses.length === 0 // اگر اولین آدرس است، خودکار پیش‌فرض شود
    };
    this.addresses.push(newAddress);
    return { success: true, data: newAddress };
  }

  async updateAddress(id: string, payload: UpdateAddressPayload): Promise<UserDataSourceResult<UserAddress>> {
    await this.delay();
    const index = this.addresses.findIndex(a => a.id === id);
    if (index === -1) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'آدرس پیدا نشد' } };
    }
    this.addresses[index] = { ...this.addresses[index], ...payload };
    return { success: true, data: this.addresses[index] };
  }

  async deleteAddress(id: string): Promise<UserDataSourceResult<void>> {
    await this.delay();
    const initialLength = this.addresses.length;
    this.addresses = this.addresses.filter(a => a.id !== id);
    if (this.addresses.length === initialLength) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'آدرس برای حذف پیدا نشد' } };
    }
    // اگر آدرس پیش‌فرض حذف شد، اولین آدرس باقی‌مانده را پیش‌فرض کن
    if (this.addresses.length > 0 && !this.addresses.some(a => a.isDefault)) {
      this.addresses[0].isDefault = true;
    }
    return { success: true };
  }

  async setDefaultAddress(id: string): Promise<UserDataSourceResult<void>> {
    await this.delay();
    const exists = this.addresses.some(a => a.id === id);
    if (!exists) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'آدرس پیدا نشد' } };
    }
    this.addresses = this.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    return { success: true };
  }

  // ==========================================
  // PREFERENCES METHODS
  // ==========================================
  async getPreferences(): Promise<UserDataSourceResult<UserPreferences>> {
    await this.delay();
    return { success: true, data: { ...this.preferences } };
  }

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<UserDataSourceResult<UserPreferences>> {
    await this.delay();
    this.preferences = { ...this.preferences, ...payload };
    return { success: true, data: { ...this.preferences } };
  }
}