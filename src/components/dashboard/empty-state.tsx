'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-white/[0.02] border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/[0.03] transition-colors duration-300"
    >
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-5 shadow-inner">
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-white font-bold mb-2 tracking-tight">{title}</h3>
      <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      {actionHref && actionLabel && (
        <Link 
          href={actionHref} 
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}