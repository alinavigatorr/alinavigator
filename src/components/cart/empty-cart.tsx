'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function EmptyCart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,255,255,0.03)]">
        <ShoppingBag className="w-10 h-10 text-white/20" />
      </div>
      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">سبد خرید شما خالی است</h2>
      <p className="text-white/40 mb-8 max-w-sm leading-relaxed text-sm">
        هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده محصولات جدید به فروشگاه سر بزنید.
      </p>
      <Link 
        href="/products"
        className="inline-flex items-center gap-2 bg-[rgb(var(--primary))] text-black px-6 py-3 rounded-xl font-bold text-sm transition-transform active:scale-95 hover:bg-[rgb(var(--primary))]/90"
      >
        مشاهده محصولات <ArrowLeft className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}