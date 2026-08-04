'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SkeletonCard } from '@/components/dashboard/skeleton-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { OrderStatusBadge } from '@/components/dashboard/orders/order-status-badge';
import { PriceSummaryCard } from '@/components/dashboard/orders/price-summary-card';
import { OrderItemsList } from '@/components/dashboard/orders/order-items-list';
import { TrackingTimeline } from '@/components/dashboard/orders/tracking-timeline';
import { TrackingCard } from '@/components/dashboard/orders/tracking-card';
import { InvoiceCard } from '@/components/dashboard/orders/invoice-card';
import { ReturnSection } from '@/components/returns/ReturnSection';
import { mockOrders } from '@/lib/orders';
import { Order } from '@/types/order';
import { ChevronLeft, PackageX, User, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundOrder = mockOrders.find(o => o.id === params.id);
      setOrder(foundOrder || null);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.id]);

  // Memoized values to prevent unnecessary recalculations
  const isCancelled = useMemo(() => order?.status === 'CANCELLED' || order?.status === 'RETURNED', [order?.status]);

  if (isLoading) {
    return (
      <DashboardShell className="flex flex-col gap-6">
        <SkeletonCard className="h-10 w-32 mb-2 bg-transparent border-0" />
        <SkeletonCard className="h-28" /> {/* Header */}
        <SkeletonCard className="h-32" /> {/* Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <SkeletonCard className="h-64" /> {/* Items */}
            <SkeletonCard className="h-32" /> {/* Returns */}
          </div>
          <div className="flex flex-col gap-6">
            <SkeletonCard className="h-56" /> {/* Summary */}
            <SkeletonCard className="h-48" /> {/* Invoice */}
            <SkeletonCard className="h-48" /> {/* Tracking */}
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!order) {
    return (
      <DashboardShell>
        <EmptyState
          icon={PackageX}
          title="سفارش یافت نشد"
          description="این سفارش در سیستم ثبت نشده یا شناسه آن نامعتبر است."
          actionLabel="بازگشت به سفارشات"
          actionHref="/profile/orders"
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell className="flex flex-col gap-6">

      {/* Back Navigation */}
      <button
        onClick={() => router.push('/profile/orders')}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm w-fit focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md pr-2"
        aria-label="بازگشت به لیست سفارشات"
      >
        <ChevronLeft className="w-4 h-4 rotate-180" /> سفارشات من
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Header Section */}
          <header className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgb(var(--primary))]/5 blur-[60px] pointer-events-none" />

            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-white tracking-tight">سفارش #{order.orderNumber}</h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-white/50 text-sm">ثبت شده در: {order.date}</p>
            </div>

            <div className="flex flex-col md:items-end gap-1 relative z-10 bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-white/50 text-xs">آدرس تحویل</span>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium text-white">
                <User className="w-4 h-4 text-[rgb(var(--primary))]" /> {order.shippingAddress.fullName}
              </div>
              <div className="flex items-start gap-2 mt-1 text-xs text-white/70 max-w-[250px]">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> <span className="truncate">{order.shippingAddress.fullAddress}</span>
              </div>
            </div>
          </header>

          {/* Premium Timeline */}
          <TrackingTimeline currentStatus={order.status} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 flex flex-col gap-6">
              <OrderItemsList items={order.items} />

              {/* --- Returns Engine Integration --- */}
              <ReturnSection
                orderId={order.id}
                orderStatus={order.status}
                deliveryDate={order.date}
                isDigitalProduct={false}
              />
            </div>

            <div className="flex flex-col gap-6">
              <PriceSummaryCard summary={order.priceSummary} />

              <InvoiceCard
                invoiceNumber={`INV-${order.orderNumber}`}
                date={order.date}
                paymentMethod="پرداخت آنلاین (زرین‌پال)"
                paymentStatus={isCancelled ? "لغو شده" : "پرداخت موفق"}
              />

              {!isCancelled && (
                <TrackingCard
                  trackingNumber="1029384756"
                  courier="تیپاکس"
                  estimatedDelivery="۲ الی ۳ روز کاری"
                />
              )}
            </div>

          </div>
        </motion.div>
      </AnimatePresence>
    </DashboardShell>
  );
}