'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { SeedSessionService } from '../services/seed/seed-session-service';
import { SeedProfileRepository } from '../services/seed/seed-profile-repository';
import { SeedProfile } from '../services/seed/seed-profiles';
import { DevRole } from '../services/seed/seed-roles';

export type UserRole = DevRole;
export type SeedUser = SeedProfile;

export const SEED_USERS: SeedUser[] = SeedProfileRepository.getAllProfiles();

interface MockAuthContextType {
  currentUser: SeedUser;
  switchUser: (userId: string) => void;
  users: SeedUser[];
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(
  undefined
);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SeedUser>(() =>
    SeedSessionService.getActiveSessionProfile()
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const activeProfile = SeedSessionService.getActiveSessionProfile();
    setCurrentUser(activeProfile);
    setMounted(true);
  }, []);

  const switchUser = (userId: string) => {
    try {
      const updatedProfile = SeedSessionService.setActiveSessionProfile(userId);
      setCurrentUser(updatedProfile);
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch seed user profile:', error);
    }
  };

  if (!mounted) return null;

  return (
    <MockAuthContext.Provider
      value={{ currentUser, switchUser, users: SEED_USERS }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}
