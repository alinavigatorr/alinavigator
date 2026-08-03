'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CalendarDays } from 'lucide-react';
import { User } from '../../contexts/AuthContext'; // Import User type if needed, assuming it's exported

interface DashboardWelcomeCardProps {
  user: User | null;
}

export function DashboardWelcomeCard({ user }: DashboardWelcomeCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[rgb(var(--primary))]/10 blur-[80px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="flex items-center gap-5 relative z-10">
        <div className="w-16 h-16 rounded-full bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] flex items-center justify-center font-bold text-2xl border-2 border-[rgb(var(--primary))]/30 shrink-0">
          {user?.firstName?.charAt(0) || 'U'}
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            سلام، {user?.firstName || 'کاربر عزیز'} 👋
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium">به پیشخوان کاربری خود خوش آمدید.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-white/80">
          <CalendarDays className="w-4 h-4 text-white/50" aria-hidden="true" />
          <span>عضویت: ۱۴۰۲/۰۵</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 rounded-xl text-xs font-bold text-[rgb(var(--primary))]">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>عضو ویژه</span>
        </div>
      </div>
    </motion.div>
  );
}