// src/services/user/user-api.ts

import { httpClient } from '../core/http-client';
import { UserEndpoints } from './user-endpoints';
import {
  UserProfile,
  UpdateProfilePayload,
  UserAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
  UserPreferences,
  UpdatePreferencesPayload,
  UserNotification
} from './user-types';

export class UserApi {
  // ==========================================
  // PROFILE ENDPOINTS
  // ==========================================
  
  static async getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>(UserEndpoints.PROFILE.GET);
  }

  static async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    return httpClient.patch<UserProfile>(UserEndpoints.PROFILE.UPDATE, payload);
  }

  // ==========================================
  // ADDRESS ENDPOINTS
  // ==========================================
  
  static async getAddresses(): Promise<UserAddress[]> {
    return httpClient.get<UserAddress[]>(UserEndpoints.ADDRESS.GET_ALL);
  }

  static async createAddress(payload: CreateAddressPayload): Promise<UserAddress> {
    return httpClient.post<UserAddress>(UserEndpoints.ADDRESS.CREATE, payload);
  }

  static async updateAddress(id: string, payload: UpdateAddressPayload): Promise<UserAddress> {
    return httpClient.patch<UserAddress>(UserEndpoints.ADDRESS.UPDATE(id), payload);
  }

  static async deleteAddress(id: string): Promise<void> {
    return httpClient.delete<void>(UserEndpoints.ADDRESS.DELETE(id));
  }

  static async setDefaultAddress(id: string): Promise<UserAddress> {
    return httpClient.patch<UserAddress>(UserEndpoints.ADDRESS.SET_DEFAULT(id), {});
  }

  // ==========================================
  // PREFERENCES ENDPOINTS
  // ==========================================
  
  static async getPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>(UserEndpoints.PREFERENCES.GET);
  }

  static async updatePreferences(payload: UpdatePreferencesPayload): Promise<UserPreferences> {
    return httpClient.patch<UserPreferences>(UserEndpoints.PREFERENCES.UPDATE, payload);
  }

  // ==========================================
  // NOTIFICATION ENDPOINTS
  // ==========================================
  
  static async getNotifications(): Promise<UserNotification[]> {
    return httpClient.get<UserNotification[]>(UserEndpoints.NOTIFICATIONS.GET_ALL);
  }

  static async markNotificationAsRead(id: string): Promise<void> {
    return httpClient.patch<void>(UserEndpoints.NOTIFICATIONS.MARK_READ(id), {});
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    return httpClient.patch<void>(UserEndpoints.NOTIFICATIONS.MARK_ALL_READ, {});
  }
}