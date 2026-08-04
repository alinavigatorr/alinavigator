import { AuthDataSource } from './auth-data-source';
import { AuthValidator } from './auth-validator';
import { PasswordPolicyEngine } from './password-policy';
import { SessionEngine } from './session-engine';
import { 
  LoginCredentials, 
  RegisterPayload, 
  PasswordPolicy 
} from '../../domain/auth/auth-types';
import { Identity } from '../../domain/auth/identity-types';
import { User } from '../../domain/auth/user-types';
import { Session } from '../../domain/auth/session-types';

/**
 * Standardized response object for all Authentication Service operations.
 * This prevents the UI layer from needing complex try/catch blocks.
 */
export interface AuthOperationResult<T = void> {
  isSuccess: boolean;
  data?: T;
  error?: string;
}

export class AuthService {
  /**
   * Default password policy used by the frontend for fast-fail validation 
   * before sending requests to the backend.
   */
  private readonly defaultPolicy: PasswordPolicy = {
    minimumLength: 8,
    requiresUppercase: true,
    requiresLowercase: true,
    requiresNumber: true,
    requiresSpecialCharacter: true,
    maxAttempts: 5,
    lockDuration: 900 // 15 minutes
  };

  /**
   * Strict Dependency Injection: The service does not know if it's talking 
   * to a Mock database, a REST API, or GraphQL. It only knows the Contract.
   * BFF and HttpOnly logic will be handled inside the specific AuthDataSource implementation.
   */
  constructor(private readonly dataSource: AuthDataSource) {}

  public async login(credentials: LoginCredentials): Promise<AuthOperationResult<Identity>> {
    try {
      // 1. Fast-fail local validation
      const validation = AuthValidator.validateLoginCredentials(credentials.email, credentials.password);
      if (!validation.isValid) {
        return { isSuccess: false, error: validation.errors[0] };
      }

      // 2. Data Source execution (Backend Call / Mock)
      const identity = await this.dataSource.login(credentials);

      // 3. Post-execution domain validation (e.g., verifying backend session rules)
      const sessionValidation = SessionEngine.evaluateExpiration(identity.session);
      if (!sessionValidation.isValid) {
        return { isSuccess: false, error: sessionValidation.reason };
      }

      return { isSuccess: true, data: identity };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Login failed due to an unexpected error.' };
    }
  }

  public async register(payload: RegisterPayload): Promise<AuthOperationResult<Identity>> {
    try {
      // 1. Format validation
      const validation = AuthValidator.validateRegistration(payload.email, payload.email, false, false);
      if (!validation.isValid) {
        return { isSuccess: false, error: validation.errors[0] };
      }

      // 2. Password complexity validation (if standard registration)
      if (payload.password) {
        const passwordCheck = PasswordPolicyEngine.evaluateComplexity(payload.password, this.defaultPolicy);
        if (!passwordCheck.isValid) {
          return { isSuccess: false, error: passwordCheck.errors[0] };
        }
      }

      // 3. Data Source execution
      const identity = await this.dataSource.register(payload);
      return { isSuccess: true, data: identity };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Registration failed.' };
    }
  }

  public async logout(sessionId: string): Promise<AuthOperationResult> {
    try {
      await this.dataSource.logout(sessionId);
      return { isSuccess: true };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Failed to logout.' };
    }
  }

  public async refresh(sessionId: string): Promise<AuthOperationResult<Identity>> {
    try {
      const identity = await this.dataSource.refreshSession(sessionId);
      return { isSuccess: true, data: identity };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Session refresh failed.' };
    }
  }

  public async validateSession(sessionId: string): Promise<AuthOperationResult<Session>> {
    try {
      const session = await this.dataSource.validateSession(sessionId);
      
      // Enforce domain rules on the retrieved session object
      const sessionValidation = SessionEngine.evaluateExpiration(session);
      if (!sessionValidation.isValid) {
        return { isSuccess: false, error: sessionValidation.reason };
      }

      return { isSuccess: true, data: session };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Session is invalid.' };
    }
  }

  public async changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<AuthOperationResult> {
    try {
      if (newPassword) {
        const passwordCheck = PasswordPolicyEngine.evaluateComplexity(newPassword, this.defaultPolicy);
        if (!passwordCheck.isValid) {
          return { isSuccess: false, error: passwordCheck.errors[0] };
        }
      }

      await this.dataSource.changePassword(userId, currentPassword, newPassword);
      return { isSuccess: true };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Failed to change password.' };
    }
  }

  public async forgotPassword(email: string): Promise<AuthOperationResult> {
    try {
      const validation = AuthValidator.validateEmailFormat(email);
      if (!validation.isValid) {
        return { isSuccess: false, error: validation.errors[0] };
      }

      await this.dataSource.forgotPassword(email);
      return { isSuccess: true };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Failed to process forgot password request.' };
    }
  }

  public async resetPassword(recoveryToken: string, newPassword: string): Promise<AuthOperationResult> {
    try {
      const passwordCheck = PasswordPolicyEngine.evaluateComplexity(newPassword, this.defaultPolicy);
      if (!passwordCheck.isValid) {
        return { isSuccess: false, error: passwordCheck.errors[0] };
      }

      await this.dataSource.resetPassword(recoveryToken, newPassword);
      return { isSuccess: true };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Failed to reset password.' };
    }
  }

  public async getCurrentUser(sessionId: string): Promise<AuthOperationResult<User>> {
    try {
      const user = await this.dataSource.getCurrentUser(sessionId);
      return { isSuccess: true, data: user };
    } catch (error: any) {
      return { isSuccess: false, error: error.message || 'Failed to fetch user data.' };
    }
  }
}