'use client';

import React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface DashboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({ children, className = '' }: DashboardShellProps) {
  return (
    // استفاده از LazyMotion برای جداسازی و لود داینامیک کدهای سنگین انیمیشن
    <LazyMotion features={domAnimation} strict>
      <m.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 ${className}`}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}