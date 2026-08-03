'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderPreviewCardProps {
  orderNumber: string;
  date: string;
  total: string;
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  pending: { label: 'در انتظار', classes: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  processing: { label: 'در حال پردازش', classes: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  shipped: { label: 'ارسال شده', classes: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  delivered: { label: 'تحویل شده', classes: 'text-green-400 bg-green-400/10 border-green-400/20' },
  cancelled: { label: 'لغو شده', classes: 'text-red-400 bg-red-400/10 border-red-400/20' }
};

export function OrderPreviewCard({ orderNumber, date, total, status }: OrderPreviewCardProps) {
  const badge = statusConfig[status];

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-colors focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]/50 cursor-default">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/50 shrink-0">
          <ShoppingBag className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-white font-bold text-sm tracking-wide">#{orderNumber}</span>
          <span className="text-white/50 text-xs">{date}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-white font-medium text-sm">{total} تومان</span>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${badge.classes}`}>
          {badge.label}
        </span>
      </div>
    </div>
  );
}