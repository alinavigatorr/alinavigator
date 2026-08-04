'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../../../domain/auth/role-types';

export interface ProfileBootstrapProps {
  children: ReactNode;
}

export const ProfileBootstrap: React.FC<ProfileBootstrapProps> = ({ children }) => {
  const { currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUserProfileData = async () => {
      if (!isAuthenticated || !currentUser) {
        return;
      }

      setIsBootstrapping(true);
      setBootstrapError(null);

      try {
        // --- SIMULATED PROFILE & MODULE BOOTSTRAPPING ---
        // Here you would typically fetch user-specific data concurrently:
        // - Wallet balances
        // - Unread notifications count
        // - Customer preferences or Seller specific modules if currentUser.roles includes SELLER
        
        await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network hydration

        if (currentUser.roles.includes(UserRole.SELLER)) {
          // console.log('Bootstrapping seller-specific modules...');
        }

        // console.log('User profile and related state successfully bootstrapped for:', currentUser.email);
      } catch (err: any) {
        if (isMounted) {
          setBootstrapError(err.message || 'Failed to load user profile data.');
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    loadUserProfileData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, currentUser]);

  // Show loading spinner while authentication or profile bootstrapping is in progress
  if (authLoading || (isAuthenticated && isBootstrapping)) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 text-sm animate-pulse">Initializing your workspace...</p>
      </div>
    );
  }

  // If bootstrapping encountered a fatal error
  if (bootstrapError) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
        <div className="max-w-md w-full p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
          <h3 className="text-xl font-bold text-red-400 mb-2">Initialization Error</h3>
          <p className="text-gray-300 text-sm mb-6">{bootstrapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};