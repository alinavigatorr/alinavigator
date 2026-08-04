'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { DashboardShell } from '../../../components/dashboard/dashboard-shell';
import { DashboardWelcomeCard } from '../../../components/dashboard/dashboard-welcome-card';
import { DashboardStatCard } from '../../../components/dashboard/dashboard-stat-card';
import { QuickActionCard } from '../../../components/dashboard/quick-action-card';
import { RecentOrdersPreview } from '../../../components/dashboard/widgets/recent-orders-preview';
import { WishlistPreview } from '../../../components/dashboard/widgets/wishlist-preview';
import { RecentlyViewedPreview } from '../../../components/dashboard/widgets/recently-viewed-preview';
import { Package, Heart, Clock, MapPin, User, Shield } from 'lucide-react';

// 🌟 ایمپورت کامپوننت جدید کلوپ مشتریان
import { MembershipOverview } from '../../../components/dashboard/membership-overview';

export default function ProfileOverviewPage() {
  const { user } = useAuth();

  return (
    <DashboardShell className="flex flex-col gap-8">
      <section aria-label="خوش‌آمدگویی">
        <DashboardWelcomeCard user={user} />
      </section>

      {/* 🌟 بخش جدید: خلاصه وضعیت کلوپ مشتریان و کیف پول */}
      <section aria-label="کلوپ مشتریان و کیف پول">
        <MembershipOverview />
      </section>

      {/* Upgraded Stats Section */}
      <section aria-label="خلاصه آمار کاربری">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatCard title="کل سفارشات" value="۱۴" icon={Package} delay={0.1} trend={{ value: '+12%', isPositive: true }} />
          <DashboardStatCard title="علاقه‌مندی‌ها" value="۳۲" icon={Heart} delay={0.15} trend={{ value: '+4', isPositive: true }} />
          <DashboardStatCard title="بازدیدهای اخیر" value="۱۲۸" icon={Clock} delay={0.2} trend={{ value: '18', isPositive: false }} />
          <DashboardStatCard title="آدرس‌های ثبت‌شده" value="۳" icon={MapPin} delay={0.25} />
        </div>
      </section>

      <section aria-label="دسترسی سریع">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard title="سفارشات من" description="پیگیری و مشاهده تاریخچه خریدها" icon={Package} href="/profile/orders" />
          <QuickActionCard title="علاقه‌مندی‌ها" description="مشاهده کالاهای ذخیره‌شده" icon={Heart} href="/profile/wishlist" />
          <QuickActionCard title="آدرس‌های پستی" description="مدیریت آدرس‌های ارسال" icon={MapPin} href="/profile/addresses" />
        </div>
      </section>
      
      {/* 🌟 New Activity Widgets Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentOrdersPreview />
        <WishlistPreview />
      </div>

      {/* Spans full width below */}
      <RecentlyViewedPreview />

    </DashboardShell>
  );
}