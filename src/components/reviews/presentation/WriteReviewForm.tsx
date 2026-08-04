'use client';

import React, { useState, FormEvent } from 'react';
import { useReviewContext } from '../context/ReviewContext';
import { ReviewSubmission } from '../../../domain/reviews/review-types';

export function WriteReviewForm() {
  const { setIsWritingReview, submitNewReview } = useReviewContext();

  // Form State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  
  // Pros & Cons State
  const [proInput, setProInput] = useState<string>('');
  const [conInput, setConInput] = useState<string>('');
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);

  // UX State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ rating?: string; title?: string; comment?: string }>({});

  // Constants
  const MAX_TITLE_LENGTH = 100;
  const MAX_COMMENT_LENGTH = 1000;

  // Handlers for Pros & Cons
  const handleAddPro = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    // Prevent form submission if triggered via button click inside form
    if ('preventDefault' in e && e.type === 'click') e.preventDefault();
    
    if (('key' in e && e.key === 'Enter') || e.type === 'click') {
      if ('preventDefault' in e) e.preventDefault(); // Prevent form submit on Enter
      if (proInput.trim() && !pros.includes(proInput.trim())) {
        setPros([...pros, proInput.trim()]);
        setProInput('');
      }
    }
  };

  const handleAddCon = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
    if ('preventDefault' in e && e.type === 'click') e.preventDefault();
    
    if (('key' in e && e.key === 'Enter') || e.type === 'click') {
      if ('preventDefault' in e) e.preventDefault(); // Prevent form submit on Enter
      if (conInput.trim() && !cons.includes(conInput.trim())) {
        setCons([...cons, conInput.trim()]);
        setConInput('');
      }
    }
  };

  const removePro = (index: number) => setPros(pros.filter((_, i) => i !== index));
  const removeCon = (index: number) => setCons(cons.filter((_, i) => i !== index));

  // Validation & Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: { rating?: string; title?: string; comment?: string } = {};
    if (rating === 0) newErrors.rating = 'لطفاً امتیاز خود را ثبت کنید.';
    if (title.trim().length < 3) newErrors.title = 'عنوان نظر باید حداقل ۳ کاراکتر باشد.';
    if (comment.trim().length < 10) newErrors.comment = 'متن نظر باید حداقل ۱۰ کاراکتر باشد.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const newReview: ReviewSubmission = {
      productId: 'prod-001', // در دنیای واقعی از کانتکست یا پراپ خوانده می‌شود
      author: { name: 'کاربر تستی', isAnonymous: false }, // Placeholder Auth
      rating,
      title: title.trim(),
      comment: comment.trim(),
      pros,
      cons,
      isVerifiedPurchase: true, // Placeholder Verification
    };

    try {
      await submitNewReview(newReview);
      // پس از موفقیت فرم خود به خود توسط کانتکست بسته می‌شود
    } catch (error) {
      console.error("Submission failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <h3 className="text-xl font-bold text-white">ثبت دیدگاه جدید</h3>
        <button 
          onClick={() => setIsWritingReview(false)}
          className="text-white/50 hover:text-white transition-colors"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Star Rating Selector */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">امتیاز شما به این محصول <span className="text-red-400">*</span></label>
          <div className="flex items-center gap-1" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => { setRating(star); setErrors({ ...errors, rating: undefined }); }}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'text-amber-400' : 'text-white/20'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-400 text-xs mt-2">{errors.rating}</p>}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">عنوان دیدگاه <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: undefined }); }}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="خلاصه نظر شما..."
            className={`w-full bg-black/50 border ${errors.title ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none p-3 text-sm transition-colors`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title ? <span className="text-red-400 text-xs">{errors.title}</span> : <span></span>}
            <span className="text-white/30 text-xs">{title.length} / {MAX_TITLE_LENGTH}</span>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <div>
            <label className="block text-sm font-medium text-emerald-400/80 mb-2">نقاط قوت</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={proInput}
                onChange={(e) => setProInput(e.target.value)}
                onKeyDown={handleAddPro}
                placeholder="مثلاً: کیفیت ساخت بالا"
                className="flex-1 bg-black/50 border border-emerald-500/20 rounded-xl text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none p-3 text-sm transition-colors"
              />
              <button type="button" onClick={handleAddPro} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors">+</button>
            </div>
            {pros.length > 0 && (
              <ul className="mt-3 space-y-2">
                {pros.map((pro, index) => (
                  <li key={index} className="flex items-center justify-between text-sm text-emerald-400/80 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                    <span>{pro}</span>
                    <button type="button" onClick={() => removePro(index)} className="hover:text-red-400 transition-colors">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cons */}
          <div>
            <label className="block text-sm font-medium text-red-400/80 mb-2">نقاط ضعف</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={conInput}
                onChange={(e) => setConInput(e.target.value)}
                onKeyDown={handleAddCon}
                placeholder="مثلاً: قیمت نسبتاً بالا"
                className="flex-1 bg-black/50 border border-red-500/20 rounded-xl text-white placeholder-white/30 focus:border-red-500 focus:outline-none p-3 text-sm transition-colors"
              />
              <button type="button" onClick={handleAddCon} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">+</button>
            </div>
            {cons.length > 0 && (
              <ul className="mt-3 space-y-2">
                {cons.map((con, index) => (
                  <li key={index} className="flex items-center justify-between text-sm text-red-400/80 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                    <span>{con}</span>
                    <button type="button" onClick={() => removeCon(index)} className="hover:text-red-400 transition-colors">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Review Body */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">متن دیدگاه <span className="text-red-400">*</span></label>
          <textarea
            value={comment}
            onChange={(e) => { setComment(e.target.value); setErrors({ ...errors, comment: undefined }); }}
            maxLength={MAX_COMMENT_LENGTH}
            rows={5}
            placeholder="تجربه خود را از خرید و استفاده از این کالا با دیگران به اشتراک بگذارید..."
            className={`w-full bg-black/50 border ${errors.comment ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none p-3 text-sm transition-colors resize-none`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment ? <span className="text-red-400 text-xs">{errors.comment}</span> : <span></span>}
            <span className="text-white/30 text-xs">{comment.length} / {MAX_COMMENT_LENGTH}</span>
          </div>
        </div>

        {/* Actions Placeholder */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>دیدگاه شما با وضعیت خریدار محصول ثبت خواهد شد.</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsWritingReview(false)}
              className="flex-1 sm:flex-none px-6 py-2.5 border border-white/10 hover:bg-white/5 text-white text-sm font-medium rounded-xl transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ثبت...
                </>
              ) : (
                'ثبت نهایی دیدگاه'
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}