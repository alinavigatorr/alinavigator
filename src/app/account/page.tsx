'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, Activity, Camera } from 'lucide-react';

export default function AccountDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('خوش آمدی 👋');

  useEffect(() => {
    // شبیه‌سازی لودینگ اطلاعات (Skeleton)
    const timer = setTimeout(() => setIsLoading(false), 800);

    // محاسبه متن زنده بر اساس ساعت
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('صبح بخیر علیرضا ☀️');
    else if (hour >= 12 && hour < 17) setGreeting('ظهر بخیر علیرضا 🌤️');
    else if (hour >= 17 && hour < 20) setGreeting('عصر بخیر علیرضا ⛅');
    else setGreeting('شب بخیر علیرضا 🌙');

    return () => clearTimeout(timer);
  }, []);

  // UI اسکلتون برای لحظه ورود
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-6">
          <div className="h-8 bg-white/5 rounded-lg w-48"></div>
          <div className="h-4 bg-white/5 rounded-md w-72 mt-1"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl mt-2"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8"
    >
      {/* متن داینامیک */}
      <div className="flex flex-col gap-1 border-b border-white/[0.06] pb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-white/40 font-medium mt-1">
          از طریق پیش‌خوان کاربری می‌توانی تمام فعالیت‌های حساب خود را مدیریت کنی.
        </p>
      </div>

      {/* کارت‌های آماری با Scale و Glow نرم */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_0_25px_rgba(255,255,255,0.03)] transition-colors cursor-pointer flex flex-col group">
          <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-white/50 group-hover:text-white transition-colors mb-4">
            <Package className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight mb-1">۲</p>
          <p className="text-xs font-medium text-white/40">سفارش در جریان</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_0_25px_rgba(255,255,255,0.03)] transition-colors cursor-pointer flex flex-col group">
          <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-white/50 group-hover:text-white transition-colors mb-4">
            <Heart className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight mb-1">۵</p>
          <p className="text-xs font-medium text-white/40">محصول در علاقه‌مندی‌ها</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.1] hover:shadow-[0_0_25px_rgba(255,255,255,0.03)] transition-colors cursor-pointer flex flex-col group">
          <div className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-white/50 group-hover:text-white transition-colors mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight mb-1">فعال</p>
          <p className="text-xs font-medium text-white/40">وضعیت حساب کاربری</p>
        </motion.div>
      </div>

      {/* بخش پروفایل: کاور (GitHub Style) + گرادیانت آواتار + تعامل آپلود */}
      <div className="mt-2 flex flex-col">
        <h2 className="text-[15px] font-bold text-white/90 tracking-tight mb-4">پروفایل کاربری</h2>

        <div className="relative rounded-2xl border border-white/[0.04] bg-white/[0.015] backdrop-blur-md flex flex-col overflow-hidden">
          
          {/* کاور پشتی (Cover Image Placeholder) */}
          <div className="h-32 w-full bg-gradient-to-r from-neutral-800 to-neutral-900 relative">
            <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          </div>

          {/* آواتار گرادیانتی با Initial (حرف A) */}
          <div className="absolute top-20 right-6 z-10 flex items-end gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full border-[5px] border-[#111111] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl overflow-hidden">
                <span className="text-4xl font-extrabold text-white tracking-tighter shadow-sm pt-1">A</span>
                
                {/* لایه تیره و آیکون آپلود در هاور */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* اطلاعات متنی زیر کاور */}
          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-col text-right">
              <p className="text-xl font-bold text-white tracking-tight">علیرضا شمس</p>
              <p className="text-sm font-medium text-white/40 mt-0.5" dir="ltr">@alinavigator</p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}