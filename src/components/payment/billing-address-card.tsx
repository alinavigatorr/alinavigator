'use client';

import React from 'react';
import { MapPin, Edit2 } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';

export const BillingAddressCard = React.memo(function BillingAddressCard() {
  const { billingInformation } = usePayment();

  if (!billingInformation) return null;

  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4" aria-label="اطلاعات صورت‌حساب">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white/50" /> آدرس صورت‌حساب
        </h3>
        <button className="text-[rgb(var(--primary))] text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 rounded px-1">
          تغییر آدرس
        </button>
      </div>
      
      <div className="flex flex-col gap-2 text-sm text-white/80 bg-white/5 p-4 rounded-xl border border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white">{billingInformation.fullName}</span>
          <button className="text-white/40 hover:text-white transition-colors" aria-label="ویرایش اطلاعات">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-white/60 leading-relaxed text-xs mt-1">{billingInformation.fullAddress}</p>
        <div className="flex items-center gap-4 text-white/50 text-xs mt-2 pt-2 border-t border-white/5">
          <span>کد پستی: {billingInformation.postalCode}</span>
          <span>تلفن: {billingInformation.phone}</span>
        </div>
      </div>
    </section>
  );
});