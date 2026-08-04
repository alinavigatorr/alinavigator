// src/services/user/user-types.ts

// ==========================================
// FUTURE DOMAINS (Loyalty & Premium)
// ==========================================
export interface PremiumMembership {
  status: 'ACTIVE' | 'EXPIRED' | 'NONE';
  planId?: string;
  expiresAt?: string;
}

export interface UserLoyalty {
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
  joinedAt: string;
}

// ==========================================
// USER PROFILE TYPES
// ==========================================
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  createdAt: string;
  // افزوده شده برای پشتیبانی در فازهای بعدی
  loyalty?: UserLoyalty;
  premium?: PremiumMembership;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface AvatarUploadResult {
  avatarUrl: string;
}

// ==========================================
// ADDRESS TYPES
// ==========================================
export interface UserAddress {
  id: string;
  title: string; // e.g., "Home", "Office"
  fullName: string;
  phoneNumber: string;
  city: string;
  state: string;
  postalCode: string;
  addressLine: string;
  isDefault: boolean;
}

export type CreateAddressPayload = Omit<UserAddress, 'id' | 'isDefault'>;
export type UpdateAddressPayload = Partial<CreateAddressPayload>;

// ==========================================
// PREFERENCES & NOTIFICATIONS TYPES
// ==========================================
export interface NotificationChannels {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface NotificationPreferences {
  orderUpdates: NotificationChannels;
  promotions: NotificationChannels;
  security: NotificationChannels;
}

export interface UserPreferences {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  language: string;
  currency: string;
  // ساختار قدیمی حفظ و با ساختار جدید بسط داده شد
  newsletterOptIn: boolean;
  smsNotifications: boolean;
  detailedNotifications: NotificationPreferences;
}

export type UpdatePreferencesPayload = Partial<UserPreferences>;

// ==========================================
// NOTIFICATION HISTORY TYPES
// ==========================================
export interface UserNotification {
  id: string;
  type: 'ORDER_UPDATE' | 'PROMO' | 'SECURITY' | 'SYSTEM';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string; // Optional link to redirect when clicked
}