'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
  trend?: { value: string; isPositive: boolean }; // 🌟 Added Trend
}

export function DashboardStatCard({ title, value, icon: Icon, delay = 0, trend }: DashboardStatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-md transition-colors hover:bg-white/[0.07] relative"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[rgb(var(--primary))] shrink-0">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-white/50 text-xs font-medium mb-0.5">{title}</span>
        <div className="flex items-center justify-between">
          <span className="text-white font-bold text-xl">{value}</span>
          {/* Trend Indicator */}
          {trend && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${trend.isPositive ? 'bg-green-400/10 text-green-400' : 'bg-white/5 text-white/50'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}