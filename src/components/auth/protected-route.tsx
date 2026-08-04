'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // هدایت کاربر مهمان به صفحه ورود با ذخیره مسیر قبلی
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // نمایش وضعیت لودینگ برای جلوگیری از سوسو زدن (Flickering)
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--primary))]" />
          <p className="text-white/50 text-sm">در حال بررسی اطلاعات کاربری...</p>
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}