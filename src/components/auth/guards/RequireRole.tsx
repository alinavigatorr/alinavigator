import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../../../domain/auth/role-types';

export interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  /**
   * Optional fallback UI if the user does not have the required role.
   */
  fallback?: ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ children, allowedRoles, fallback }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  // If there's no user logged in, they definitely don't have the role
  if (!currentUser) {
    return (
      <>
        {fallback || <div>Access Denied. Please log in.</div>}
      </>
    );
  }

  // Check if the user has at least one of the required roles
  const hasRequiredRole = currentUser.roles.some((role) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    return (
      <>
        {fallback || <div>Access Denied. Insufficient role permissions.</div>}
      </>
    );
  }

  // User has the required role, render the protected component
  return <>{children}</>;
};