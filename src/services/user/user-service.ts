// src/services/user/user-service.ts

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
import { UserDataSource } from './user-data-source';
import { MockUserDataSource } from './mock-user-data-source';

// الگوی استاندارد پاسخ برای کامپوننت‌های UI (حفظ سازگاری با ساختار قبلی شما)
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class UserService {
  private dataSource: UserDataSource;

  /**
   * Dependency Injection: 
   * سرویس وابسته به پیاده‌سازی خاصی نیست و فقط اینترفیس را می‌شناسد.
   */
  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource;
  }

  // ==========================================
  // PROFILE
  // ==========================================
  async getProfile(): Promise<ServiceResult<UserProfile>> {
    return this.dataSource.getProfile();
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<ServiceResult<UserProfile>> {
    return this.dataSource.updateProfile(payload);
  }

  async uploadAvatar(file: File): Promise<ServiceResult<AvatarUploadResult>> {
    return this.dataSource.uploadAvatar(file);
  }

  // ==========================================
  // ADDRESSES
  // ==========================================
  async getAddresses(): Promise<ServiceResult<UserAddress[]>> {
    return this.dataSource.getAddresses();
  }

  async createAddress(payload: CreateAddressPayload): Promise<ServiceResult<UserAddress>> {
    return this.dataSource.createAddress(payload);
  }

  async updateAddress(id: string, payload: UpdateAddressPayload): Promise<ServiceResult<UserAddress>> {
    return this.dataSource.updateAddress(id, payload);
  }

  async deleteAddress(id: string): Promise<ServiceResult<void>> {
    return this.dataSource.deleteAddress(id);
  }

  async setDefaultAddress(id: string): Promise<ServiceResult<void>> {
    return this.dataSource.setDefaultAddress(id);
  }

  // ==========================================
  // PREFERENCES
  // ==========================================
  async getPreferences(): Promise<ServiceResult<UserPreferences>> {
    return this.dataSource.getPreferences();
  }

  async updatePreferences(payload: UpdatePreferencesPayload): Promise<ServiceResult<UserPreferences>> {
    return this.dataSource.updatePreferences(payload);
  }
}

// Singleton export 
// در این مرحله، نسخه Mock را به سرویس تزریق می‌کنیم تا بدون بک‌اند کار کند.
// در آینده فقط کافیست این را به ApiUserDataSource تغییر دهید.
export const userService = new UserService(new MockUserDataSource());