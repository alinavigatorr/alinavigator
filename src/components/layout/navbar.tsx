'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { motion, useScroll, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/container';
import { useSearch } from '../../contexts/SearchContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext'; // اضافه شدن کانتکست سبد خرید
import { useAuthStore } from '../../store/authStore';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  
  const { openSearch } = useSearch();
  const { itemCount, isMounted: isWishlistMounted } = useWishlist();
  
  // استخراج وضعیت سبد خرید
  const { totalItems, toggleCart, isMounted: isCartMounted } = useCart();
  
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 20));
  }, [scrollY]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'محصولات', href: '/products' },
    { name: 'دسته‌بندی‌ها', href: '/categories' },
    { name: 'کاستوم بیلدها', href: '/custom-builds' },
    { name: 'پشتیبانی', href: '/support' },
  ];

  // آیکون‌های سمت چپ با لاجیک جدید سبد خرید و اصلاح مسیر علاقه‌مندی‌ها
  const actionIcons = [
    { icon: <Search className="w-5 h-5" />, label: 'جستجو', isButton: true, action: openSearch },
    { 
      icon: (
        <div className="relative flex items-center justify-center">
          <Heart className="w-5 h-5" />
          {isWishlistMounted && itemCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[rgb(var(--primary))] text-black text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(var(--primary),0.4)]">
              {itemCount}
            </span>
          )}
        </div>
      ), 
      label: 'علاقه‌مندی‌ها', 
      href: '/wishlist' // 🌟 مسیر اصلاح شد
    },
    { 
      icon: (
        <div className="relative flex items-center justify-center">
          <ShoppingCart className="w-5 h-5" />
          {isCartMounted && totalItems > 0 && (
            <span className="absolute -top-2.5 -right-2.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#14b8a6] text-black text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(20,184,166,0.4)]">
              {totalItems}
            </span>
          )}
        </div>
      ), 
      label: 'سبد خرید', 
      isButton: true, 
      action: toggleCart // باز کردن مینی کارت
    },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isScrolled || mobileMenuOpen 
          ? 'border-white/[0.06] shadow-2xl' 
          : 'border-transparent'
      }`}
      animate={{ height: isScrolled ? '70px' : '90px' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 🌟 سیستم Glassmorphism داینامیک */}
      <div 
        className={`absolute inset-0 -z-10 backdrop-blur-2xl transition-all duration-500 ${
          isScrolled || mobileMenuOpen 
            ? 'bg-[rgb(18,21,32)]/85' 
            : 'bg-transparent' 
        }`} 
      />

      <Container className="h-full flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center gap-2 group z-50 outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
          <motion.div dir="ltr" className="text-xl font-extrabold tracking-tighter text-white flex items-center gap-1">
            <span className="text-[rgb(var(--primary))]">Ali</span>Navigator
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link key={i} href={link.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 py-1 outline-none focus-visible:text-[rgb(var(--primary))]">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* منوی آیکون‌های سمت چپ (دسکتاپ) */}
        <div className="hidden md:flex items-center gap-2.5">
          {actionIcons.map((item, i) => {
            const IconWrapper = (
              <div className="p-2.5 rounded-full bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-[0.95]" title={item.label}>
                {item.icon}
              </div>
            );
            return item.isButton ? (
              <button key={i} onClick={item.action} aria-label={item.label} className="outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-full">{IconWrapper}</button>
            ) : (
              <Link key={i} href={item.href || '#'} aria-label={item.label} className="outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-full">{IconWrapper}</Link>
            );
          })}

          {/* بخش حساب کاربری */}
          {isAuthenticated ? (
            <div className="relative group ml-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/5 to-white/10 ring-1 ring-white/10 ring-offset-2 ring-offset-[#0a0a0a] flex items-center justify-center text-white/80 overflow-hidden cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:ring-white/30 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] active:scale-95">
                <User className="w-4 h-4" />
              </div>

              {/* منوی کشویی پروفایل */}
              <div className="absolute top-full left-0 mt-3 w-56 bg-[#000000] border border-white/[0.08] rounded-2xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] opacity-0 invisible scale-95 origin-top-left group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col p-1.5 z-50 overflow-hidden">
                <div style={{ backgroundColor: 'rgb(18, 21, 32)', opacity: 0.95 }} className="absolute inset-0 backdrop-blur-2xl -z-10"></div>
                
                <div className="px-3 py-3 border-b border-white/[0.06] mb-1.5 relative z-10">
                  <p className="text-sm font-semibold text-white tracking-tight truncate">علیرضا شمس</p>
                  <p className="text-xs text-white/40 truncate mt-0.5 font-medium" dir="ltr">@alinavigator</p>
                </div>
                <Link href="/account" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors duration-200 outline-none focus-visible:bg-white/[0.06] relative z-10">پیش‌خوان من</Link>
                <Link href="/account/orders" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors duration-200 outline-none focus-visible:bg-white/[0.06] relative z-10">سفارش‌ها</Link>
                <Link href="/wishlist" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors duration-200 outline-none focus-visible:bg-white/[0.06] relative z-10">علاقه‌مندی‌ها</Link>
                <Link href="/account/security" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors duration-200 outline-none focus-visible:bg-white/[0.06] relative z-10">امنیت (Passkeys)</Link>
                <div className="h-px bg-white/[0.06] my-1 relative z-10" />
                <button className="px-3 py-2 text-sm font-medium text-red-400/90 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors duration-200 flex items-center gap-2 outline-none focus-visible:bg-red-400/10 relative z-10">
                  <LogOut className="w-4 h-4" />
                  خروج از حساب
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="p-2.5 rounded-full bg-white/[0.02] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-95 ml-1 outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50" title="ورود / ثبت‌نام">
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* دکمه ساندویچی (موبایل) */}
        <button 
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors z-50 relative outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-lg" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="منوی موبایل"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {/* پنل منوی کشویی موبایل */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 h-[100dvh] bg-black/40 backdrop-blur-md md:hidden z-40"
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 border-b border-white/[0.08] px-6 pt-8 md:hidden flex flex-col gap-8 shadow-2xl z-50 max-h-[85dvh] overflow-y-auto overscroll-contain"
            >
              <div className="absolute inset-0 backdrop-blur-2xl bg-[rgb(18,21,32)]/95 -z-10"></div>

              <div className="flex items-center justify-around pb-8 border-b border-white/[0.06] shrink-0 relative z-10">
                {actionIcons.map((item, i) => {
                  const IconWrapper = (
                    <div className="p-4 rounded-2xl bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center active:scale-95">
                      {item.icon}
                    </div>
                  );
                  return item.isButton ? (
                    <button key={i} onClick={() => { setMobileMenuOpen(false); item.action!(); }} className="outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-2xl">{IconWrapper}</button>
                  ) : (
                    <Link key={i} href={item.href || '#'} onClick={() => setMobileMenuOpen(false)} className="outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-2xl">{IconWrapper}</Link>
                  );
                })}

                {isAuthenticated ? (
                  <div className="relative group">
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-2xl block">
                      <div className="p-4 rounded-2xl bg-gradient-to-tr from-[rgb(var(--primary))]/10 to-[rgb(var(--primary))]/5 border border-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center active:scale-95 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                        <User className="w-6 h-6" />
                      </div>
                    </Link>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 rounded-2xl block">
                    <div className="p-4 rounded-2xl bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center active:scale-95">
                      <User className="w-6 h-6" />
                    </div>
                  </Link>
                )}
              </div>

              <nav className="flex flex-col gap-2 pb-24 relative z-10">
                {navLinks.map((link, i) => (
                  <Link 
                    key={i} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-lg font-medium text-white/70 hover:text-white hover:bg-white/[0.03] rounded-xl px-4 py-3 transition-all duration-200 outline-none focus-visible:bg-white/[0.03]"
                  >
                    {link.name}
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <Link 
                    href="/account" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="text-lg font-semibold text-[rgb(var(--primary))] block px-4 py-3 mt-4 border-t border-white/[0.06] outline-none focus-visible:bg-[rgb(var(--primary))]/10 rounded-xl"
                  >
                    پیش‌خوان حساب کاربری
                  </Link>
                )}
                
                <div className="h-[env(safe-area-inset-bottom)] w-full"></div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}