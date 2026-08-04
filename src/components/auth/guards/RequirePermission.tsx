import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export interface RequirePermissionProps {
  children: ReactNode;
  /**
   * The exact permission code required to render the children (e.g., 'orders:create').
   */
  requiredPermission: string;
  /**
   * Optional fallback UI if the user does not have the required permission.
   * If omitted, the component simply renders nothing (null).
   */
  fallback?: ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({ 
  children, 
  requiredPermission, 
  fallback = null 
}) => {
  const { permissions, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, they don't have permissions
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check if the user has the exact permission code OR the absolute wildcard '*'
  const hasPermission = permissions.some(
    (p) => p.code === requiredPermission || p.code === '*'
  );

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  // User has the required permission, render the protected component
  return <>{children}</>;
};