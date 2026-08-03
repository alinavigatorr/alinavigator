'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, CartContextType } from '../types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // لود دیتا از LocalStorage (جلوگیری از ارور هیدریشن)
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = localStorage.getItem('alinavigator_cart');
      const storedSaved = localStorage.getItem('alinavigator_saved');
      if (storedCart) setItems(JSON.parse(storedCart));
      if (storedSaved) setSavedItems(JSON.parse(storedSaved));
    } catch (e) {
      console.error("Error loading cart data");
    }
  }, []);

  // ذخیره زنده در LocalStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('alinavigator_cart', JSON.stringify(items));
      localStorage.setItem('alinavigator_saved', JSON.stringify(savedItems));
    }
  }, [items, savedItems, isMounted]);

  // 🌟 ویژگی اسپرینت ۱۳: همگام‌سازی زنده بین تب‌های مرورگر (Cross-tab Synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'alinavigator_cart' && e.newValue) {
        try { setItems(JSON.parse(e.newValue)); } catch (err) {}
      }
      if (e.key === 'alinavigator_saved' && e.newValue) {
        try { setSavedItems(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // محاسبات با پرفورمنس بالا
  const totalItems = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((total, item) => total + (item.price * item.quantity), 0), [items]);
  
  const formattedSubtotal = useMemo(() => {
    return subtotal.toLocaleString('fa-IR') + ' تومان';
  }, [subtotal]);

  // متدهای سبد خرید اصلی
  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        // 🌟 ویژگی اسپرینت ۱۳: جلوگیری از افزودن بیشتر از موجودی انبار (Stock Validation)
        if (existing.stock !== undefined && existing.quantity >= existing.stock) return prev;
        return prev.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        // 🌟 ویژگی اسپرینت ۱۳: جلوگیری از افزایش بیشتر از موجودی انبار
        if (item.stock !== undefined && item.quantity >= item.stock) return item;
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    }));
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id && item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  
  const itemExists = useCallback((id: string) => items.some(item => item.id === id), [items]);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  // 🌟 متدهای "بعداً می‌خرم" (Save for Later)
  const saveForLater = useCallback((id: string) => {
    setItems(prev => {
      const itemToSave = prev.find(item => item.id === id);
      if (itemToSave) {
        setSavedItems(currentSaved => [...currentSaved, { ...itemToSave, quantity: 1 }]);
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const moveToCart = useCallback((id: string) => {
    setSavedItems(prev => {
      const itemToMove = prev.find(item => item.id === id);
      if (itemToMove) {
        setItems(currentCart => [...currentCart, itemToMove]);
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const removeSavedItem = useCallback((id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const value = useMemo(() => ({
    items, savedItems, isMounted, totalItems, subtotal, formattedSubtotal,
    addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, itemExists,
    isCartOpen, toggleCart, saveForLater, moveToCart, removeSavedItem
  }), [
    items, savedItems, isMounted, totalItems, subtotal, formattedSubtotal,
    addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, itemExists,
    isCartOpen, toggleCart, saveForLater, moveToCart, removeSavedItem
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};