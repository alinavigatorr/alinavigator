'use client';

import React from 'react';
import { OrderStatus } from '../../../types/order';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; style: string }> = {
  PENDING: { label: 'در انتظار پرداخت', style: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  CONFIRMED: { label: 'تایید شده', style: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  PROCESSING: { label: 'در حال پردازش', style: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  PACKED: { label: 'بسته‌بندی شده', style: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  SHIPPED: { label: 'ارسال شده', style: 'text-teal-400 bg-teal-400/10 border-teal-400/20' },
  OUT_FOR_DELIVERY: { label: 'در حال تحویل', style: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  DELIVERED: { label: 'تحویل شده', style: 'text-green-400 bg-green-400/10 border-green-400/20' },
  CANCELLED: { label: 'لغو شده', style: 'text-red-400 bg-red-400/10 border-red-400/20' },
  RETURNED: { label: 'مرجوعی', style: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  REFUNDED: { label: 'مسترد شده', style: 'text-slate-400 bg-slate-400/10 border-slate-400/20' }
};

export function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${config.style} ${className}`}>
      {config.label}
    </span>
  );
}