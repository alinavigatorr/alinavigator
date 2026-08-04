'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, Shield, Key, MonitorSmartphone, Bell, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../../components/ui/container';

const accountLinks = [
  { href: '/account', label: 'پیش‌خوان / پروفایل', icon: <User className="w-4 h-4" /> },
  { href: '/account/orders', label: 'سفارش‌ها', icon: <Package className="w-4 h-4" /> },
  { href: '/account/wishlist', label: 'علاقه‌مندی‌ها', icon: <Heart className="w-4 h-4" /> },
  { href: '/account/addresses', label: 'آدرس‌ها', icon: <MapPin className="w-4 h-4" /> },
  { href: '/account/security', label: 'امنیت و گذرواژه', icon: <Shield className="w-4 h-4" /> },
  { href: '/account/passkeys', label: 'کلیدهای عبور (Passkeys)', icon: <Key className="w-4 h-4" /> },
  { href: '/account/devices', label: 'مدیریت دستگاه‌ها', icon: <MonitorSmartphone className="w-4 h-4" /> },
  { href: '/account/notifications', label: 'اطلاع‌رسانی‌ها', icon: <Bell className="w-4 h-4" /> },
  { href: '/account/settings', label: 'تنظیمات', icon: <Settings className="w-4 h-4" /> },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleLogout = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/login');
    }, 200);
  };

  return (
    <motion.div
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen pt-[120px] pb-24 bg-[#000000] selection:bg-[rgb(var(--primary))]/30 relative"
    >
      {/* 🌟 لایه خالص: مشکی مطلق زیرین + لایه rgb(18, 21, 32) با اوپاسیتی عمیق (بدون گرادیانت وسط) */}
      <div style={{ backgroundColor: 'rgb(18, 21, 32)', opacity: 0.92 }} className="absolute inset-0 pointer-events-none z-0"></div>

      <Container className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3">
          <nav className="flex flex-col gap-0.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-sm backdrop-blur-xl">
            {accountLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/account' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out group ${
                    isActive ? 'text-white bg-white/[0.04]' : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="active-nav-indicator" className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-[rgb(var(--primary))] rounded-l-full shadow-[0_0_10px_rgb(var(--primary))]" />
                  )}
                  <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[rgb(var(--primary))]' : 'group-hover:scale-110'}`}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
            
            <div className="h-px w-full bg-white/[0.05] my-2" />
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 ease-out w-full text-right"
            >
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-9 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 md:p-8 rounded-2xl bg-white/[0.015] border border-white/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.12)] min-h-[500px] backdrop-blur-3xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

      </Container>
    </motion.div>
  );
}