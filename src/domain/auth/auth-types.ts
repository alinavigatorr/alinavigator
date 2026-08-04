export interface LoginCredentials {
    email: string;
    password?: string; // Optional to support future Passwordless or SSO flows
    mfaCode?: string;  // Future-ready for Multi-Factor Authentication
  }
  
  export interface RegisterPayload {
    email: string;
    password?: string; // Optional for SSO registration flows
    firstName?: string;
    lastName?: string;
  }
  
  export interface PasswordPolicy {
    minimumLength: number;
    requiresUppercase: boolean;
    requiresLowercase: boolean;
    requiresNumber: boolean;
    requiresSpecialCharacter: boolean;
    maxAttempts: number;
    lockDuration: number; // Time in seconds the account remains locked after maxAttempts
  }
  
  export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Expiration time in seconds
    tokenType: string; // Typically 'Bearer'
  }
  
  export interface RefreshToken {
    token: string;
    expiresAt: Date;
    deviceId?: string; // Ties the refresh token to a specific device/session
  }