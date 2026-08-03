'use client';

import React from 'react';
import { XCircle, RefreshCcw } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';

export function PaymentFailureScreen() {
  const { setStatus } = usePayment();

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500" aria-live="assertive">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">پرداخت ناموفق بود</h2>
      <p className="text-white/50 mb-8 text-center max-w-md leading-relaxed">
        متأسفانه در پردازش تراکنش شما خطایی رخ داد. هیچ مبلغی از حساب شما کسر نشده است. لطفاً مجدداً تلاش کنید.
      </p>
      
      <button 
        onClick={() => setStatus('IDLE')}
        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <RefreshCcw className="w-4 h-4" /> تلاش مجدد و بازگشت
      </button>
    </div>
  );
}