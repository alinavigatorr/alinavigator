'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface RecentlyViewedContextType {
  viewedIds: string[];
  addProductView: (productId: string) => void;
  isMounted: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('alinavigator_recently_viewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setViewedIds(parsed);
      } catch (e) {
        localStorage.removeItem('alinavigator_recently_viewed');
      }
    }
  }, []);

  // تابع ثبت بازدید محصول جدید
  const addProductView = (productId: string) => {
    setViewedIds(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      // حذف آیدی اگر از قبل وجود داشته تا به آخر لیست (جدیدترین) منتقل شود
      const filtered = safePrev.filter(id => id !== productId);
      // اضافه کردن آیدی جدید به ابتدای آرایه و محدود کردن به حداکثر ۶ محصول اخیر
      const updated = [productId, ...filtered].slice(0, 6);
      
      localStorage.setItem('alinavigator_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewedIds, addProductView, isMounted }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return context;
};