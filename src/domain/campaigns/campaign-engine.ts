/**
 * Campaign Engine
 * Core validation and resolution rules for the Commerce Growth Platform Campaigns.
 */

 import { Campaign, CampaignEvaluationContext, CampaignResult, CampaignStatus } from './campaign-types';

 export class CampaignEngine {
   /**
    * Evaluates a list of candidate campaigns against a given context to resolve the winning campaign.
    * Handles scheduling, scope matching, conflicts, and priority resolution.
    */
   public static evaluateCandidates(campaigns: Campaign[], context: CampaignEvaluationContext): CampaignResult {
     const now = context.currentTime ? new Date(context.currentTime) : new Date();
 
     // 1. فیلتر کردن کمپین‌های معتبر بر اساس زمان، وضعیت و تطابق با هدف (Target Audience)
     const validCampaigns = campaigns.filter(campaign => {
       // کمپین‌های منقضی، لغوشده یا پیش‌نویس نمی‌توانند فعال شوند
       if (['expired', 'cancelled', 'draft', 'paused'].includes(campaign.status)) {
         return false;
       }
 
       const start = new Date(campaign.startDate);
       const end = new Date(campaign.endDate);
 
       // کمپین فقط در بازه زمانی خودش می‌تواند فعال باشد
       if (now < start || now > end) {
         return false;
       }
 
       // بررسی تطابق با اهداف (مانند دسته‌بندی خاص، برند یا فروشنده)
       if (context.targetCategoryId && campaign.rules.targetCategoryIds?.length) {
         if (!campaign.rules.targetCategoryIds.includes(context.targetCategoryId)) return false;
       }
       if (context.targetBrandId && campaign.rules.targetBrandIds?.length) {
         if (!campaign.rules.targetBrandIds.includes(context.targetBrandId)) return false;
       }
       if (context.targetSellerId && campaign.rules.targetSellerIds?.length) {
         if (!campaign.rules.targetSellerIds.includes(context.targetSellerId)) return false;
       }
 
       return true;
     });
 
     // اگر هیچ کمپینی معتبر نبود
     if (validCampaigns.length === 0) {
       return {
         isValid: false,
         currentStatus: 'expired',
         conflictDetected: false,
         priority: 0,
         reason: 'NO_VALID_CAMPAIGN_FOUND'
       };
     }
 
     // 2. مرتب‌سازی بر اساس اولویت (عدد بزرگتر = اولویت بالاتر)
     validCampaigns.sort((a, b) => b.priority - a.priority);
 
     // 3. تشخیص تداخل (مانند وجود بیش از یک Flash Sale فعال در یک Scope)
     const flashSales = validCampaigns.filter(c => c.type === 'flash_sale');
     const conflictDetected = flashSales.length > 1;
 
     // 4. اعمال قانون: کمپین با اولویت بالاتر برنده است (ایندکس 0 پس از مرتب‌سازی)
     const winner = validCampaigns[0];
 
     return {
       isValid: true,
       activeCampaign: winner,
       currentStatus: 'active', // برنده به عنوان فعال شناخته می‌شود
       conflictDetected: conflictDetected,
       priority: winner.priority,
       reason: conflictDetected 
         ? 'MULTIPLE_VALID_CAMPAIGNS_RESOLVED_BY_PRIORITY' 
         : 'VALID_CAMPAIGN_APPLIED'
     };
   }
 
   /**
    * Helper function to determine the real-time status of a campaign based on current date.
    */
   public static resolveRealTimeStatus(campaign: Campaign, currentTime?: string): CampaignStatus {
     if (campaign.status === 'cancelled' || campaign.status === 'draft') {
       return campaign.status;
     }
 
     const now = currentTime ? new Date(currentTime) : new Date();
     const start = new Date(campaign.startDate);
     const end = new Date(campaign.endDate);
 
     if (now > end) {
       return 'expired';
     }
     
     if (now >= start && now <= end && campaign.status !== 'paused') {
       return 'active';
     }
     
     if (now < start) {
       return 'scheduled';
     }
 
     return campaign.status;
   }
 }