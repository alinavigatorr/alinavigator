// src/services/reviews/review-moderation.ts

import { ModerationResult, ModerationReason, RiskLevel, Confidence, SuggestedAction } from './review-flags';

export class ReviewModerationEngine {
  /**
   * ارزیابی محتوای نظر توسط هوش مصنوعی (مکان‌نما / Placeholder)
   * در فازهای آینده، این متد با API ارائه‌دهنده AI متصل خواهد شد.
   */
  static evaluateContent(title: string, body: string): ModerationResult {
    // --- PLACEHOLDER LOGIC ---
    const content = `${title} ${body}`.toLowerCase();
    
    const reasons: ModerationReason[] = [];
    let riskLevel: RiskLevel = 'NONE';
    let confidence: Confidence = 'HIGH'; // اطمینان سیستم از تصمیم‌گیری
    let aiScore = 95.0; // نمره ایمنی (۱۰۰ یعنی کاملا ایمن)
    
    // شبیه‌سازی تشخیص تبلیغات و اسپم (وجود لینک)
    if (content.includes('http://') || content.includes('https://') || content.includes('www.')) {
      reasons.push('SPAM');
      reasons.push('ADVERTISEMENT');
      riskLevel = 'MEDIUM';
      aiScore = 60.0;
    }

    // شبیه‌سازی تشخیص کلمات رکیک (فیلترینگ ساده به عنوان نمونه معماری)
    const mockProfanity = ['بدوبیراه', 'توهین']; 
    if (mockProfanity.some(word => content.includes(word))) {
      reasons.push('PROFANITY');
      riskLevel = 'HIGH';
      aiScore = 20.0;
    }

    if (reasons.length === 0) {
      reasons.push('CLEAN');
    }

    const isClean = reasons.includes('CLEAN');
    // اگر ریسک بالا باشد، نیازمند دخالت انسانی (Human Override) است
    const requiresHumanOverride = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';
    
    let suggestedAction: SuggestedAction = 'APPROVE';
    if (riskLevel === 'CRITICAL') {
      suggestedAction = 'REJECT';
    } else if (requiresHumanOverride || riskLevel === 'MEDIUM') {
      suggestedAction = 'FLAG_FOR_HUMAN';
    }

    return {
      isClean,
      riskLevel,
      confidence,
      reasons,
      aiScore,
      requiresHumanOverride,
      suggestedAction
    };
  }

  /**
   * تشخیص ارسال نظرات تکراری توسط یک کاربر (Repeated Review Detection)
   */
  static detectRepeatedSubmission(currentBody: string, recentSubmissionsBodies: string[]): boolean {
    const normalize = (text: string) => text.trim().toLowerCase();
    const normalizedCurrent = normalize(currentBody);
    
    // بررسی اینکه آیا دقیقاً همین متن اخیراً ارسال شده است یا خیر
    return recentSubmissionsBodies.some(pastBody => normalize(pastBody) === normalizedCurrent);
  }
}