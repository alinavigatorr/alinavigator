'use client';

import React from 'react';
import { PriceSummary } from '../../../types/order';

interface PriceSummaryCardProps {
  summary: PriceSummary;
}

export const PriceSummaryCard = React.memo(function PriceSummaryCard({ summary }: PriceSummaryCardProps) {
  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4" aria-label="خلاصه هزینه‌ها">
      <h3 className="text-white font-bold text-sm mb-2">خلاصه هزینه‌ها</h3>
      
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>مبلغ کل کالاها</span>
        <span>{summary.subtotal.toLocaleString()} تومان</span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>هزینه ارسال</span>
        <span>{summary.shipping === 0 ? 'رایگان' : `${summary.shipping.toLocaleString()} تومان`}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-white/70">
        <span>مالیات (ارزش افزوده)</span>
        <span>{summary.tax.toLocaleString()} تومان</span>
      </div>

      {summary.discount > 0 && (
        <div className="flex items-center justify-between text-sm text-[rgb(var(--primary))] font-medium">
          <span>تخفیف اعمال شده</span>
          <span>- {summary.discount.toLocaleString()} تومان</span>
        </div>
      )}

      <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between text-white font-bold text-lg">
        <span>مبلغ قابل پرداخت</span>
        <span>{summary.total.toLocaleString()} <span className="text-xs font-normal opacity-70">تومان</span></span>
      </div>
    </section>
  );
});