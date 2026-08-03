'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  specs: Record<string, string>;
}

interface CompareState {
  products: CompareProduct[];
  addProduct: (product: CompareProduct) => boolean;
  removeProduct: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const current = get().products;
        if (current.some((p) => p.id === product.id)) return true;
        if (current.length >= 4) return false; // حداکثر ۴ محصول
        set({ products: [...current, product] });
        return true;
      },
      removeProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
      clearCompare: () => set({ products: [] }),
    }),
    {
      name: 'alinavigator_compare',
    }
  )
);