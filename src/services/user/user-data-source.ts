// src/services/user/user-data-source.ts

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

/**
 * The unified result wrapper for all user data operations.
 */
export interface UserDataSourceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Abstract Data Source Interface for the User Domain.
 * Any backend implementation (Mock, REST, GraphQL, Firebase) MUST implement this interface.
 */
export interface UserDataSource {
  // ==========================================
  // PROFILE
  // ==========================================
  getProfile(): Promise<UserDataSourceResult<UserProfile>>;
  updateProfile(payload: UpdateProfilePayload): Promise<UserDataSourceResult<UserProfile>>;
  uploadAvatar(file: File): Promise<UserDataSourceResult<AvatarUploadResult>>;

  // ==========================================
  // ADDRESSES
  // ==========================================
  getAddresses(): Promise<UserDataSourceResult<UserAddress[]>>;
  createAddress(payload: CreateAddressPayload): Promise<UserDataSourceResult<UserAddress>>;
  updateAddress(id: string, payload: UpdateAddressPayload): Promise<UserDataSourceResult<UserAddress>>;
  deleteAddress(id: string): Promise<UserDataSourceResult<void>>;
  setDefaultAddress(id: string): Promise<UserDataSourceResult<void>>;

  // ==========================================
  // PREFERENCES
  // ==========================================
  getPreferences(): Promise<UserDataSourceResult<UserPreferences>>;
  updatePreferences(payload: UpdatePreferencesPayload): Promise<UserDataSourceResult<UserPreferences>>;
}