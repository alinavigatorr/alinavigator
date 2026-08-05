'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// ۱. جایگزین کردن ایمپورت‌های معمولی با داینامیک ایمپورت
// import AnalyticsChart from './AnalyticsChart'; (حذف شود)
// import ReturnsManager from './ReturnsManager'; (حذف شود)

const AnalyticsChart = dynamic(() => import('./AnalyticsChart'), {
  ssr: false, // چارت‌ها معمولاً نیازی به رندر سمت سرور ندارند
  loading: () => <div className="animate-pulse bg-gray-200 h-64 w-full rounded-md">در حال بارگذاری چارت...</div>,
});

const ReturnsManager = dynamic(() => import('./ReturnsManager'), {
  loading: () => <div className="text-center p-4">در حال بارگذاری سیستم مرجوعی...</div>,
});

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="dashboard-container">
      {/* منوی تب‌ها */}
      <nav>
        <button onClick={() => setActiveTab('analytics')}>آمار و گزارش‌ها</button>
        <button onClick={() => setActiveTab('returns')}>مدیریت مرجوعی‌ها</button>
      </nav>

      {/* ۲. کامپوننت‌ها فقط زمانی که تب فعال شود دانلود و رندر می‌شوند */}
      <main className="mt-8">
        {activeTab === 'analytics' && <AnalyticsChart />}
        {activeTab === 'returns' && <ReturnsManager />}
      </main>
    </div>
  );
}