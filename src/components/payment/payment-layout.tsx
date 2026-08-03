'use client';
import React from 'react';

export function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08080A] text-white flex flex-col pt-20 pb-10 px-4 md:px-8 selection:bg-[rgb(var(--primary))]/30">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-2 border-b border-white/10 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تکمیل پرداخت</h1>
          <p className="text-white/50 text-sm">لطفا روش پرداخت و اطلاعات صورت‌حساب خود را تایید کنید.</p>
        </header>
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}