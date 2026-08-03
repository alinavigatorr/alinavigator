'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Check, X, Loader2 } from 'lucide-react';

export function CouponInput() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleApply = () => {
    if (!code) return;
    setStatus('loading');
    setTimeout(() => {
      if (code.toLowerCase() === 'vip2026') setStatus('success');
      else setStatus('error');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex items-center">
        <div className="absolute right-3 text-white/30">
          <Tag className="w-4 h-4" />
        </div>
        <input
          value={code}
          onChange={(e) => { setCode(e.target.value); setStatus('idle'); }}
          disabled={status === 'success' || status === 'loading'}
          placeholder="کد تخفیف دارید؟"
          className={`w-full bg-white/5 border outline-none rounded-xl py-3 pr-10 pl-24 text-sm text-white font-medium transition-colors ${
            status === 'error' ? 'border-red-500/50 bg-red-500/5' : 
            status === 'success' ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 focus:border-white/30'
          }`}
        />
        <div className="absolute left-1.5">
          {status === 'success' ? (
            <button onClick={() => { setCode(''); setStatus('idle'); }} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-500/20 transition-colors">
              حذف <X className="w-3 h-3" />
            </button>
          ) : (
            <button 
              onClick={handleApply}
              disabled={!code || status === 'loading'}
              className="text-xs bg-[rgb(var(--primary))] text-black font-bold px-4 py-1.5 rounded-lg disabled:opacity-50 transition-transform active:scale-95 flex items-center justify-center min-w-[60px]"
            >
              {status === 'loading' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'ثبت'}
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {status === 'error' && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 pr-1">کد تخفیف وارد شده نامعتبر است.</motion.p>
        )}
        {status === 'success' && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-green-400 pr-1 flex items-center gap-1"><Check className="w-3 h-3" /> کد تخفیف با موفقیت اعمال شد.</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}