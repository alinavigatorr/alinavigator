'use client';

import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { ShieldCheck, Check } from 'lucide-react';

export const PaymentSummaryCard = React.memo(function PaymentSummaryCard() {
  const { paymentSummary, validationState, isConfirmed, setIsConfirmed, status, processPayment } = usePayment();
  const hasSavings = paymentSummary.discount > 0;
  
  // Checking if UI should be locked
  const isProcessing = status === 'PROCESSING';

  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 sticky top-6" aria-label="خلاصه پرداخت">
      <h3 className="text-white font-bold text-sm mb-2">فاکتور نهایی</h3>
      
      <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>مبلغ کالاها</span>
          <span>{paymentSummary.subtotal.toLocaleString()} تومان</span>
        </div>
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>هزینه ارسال</span>
          <span>{paymentSummary.shipping === 0 ? 'رایگان' : `${paymentSummary.shipping.toLocaleString()} تومان`}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>مالیات (۹٪)</span>
          <span>{paymentSummary.tax.toLocaleString()} تومان</span>
        </div>
        {hasSavings && (
          <div className="flex items-center justify-between text-sm text-[rgb(var(--primary))] font-medium">
            <span>سود شما از خرید</span>
            <span>{paymentSummary.discount.toLocaleString()} تومان</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-center justify-between text-white font-bold text-lg">
          <span>مبلغ نهایی</span>
          <span>{paymentSummary.total.toLocaleString()} <span className="text-xs font-normal opacity-70">تومان</span></span>
        </div>
      </div>

      <div 
        className={`flex items-start gap-3 mt-2 group outline-none ${isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} 
        tabIndex={isProcessing ? -1 : 0}
        onClick={() => !isProcessing && setIsConfirmed(!isConfirmed)}
        onKeyDown={(e) => {
          if (!isProcessing && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsConfirmed(!isConfirmed);
          }
        }}
      >
        <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition-all border ${isConfirmed ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-black' : 'bg-white/5 border-white/20 group-hover:border-white/40 group-focus:ring-2 group-focus:ring-[rgb(var(--primary))]/50'}`}>
           {isConfirmed && <Check className="w-3.5 h-3.5" />}
        </div>
        <span className="text-xs text-white/60 leading-relaxed select-none">
          صحت اطلاعات وارد شده اعم از آدرس، گیرنده و اقلام سفارش را تایید می‌کنم.
        </span>
      </div>

      <button 
        disabled={!validationState.canProceed || isProcessing}
        onClick={processPayment}
        aria-busy={isProcessing}
        className="w-full mt-2 py-3.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 disabled:bg-white/10 disabled:text-white/30 text-black font-bold rounded-xl transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 flex items-center justify-center gap-2"
      >
        {isProcessing ? 'در حال پردازش...' : (validationState.canProceed ? 'تایید و پرداخت نهایی' : 'تکمیل اطلاعات الزامی است')}
      </button>
      
      <span className="text-[10px] text-white/40 flex items-center justify-center gap-1 mt-1">
        <ShieldCheck className="w-3 h-3" /> درگاه پرداخت ایمن و رمزنگاری شده
      </span>
    </section>
  );
});