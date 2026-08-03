'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Settings, MessageSquare, HelpCircle, Download } from 'lucide-react';

const TABS = [
  { id: 'desc', label: 'توضیحات معرفی', icon: FileText },
  { id: 'specs', label: 'مشخصات فنی', icon: Settings },
  { id: 'reviews', label: 'نقد و بررسی (۲۴)', icon: MessageSquare },
  { id: 'questions', label: 'پرسش و پاسخ', icon: HelpCircle },
  { id: 'downloads', label: 'دانلودها', icon: Download },
];

export function ProductTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="mt-16 flex flex-col">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-white/10 pb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors outline-none whitespace-nowrap ${
                isActive ? 'text-[rgb(var(--primary))]' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="pdp-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--primary))] shadow-[0_-2px_10px_rgba(var(--primary),0.5)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="py-8 min-h-[300px]">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="text-white/70 leading-relaxed text-sm"
        >
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">طراحی شده برای حرفه‌ای‌ها</h3>
              <p>این محصول با استفاده از بهترین متریال‌ها و جدیدترین تکنولوژی روز دنیا ساخته شده است تا نیازهای حرفه‌ای‌ترین کاربران را برطرف کند...</p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex border-b border-white/5 py-3"><span className="w-1/3 text-white/40">وزن</span><span className="font-medium text-white">۱.۲ کیلوگرم</span></div>
              <div className="flex border-b border-white/5 py-3"><span className="w-1/3 text-white/40">ابعاد</span><span className="font-medium text-white">۳۰x۲۰x۵ سانتی‌متر</span></div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <MessageSquare className="w-10 h-10 text-white/20 mb-4" />
              <p className="text-white/50">هنوز دیدگاهی ثبت نشده است.</p>
              <button className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors">ثبت اولین دیدگاه</button>
            </div>
          )}
          {/* Other tabs follow the same pattern... */}
        </motion.div>
      </div>
    </div>
  );
}