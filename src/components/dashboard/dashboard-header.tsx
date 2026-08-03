'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell } from 'lucide-react';

export function DashboardHeader() {
  const { user } = useAuth();
  
  // Task 1: Static initial state for SSR to prevent Hydration Mismatch
  const [greeting, setGreeting] = useState('خوش آمدید');

  useEffect(() => {
    // Client-side execution only
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'صبح بخیر' : hour < 18 ? 'عصر بخیر' : 'شب بخیر');
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 md:px-8 bg-white/[0.02] backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] flex items-center justify-center font-bold border border-[rgb(var(--primary))]/30 shrink-0">
          {user?.firstName?.charAt(0) || 'U'}
        </div>
        
        <div className="flex flex-col">
          <span className="text-white/60 text-xs font-medium">{greeting}،</span>
          <span className="text-white font-bold text-sm truncate max-w-[150px] sm:max-w-xs">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>

      <button 
        aria-label="پیام‌ها و اعلان‌ها"
        className="relative p-2.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {/* Task 2: Replaced Hardcoded border-[#0F0F13] with standard border-black */}
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[rgb(var(--primary))] rounded-full border-2 border-black"></span>
      </button>
    </header>
  );
}