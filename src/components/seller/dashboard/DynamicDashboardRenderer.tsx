'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { SellerDashboardRegistry } from '../../../services/seller/dashboard/seller-dashboard-registry';

interface DynamicDashboardRendererProps {
  userPermissions: string[]; // دسترسی‌های کاربر فعال
  activeFeatureFlags: Record<string, boolean>; // لیست Feature Flag های روشن
  currentPath: string; // مسیر فعلی برای تشخیص اکتیو بودن منوها
  children: React.ReactNode; // محتوای داینامیک ماژول‌ها که توسط روتر در اینجا تزریق می‌شود
}

export function DynamicDashboardRenderer({
  userPermissions,
  activeFeatureFlags,
  currentPath,
  children
}: DynamicDashboardRendererProps) {
  
  // خواندن، فیلتر کردن و آماده‌سازی ساختار ناوبری به صورت کاملاً داینامیک
  const sidebarStructure = useMemo(() => {
    // ۱. دریافت سکشن‌های مرتب‌شده از رجیستری
    const sections = SellerDashboardRegistry.getSections();

    return sections.map(section => {
      // ۲. دریافت ماژول‌های هر سکشن (که خودشان در رجیستری بر اساس sortOrder مرتب شده‌اند)
      const modules = SellerDashboardRegistry.getModulesBySection(section.id)
        .filter(mod => {
          // فیلتر ۱: بررسی وضعیت کلی و نمایش (Visibility)
          if (!mod.isActive || mod.isHidden) return false;

          // فیلتر ۲: بررسی سطوح دسترسی (Permissions)
          // فروشنده باید تمام دسترسی‌های الزامی ماژول را داشته باشد
          const hasPermissions = mod.requiredPermissions.every(permission =>
            userPermissions.includes(permission)
          );
          if (!hasPermissions) return false;

          // فیلتر ۳: بررسی Feature Flags
          // اگر ماژول پشت یک فلگ باشد، آن فلگ حتماً باید روشن باشد
          if (mod.featureFlag && !activeFeatureFlags[mod.featureFlag]) {
            return false;
          }

          return true;
        });

      return {
        ...section,
        modules
      };
    }).filter(section => section.modules.length > 0); // پنهان‌سازی سکشن‌هایی که هیچ ماژول مجازی برای این کاربر ندارند
  }, [userPermissions, activeFeatureFlags]);

  return (
    <div className="min-h-screen bg-black text-white flex font-sans" dir="rtl">
      {/* سایدبار پویا (Dynamic Sidebar) */}
      <aside className="w-64 bg-white/5 border-l border-white/10 hidden md:flex flex-col backdrop-blur-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-cyan-400">
            پنل فروشندگان
          </h2>
          <p className="text-xs text-white/40 mt-1">Dynamic Renderer Active</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {sidebarStructure.map(section => (
            <div key={section.id}>
              <h3 className="text-xs font-semibold text-white/40 mb-3 px-3 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1.5">
                {section.modules.map(mod => {
                  const isActivePath = currentPath === mod.path || currentPath.startsWith(`${mod.path}/`);
                  return (
                    <li key={mod.id}>
                      <Link
                        href={mod.path}
                        title={mod.description}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isActivePath
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        {/* 
                          جایگاه رندر داینامیک آیکون بر اساس Icon Identifier 
                          (در این فاز از نام آیکون به عنوان Placeholder استفاده شده است)
                        */}
                        <div className={`w-5 h-5 flex flex-shrink-0 items-center justify-center rounded-md ${isActivePath ? 'text-emerald-400' : 'text-white/50'}`}>
                          <span className="text-[9px] font-mono opacity-50 truncate max-w-[20px]">
                            {mod.iconIdentifier?.split('-')[0]}
                          </span>
                        </div>
                        
                        <span className="text-sm font-medium truncate">{mod.title}</span>

                        {/* نشان‌گر ماژول‌هایی که استراتژی Lazy Load دارند (مخصوص توسعه‌دهنده) */}
                        {mod.lazyLoad && (
                          <span className="mr-auto w-1.5 h-1.5 rounded-full bg-blue-500/50" title="Lazy Loaded Module"></span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* ناحیه محتوای اصلی (Main Content Area) */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* هدر داینامیک داشبورد */}
        <header className="h-16 bg-white/5 border-b border-white/10 flex items-center px-6 backdrop-blur-md">
          <div className="flex items-center text-sm text-white/50">
             وضعیت رجیستری: <span className="text-emerald-400 mr-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               متصل و فعال
             </span>
          </div>
        </header>

        {/* 
          محل تزریق داینامیک ماژول‌ها
          در این بخش کامپوننت‌های مربوط به هر ماژول که به صورت Lazy Load یا عادی 
          توسط Next.js فراخوانی شده‌اند قرار می‌گیرند.
        */}
        <div className="flex-1 overflow-y-auto p-6 relative">
           {children}
        </div>
      </main>
    </div>
  );
}