/**
 * Campaign Domain Types
 * Core data structures for the Commerce Growth Platform Campaign Engine.
 */

 export type CampaignType = 
 | 'flash_sale'
 | 'seasonal'
 | 'brand'
 | 'category'
 | 'seller'
 | 'marketplace'
 | 'bundle';

export type CampaignStatus = 
 | 'draft'
 | 'scheduled'
 | 'active'
 | 'paused'
 | 'expired'
 | 'cancelled';

export interface CampaignRule {
 minCartAmount?: number;
 maxDiscountPercentage?: number;
 targetCategoryIds?: string[];
 targetBrandIds?: string[];
 targetSellerIds?: string[];
}

export interface Campaign {
 id: string;
 title: string;
 description: string;
 type: CampaignType;
 status: CampaignStatus;
 startDate: string; // ISO Date String
 endDate: string; // ISO Date String
 priority: number; // اعداد بالاتر = اولویت بیشتر
 isVisible: boolean;
 rules: CampaignRule;
}

export interface CampaignEvaluationContext {
 currentTime?: string; // اختیاری، برای تست یا زمان‌سنجی
 targetCategoryId?: string;
 targetBrandId?: string;
 targetSellerId?: string;
}

export interface CampaignResult {
 isValid: boolean;
 activeCampaign?: Campaign;
 currentStatus: CampaignStatus;
 conflictDetected: boolean;
 priority: number;
 reason: string;
}