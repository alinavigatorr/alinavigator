'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  items: string[];
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string) => void;
  syncWithServer: (token: string) => Promise<void>;
  itemCount: number;
  isMounted: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // لود اولیه دیتای لوکال استوریج (حالت مهمان)
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('alinavigator_wishlist');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch (e) {
        localStorage.removeItem('alinavigator_wishlist');
      }
    }
  }, []);

  const toggleItem = (productId: string) => {
    setItems(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.includes(productId);
      const updated = exists ? safePrev.filter(id => id !== productId) : [...safePrev, productId];
      
      localStorage.setItem('alinavigator_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return Array.isArray(items) ? items.includes(productId) : false;
  };

  // انتقال مستقیم به سبد خرید
  const moveToCart = (productId: string) => {
    console.log(`محصول ${productId} به سبد خرید منتقل شد`);
    toggleItem(productId); // حذف از لیست علاقه‌مندی‌ها
  };

  // ادغام دیتای مهمان با دیتابیس پس از ورود کاربر
  const syncWithServer = async (token: string) => {
    try {
      const localItems = Array.isArray(items) ? items : [];
      const response = await fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ localItems }),
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.mergedItems);
        localStorage.setItem('alinavigator_wishlist', JSON.stringify(data.mergedItems));
      }
    } catch (error) {
      console.error("خطا در همگام‌سازی Wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      items, 
      toggleItem, 
      isInWishlist, 
      moveToCart,
      syncWithServer,
      itemCount: Array.isArray(items) ? items.length : 0, 
      isMounted 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};