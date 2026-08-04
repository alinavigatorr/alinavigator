'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon, ChevronLeft } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  delay?: number;
}

export function QuickActionCard({ title, description, icon: Icon, href, delay = 0 }: QuickActionCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link 
        href={href}
        aria-label={`رفتن به بخش ${title}`}
        className="group flex items-start gap-4 p-5 h-full bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 min-h-[44px]"
      >
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/70 group-hover:text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--primary))]/10 transition-colors shrink-0">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-white font-medium text-sm transition-colors group-hover:text-[rgb(var(--primary))]">{title}</h3>
          <p className="text-white/50 text-xs mt-1.5 leading-relaxed">{description}</p>
        </div>
        <ChevronLeft className="w-5 h-5 text-white/20 group-hover:text-white transition-colors shrink-0 mt-2.5" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}