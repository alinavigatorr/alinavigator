'use client';

import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { FileText, MapPin, CreditCard } from 'lucide-react';

export const InvoicePreview = React.memo(function InvoicePreview() {
  const { billingInformation, selectedMethod, paymentSummary } = usePayment();
  const mockOrderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const today = new Date().toLocaleDateString('fa-IR');

  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col gap-6" aria-label="پیش‌فاکتور سفارش">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 flex items-center justify-center text-[rgb(var(--primary))] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-bold text-sm sm:text-base truncate">پیش‌فاکتور سفارش</h3>
            <p className="text-white/50 text-[10px] sm:text-xs mt-1 truncate">شماره: {mockOrderNumber} | تاریخ: {today}</p>
          </div>
        </div>
        {/* کلاس hidden sm:block حذف شد و استایل‌ها برای سایز موبایل بهینه‌تر شدند */}
        <div className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/70 shrink-0 text-center ml-1 sm:ml-0">
          در انتظار پرداخت
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
           <span className="text-white/50 text-xs flex items-center gap-1.5 mb-1"><MapPin className="w-4 h-4" /> اطلاعات گیرنده</span>
           <p className="text-white font-bold text-sm">{billingInformation?.fullName || 'نامشخص'}</p>
           <p className="text-white/70 text-xs leading-relaxed">{billingInformation?.fullAddress}</p>
           <p className="text-white/50 text-xs mt-1">شماره تماس: {billingInformation?.phone}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col gap-2">
           <span className="text-white/50 text-xs flex items-center gap-1.5 mb-1"><CreditCard className="w-4 h-4" /> اطلاعات پرداخت</span>
           <p className="text-white font-bold text-sm">روش: {selectedMethod?.name || 'نامشخص'}</p>
           <p className="text-white/70 text-xs">تعداد اقلام: ۲ عدد (آزمایشی)</p>
           <p className="text-[rgb(var(--primary))] text-sm font-bold mt-auto pt-2 border-t border-white/5">
             مبلغ قابل پرداخت: {paymentSummary.total.toLocaleString()} تومان
           </p>
        </div>
      </div>
    </section>
  );
});