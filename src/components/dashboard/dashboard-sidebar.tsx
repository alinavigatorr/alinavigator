'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Heart, Clock, 
  MapPin, User, Shield, Settings, LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'پیشخوان', path: '/profile', icon: LayoutDashboard },
  { name: 'سفارشات', path: '/profile/orders', icon: ShoppingBag },
  { name: 'علاقه‌مندی‌ها', path: '/profile/wishlist', icon: Heart },
  { name: 'بازدیدهای اخیر', path: '/profile/recently-viewed', icon: Clock },
  { name: 'آدرس‌ها', path: '/profile/addresses', icon: MapPin },
  { name: 'اطلاعات حساب', path: '/profile/account', icon: User },
  { name: 'امنیت', path: '/profile/security', icon: Shield },
  { name: 'تنظیمات', path: '/profile/preferences', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col md:w-20 lg:w-64 h-screen sticky top-0 bg-white/[0.02] border-l border-white/5 backdrop-blur-xl transition-all duration-300 z-40">
      {/* لوگو یا عنوان (فقط دسکتاپ) */}
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/10">
        <span className="text-xl font-extrabold tracking-tighter text-white hidden lg:block">
          <span className="text-[rgb(var(--primary))]">Ali</span>Navigator
        </span>
        <span className="text-xl font-extrabold text-[rgb(var(--primary))] lg:hidden">
          A<span className="text-white">N</span>
        </span>
      </div>

      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto p-4 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              title={item.name}
              className={`flex items-center lg:justify-start justify-center gap-3 lg:px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 relative group ${
                isActive ? 'text-[rgb(var(--primary))]' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute inset-0 bg-[rgb(var(--primary))]/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10 shrink-0" aria-hidden="true" />
              <span className="font-medium text-sm relative z-10 hidden lg:block whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout}
          title="خروج از حساب"
          className="flex items-center lg:justify-start justify-center gap-3 lg:px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/50 w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="font-medium text-sm hidden lg:block whitespace-nowrap">خروج از حساب</span>
        </button>
      </div>
    </aside>
  );
}