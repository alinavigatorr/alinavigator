import React from 'react';
import { ReturnsDashboard } from '@/components/returns/ReturnsDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مدیریت مرجوعی‌ها | پنل فروشندگان',
  description: 'داشبورد بررسی و مدیریت درخواست‌های بازگشت کالا',
};

export default function SellerReturnsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <ReturnsDashboard />
    </div>
  );
}