'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../dashboard-section';
import { OrderPreviewCard } from '../order-preview-card';
import { SkeletonCard } from '../skeleton-card';
import { EmptyState } from '../empty-state';
import { ShoppingBag } from 'lucide-react';

const mockOrders = [
  { id: '1', orderNumber: 'ORD-99382', date: '۲ مرداد ۱۴۰۵', total: '۱,۴۵۰,۰۰۰', status: 'processing' as const },
  { id: '2', orderNumber: 'ORD-88211', date: '۱۸ تیر ۱۴۰۵', total: '۸۵۰,۰۰۰', status: 'delivered' as const },
  { id: '3', orderNumber: 'ORD-77102', date: '۵ خرداد ۱۴۰۵', total: '۳,۲۰۰,۰۰۰', status: 'cancelled' as const },
];

export function RecentOrdersPreview() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<typeof mockOrders>([]);

  useEffect(() => {
    // Client-side fetch mock
    const timer = setTimeout(() => {
      setData(mockOrders);
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardSection title="سفارشات اخیر" actionLabel="همه سفارشات" actionHref="/profile/orders">
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-20" />)}
        </div>
      ) : data.length > 0 ? (
        <div className="flex flex-col gap-3">
          {data.map(order => <OrderPreviewCard key={order.id} {...order} />)}
        </div>
      ) : (
        <EmptyState 
          icon={ShoppingBag} 
          title="سفارشی یافت نشد" 
          description="شما هنوز هیچ سفارشی ثبت نکرده‌اید." 
          actionLabel="رفتن به فروشگاه" 
          actionHref="/products" 
        />
      )}
    </DashboardSection>
  );
}