'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Landmark, Zap } from 'lucide-react';

export interface CheckoutSession {
  step: number;
  paymentMethod: string;
}

export default function TestCheckoutPage() {
  const [session, setSession] = useState<CheckoutSession>({
    step: 3, // مستقیم میبریم روی مرحله پرداخت تا روش‌ها رو ببینید
    paymentMethod: 'gateway',
  });

  const totalAmount = 15400000; // مثال: ۱۵ میلیون و چهارصد هزار تومان
  const installmentAmount = Math.round(totalAmount / 4);

  const methods = [
    {
      id: 'gateway',
      title: 'درگاه پرداخت اینترنتی (شتاب)',
      description: 'پرداخت امن با کلیه کارت‌های عضو شتاب (ملت، سداد، زرین‌پال)',
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      badge: 'متداول',
    },
    {
      id: 'snapppay',
      title: 'خرید اقساطی اسنپ‌پی (BNPL)',
      description: `پرداخت در ۴ قسط ماهانه هر کدام حدود ${installmentAmount.toLocaleString('fa-IR')} تومان بدون کارمزد`,
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      badge: 'اعتباری / اقساطی',
    },
    {
      id: 'digipay',
      title: 'سرویس اعتباری دیجی‌پی',
      description: 'استفاده از اعتبار اقساطی سازمانی یا بانکی برای خرید تجهیزات',
      icon: <Wallet className="w-5 h-5 text-purple-400" />,
      badge: 'اقساطی',
    },
    {
      id: 'card_to_card',
      title: 'کارت به کارت / واریز حقوقی',
      description: 'مناسب برای سفارش‌های عمده یا سازمانی',
      icon: <Landmark className="w-5 h-5 text-blue-400" />,
      badge: 'آفلاین',
    },
  ];

  return (
    <main className="min-h-screen bg-[#08080A] text-white p-6 sm:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-extrabold text-center mb-8">تست زیرساخت درگاه‌های پرداخت و اقساطی (BNPL)</h1>
        
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white/80 mb-4">انتخاب روش پرداخت</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {methods.map((method) => {
              const isSelected = session.paymentMethod === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSession({ ...session, paymentMethod: method.id })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))] shadow-lg shadow-[rgb(var(--primary))]/5'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-3 rounded-xl border ${isSelected ? 'bg-[rgb(var(--primary))]/20 border-[rgb(var(--primary))]/30' : 'bg-white/5 border-white/10'}`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{method.title}</h4>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        isSelected ? 'bg-[rgb(var(--primary))] text-black font-bold' : 'bg-white/10 text-white/60'
                      }`}>
                        {method.badge}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{method.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/50">مبلغ قابل پرداخت: <strong className="text-white text-sm">{totalAmount.toLocaleString('fa-IR')} تومان</strong></span>
            <button 
              onClick={() => alert(`پرداخت با موفقیت از طریق روش [${session.paymentMethod}] ثبت شد!`)}
              className="bg-[rgb(var(--primary))] text-black font-bold px-6 py-3 rounded-xl text-sm transition-all hover:opacity-90"
            >
              تایید و انتقال به درگاه
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}