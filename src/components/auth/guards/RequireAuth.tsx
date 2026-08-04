import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface RequireAuthProps {
  children: ReactNode;
  /**
   * The UI to display (or a component that triggers a redirect) 
   * when the user is not authenticated.
   */
  fallback?: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading state while authentication status is being determined
  if (isLoading) {
    return <div>Loading...</div>; // Can be replaced with your global Spinner
  }

  // If not authenticated, render the fallback or a placeholder redirect message
  if (!isAuthenticated) {
    return (
      <>
        {fallback || (
          <div>
            {/* Placeholder: In Next.js, you might render a component here that calls router.push('/login') in useEffect */}
            Redirecting to login... (Unauthenticated)
          </div>
        )}
      </>
    );
  }

  // If authenticated, safely render the protected children
  return <>{children}</>;
};