'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { Tag, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface OrderSummaryProps {
  shippingCost: number;
  isValid: boolean;
  onSubmit: () => void;
}

export function OrderSummary({ shippingCost, isValid, onSubmit }: OrderSummaryProps) {
  const { items, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponState, setCouponState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const discount = couponState === 'success' ? totalPrice * 0.1 : 0; // 10% fake discount
  const finalTotal = totalPrice + shippingCost - discount;

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    setCouponState('loading');
    // Fake API Delay
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'VIP10') {
        setCouponState('success');
      } else {
        setCouponState('error');
      }
    }, 1000);
  };

  const formatPrice = (price: number) => price.toLocaleString('fa-IR');

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
      <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">خلاصه سفارش</h3>
      
      {/* Items Preview */}
      <div className="space-y-4 mb-6 max-h-48 overflow-y-auto pr-2 [scrollbar-width:thin]">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 rounded-xl bg-black/20 shrink-0 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <h4 className="text-xs font-bold text-white/90 line-clamp-1">{item.title}</h4>
              <div className="text-[10px] text-white/50 mt-1 flex justify-between">
                <span>{item.quantity} عدد</span>
                <span>{item.formattedPrice} تومان</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="mb-6">
        <label htmlFor="coupon" className="text-xs font-medium text-white/70 mb-2 block">کد تخفیف (تست: VIP10)</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
            <input
              id="coupon"
              type="text"
              disabled={couponState === 'success' || couponState === 'loading'}
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value); setCouponState('idle'); }}
              placeholder="کد تخفیف خود را وارد کنید"
              className="w-full bg-black/20 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:border-[rgb(var(--primary))] outline-none disabled:opacity-50 transition-colors"
            />
          </div>
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode || couponState === 'success' || couponState === 'loading'}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
            aria-label="اعمال کد تخفیف"
          >
            {couponState === 'loading' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'اعمال'}
          </button>
        </div>
        
        <motion.div initial={false} animate={{ height: 'auto' }} className="mt-2 overflow-hidden">
          {couponState === 'error' && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> کد تخفیف نامعتبر است</p>}
          {couponState === 'success' && <p className="text-xs text-[rgb(var(--success,16,185,129))] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> تخفیف با موفقیت اعمال شد</p>}
        </motion.div>
      </div>

      {/* Totals */}
      <div className="space-y-3 text-sm border-t border-white/10 pt-4 mb-6">
        <div className="flex justify-between text-white/60"><span>مبلغ کالاها:</span><span>{formatPrice(totalPrice)} تومان</span></div>
        <div className="flex justify-between text-white/60"><span>هزینه ارسال:</span><span>{shippingCost === 0 ? 'رایگان' : `${formatPrice(shippingCost)} تومان`}</span></div>
        {discount > 0 && <div className="flex justify-between text-[rgb(var(--success,16,185,129))]"><span>سود شما از خرید:</span><span>{formatPrice(discount)} تومان</span></div>}
        <div className="flex justify-between text-white/40 text-xs"><span>مالیات بر ارزش افزوده:</span><span>محاسبه شده در قیمت کالا</span></div>
      </div>

      <div className="flex items-end justify-between border-t border-white/10 pt-4 mb-8">
        <span className="text-sm font-bold text-white">مبلغ قابل پرداخت:</span>
        <div className="flex items-baseline gap-1 text-[rgb(var(--primary))]">
          <span className="text-2xl font-black">{formatPrice(finalTotal)}</span>
          <span className="text-xs font-bold">تومان</span>
        </div>
      </div>

      {/* Desktop Submit Button (Hidden on mobile via CSS trick, we'll use a fixed bar on mobile) */}
      <button
        onClick={onSubmit}
        disabled={!isValid}
        className="hidden md:flex w-full items-center justify-center py-4 rounded-xl bg-[rgb(var(--primary))] text-black font-black text-base hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(var(--primary),0.2)] focus:ring-2 focus:ring-white outline-none"
      >
        تایید و پرداخت
      </button>
    </div>
  );
}