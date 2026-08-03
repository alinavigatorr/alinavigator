'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function CheckoutSummary() {
  const { items, subtotal, isMounted } = useCart();

  const FREE_SHIPPING_THRESHOLD = 5000000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 45000;
  const tax = Math.floor(subtotal * 0.09);
  const finalTotal = subtotal + shipping + tax;

  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sticky top-[100px] shadow-2xl">
      <h2 className="text-lg font-bold text-white tracking-tight mb-6">خلاصه سفارش</h2>

      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium mb-2">
          <span className="text-white/60">ارسال رایگان</span>
          {shipping === 0 ? (
            <span className="text-[rgb(var(--primary))] font-bold">تبریک! ارسال رایگان شد.</span>
          ) : (
            <span className="text-white/40">{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('fa-IR')} تومان مانده</span>
          )}
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${shipping === 0 ? 'bg-[rgb(var(--primary))]' : 'bg-white/30'}`}
          />
        </div>
      </div>

      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pl-1">
        {isMounted && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-white/30">
            <ShoppingBag className="w-8 h-8 mb-2" />
            <span className="text-xs">سبد خرید شما خالی است</span>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-4 h-4 text-white/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-white truncate">{item.title}</h4>
                <span className="text-[10px] text-white/40">{item.quantity} عدد</span>
              </div>
              <span className="text-xs font-bold text-white">
                {(item.price * item.quantity).toLocaleString('fa-IR')}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 mb-6 text-sm border-t border-white/5 pt-4">
        <div className="flex justify-between">
          <span className="text-white/50">قیمت کالاها</span>
          <span className="text-white font-medium">{subtotal.toLocaleString('fa-IR')} تومان</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">هزینه ارسال</span>
          <span className={shipping === 0 ? 'text-[rgb(var(--primary))]' : 'text-white'}>
            {shipping === 0 ? 'رایگان' : `${shipping.toLocaleString('fa-IR')} تومان`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">مالیات بر ارزش افزوده</span>
          <span className="text-white">{tax.toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 border-t border-white/5 pt-4">
        <span className="text-white/70 font-medium">مبلغ قابل پرداخت</span>
        <div className="text-left">
          <motion.div
            key={finalTotal}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-extrabold text-white tracking-tight"
          >
            {finalTotal.toLocaleString('fa-IR')}
          </motion.div>
          <span className="text-[10px] text-white/40">تومان</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30 font-medium">
        <ShieldCheck className="w-4 h-4" /> پرداخت امن و رمزنگاری شده
      </div>
    </div>
  );
}
