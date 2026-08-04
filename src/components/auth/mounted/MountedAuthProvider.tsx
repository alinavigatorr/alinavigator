import React, { ReactNode, useMemo } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { AuthService } from '../../../services/auth/auth-service';
import { MockAuthDataSource } from '../../../services/auth/mock-auth-data-source';

export interface MountedAuthProviderProps {
  children: ReactNode;
}

export const MountedAuthProvider: React.FC<MountedAuthProviderProps> = ({ children }) => {
  // We use useMemo to ensure the services are only instantiated once
  // when the application starts and mounts this provider.
  const authService = useMemo(() => {
    // 1. Instantiate the Data Source (Currently Mock, future: ApiAuthDataSource)
    const dataSource = new MockAuthDataSource();
    
    // 2. Inject the Data Source into the Service
    return new AuthService(dataSource);
  }, []);

  // 3. Inject the Service into the Context Provider
  return (
    <AuthProvider authService={authService}>
      {children}
    </AuthProvider>
  );
};