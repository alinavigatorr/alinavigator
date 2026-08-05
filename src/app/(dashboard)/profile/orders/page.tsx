'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { OrderCard } from '@/components/dashboard/orders/order-card';
import { SkeletonCard } from '@/components/dashboard/skeleton-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { mockOrders } from '@/lib/orders';
import { OrderStatus } from '@/types/order';
import { Search, SlidersHorizontal, PackageX, PackageSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 5;

type SortOption = 'newest' | 'oldest' | 'highest_price' | 'lowest_price';
type FilterOption = OrderStatus | 'ALL';

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterOption>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Simulate network delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  // Memoized Filtering & Sorting Logic
  const processedOrders = useMemo(() => {
    let result = [...mockOrders];

    // 1. Search (Order Number or Product Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(q) ||
        // FIX: Added 'any' type to 'item' to pass strict TypeScript build checks
        order.items.some((item: any) => item.name.toLowerCase().includes(q))
      );
    }

    // 2. Filter Status
    if (statusFilter !== 'ALL') {
      result = result.filter(order => order.status === statusFilter);
    }

    // 3. Sort
    result.sort((a, b) => {
      // Mock string date parsing fallback (Real app would use timestamps)
      if (sortBy === 'newest') return b.date.localeCompare(a.date);
      if (sortBy === 'oldest') return a.date.localeCompare(b.date);
      if (sortBy === 'highest_price') return b.priceSummary.total - a.priceSummary.total;
      if (sortBy === 'lowest_price') return a.priceSummary.total - b.priceSummary.total;
      return 0;
    });

    return result;
  }, [searchQuery, statusFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(processedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = processedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardShell className="flex flex-col gap-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">سفارشات من</h1>
          <p className="text-sm text-white/50 mt-1">تاریخچه و پیگیری خریدهای شما</p>
        </div>
      </div>

      {/* Controls: Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/[0.02] p-4 border border-white/5 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            type="text"
            placeholder="جستجوی شماره سفارش یا نام کالا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 transition-all"
            aria-label="جستجوی سفارشات"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-white/40 hidden md:block" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full md:w-auto bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 [&>option]:bg-[#0F0F13]"
            aria-label="مرتب‌سازی سفارشات"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="highest_price">بیشترین مبلغ</option>
            <option value="lowest_price">کمترین مبلغ</option>
          </select>
        </div>
      </div>

      {/* Controls: Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as FilterOption)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 ${statusFilter === status
                ? 'bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] border border-[rgb(var(--primary))]/30'
                : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10 hover:text-white'
              }`}
          >
            {status === 'ALL' ? 'همه سفارشات' : status === 'PENDING' ? 'جاری' : status === 'DELIVERED' ? 'تحویل شده' : status === 'CANCELLED' ? 'لغو شده' : status === 'PROCESSING' ? 'در حال پردازش' : 'ارسال شده'}
          </button>
        ))}
      </div>

      {/* Orders List & States */}
      <div className="flex flex-col gap-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-40" />)}
            </motion.div>
          ) : processedOrders.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                icon={searchQuery || statusFilter !== 'ALL' ? PackageSearch : PackageX}
                title={searchQuery || statusFilter !== 'ALL' ? 'سفارشی یافت نشد' : 'هنوز سفارشی ندارید'}
                description={searchQuery || statusFilter !== 'ALL' ? 'با این فیلتر یا کلمه کلیدی هیچ سفارشی مطابقت ندارد.' : 'با مراجعه به فروشگاه می‌توانید اولین خرید خود را انجام دهید.'}
              />
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <ul className="flex flex-col gap-4" aria-label="لیست سفارشات">
                {paginatedOrders.map(order => (
                  <li key={order.id}>
                    <OrderCard order={order} />
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-white/5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-white/5 text-white text-sm rounded-lg disabled:opacity-30 hover:bg-white/10 focus:ring-2 focus:ring-[rgb(var(--primary))]/50"
                  >
                    قبلی
                  </button>
                  <span className="text-white/50 text-sm font-medium mx-2">صفحه {currentPage} از {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 bg-white/5 text-white text-sm rounded-lg disabled:opacity-30 hover:bg-white/10 focus:ring-2 focus:ring-[rgb(var(--primary))]/50"
                  >
                    بعدی
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}