import React, { createContext, useContext, useMemo } from 'react';

// 1. Import real database implementations instead of the Mock ones
import { PrismaUserRepository } from '../database/prisma/repositories/prisma-user-repository';
import { PrismaSessionRepository } from '../database/prisma/repositories/prisma-session-repository';
import { PrismaAuthDataSource } from '../services/auth/prisma-auth-data-source';

// 2. Import the unchanging Business Service
import { AuthService } from '../services/auth/auth-service';

// Context definition (Unchanged)
interface AuthContextType {
  authService: AuthService;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const MountedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 3. Dependency Injection Wiring (Singleton instance per app lifecycle)
  const authService = useMemo(() => {
    // Step A: Instantiate Repositories
    const userRepository = new PrismaUserRepository();
    const sessionRepository = new PrismaSessionRepository();

    // Step B: Inject Repositories into the Real Data Source
    // This used to be: new MockAuthDataSource()
    const authDataSource = new PrismaAuthDataSource(userRepository, sessionRepository);

    // Step C: Inject Data Source into the Business Service
    return new AuthService(authDataSource);
  }, []);

  return (
    <AuthContext.Provider value={{ authService }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for UI components (Unchanged)
export const useAuthEngine = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthEngine must be used within a MountedAuthProvider');
  }
  return context.authService;
};