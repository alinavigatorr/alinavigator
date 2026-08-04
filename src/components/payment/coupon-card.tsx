'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';

export const CouponCard = React.memo(function CouponCard() {
  const { appliedCoupon, applyCoupon, removeCoupon } = usePayment();
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsApplying(true);
    await applyCoupon(code.toUpperCase());
    setIsApplying(false);
  };

  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4" aria-label="کد تخفیف">
      <h3 className="text-white font-bold text-sm flex items-center gap-2">
        <Ticket className="w-4 h-4 text-white/50" /> کد تخفیف یا کارت هدیه
      </h3>
      
      <AnimatePresence mode="wait">
        {!appliedCoupon?.isValid ? (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="کد تخفیف خود را وارد کنید"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all uppercase"
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              />
              <button
                onClick={handleApply}
                disabled={!code.trim() || isApplying}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {isApplying ? 'در حال بررسی...' : 'اعمال'}
              </button>
            </div>
            {appliedCoupon && !appliedCoupon.isValid && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {appliedCoupon.message}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-between bg-green-400/10 border border-green-400/20 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div className="flex flex-col">
                <span className="text-green-400 text-sm font-bold">{appliedCoupon.code}</span>
                <span className="text-green-400/70 text-xs">{appliedCoupon.message} (- {appliedCoupon.discountAmount.toLocaleString()} تومان)</span>
              </div>
            </div>
            <button onClick={removeCoupon} className="p-2 hover:bg-green-400/20 rounded-lg transition-colors text-green-400" aria-label="حذف کد تخفیف">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});