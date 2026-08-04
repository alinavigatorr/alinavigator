'use client';

import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { InvoicePreview } from './invoice-preview';
import { OrderNotes } from './order-notes';
import { EstimatedDeliveryWidget } from './estimated-delivery-widget';

export const ReviewOrderSection = React.memo(function ReviewOrderSection() {
  const { setSelectedMethod } = usePayment();

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300" aria-label="بخش تایید اطلاعات">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">مرور و تایید نهایی</h2>
          <p className="text-white/50 text-sm mt-1">لطفاً پیش از تایید نهایی، پیش‌فاکتور سفارش خود را بررسی کنید.</p>
        </div>
        <button 
          onClick={() => setSelectedMethod(null)}
          className="text-sm px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shrink-0"
        >
          ویرایش اطلاعات
        </button>
      </div>

      <InvoicePreview />
      <EstimatedDeliveryWidget />
      <OrderNotes />
    </div>
  );
});