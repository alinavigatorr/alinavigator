'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package } from 'lucide-react';

export function StepConfirmation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-20 h-20 rounded-full bg-[rgb(var(--primary))]/10 border-2 border-[rgb(var(--primary))] flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-10 h-10 text-[rgb(var(--primary))]" />
      </motion.div>

      <h2 className="text-2xl font-extrabold text-white mb-2">سفارش شما ثبت شد!</h2>
      <p className="text-sm text-white/50 max-w-md leading-relaxed mb-8">
        از خرید شما سپاسگزاریم. سفارش شما با موفقیت ثبت شد و به زودی پردازش خواهد شد. کد رهگیری سفارش برای شما پیامک می‌شود.
      </p>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-8 py-4 mb-8">
        <span className="text-xs text-white/40 block mb-1">کد سفارش</span>
        <span className="text-lg font-bold text-[rgb(var(--primary))] tracking-wider">
          ALN-{Math.floor(100000 + Math.random() * 900000)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-white/30">
        <Package className="w-4 h-4" />
        <span>وضعیت: در حال پردازش</span>
      </div>
    </motion.div>
  );
}
