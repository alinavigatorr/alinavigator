'use client';

import React from 'react';
import { HelpCircle, ThumbsUp, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function QnASection() {
  return (
    <section className="mt-16" aria-labelledby="qna-heading">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 id="qna-heading" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#14b8a6]" />
            پرسش و پاسخ
          </h2>
          <p className="text-sm text-white/50 mt-1">سوالات خود را بپرسید یا به دیگران کمک کنید.</p>
        </div>
        <button className="shrink-0 px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 border border-white/10 transition-colors">
          ثبت پرسش جدید
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-8">
          
          {/* سوال */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm font-bold shrink-0">Q</div>
            <div>
              <p className="text-base font-bold text-white mb-2 leading-relaxed">آیا این محصول برای کارهای سنگین و طولانی مدت مناسب است؟</p>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span>توسط رضا ک.</span>
                <span>۲۵ آبان ۱۴۰۲</span>
              </div>
            </div>
          </div>

          {/* پاسخ ادمین */}
          <div className="flex gap-4 ml-0 md:ml-14 pl-4 md:pl-6 border-r-2 border-[#14b8a6]">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#14b8a6]/20 border border-[#14b8a6]/30 text-[#14b8a6]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-[#14b8a6]">AliNavigator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20">پاسخ تایید شده</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">بله، کاملاً مناسب است و به دلیل متریال با کیفیت در استفاده‌های طولانی افت عملکرد نخواهد داشت.</p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> ۲۴ مفید بود
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// این خط الزامی است تا import داینامیک در صفحه محصول به درستی کار کند
export default QnASection;