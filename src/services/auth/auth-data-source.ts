import { 
    LoginCredentials, 
    RegisterPayload 
  } from '../../domain/auth/auth-types';
  import { Identity } from '../../domain/auth/identity-types';
  import { User } from '../../domain/auth/user-types';
  import { Session } from '../../domain/auth/session-types';
  
  /**
   * The strict contract for any Authentication Data Source (Mock, REST API, GraphQL, etc.).
   * By depending on this interface, the AuthService remains completely decoupled from the backend implementation.
   */
  export interface AuthDataSource {
    /**
     * Authenticates a user and returns their complete Identity context.
     */
    login(credentials: LoginCredentials): Promise<Identity>;
  
    /**
     * Registers a new user and optionally returns their new Identity if auto-login is enabled.
     */
    register(payload: RegisterPayload): Promise<Identity>;
  
    /**
     * Terminates the current active session.
     */
    logout(sessionId: string): Promise<void>;
  
    /**
     * Refreshes the session/tokens using the current refresh token mechanism.
     * Returns an updated Identity.
     */
    refreshSession(sessionId: string): Promise<Identity>;
  
    /**
     * Fetches the current user profile data based on the active session.
     */
    getCurrentUser(sessionId: string): Promise<User>;
  
    /**
     * Checks the backend to ensure the provided session is still valid (not revoked).
     */
    validateSession(sessionId: string): Promise<Session>;
  
    /**
     * Updates the user's password.
     */
    changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<void>;
  
    /**
     * Initiates a password reset flow (e.g., sends an email).
     */
    forgotPassword(email: string): Promise<void>;
  
    /**
     * Completes a password reset flow using a recovery token.
     */
    resetPassword(recoveryToken: string, newPassword: string): Promise<void>;
  
    /**
     * Verifies a user's email address using a verification token.
     */
    verifyEmail(verificationToken: string): Promise<void>;
  }