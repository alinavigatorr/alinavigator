'use client';

import React from 'react';
import Link from 'next/link';
import { OrderItem } from '../../../types/order';
import { Image as ImageIcon, ChevronLeft } from 'lucide-react';

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList = React.memo(function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4" aria-label="اقلام سفارش">
      <h3 className="text-white font-bold text-sm mb-2">اقلام سفارش ({items.length} کالا)</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const subtotal = item.price * item.quantity;
          return (
            <li key={item.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors focus-within:ring-2 focus-within:ring-[rgb(var(--primary))]/50">
              <div className="flex items-center gap-4">
                {/* Lazy loaded mock image container */}
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden relative border border-white/10">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} loading="lazy" className="w-full h-full object-cover opacity-50" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-white/20" aria-hidden="true" />
                  )}
                </div>
                <div className="flex flex-col">
                  <Link href={`/products/${item.productId}`} className="text-white font-bold text-sm line-clamp-1 hover:text-[rgb(var(--primary))] transition-colors focus:outline-none">
                    {item.name}
                  </Link>
                  <span className="text-white/50 text-xs mt-1">تعداد: {item.quantity} | رنگ/مدل: استاندارد</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-1">
                <span className="text-white/50 text-xs hidden sm:block">جمع جزء</span>
                <span className="text-white font-bold text-sm">{subtotal.toLocaleString()} تومان</span>
                <Link href={`/products/${item.productId}`} tabIndex={-1} className="sm:hidden flex items-center text-xs text-[rgb(var(--primary))] font-medium">
                  مشاهده محصول <ChevronLeft className="w-3 h-3" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
});