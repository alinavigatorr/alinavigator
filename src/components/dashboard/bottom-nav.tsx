'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const bottomNavItems = [
  { name: 'پیشخوان', path: '/profile', icon: LayoutDashboard },
  { name: 'سفارشات', path: '/profile/orders', icon: ShoppingBag },
  { name: 'علاقه‌مندی', path: '/profile/wishlist', icon: Heart },
  { name: 'حساب', path: '/profile/account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/10 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/profile' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-16 h-14 relative focus:outline-none rounded-xl ${isActive ? 'text-[rgb(var(--primary))]' : 'text-white/50 hover:text-white'
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-[rgb(var(--primary))]/10 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 mb-1 relative z-10" aria-hidden="true" />
              <span className="text-[10px] font-medium relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}