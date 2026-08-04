'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      
      {/* دکمه بازگشت به صفحه اصلی */}
      <div className="absolute top-6 right-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] rounded-lg p-2"
          aria-label="بازگشت به صفحه اصلی"
        >
          <ArrowRight className="w-4 h-4" /> بازگشت
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 pt-12 pb-12">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-3xl font-extrabold tracking-tighter text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] rounded-lg px-2">
            <span className="text-[rgb(var(--primary))]">Ali</span>Navigator
          </Link>
        </div>
        
        {/* کانتینر پریمیوم شیشه‌ای (بدون هاردکد رنگ) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/[0.02] border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl relative"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}