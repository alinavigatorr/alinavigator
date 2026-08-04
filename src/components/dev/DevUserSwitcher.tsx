'use client';

import React, { useState } from 'react';
import { useMockAuth } from '../../contexts/MockAuthContext';
import { SeedConfig } from '../../services/seed/seed-config';

export function DevUserSwitcher() {
  const { currentUser, switchUser, users } = useMockAuth();
  const [isOpen, setIsOpen] = useState(false);

  // بررسی امنیتی: این ابزار نباید هرگز در محیط Production نمایش داده شود
  if (!SeedConfig.isDevelopment()) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans text-right" dir="rtl">
      {/* حالت جمع‌شده (Floating Button) */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 bg-black/80 hover:bg-black text-white rounded-2xl shadow-2xl backdrop-blur-2xl border border-white/20 transition-all duration-300 hover:scale-105 group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div className="flex flex-col text-right">
            <span className="text-xs text-white/60 font-medium">محیط توسعه (Seed)</span>
            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              {currentUser.name}
            </span>
          </div>
          <span className="bg-white/10 px-2.5 py-1 rounded-xl text-xs text-emerald-300 font-semibold border border-white/10">
            {currentUser.role}
          </span>
        </button>
      ) : (
        /* حالت بازشده (Expanded Panel) */
        <div className="w-80 md:w-96 bg-black/90 text-white rounded-3xl shadow-2xl backdrop-blur-3xl border border-white/20 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* هدر پنل */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-white">تغییر کاربر و نقش تستی</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* کارت کاربر فعال فعلی */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border border-white/20 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/50">کاربر فعال فعلی:</p>
                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              </div>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                {currentUser.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs text-white/70">
              <div>سطح: <span className="text-white font-semibold">{currentUser.membershipTier}</span></div>
              <div>موجودی: <span className="text-emerald-400 font-semibold">{(currentUser.walletBalance).toLocaleString()} ت</span></div>
            </div>
          </div>

          {/* لیست انتخاب سریع کاربران و نقش‌ها */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto pl-1 custom-scrollbar">
            <p className="text-xs text-white/50 px-1 mb-1">انتخاب از بین ۸ نقش استاندارد:</p>
            {users.map((user) => {
              const isSelected = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-right transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent text-white/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md flex-shrink-0 ${
                    isSelected ? 'bg-emerald-500 text-black font-bold' : 'bg-white/10 text-white/70'
                  }`}>
                    {user.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* فوتر پنل */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-[10px] text-white/40">
              این ابزار صرفاً در محیط Localhost فعال است و در محیط Production رندر نمی‌شود.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}