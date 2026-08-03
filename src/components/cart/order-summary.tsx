'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { CouponInput } from './coupon-input';

interface OrderSummaryProps {
  subtotal: number;
  totalDiscount: number;
}

export function OrderSummary({ subtotal, totalDiscount }: OrderSummaryProps) {
  const FREE_SHIPPING_THRESHOLD = 5000000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 45000;
  const tax = Math.floor((subtotal - totalDiscount) * 0.09);
  const finalTotal = (subtotal - totalDiscount) + shipping + tax;
  
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sticky top-[100px] shadow-2xl">
      <h2 className="text-lg font-bold text-white tracking-tight mb-6">خلاصه سفارش</h2>
      
      {/* Free Shipping Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium mb-2">
          <span className="text-white/60">ارسال رایگان</span>
          {shipping === 0 ? (
            <span className="text-[rgb(var(--primary))] font-bold">تبریک! ارسال رایگان شد.</span>
          ) : (
            <span className="text-white/40">{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} تومان مانده</span>
          )}
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progressPercent}%` }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${shipping === 0 ? 'bg-[rgb(var(--primary))]' : 'bg-white/30'}`} 
          />
        </div>
      </div>

      <div className="space-y-4 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50">قیمت کالاها</span>
          <span className="text-white font-medium">{subtotal.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between text-red-400">
          <span>سود شما از خرید</span>
          <span>{totalDiscount.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">هزینه ارسال</span>
          <span className={shipping === 0 ? 'text-[rgb(var(--primary))]' : 'text-white'}>
            {shipping === 0 ? 'رایگان' : `${shipping.toLocaleString()} تومان`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">مالیات بر ارزش افزوده</span>
          <span className="text-white">{tax.toLocaleString()} تومان</span>
        </div>
      </div>

      <div className="pb-6 mb-6 border-b border-white/5">
        <CouponInput />
      </div>

      <div className="flex justify-between items-end mb-6">
        <span className="text-white/70 font-medium">مبلغ قابل پرداخت</span>
        <div className="text-left">
          <motion.div 
            key={finalTotal}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-extrabold text-white tracking-tight"
          >
            {finalTotal.toLocaleString()}
          </motion.div>
          <span className="text-[10px] text-white/40">تومان</span>
        </div>
      </div>

      <button className="w-full bg-[rgb(var(--primary))] text-black py-4 rounded-xl font-bold text-sm transition-all hover:bg-[rgb(var(--primary))]/90 active:scale-[0.98] shadow-[0_10px_30px_rgba(var(--primary),0.15)]">
        ثبت سفارش و پرداخت
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30 font-medium">
        <ShieldCheck className="w-4 h-4" /> پرداخت امن و رمزنگاری شده
      </div>
    </div>
  );
}