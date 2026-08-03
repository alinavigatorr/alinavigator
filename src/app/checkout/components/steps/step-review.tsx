'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, ArrowRight, CheckCircle2, MapPin, Truck, CreditCard } from 'lucide-react';
import type { CheckoutSession } from '../../use-checkout-session';
import { useCart } from '@/contexts/CartContext';

interface StepReviewProps {
  session: CheckoutSession;
  onComplete: () => void;
  onPrev: () => void;
}

const shippingLabels: Record<string, string> = {
  standard: 'ارسال عادی پستی',
  express: 'ارسال سریع (پیک)',
  free: 'ارسال رایگان',
};

const paymentLabels: Record<string, string> = {
  gateway: 'درگاه پرداخت اینترنتی (شتاب)',
  snapppay: 'خرید اقساطی اسنپ‌پی',
  digipay: 'سرویس اعتباری دیجی‌پی',
  card_to_card: 'کارت به کارت / واریز حقوقی',
};

export function StepReview({ session, onComplete, onPrev }: StepReviewProps) {
  const { items, subtotal } = useCart();

  const FREE_SHIPPING_THRESHOLD = 5000000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 45000;
  const tax = Math.floor(subtotal * 0.09);
  const finalTotal = subtotal + shipping + tax;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20">
          <ClipboardCheck className="w-5 h-5 text-[rgb(var(--primary))]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">بررسی نهایی سفارش</h2>
          <p className="text-xs text-white/40">اطلاعات سفارش خود را بررسی کنید</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-[rgb(var(--primary))]" />
            <h3 className="text-sm font-bold text-white">آدرس تحویل</h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            {session.address.fullName} - {session.address.phone}
            <br />
            {session.address.province}، {session.address.city}، {session.address.address}
            <br />
            کد پستی: {session.address.postalCode}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-[rgb(var(--primary))]" />
            <h3 className="text-sm font-bold text-white">روش ارسال</h3>
          </div>
          <p className="text-xs text-white/60">
            {shippingLabels[session.shippingMethod] || session.shippingMethod}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-4 h-4 text-[rgb(var(--primary))]" />
            <h3 className="text-sm font-bold text-white">روش پرداخت</h3>
          </div>
          <p className="text-xs text-white/60">
            {paymentLabels[session.paymentMethod] || session.paymentMethod}
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white mb-3">اقلام سفارش</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="text-white/60 truncate ml-2">
                  {item.title} × {item.quantity}
                </span>
                <span className="text-white font-medium">
                  {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-3 pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-white">مبلغ قابل پرداخت</span>
            <span className="text-lg font-extrabold text-[rgb(var(--primary))]">
              {finalTotal.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 bg-white/5 text-white/70 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/10 active:scale-[0.98]"
        >
          <ArrowRight className="w-4 h-4" />
          مرحله قبل
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 bg-[rgb(var(--primary))] text-black px-8 py-3 rounded-xl font-bold text-sm transition-all hover:bg-[rgb(var(--primary))]/90 active:scale-[0.98] shadow-[0_10px_30px_rgba(var(--primary),0.15)]"
        >
          <CheckCircle2 className="w-4 h-4" />
          ثبت سفارش و پرداخت
        </button>
      </div>
    </motion.div>
  );
}
