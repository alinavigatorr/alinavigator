'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  mergeWithServer: (serverItems: WishlistItem[]) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (!get().isInWishlist(item.id)) {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },
      mergeWithServer: (serverItems) => {
        const current = get().items;
        const merged = [...serverItems];
        current.forEach((item) => {
          if (!merged.some((i) => i.id === item.id)) {
            merged.push(item);
          }
        });
        set({ items: merged });
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'alinavigator_wishlist',
    }
  )
);