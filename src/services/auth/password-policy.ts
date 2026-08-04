import { PasswordPolicy } from '../../domain/auth/auth-types';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface LockStateResult {
  isLocked: boolean;
  remainingLockTimeSeconds: number;
}

export class PasswordPolicyEngine {
  /**
   * Evaluates if a given password meets the complexity requirements defined in the policy.
   */
  public static evaluateComplexity(password: string, policy: PasswordPolicy): PasswordValidationResult {
    const errors: string[] = [];

    if (!password) {
      return { isValid: false, errors: ['Password cannot be empty.'] };
    }

    if (password.length < policy.minimumLength) {
      errors.push(`Password must be at least ${policy.minimumLength} characters long.`);
    }

    if (policy.requiresUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    if (policy.requiresLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    if (policy.requiresNumber && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }

    if (policy.requiresSpecialCharacter && !/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Evaluates if an account should be temporarily locked based on failed attempts and time elapsed.
   * Uses dependency injection for currentTime to remain a pure, deterministic function.
   */
  public static evaluateLockState(
    failedAttempts: number,
    lastFailedAttemptAt: Date | null,
    policy: PasswordPolicy,
    currentTime: Date = new Date()
  ): LockStateResult {
    // If attempts are below threshold or there's no record of a failed attempt, not locked.
    if (failedAttempts < policy.maxAttempts || !lastFailedAttemptAt) {
      return { isLocked: false, remainingLockTimeSeconds: 0 };
    }

    const timeSinceLastFailureInSeconds = (currentTime.getTime() - lastFailedAttemptAt.getTime()) / 1000;

    // If the elapsed time is less than the required lock duration, it remains locked.
    if (timeSinceLastFailureInSeconds < policy.lockDuration) {
      return {
        isLocked: true,
        remainingLockTimeSeconds: Math.ceil(policy.lockDuration - timeSinceLastFailureInSeconds),
      };
    }

    // The lock duration has naturally expired.
    return { isLocked: false, remainingLockTimeSeconds: 0 };
  }
}