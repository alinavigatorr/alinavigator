'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { usePayment } from '../../contexts/PaymentContext';

export const OrderNotes = React.memo(function OrderNotes() {
  const { setOrderNotes } = usePayment();
  const [localNote, setLocalNote] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_LENGTH = 250;

  useEffect(() => {
    const handler = setTimeout(() => setOrderNotes(localNote), 500);
    return () => clearTimeout(handler);
  }, [localNote, setOrderNotes]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNote(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-3" aria-label="یادداشت سفارش">
      <h3 className="text-white font-bold text-sm flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-white/50" /> یادداشت سفارش (اختیاری)
      </h3>
      <div className="relative">
        <textarea
          ref={textareaRef}
          maxLength={MAX_LENGTH}
          value={localNote}
          onChange={handleInput}
          placeholder="اگر نکته‌ای برای ارسال دارید اینجا بنویسید..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 resize-none min-h-[80px] overflow-hidden transition-colors"
          aria-label="فیلد یادداشت سفارش"
        />
        <span className={`absolute bottom-3 left-3 text-xs ${localNote.length >= MAX_LENGTH ? 'text-red-400' : 'text-white/30'}`}>
          {localNote.length} / {MAX_LENGTH}
        </span>
      </div>
    </section>
  );
});