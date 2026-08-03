// src/components/reviews/review-item.tsx
'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MoreVertical, Trash2, Edit, Flag, Bookmark, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '../../types/community';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const [helpfulVoted, setHelpfulVoted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="py-8 border-b border-white/5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#14b8a6]/20 to-[#0ea5e9]/20 flex items-center justify-center text-white/80 font-bold border border-white/10 shrink-0">
            {review.userName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-white">{review.userName}</h4>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#10b981]/10 text-[#10b981] text-[10px] font-medium border border-[#10b981]/20">
                  <CheckCircle className="w-3 h-3" /> خریدار تایید شده
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center text-[#14b8a6]" aria-label={`امتیاز ${review.rating} از ۵`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
              <time className="text-xs text-white/40">{new Date(review.createdAt).toLocaleDateString('fa-IR')}</time>
            </div>
          </div>
        </div>

        {/* Action Menu (Report, Edit, Delete) */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-[#14b8a6] outline-none"
            aria-label="گزینه‌های نظر"
            aria-expanded={menuOpen}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute left-0 top-full mt-2 w-48 bg-[#12151c] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20"
              >
                {review.isOwner ? (
                  <>
                    <button className="w-full flex items-center gap-2 px-4 py-3 text-xs text-white/80 hover:bg-white/5 transition-colors text-right">
                      <Edit className="w-4 h-4" /> ویرایش دیدگاه
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-3 text-xs text-red-400 hover:bg-red-400/10 transition-colors text-right">
                      <Trash2 className="w-4 h-4" /> حذف دیدگاه
                    </button>
                  </>
                ) : (
                  <button className="w-full flex items-center gap-2 px-4 py-3 text-xs text-white/80 hover:bg-white/5 transition-colors text-right">
                    <Flag className="w-4 h-4" /> گزارش تخلف
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pl-0 md:pl-16">
        <h5 className="text-base font-bold text-white mb-2">{review.title}</h5>
        <p className="text-sm text-white/70 leading-relaxed mb-6">{review.comment}</p>

        {/* Media Gallery (Lazy Loaded) */}
        {review.media && review.media.length > 0 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 [scrollbar-width:none]">
            {review.media.map((media) => (
              <button key={media.id} className="relative w-24 h-24 rounded-xl border border-white/10 overflow-hidden shrink-0 group focus-visible:ring-2 focus-visible:ring-[#14b8a6] outline-none bg-white/5">
                <img src={media.url} alt={media.alt || 'تصویر کاربر'} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {media.type === 'video_placeholder' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Community Actions */}
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setHelpfulVoted(!helpfulVoted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] ${
              helpfulVoted ? 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/30' : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${helpfulVoted ? 'fill-current' : ''}`} />
            مفید بود ({review.helpfulVotes + (helpfulVoted ? 1 : 0)})
          </motion.button>
          
          <button className="p-2 text-white/40 hover:text-white transition-colors" title="ذخیره دیدگاه">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 text-white/40 hover:text-white transition-colors" title="اشتراک‌گذاری">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}