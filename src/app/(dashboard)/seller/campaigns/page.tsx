import React from 'react';
import { CampaignDashboard } from '@/components/campaigns/CampaignDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'مدیریت کمپین‌ها | پنل فروشندگان',
  description: 'داشبورد مدیریت کمپین‌ها و جشنواره‌های فروش',
};

export default function SellerCampaignsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <CampaignDashboard />
    </div>
  );
}