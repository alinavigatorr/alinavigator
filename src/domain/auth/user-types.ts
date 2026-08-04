import { UserRole } from './role-types';

export const UserStatus = {
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  LOCKED: 'LOCKED',
  DELETED: 'DELETED',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  preferredLanguage?: string;
}

export interface User {
  id: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}