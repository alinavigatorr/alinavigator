'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// تمام ایمپورت‌ها و تایپ‌های اصلی خودتان (مثل LoginFormValues و useAuthStore) را اینجا قرار دهید

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile';
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        // useAuthStore.getState().setUser(result.user);
        router.push(callbackUrl); // بازگشت به مقصد اولیه کاربر
      } else {
        // مدیریت خطای سرور
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 🌟 ریشه اصلی صفحه لاگین: مشکی مطلق زیرین + لایه rgb(18, 21, 32) با اوپاسیتی عمیق و پریمیوم
    <div className="min-h-screen w-full bg-[#000000] relative flex items-center justify-center p-6">
      
      {/* لایه عمیق رنگی روی پس‌زمینه مشکی */}
      <div style={{ backgroundColor: 'rgb(18, 21, 32)', opacity: 0.92 }} className="absolute inset-0 pointer-events-none z-0"></div>

      {/* هاله نورانی استودیو برای جذابیت بصری */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#14b8a6]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* باکس فرم لاگین با انیمیشن و افکت شیشه‌ای */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-2xl backdrop-blur-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">ورود به حساب کاربری</h1>
          <p className="text-sm text-white/50">به پنل مدیریت تجهیزات AliNavigator خوش آمدید</p>
        </div>

        {/* فرم و المان‌های ورودی شما */}
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-5">
          {/* محتوای فرم شما */}
        </form>
      </motion.div>
    </div>
  );
}