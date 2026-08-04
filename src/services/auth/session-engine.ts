import { Session } from '../../domain/auth/session-types';

export interface SessionValidationResult {
  isValid: boolean;
  reason?: string;
}

export class SessionEngine {
  /**
   * Evaluates if the session has passed its absolute expiration date.
   */
  public static evaluateExpiration(
    session: Session,
    currentTime: Date = new Date()
  ): SessionValidationResult {
    if (currentTime.getTime() > session.expiresAt.getTime()) {
      return {
        isValid: false,
        reason: 'Session has expired.',
      };
    }

    return { isValid: true };
  }

  /**
   * Evaluates if the session should be invalidated due to user inactivity.
   * Useful for banking, admin panels, or high-security applications.
   */
  public static evaluateIdleTimeout(
    session: Session,
    maxIdleTimeSeconds: number,
    currentTime: Date = new Date()
  ): SessionValidationResult {
    const idleTimeSeconds = (currentTime.getTime() - session.lastActivity.getTime()) / 1000;

    if (idleTimeSeconds > maxIdleTimeSeconds) {
      return {
        isValid: false,
        reason: `Session expired due to inactivity exceeding ${maxIdleTimeSeconds} seconds.`,
      };
    }

    return { isValid: true };
  }

  /**
   * Evaluates concurrent session policies (e.g., preventing a user from logging in on 
   * more than 3 devices simultaneously).
   */
  public static evaluateConcurrentSessions(
    activeSessionsCount: number,
    maxAllowedSessions: number
  ): SessionValidationResult {
    if (activeSessionsCount >= maxAllowedSessions) {
      return {
        isValid: false,
        reason: `Maximum concurrent sessions limit (${maxAllowedSessions}) reached.`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates if the device attempting to use the session matches the device 
   * that originally created it (to prevent token theft/hijacking).
   */
  public static evaluateDeviceMatch(
    session: Session,
    currentDeviceId: string
  ): SessionValidationResult {
    // If the session was created without a device ID, we skip this strict check
    if (!session.deviceId) {
      return { isValid: true };
    }

    if (session.deviceId !== currentDeviceId) {
      return {
        isValid: false,
        reason: 'Device fingerprint mismatch. Session hijacked or device changed.',
      };
    }

    return { isValid: true };
  }
}