'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Image as ImageIcon, CreditCard, Truck } from 'lucide-react';
import { Order } from '../../../types/order';
import { OrderStatusBadge } from './order-status-badge';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const productCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const paymentStatus = ['CANCELLED', 'RETURNED', 'REFUNDED'].includes(order.status) 
    ? 'لغو پرداخت' 
    : order.status === 'PENDING' ? 'پرداخت نشده' : 'پرداخت موفق';

  return (
    <article className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.05] transition-colors focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]/50 flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <span className="text-white font-bold text-sm">#{order.orderNumber}</span>
          <span className="text-white/40 text-xs hidden sm:inline">• {order.date}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-white/60">
          <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> {paymentStatus}</span>
          <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> {order.priceSummary.shipping === 0 ? 'رایگان' : `${order.priceSummary.shipping.toLocaleString()} ت`}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Thumbnails & Summary */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3 space-x-reverse">
            {order.items.slice(0, 3).map((item, idx) => (
              <div key={item.id} className={`w-12 h-12 rounded-xl bg-white/10 border-2 border-[#0F0F13] flex items-center justify-center overflow-hidden z-[${3-idx}] relative`}>
                <ImageIcon className="w-5 h-5 text-white/20" />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-12 h-12 rounded-xl bg-white/5 border-2 border-[#0F0F13] flex items-center justify-center text-white/50 text-xs font-bold z-0 relative backdrop-blur-md">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{productCount} کالا در این سفارش</span>
            <span className="text-white/50 text-xs mt-1 truncate max-w-[200px]">
              {order.items.map(i => i.name).join('، ')}
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8">
          <div className="flex flex-col md:items-end">
            <span className="text-white/50 text-xs mb-1">مبلغ کل</span>
            <span className="text-white font-bold">{order.priceSummary.total.toLocaleString()} <span className="text-xs font-normal">تومان</span></span>
          </div>
          <Link 
            href={`/profile/orders/${order.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label={`مشاهده جزئیات سفارش ${order.orderNumber}`}
          >
            جزئیات <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
        
      </div>
    </article>
  );
}