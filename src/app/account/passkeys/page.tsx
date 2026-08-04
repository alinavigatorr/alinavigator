'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, MonitorSmartphone, Trash2, ShieldCheck } from 'lucide-react';

const mockPasskeys = [
  { id: '1', name: 'آیفون ۱۴ پرو مکس', device: 'iOS - Safari', createdAt: '۱۴۰۲/۰۶/۱۵', lastUsed: 'امروز' },
];

export default function PasskeysPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterPasskey = () => {
    setIsRegistering(true);
    setTimeout(() => setIsRegistering(false), 2000);
  };

  const premiumEase = [0.16, 1, 0.3, 1];

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: premiumEase }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.06] pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Key className="w-6 h-6 text-[rgb(var(--primary))]" strokeWidth={2.5} />
            کلیدهای عبور
          </h1>
          <p className="text-sm text-white/40 font-medium">
            بدون نیاز به رمز عبور و در نهایت امنیت به حساب خود وارد شوید.
          </p>
        </div>
        <button
          onClick={handleRegisterPasskey}
          disabled={isRegistering}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--primary))]/50 disabled:opacity-50 shadow-[0_4px_14px_rgba(255,255,255,0.15)]"
        >
          {isRegistering ? (
            <motion.div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          افزودن کلید جدید
        </button>
      </div>

      <div className="bg-[rgb(var(--primary))]/[0.03] border border-[rgb(var(--primary))]/10 rounded-2xl p-5 flex gap-4 backdrop-blur-md">
        <ShieldCheck className="w-6 h-6 text-[rgb(var(--primary))]/80 shrink-0 mt-0.5" />
        <p className="text-sm text-white/60 leading-relaxed font-medium">
          کلیدهای عبور استاندارد جدید امنیت هستند. اطلاعات بیومتریک شما (اثر انگشت یا تشخیص چهره) هرگز دستگاه شما را ترک نمی‌کند و در برابر تمامی حملات فیشینگ مقاوم است.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[15px] font-bold text-white/90 tracking-tight">دستگاه‌های متصل</h2>
        
        {mockPasskeys.length > 0 ? (
          mockPasskeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-300 ease-out group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/50 group-hover:text-white/80 group-hover:scale-105 transition-all duration-300">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white tracking-tight">{key.name}</span>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-white/40">
                    <span>{key.device}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>آخرین استفاده: {key.lastUsed}</span>
                  </div>
                </div>
              </div>
              <button className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 ease-out active:scale-95" title="حذف دستگاه">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
            <Key className="w-10 h-10 text-white/10 mb-4" strokeWidth={1} />
            <p className="text-white/40 text-sm font-medium">در حال حاضر هیچ کلید عبوری ثبت نشده است.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}