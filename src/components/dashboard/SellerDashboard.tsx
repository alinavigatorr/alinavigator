'use client';

import React, { useState, useTransition, useCallback } from 'react';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
  ssr: false, // چارت‌ها نیازی به رندر سمت سرور و سئو ندارند
  loading: () => <div className="animate-pulse bg-gray-200/10 h-64 w-full rounded-md text-white/50 flex items-center justify-center">در حال بارگذاری چارت...</div>,
});

const ReturnsManager = dynamic(() => import('./ReturnsManager'), {
  ssr: false, // داشبورد ادمین/فروشنده نیازی به ایندکس گوگل ندارد
  loading: () => <div className="text-center p-4 text-white/50">در حال بارگذاری سیستم مرجوعی...</div>,
});

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  
  // استفاده از useTransition برای جلوگیری از مسدود شدن مرورگر هنگام دانلود چانک‌های JS
  const [isPending, startTransition] = useTransition();

  const handleTabChange = useCallback((tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  }, []);

  return (
    <div className="dashboard-container">
      {/* منوی تب‌ها */}
      <nav className="flex gap-4">
        <button 
          onClick={() => handleTabChange('analytics')}
          className={activeTab === 'analytics' ? 'opacity-100 font-bold' : 'opacity-70'}
          disabled={isPending}
        >
          آمار و گزارش‌ها
        </button>
        <button 
          onClick={() => handleTabChange('returns')}
          className={activeTab === 'returns' ? 'opacity-100 font-bold' : 'opacity-70'}
          disabled={isPending}
        >
          مدیریت مرجوعی‌ها
        </button>
        
        {/* نمایش وضعیت لودینگ یکپارچه برای تغییر تب‌ها */}
        {isPending && <span className="text-sm opacity-50 animate-pulse">در حال دریافت...</span>}
      </nav>

      {/* کامپوننت‌ها فقط زمانی که تب فعال شود به صورت استریم دانلود و رندر می‌شوند */}
      <main className="mt-8 relative min-h-[250px]">
        {activeTab === 'analytics' && <AnalyticsChart />}
        {activeTab === 'returns' && <ReturnsManager />}
      </main>
    </div>
  );
}