// src/services/auth/types/auth-types.ts

export type UserRole = 'GUEST' | 'CUSTOMER' | 'ADMIN';

export type Permission = 'READ_DASHBOARD' | 'MANAGE_ORDERS' | 'EDIT_PROFILE';

export interface UserClaims {
  uid: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

export interface UserSession {
  user: UserClaims | null;
  isAuthenticated: boolean;
  expiresAt: number | null; // Timestamp for session validity
}

export interface AuthResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginResult extends AuthResult<{ session: UserSession }> {}
export interface RefreshResult extends AuthResult<{ session: UserSession }> {}
export interface LogoutResult extends AuthResult<void> {}

// ==========================================
// FUTURE RESERVED INTERFACES
// ==========================================

export interface AccessToken {
  token: string;
  expiresIn: number; // Seconds until expiration
}

export interface RefreshToken {
  token: string;
  expiresIn: number; // Seconds until expiration
}

export interface CookieConfig {
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}