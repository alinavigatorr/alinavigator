import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AuthService } from '../../../services/auth/auth-service';
import { LoginCredentials, RegisterPayload } from '../../../domain/auth/auth-types';
import { User } from '../../../domain/auth/user-types';
import { Session } from '../../../domain/auth/session-types';
import { Permission } from '../../../domain/auth/permission-types';
import { Identity } from '../../../domain/auth/identity-types';

export interface AuthContextState {
  currentUser: User | null;
  session: Session | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  authService: AuthService;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, authService }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const applyIdentity = (identity: Identity) => {
    setCurrentUser(identity.user);
    setSession(identity.session);
    setPermissions(identity.permissions);
    setIsAuthenticated(identity.isAuthenticated);
  };

  const clearIdentity = () => {
    setCurrentUser(null);
    setSession(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  const clearError = useCallback(() => setAuthError(null), []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setAuthError(null);
    
    const result = await authService.login(credentials);
    
    if (result.isSuccess && result.data) {
      applyIdentity(result.data);
    } else {
      setAuthError(result.error || 'Login failed.');
    }
    
    setIsLoading(false);
  }, [authService]);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setAuthError(null);
    
    const result = await authService.register(payload);
    
    if (result.isSuccess && result.data) {
      applyIdentity(result.data);
    } else {
      setAuthError(result.error || 'Registration failed.');
    }
    
    setIsLoading(false);
  }, [authService]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    
    if (session) {
      const result = await authService.logout(session.sessionId);
      if (!result.isSuccess) {
        console.warn('Logout warning:', result.error);
      }
    }
    
    clearIdentity();
    setIsLoading(false);
  }, [authService, session]);

  const refreshSession = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    setAuthError(null);
    
    const result = await authService.refresh(session.sessionId);
    
    if (result.isSuccess && result.data) {
      applyIdentity(result.data);
    } else {
      setAuthError(result.error || 'Failed to refresh session.');
      clearIdentity(); // Force logout on failed refresh
    }
    
    setIsLoading(false);
  }, [authService, session]);

  const value: AuthContextState = {
    currentUser,
    session,
    permissions,
    isAuthenticated,
    isLoading,
    authError,
    login,
    register,
    logout,
    refreshSession,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};