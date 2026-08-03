'use client';

import React from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { CheckCircle2, Download, Mail, ChevronRight, PackageSearch } from 'lucide-react';
import Link from 'next/link';
import { OrderTimeline } from './order-timeline';

export const ReceiptCard = React.memo(function ReceiptCard() {
  const { paymentSummary, selectedMethod, billingInformation } = usePayment();
  const mockOrderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const mockTxnRef = "TXN-" + Math.floor(10000000 + Math.random() * 90000000);
  const today = new Date().toLocaleDateString('fa-IR');

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 w-full max-w-2xl mx-auto" aria-live="polite">
      
      {/* Header رسید */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-[rgb(var(--primary))]/10 flex items-center justify-center mb-2 border border-[rgb(var(--primary))]/20">
          <CheckCircle2 className="w-8 h-8 text-[rgb(var(--primary))]" />
        </div>
        <h2 className="text-2xl font-bold text-white">پرداخت موفقیت‌آمیز بود</h2>
        <p className="text-white/50 text-sm">رسید دیجیتال شما صادر شد. سفارش در حال پردازش است.</p>
      </div>

      {/* اطلاعات تراکنش */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-5 flex flex-col gap-3 text-sm mt-2">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-white/50">شماره سفارش</span>
          <span className="text-white font-mono font-bold tracking-widest">{mockOrderNumber}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-white/50">کد رهگیری تراکنش</span>
          <span className="text-white font-mono text-xs sm:text-sm">{mockTxnRef}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-white/50">تاریخ ثبت</span>
          <span className="text-white">{today}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="text-white/50">روش پرداخت</span>
          <span className="text-white">{selectedMethod?.name || 'نامشخص'}</span>
        </div>
        <div className="flex justify-between items-start border-b border-white/5 pb-3 pt-1">
          <span className="text-white/50 whitespace-nowrap ml-4">آدرس ارسال</span>
          <span className="text-white text-left leading-relaxed text-xs">{billingInformation?.fullAddress || 'نامشخص'}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-white/50">مبلغ پرداخت شده</span>
          <span className="text-[rgb(var(--primary))] font-bold text-lg">{paymentSummary.total.toLocaleString()} <span className="text-xs font-normal opacity-70">تومان</span></span>
        </div>
      </div>

      {/* تایم‌لاین ویژوال (Order Timeline) */}
      <OrderTimeline />

      {/* دکمه‌های اکشن فرمالیته (Placeholder) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50">
          <Download className="w-4 h-4" /> دانلود رسید
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/50">
          <Mail className="w-4 h-4" /> ارسال به ایمیل
        </button>
      </div>

      {/* دکمه‌های مسیردهی */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
        <Link href="/profile/orders" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-black text-sm font-bold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50">
          <PackageSearch className="w-4 h-4" /> پیگیری سفارش
        </Link>
        <Link href="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium rounded-xl transition-colors focus:outline-none">
          بازگشت به فروشگاه <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
});