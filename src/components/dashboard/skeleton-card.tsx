'use client';

import React from 'react';

export function SkeletonCard({ className = 'h-24' }: { className?: string }) {
  return (
    <div className={`w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse ${className}`} aria-hidden="true" />
  );
}