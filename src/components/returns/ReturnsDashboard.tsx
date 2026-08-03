'use client';

import React, { useState, useMemo } from 'react';
import { ReturnRequest, ReturnStatus, ReturnReason, RefundType } from '../../domain/returns/return-types';

// Extended interface for dashboard visualization (combining order data)
interface ReturnDashboardRow extends ReturnRequest {
  orderNumber: string;
  customerName: string;
  productName: string;
}

// Mock Data for Dashboard Visualization
const mockReturns: ReturnDashboardRow[] = [
  {
    id: 'ret-101',
    orderId: 'ord-1001',
    orderNumber: 'ORD-1001',
    orderItemId: 'item-1',
    userId: 'usr-1',
    customerName: 'علی رضا حسینی',
    productName: 'گوشی موبایل سامسونگ Galaxy S24 Ultra',
    reason: 'damaged_item',
    status: 'pending_review',
    requestedDate: '2026-08-01T10:00:00.000Z',
    returnWindowDays: 7,
    refundType: 'original_payment_method',
    replacementType: 'none',
    shippingResponsibility: 'seller',
    inspectionResult: 'pending'
  },
  {
    id: 'ret-102',
    orderId: 'ord-1002',
    orderNumber: 'ORD-1002',
    orderItemId: 'item-2',
    userId: 'usr-2',
    customerName: 'مریم احمدی',
    productName: 'کفش ورزشی نایکی مدل Air Zoom',
    reason: 'wrong_item',
    status: 'approved',
    requestedDate: '2026-07-30T14:30:00.000Z',
    approvalDate: '2026-07-31T09:00:00.000Z',
    returnWindowDays: 14,
    refundType: 'store_credit',
    replacementType: 'none',
    shippingResponsibility: 'marketplace',
    inspectionResult: 'pending'
  },
  {
    id: 'ret-103',
    orderId: 'ord-1003',
    orderNumber: 'ORD-1003',
    orderItemId: 'item-3',
    userId: 'usr-3',
    customerName: 'سارا رضایی',
    productName: 'ساعت هوشمند اپل واچ سری 9',
    reason: 'changed_mind',
    status: 'rejected',
    requestedDate: '2026-07-25T11:00:00.000Z',
    returnWindowDays: 7,
    refundType: 'original_payment_method',
    replacementType: 'none',
    shippingResponsibility: 'buyer',
    inspectionResult: 'pending'
  },
  {
    id: 'ret-104',
    orderId: 'ord-1004',
    orderNumber: 'ORD-1004',
    orderItemId: 'item-4',
    userId: 'usr-4',
    customerName: 'امیرعلی کریمی',
    productName: 'هدفون سونی مدل WH-1000XM5',
    reason: 'defective',
    status: 'refunded',
    requestedDate: '2026-07-20T16:45:00.000Z',
    approvalDate: '2026-07-21T10:00:00.000Z',
    returnWindowDays: 7,
    refundType: 'original_payment_method',
    replacementType: 'none',
    shippingResponsibility: 'seller',
    inspectionResult: 'passed'
  }
];

export function ReturnsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'refund' | 'replacement'>('all');

  // Filter Logic
  const filteredReturns = useMemo(() => {
    return mockReturns.filter((req) => {
      const matchesSearch = 
        req.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.productName.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      
      let matchesType = true;
      if (typeFilter === 'refund') matchesType = req.replacementType === 'none';
      if (typeFilter === 'replacement') matchesType = req.replacementType !== 'none';
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  // Summary Stats
  const stats = useMemo(() => ({
    total: mockReturns.length,
    pending: mockReturns.filter(r => r.status === 'requested' || r.status === 'pending_review').length,
    approved: mockReturns.filter(r => r.status === 'approved' || r.status === 'awaiting_shipment' || r.status === 'in_transit' || r.status === 'received').length,
    rejected: mockReturns.filter(r => r.status === 'rejected').length,
    refunded: mockReturns.filter(r => r.status === 'refunded' || r.status === 'completed').length,
  }), []);

  // UI Helpers
  const getStatusBadge = (status: ReturnStatus) => {
    const config = {
      requested: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'درخواست شده' },
      pending_review: { bg: 'bg-amber-500/10', text: 'text-amber-500', label: 'در انتظار بررسی' },
      approved: { bg: 'bg-[rgb(var(--primary))]/10', text: 'text-[rgb(var(--primary))]', label: 'تایید شده' },
      rejected: { bg: 'bg-[rgb(var(--error))]/10', text: 'text-[rgb(var(--error))]', label: 'رد شده' },
      awaiting_shipment: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', label: 'در انتظار ارسال' },
      in_transit: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'در مسیر بازگشت' },
      received: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', label: 'دریافت شده' },
      inspected: { bg: 'bg-teal-500/10', text: 'text-teal-500', label: 'بازرسی شده' },
      refunded: { bg: 'bg-[rgb(var(--success))]/10', text: 'text-[rgb(var(--success))]', label: 'مبلغ بازگشت داده شد' },
      completed: { bg: 'bg-[rgb(var(--success))]/20', text: 'text-[rgb(var(--success))]', label: 'تکمیل شده' }
    };
    const style = config[status] || config.requested;
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border border-current border-opacity-20 whitespace-nowrap ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getReasonLabel = (reason: ReturnReason) => {
    const labels: Record<ReturnReason, string> = {
      damaged_item: 'آسیب‌دیدگی فیزیکی',
      wrong_item: 'ارسال کالای اشتباه',
      missing_parts: 'کسری اقلام همراه',
      defective: 'نقص فنی / خرابی',
      changed_mind: 'انصراف از خرید',
      late_delivery: 'تاخیر در ارسال',
      other: 'سایر موارد'
    };
    return labels[reason];
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">مدیریت مرجوعی‌ها</h2>
          <p className="text-sm text-white/50 mt-1">بررسی و مدیریت درخواست‌های بازگشت کالا</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: 'کل درخواست‌ها', value: stats.total, color: 'text-white', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { title: 'در انتظار بررسی', value: stats.pending, color: 'text-amber-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { title: 'تایید شده', value: stats.approved, color: 'text-[rgb(var(--primary))]', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { title: 'رد شده', value: stats.rejected, color: 'text-[rgb(var(--error))]', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { title: 'مبلغ عودت شده', value: stats.refunded, color: 'text-[rgb(var(--success))]', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <svg className={`w-5 h-5 ${stat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
              <p className="text-xs text-white/50">{stat.title}</p>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-96">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="جستجو (شماره سفارش، نام مشتری یا کالا)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
          />
        </div>
        <div className="flex w-full lg:w-auto gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="flex-1 md:w-40 px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[rgb(var(--primary))] appearance-none cursor-pointer"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending_review">در انتظار بررسی</option>
            <option value="approved">تایید شده</option>
            <option value="rejected">رد شده</option>
            <option value="refunded">عودت وجه شده</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="flex-1 md:w-40 px-3 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[rgb(var(--primary))] appearance-none cursor-pointer"
          >
            <option value="all">نوع درخواست</option>
            <option value="refund">بازگشت وجه</option>
            <option value="replacement">تعویض کالا</option>
          </select>
        </div>
      </div>

      {/* Return Requests List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-white/50 bg-black/20">
                <th className="p-4 font-medium whitespace-nowrap">مشخصات سفارش</th>
                <th className="p-4 font-medium whitespace-nowrap">کالا و دلیل</th>
                <th className="p-4 font-medium whitespace-nowrap">وضعیت</th>
                <th className="p-4 font-medium whitespace-nowrap">تاریخ ثبت</th>
                <th className="p-4 font-medium whitespace-nowrap text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReturns.length > 0 ? (
                filteredReturns.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 align-top">
                      <p className="text-sm font-bold text-white">{req.orderNumber}</p>
                      <p className="text-xs text-white/60 mt-1">{req.customerName}</p>
                      <p className="text-xs text-[rgb(var(--primary))] mt-1">
                        {req.refundType === 'store_credit' ? 'شارژ کیف پول' : 'بازگشت به حساب'}
                      </p>
                    </td>
                    <td className="p-4 align-top max-w-[250px]">
                      <p className="text-sm text-white truncate" title={req.productName}>{req.productName}</p>
                      <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/30 inline-block"></span>
                        {getReasonLabel(req.reason)}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 align-top text-sm text-white/70 whitespace-nowrap">
                      {new Date(req.requestedDate).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => alert(`View details for ${req.orderNumber}`)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="جزئیات">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {req.status === 'pending_review' && (
                          <>
                            <button onClick={() => alert(`Approve return for ${req.orderNumber}`)} className="p-1.5 bg-[rgb(var(--success))]/10 hover:bg-[rgb(var(--success))]/20 text-[rgb(var(--success))] rounded-lg transition-colors" title="تایید">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                            <button onClick={() => alert(`Reject return for ${req.orderNumber}`)} className="p-1.5 bg-[rgb(var(--error))]/10 hover:bg-[rgb(var(--error))]/20 text-[rgb(var(--error))] rounded-lg transition-colors" title="رد درخواست">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </>
                        )}
                        {(req.status === 'approved' || req.status === 'in_transit') && (
                           <button onClick={() => alert(`Mark as received: ${req.orderNumber}`)} className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-lg transition-colors" title="اعلام دریافت کالا">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                           </button>
                        )}
                         {req.status === 'received' && (
                           <button onClick={() => alert(`Mark as refunded: ${req.orderNumber}`)} className="p-1.5 bg-[rgb(var(--primary))]/10 hover:bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] rounded-lg transition-colors" title="ثبت عودت وجه">
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50 text-sm">
                    هیچ درخواستی با این مشخصات یافت نشد.
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