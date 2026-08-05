'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 🌟 Task 2: Session Persistence & Prevent Hydration Mismatch
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('alinavigator_session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: any) => {
    setIsLoading(true);
    // Fake API Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'usr_12345',
      firstName: data.identifier === 'admin' ? 'مدیر' : 'کاربر',
      lastName: 'تست',
      email: data.identifier?.includes('@') ? data.identifier : 'user@example.com',
      username: data.identifier,
    };
    
    setUser(mockUser);
    localStorage.setItem('alinavigator_session', JSON.stringify(mockUser));
    setIsLoading(false);
    router.push('/profile'); // Redirect after login
  }, [router]);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    // Fake API Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: `usr_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
    };

    setUser(newUser);
    localStorage.setItem('alinavigator_session', JSON.stringify(newUser));
    setIsLoading(false);
    router.push('/profile');
  }, [router]);

  // 🌟 Task 6: Safe Logout (Leaves Cart untouched)
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('alinavigator_session');
    router.push('/login');
  }, [router]);

  // بهینه‌سازی فاز ۲: جلوگیری از رندرهای آبشاری در تمام کامپوننت‌های کلاینت
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};