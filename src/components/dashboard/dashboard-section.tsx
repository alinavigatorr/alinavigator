'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface DashboardSectionProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  children: React.ReactNode;
}

export function DashboardSection({ title, actionLabel, actionHref, children }: DashboardSectionProps) {
  return (
    <section className="flex flex-col gap-4 w-full" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        {actionHref && actionLabel && (
          <Link 
            href={actionHref} 
            className="text-sm font-medium text-[rgb(var(--primary))] hover:text-white transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 rounded px-1"
          >
            {actionLabel} <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}