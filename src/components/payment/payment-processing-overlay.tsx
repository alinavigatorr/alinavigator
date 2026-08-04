'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export const PaymentProcessingOverlay = React.memo(function PaymentProcessingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300" aria-busy="true">
      <Loader2 className="w-12 h-12 text-[rgb(var(--primary))] animate-spin mb-4" />
      <h3 className="text-white font-bold text-lg">در حال پردازش تراکنش...</h3>
      <p className="text-white/60 text-sm mt-2">لطفاً از بستن یا رفرش این صفحه خودداری کنید</p>
    </div>
  );
});