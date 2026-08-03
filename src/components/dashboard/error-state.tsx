'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ 
  title = 'خطا در دریافت اطلاعات', 
  message = 'متاسفانه در برقراری ارتباط مشکلی رخ داده است. لطفاً دوباره تلاش کنید.', 
  onRetry 
}: ErrorStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-[rgb(var(--error))]/5 border border-[rgb(var(--error))]/20 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-16 h-16 rounded-full bg-[rgb(var(--error))]/10 flex items-center justify-center text-[rgb(var(--error))] mb-4">
        <AlertTriangle className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-white font-bold mb-1.5">{title}</h3>
      <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-6">{message}</p>
      <button 
        onClick={onRetry}
        aria-label="تلاش مجدد برای دریافت اطلاعات"
        className="group flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--error))]/50"
      >
        <RefreshCcw className="w-4 h-4 text-white/50 group-hover:text-white group-hover:rotate-180 transition-all duration-500" aria-hidden="true" />
        تلاش مجدد
      </button>
    </motion.div>
  );
}