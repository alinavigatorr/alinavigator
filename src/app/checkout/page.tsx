'use client';

import React from 'react';
import { useCheckoutSession } from './use-checkout-session';
import { CheckoutDesktop } from './components/checkout-desktop';
import { CheckoutTablet } from './components/checkout-tablet';
import { CheckoutMobile } from './components/checkout-mobile';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { session, updateSession, clearSession } = useCheckoutSession();
  const { items, isMounted } = useCart();

  const nextStep = () => updateSession({ step: Math.min(5, session.step + 1) });
  const prevStep = () => updateSession({ step: Math.max(1, session.step - 1) });
  const completeOrder = () => {
    updateSession({ step: 5 });
    clearSession();
  };

  const props = { session, updateSession, nextStep, prevStep, completeOrder };

  // جلوگیری از خطای Hydration در رندر اولیه
  if (!isMounted) return null;

  // 🌟 Sprint 14 Task 7: Checkout Protection (حفاظت از سبد خالی)
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-white/20" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">سبد خرید شما خالی است</h1>
          <p className="text-white/50 mb-8 max-w-md mx-auto">برای ثبت سفارش ابتدا محصولاتی را به سبد خرید خود اضافه کنید.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-[rgb(var(--primary))] text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all focus:ring-2 focus:ring-white outline-none shadow-[0_0_20px_rgba(var(--primary),0.2)]"
          >
            بازگشت به فروشگاه <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    // حذف رنگ هاردکد شده برای پیروی از Single Source of Truth
    <main className="min-h-screen text-white pt-24 pb-12">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <CheckoutDesktop {...props} />
      </div>
      {/* Tablet View */}
      <div className="hidden md:block lg:hidden">
        <CheckoutTablet {...props} />
      </div>
      {/* Mobile View */}
      <div className="block md:hidden">
        <CheckoutMobile {...props} />
      </div>
    </main>
  );
}