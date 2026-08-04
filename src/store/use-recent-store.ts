'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentProduct {
  id: string;
  title: string;
  image: string;
  price: number;
  slug: string;
  viewedAt: number;
}

interface RecentState {
  items: RecentProduct[];
  addRecent: (product: Omit<RecentProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      items: [],
      addRecent: (product) => {
        const currentItems = get().items.filter(p => p.id !== product.id);
        const newItem = { ...product, viewedAt: Date.now() };
        // نگهداری نهایتاً ۲۰ محصول آخر
        set({ items: [newItem, ...currentItems].slice(0, 20) });
      },
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'alinavigator_recently_viewed',
    }
  )
);