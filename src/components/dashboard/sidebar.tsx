'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, ShoppingBag, Heart, MapPin, 
  User, Shield, Bell, LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'پیشخوان', path: '/profile', icon: LayoutDashboard },
  { name: 'سفارشات من', path: '/profile/orders', icon: ShoppingBag },
  { name: 'علاقه‌مندی‌ها', path: '/profile/wishlist', icon: Heart },
  { name: 'آدرس‌ها', path: '/profile/addresses', icon: MapPin },
  { name: 'اطلاعات حساب', path: '/profile/account', icon: User },
  { name: 'امنیت', path: '/profile/security', icon: Shield },
  { name: 'پیام‌ها', path: '/profile/notifications', icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-80px)] sticky top-20 bg-white/[0.02] border-l border-white/5 backdrop-blur-xl p-6 overflow-y-auto">
      {/* User Mini Profile */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
        <div className="w-12 h-12 rounded-full bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] flex items-center justify-center font-bold text-lg border border-[rgb(var(--primary))]/30">
          {user?.firstName?.charAt(0) || 'U'}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white font-bold truncate">{user?.firstName} {user?.lastName}</span>
          <span className="text-white/50 text-xs truncate" dir="ltr">{user?.email}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 relative group ${
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
              <Icon className="w-5 h-5 relative z-10" aria-hidden="true" />
              <span className="font-medium text-sm relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button 
        onClick={logout}
        className="mt-8 flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/50 w-full text-right"
      >
        <LogOut className="w-5 h-5" aria-hidden="true" />
        <span className="font-medium text-sm">خروج از حساب</span>
      </button>
    </aside>
  );
}