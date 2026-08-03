'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';

interface InvoiceCardProps {
  invoiceNumber: string;
  date: string;
  paymentMethod: string;
  paymentStatus: string;
}

export const InvoiceCard = React.memo(function InvoiceCard({ invoiceNumber, date, paymentMethod, paymentStatus }: InvoiceCardProps) {
  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4" aria-label="فاکتور و پرداخت">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">فاکتور سفارش</h3>
          <p className="text-white/50 text-xs mt-0.5">شماره: {invoiceNumber}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-white/50 text-xs">تاریخ پرداخت</span>
          <span className="text-white font-medium">{date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50 text-xs">درگاه پرداخت</span>
          <span className="text-white font-medium">{paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50 text-xs">وضعیت</span>
          <span className="text-green-400 font-medium">{paymentStatus}</span>
        </div>
      </div>

      <button className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[rgb(var(--primary))]/10 hover:bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] text-sm font-bold rounded-xl transition-colors border border-[rgb(var(--primary))]/20 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50">
        <Download className="w-4 h-4" /> دانلود فاکتور (PDF)
      </button>
    </section>
  );
});