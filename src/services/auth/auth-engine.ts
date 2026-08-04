import { UserStatus } from '../../domain/auth/user-types';
import { LoginCredentials, RegisterPayload, PasswordPolicy } from '../../domain/auth/auth-types';
import { AuthValidator } from './auth-validator';
import { PasswordPolicyEngine } from './password-policy';

export interface AuthResult {
  isSuccess: boolean;
  error?: string;
}

export class AuthEngine {
  /**
   * Evaluates all business rules prior to verifying the password hash.
   * Checks format, account status, and brute-force lock policies.
   */
  public static evaluatePreLoginRules(
    credentials: LoginCredentials,
    userStatus: UserStatus | null, // Pass null if user does not exist in DB
    failedAttempts: number,
    lastFailedAttemptAt: Date | null,
    policy: PasswordPolicy,
    currentTime: Date = new Date()
  ): AuthResult {
    // 1. Format validation
    const validation = AuthValidator.validateLoginCredentials(credentials.email, credentials.password);
    if (!validation.isValid) {
      return { isSuccess: false, error: validation.errors[0] };
    }

    // 2. Existence check (Generic error to prevent user enumeration attacks)
    if (!userStatus || userStatus === UserStatus.DELETED) {
      return { isSuccess: false, error: 'Invalid email or password.' };
    }

    // 3. Status checks
    if (userStatus === UserStatus.SUSPENDED) {
      return { isSuccess: false, error: 'Account is suspended. Please contact support.' };
    }
    
    if (userStatus === UserStatus.PENDING_VERIFICATION) {
      return { isSuccess: false, error: 'Please verify your email address before logging in.' };
    }

    // 4. Lock state evaluation (Brute-force protection)
    const lockState = PasswordPolicyEngine.evaluateLockState(
      failedAttempts,
      lastFailedAttemptAt,
      policy,
      currentTime
    );

    if (lockState.isLocked) {
      return { 
        isSuccess: false, 
        error: `Account is temporarily locked due to too many failed attempts. Try again in ${lockState.remainingLockTimeSeconds} seconds.` 
      };
    }

    return { isSuccess: true };
  }

  /**
   * Evaluates all business rules for a new user registration.
   */
  public static evaluateRegistrationRules(
    payload: RegisterPayload,
    isEmailTaken: boolean,
    policy: PasswordPolicy
  ): AuthResult {
    // 1. Format and duplicate validation
    // Note: If you implement separate usernames later, add isUsernameTaken parameter.
    const validation = AuthValidator.validateRegistration(
      payload.email,
      payload.email, // Using email as a proxy for username validation for now
      isEmailTaken,
      false
    );

    if (!validation.isValid) {
      return { isSuccess: false, error: validation.errors[0] };
    }

    // 2. Password complexity validation (Only if password is provided, e.g., not an SSO flow)
    if (payload.password) {
      const passwordCheck = PasswordPolicyEngine.evaluateComplexity(payload.password, policy);
      if (!passwordCheck.isValid) {
        return { isSuccess: false, error: passwordCheck.errors[0] };
      }
    }

    return { isSuccess: true };
  }
}