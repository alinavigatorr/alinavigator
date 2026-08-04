import { User } from './user-types';
import { Session } from './session-types';
import { Permission } from './permission-types';

export interface Identity {
  /**
   * The authenticated user's core details.
   */
  user: User;
  
  /**
   * The current active session details (device, IP, expiration).
   */
  session: Session;
  
  /**
   * Flat list of permissions dynamically resolved based on the user's roles.
   * Useful for quick authorization checks on the frontend.
   */
  permissions: Permission[];
  
  /**
   * Flag indicating if the user is currently authenticated.
   */
  isAuthenticated: boolean;
}