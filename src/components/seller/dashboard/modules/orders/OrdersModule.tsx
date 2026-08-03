'use client';

import React, { useState } from 'react';
import { SellerOrderService } from '@/services/seller/orders/seller-order-service';
import { SellerOrderModel, SellerOrderStatus, SellerPaymentStatus } from '@/services/seller/orders/seller-order-types';

export function OrdersModule() {
  const [orders] = useState<SellerOrderModel[]>(SellerOrderService.getAllOrders());

  // تابع کمکی برای استایل و متن وضعیت‌های سفارش
  const getOrderStatusConfig = (status: SellerOrderStatus) => {
    switch (status) {
      case 'pending': return { label: 'در انتظار تایید', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'confirmed': return { label: 'تایید شده', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'preparing': return { label: 'در حال پردازش', classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'packed': return { label: 'بسته‌بندی شده', classes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'shipped': return { label: 'ارسال شده', classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'delivered': return { label: 'تحویل داده شده', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'cancelled': return { label: 'لغو شده', classes: 'bg-red-500/10 text-red-400 border-red-500/20' };
      case 'returned': return { label: 'مرجوع شده', classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
      case 'refunded': return { label: 'استرداد وجه', classes: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
      default: return { label: 'نامشخص', classes: 'bg-white/5 text-white/50 border-white/10' };
    }
  };

  // تابع کمکی برای استایل وضعیت پرداخت
  const getPaymentStatusConfig = (status: SellerPaymentStatus) => {
    switch (status) {
      case 'paid': return { label: 'پرداخت شده', classes: 'text-emerald-400 bg-emerald-500/10' };
      case 'pending': return { label: 'در انتظار پرداخت', classes: 'text-amber-400 bg-amber-500/10' };
      case 'failed': return { label: 'پرداخت ناموفق', classes: 'text-red-400 bg-red-500/10' };
      case 'refunded': return { label: 'برگشت وجه', classes: 'text-gray-400 bg-gray-500/10' };
      default: return { label: 'نامشخص', classes: 'text-white/50 bg-white/5' };
    }
  };

  // فرمت تاریخ
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر ماژول */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت سفارش‌ها</h1>
          <p className="text-sm text-white/50 mt-1">پیگیری و مدیریت سفارشات مشتریان، وضعیت ارسال و پرداخت‌ها.</p>
        </div>
      </div>

      {/* نوار ابزار (Toolbar - Placeholders) */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="جستجو با شماره سفارش، نام مشتری و..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <svg className="w-4 h-4 text-white/40 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 focus:outline-none appearance-none">
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار تایید</option>
            <option value="preparing">در حال پردازش</option>
            <option value="shipped">ارسال شده</option>
          </select>
          <button className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            خروجی اکسل
          </button>
        </div>
      </div>

      {/* لیست سفارشات (Order Cards) */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => {
          const orderStatus = getOrderStatusConfig(order.status);
          const paymentStatus = getPaymentStatusConfig(order.paymentStatus);

          return (
            <div key={order.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors flex flex-col gap-4">

              {/* هدر کارت سفارش */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{order.orderNumber}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${orderStatus.classes}`}>
                    {orderStatus.label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${paymentStatus.classes}`}>
                    {paymentStatus.label}
                  </span>
                </div>
                <div className="text-sm text-white/50">
                  ثبت: {formatDate(order.orderDate)}
                </div>
              </div>

              {/* بدنه کارت سفارش */}
              <div className="flex flex-col lg:flex-row gap-6">

                {/* خلاصه مشتری */}
                <div className="flex-1 space-y-2">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">اطلاعات خریدار</h4>
                  <div className="text-sm text-white/80">
                    <span className="font-medium">{order.customer.name}</span>
                    {order.customer.city && <span className="text-white/50 ml-2">({order.customer.city})</span>}
                  </div>
                  {order.customer.phone && (
                    <div className="text-sm text-white/50">تلفن: {order.customer.phone}</div>
                  )}
                  {order.shipmentTrackingCode && (
                    <div className="text-sm text-cyan-400 mt-2 bg-cyan-400/10 inline-block px-2 py-1 rounded">
                      کد رهگیری: {order.shipmentTrackingCode}
                    </div>
                  )}
                </div>

                {/* خلاصه محصولات */}
                <div className="flex-[2] space-y-3">
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">اقلام سفارش ({order.products.length} کالا)</h4>
                  <div className="flex flex-col gap-2">
                    {order.products.map(product => (
                      <div key={product.productId} className="flex items-center gap-3 bg-black/20 p-2 rounded-lg">
                        {product.thumbnailUrl ? (
                          <img src={product.thumbnailUrl} alt={product.title} className="w-10 h-10 rounded object-cover opacity-80" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-white/10"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{product.title}</p>
                          <p className="text-xs text-white/50">{product.quantity} عدد × {product.unitPrice.toLocaleString('fa-IR')} تومان</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* خلاصه مالی و عملیات سریع */}
                <div className="flex-1 flex flex-col justify-between items-end border-r border-white/5 pr-6">
                  <div className="text-right w-full mb-4 lg:mb-0">
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">مبلغ کل سفارش</h4>
                    <span className="text-xl font-bold text-emerald-400">{order.totalAmount.toLocaleString('fa-IR')} <span className="text-sm font-normal text-emerald-400/70">تومان</span></span>
                  </div>

                  {/* Quick Actions Placeholder */}
                  <div className="w-full">
                    <select className="w-full px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm focus:outline-none appearance-none cursor-pointer">
                      <option value="">عملیات سریع (Quick Actions)</option>
                      <option value="view">مشاهده جزئیات</option>
                      <option value="print_invoice">چاپ فاکتور</option>
                      <option value="tracking">ثبت کد رهگیری</option>
                      <option value="refund">استرداد وجه</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}