'use client';

import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../dashboard-section';
import { ProductPreviewCard } from '../product-preview-card';
import { SkeletonCard } from '../skeleton-card';
import { EmptyState } from '../empty-state';
import { Heart } from 'lucide-react';

const mockWishlist = [
  { id: '1', name: 'لپ‌تاپ پرو ۱۳', price: '۴۵,۰۰۰,۰۰۰' },
  { id: '2', name: 'هدفون نویز کنسلینگ', price: '۸,۵۰۰,۰۰۰' },
  { id: '3', name: 'کیبورد مکانیکی', price: '۳,۲۰۰,۰۰۰' },
  { id: '4', name: 'موس گیمینگ', price: '۱,۸۰۰,۰۰۰' },
];

export function WishlistPreview() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<typeof mockWishlist>([]);

  useEffect(() => {
    const timer = setTimeout(() => { setData(mockWishlist); setIsLoading(false); }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardSection title="علاقه‌مندی‌ها" actionLabel="مشاهده لیست" actionHref="/profile/wishlist">
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} className="h-44" />)}
        </div>
      ) : data.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {data.map(item => <ProductPreviewCard key={item.id} name={item.name} price={item.price} actionType="cart" />)}
        </div>
      ) : (
        <EmptyState icon={Heart} title="لیست خالی است" description="کالاهای مورد علاقه خود را اینجا ذخیره کنید." />
      )}
    </DashboardSection>
  );
}