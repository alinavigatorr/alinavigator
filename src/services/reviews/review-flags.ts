// src/services/reviews/review-flags.ts

export type RiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Confidence = 'LOW' | 'MEDIUM' | 'HIGH' | 'CERTAIN';

export type ModerationReason = 
  | 'CLEAN'
  | 'PROFANITY'
  | 'SPAM'
  | 'ADVERTISEMENT'
  | 'REPEATED_REVIEW'
  | 'INAPPROPRIATE_MEDIA';

export type SuggestedAction = 
  | 'APPROVE'
  | 'REJECT'
  | 'FLAG_FOR_HUMAN'
  | 'HIDE_TEMPORARILY';

export interface ModerationResult {
  isClean: boolean;
  riskLevel: RiskLevel;
  confidence: Confidence;
  reasons: ModerationReason[];
  aiScore: number; // Placeholder for AI confidence score (e.g., 0.0 to 100.0)
  requiresHumanOverride: boolean;
  suggestedAction: SuggestedAction;
}