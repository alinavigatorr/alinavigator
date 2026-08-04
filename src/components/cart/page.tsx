'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CartItem, CartItemType } from '../../components/cart/cart-item';
import { OrderSummary } from '../../components/cart/order-summary';
import { EmptyCart } from '../../components/cart/empty-cart';
import { ProductCard } from '../../components/ui/product-card'; // Reuse from Sprint 5/6

// Mock Initial Data
const initialCart: CartItemType[] = [
  { id: '1', title: 'کیبورد مکانیکال گیمینگ ریزر مدل BlackWidow V4', brand: 'Razer', sku: 'RZ-BW-V4', variant: 'سوئیچ سبز', price: 9500000, discount: 500000, qty: 1, stock: 4, image: '' },
  { id: '2', title: 'موس بی‌سیم لاجیتک مدل MX Master 3S', brand: 'Logitech', sku: 'LG-MX-3S', variant: 'خاکستری', price: 6200000, discount: 0, qty: 2, stock: 10, image: '' }
];

export default function CartPage() {
  const [items, setItems] = useState<CartItemType[]>(initialCart);
  const [savedItems, setSavedItems] = useState<CartItemType[]>([]);

  // Actions
  const updateQty = (id: string, qty: number) => {
    setItems(items.map(item => item.id === id ? { ...item, qty } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const saveForLater = (id: string) => {
    const itemToSave = items.find(i => i.id === id);
    if (itemToSave) {
      setSavedItems([...savedItems, itemToSave]);
      removeItem(id);
    }
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalDiscount = items.reduce((acc, item) => acc + (item.discount * item.qty), 0);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-10">سبد خرید</h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/60">{items.length} کالا در سبد شما</span>
            </div>
            
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateQty={updateQty} 
                  onRemove={removeItem} 
                  onSaveForLater={saveForLater}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummary subtotal={subtotal} totalDiscount={totalDiscount} />
          </div>
        </div>
      )}

      {/* Cross-sell / Recommendations */}
      <div className="mt-24 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white tracking-tight">پیشنهاد بر اساس سبد شما</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Reusing existing ProductCard component */}
          <ProductCard id="rec-1" title="پد موس گیمینگ کورسیر" category="تجهیزات گیمینگ" price="1,200,000" rating={4.8} />
          <ProductCard id="rec-2" title="پایه مانیتور دیواری" category="لوازم جانبی" price="2,500,000" rating={4.5} />
        </div>
      </div>
    </div>
  );
}