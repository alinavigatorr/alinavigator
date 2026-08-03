'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../dashboard-section';
import { ProductPreviewCard } from '../product-preview-card';
import { SkeletonCard } from '../skeleton-card';
import { EmptyState } from '../empty-state';
import { Clock } from 'lucide-react';

const mockViewed = [
  { id: '1', name: 'مانیتور اولتراواید', price: '۲۲,۰۰۰,۰۰۰' },
  { id: '2', name: 'پد موس سایز بزرگ', price: '۴۵۰,۰۰۰' },
  { id: '3', name: 'پایه نگهدارنده لپ‌تاپ', price: '۱,۱۰۰,۰۰۰' },
  { id: '4', name: 'کابل شارژ فست', price: '۲۵۰,۰۰۰' },
];

export function RecentlyViewedPreview() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<typeof mockViewed>([]);

  useEffect(() => {
    const timer = setTimeout(() => { setData(mockViewed); setIsLoading(false); }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardSection title="بازدیدهای اخیر" actionLabel="تاریخچه کامل" actionHref="/profile/recently-viewed">
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-44" />)}
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.map(item => <ProductPreviewCard key={item.id} name={item.name} price={item.price} actionType="view" />)}
        </div>
      ) : (
        <EmptyState icon={Clock} title="بازدیدی ثبت نشده" description="محصولاتی که مشاهده می‌کنید اینجا نمایش داده می‌شوند." />
      )}
    </DashboardSection>
  );
}