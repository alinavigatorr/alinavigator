'use client';

import React, { useState, useMemo } from 'react';
import { Campaign, CampaignStatus, CampaignType } from '../../domain/campaigns/campaign-types';

// Mock Data for Dashboard Visualization
const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    title: 'حراج تابستانه',
    description: 'تخفیف‌های ویژه فصل تابستان روی تمامی محصولات',
    type: 'seasonal',
    status: 'active',
    startDate: '2026-06-01T00:00:00.000Z',
    endDate: '2026-09-01T23:59:59.000Z',
    priority: 10,
    isVisible: true,
    rules: {}
  },
  {
    id: 'camp-2',
    title: 'پیشنهاد شگفت‌انگیز موبایل',
    description: 'تخفیف ویژه گوشی‌های هوشمند به مدت محدود',
    type: 'flash_sale',
    status: 'scheduled',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-15T23:59:59.000Z',
    priority: 50,
    isVisible: true,
    rules: { targetCategoryIds: ['cat-mobile'] }
  },
  {
    id: 'camp-3',
    title: 'بلک فرایدی',
    description: 'بزرگترین حراج سال',
    type: 'marketplace',
    status: 'draft',
    startDate: '2026-11-20T00:00:00.000Z',
    endDate: '2026-11-30T23:59:59.000Z',
    priority: 100,
    isVisible: false,
    rules: {}
  },
  {
    id: 'camp-4',
    title: 'جشنواره بهاره',
    description: 'کمپین فروشندگان برای فصل بهار',
    type: 'seller',
    status: 'expired',
    startDate: '2026-03-20T00:00:00.000Z',
    endDate: '2026-04-20T23:59:59.000Z',
    priority: 20,
    isVisible: true,
    rules: {}
  },
  {
    id: 'camp-5',
    title: 'تخفیف لوازم خانگی',
    description: 'تخفیف ویژه برندهای منتخب',
    type: 'brand',
    status: 'paused',
    startDate: '2026-07-01T00:00:00.000Z',
    endDate: '2026-08-30T23:59:59.000Z',
    priority: 30,
    isVisible: false,
    rules: { targetBrandIds: ['brand-1', 'brand-2'] }
  }
];

export function CampaignDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<CampaignType | 'all'>('all');

  // Filter Logic
  const filteredCampaigns = useMemo(() => {
    return mockCampaigns.filter((campaign) => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  // Summary Stats
  const stats = useMemo(() => ({
    total: mockCampaigns.length,
    active: mockCampaigns.filter(c => c.status === 'active').length,
    scheduled: mockCampaigns.filter(c => c.status === 'scheduled').length,
    expired: mockCampaigns.filter(c => c.status === 'expired').length,
  }), []);

  // UI Helpers
  const getStatusBadge = (status: CampaignStatus) => {
    const config = {
      active: { bg: 'bg-[rgb(var(--success))]/10', text: 'text-[rgb(var(--success))]', label: 'فعال' },
      scheduled: { bg: 'bg-[rgb(var(--primary))]/10', text: 'text-[rgb(var(--primary))]', label: 'زمان‌بندی شده' },
      expired: { bg: 'bg-[rgb(var(--error))]/10', text: 'text-[rgb(var(--error))]', label: 'منقضی' },
      paused: { bg: 'bg-amber-500/10', text: 'text-amber-500', label: 'متوقف شده' },
      draft: { bg: 'bg-white/10', text: 'text-white/70', label: 'پیش‌نویس' },
      cancelled: { bg: 'bg-white/5', text: 'text-white/40', label: 'لغو شده' }
    };
    const style = config[status] || config.draft;
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border border-current border-opacity-20 ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getTypeLabel = (type: CampaignType) => {
    const types: Record<CampaignType, string> = {
      flash_sale: 'فروش ویژه (Flash Sale)',
      seasonal: 'فصلی',
      brand: 'برند',
      category: 'دسته‌بندی',
      seller: 'فروشنده',
      marketplace: 'مارکت‌پلیس',
      bundle: 'پکیج (Bundle)'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">مدیریت کمپین‌ها</h2>
          <p className="text-sm text-white/50 mt-1">ساخت و مدیریت جشنواره‌ها و رویدادهای تخفیفی</p>
        </div>
        <button 
          onClick={() => alert('Action: Create Campaign')}
          className="px-5 py-2.5 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(var(--primary),0.2)] flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          کمپین جدید
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'کل کمپین‌ها', value: stats.total, color: 'text-white', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
          { title: 'کمپین‌های فعال', value: stats.active, color: 'text-[rgb(var(--success))]', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { title: 'زمان‌بندی شده', value: stats.scheduled, color: 'text-[rgb(var(--primary))]', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { title: 'منقضی شده', value: stats.expired, color: 'text-[rgb(var(--error))]', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((stat, i) => (
          <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white/50">{stat.title}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="جستجوی کمپین (نام، توضیحات)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
          />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 md:w-40 px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[rgb(var(--primary))] appearance-none cursor-pointer"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="scheduled">زمان‌بندی شده</option>
            <option value="draft">پیش‌نویس</option>
            <option value="paused">متوقف شده</option>
            <option value="expired">منقضی شده</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="flex-1 md:w-40 px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[rgb(var(--primary))] appearance-none cursor-pointer"
          >
            <option value="all">همه انواع</option>
            <option value="flash_sale">فروش ویژه</option>
            <option value="marketplace">مارکت‌پلیس</option>
            <option value="seller">فروشنده</option>
            <option value="seasonal">فصلی</option>
          </select>
        </div>
      </div>

      {/* Campaign List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-white/50 bg-black/20">
                <th className="p-4 font-medium whitespace-nowrap">عنوان کمپین</th>
                <th className="p-4 font-medium whitespace-nowrap">نوع</th>
                <th className="p-4 font-medium whitespace-nowrap">وضعیت</th>
                <th className="p-4 font-medium whitespace-nowrap">تاریخ شروع</th>
                <th className="p-4 font-medium whitespace-nowrap">تاریخ پایان</th>
                <th className="p-4 font-medium whitespace-nowrap">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <p className="text-sm font-semibold text-white">{campaign.title}</p>
                      <p className="text-xs text-white/50 mt-1 line-clamp-1">{campaign.description}</p>
                    </td>
                    <td className="p-4 text-sm text-white/70 whitespace-nowrap">
                      {getTypeLabel(campaign.type)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="p-4 text-sm text-white/70 whitespace-nowrap">
                      {new Date(campaign.startDate).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-4 text-sm text-white/70 whitespace-nowrap">
                      {new Date(campaign.endDate).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => alert(`Edit: ${campaign.title}`)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="ویرایش">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        {campaign.status === 'active' && (
                          <button onClick={() => alert(`Pause: ${campaign.title}`)} className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg transition-colors" title="توقف">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </button>
                        )}
                        <button onClick={() => alert(`Archive: ${campaign.title}`)} className="p-1.5 bg-[rgb(var(--error))]/10 hover:bg-[rgb(var(--error))]/20 text-[rgb(var(--error))] rounded-lg transition-colors" title="آرشیو">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50 text-sm">
                    هیچ کمپینی با این مشخصات یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}