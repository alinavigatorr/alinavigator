/**
 * Campaign Service
 * Business service layer for campaign operations and engine integration.
 */

 import { Campaign, CampaignEvaluationContext, CampaignResult } from '../../domain/campaigns/campaign-types';
 import { CampaignEngine } from '../../domain/campaigns/campaign-engine';
 
 export interface CampaignDataSource {
   getCampaignById(id: string): Promise<Campaign | null>;
   getAllCampaigns(): Promise<Campaign[]>;
 }
 
 /**
  * Mock Data Source for Campaign Development & Testing
  */
 export class MockCampaignDataSource implements CampaignDataSource {
   private campaigns: Campaign[] = [
     {
       id: 'camp-1',
       title: 'حراج تابستانه',
       description: 'تخفیف‌های ویژه فصل تابستان روی تمامی محصولات',
       type: 'seasonal',
       status: 'active',
       startDate: '2026-06-01T00:00:00.000Z',
       endDate: '2026-09-01T23:59:59.000Z',
       priority: 10,
       isVisible: true,
       rules: {}
     },
     {
       id: 'camp-2',
       title: 'پیشنهاد شگفت‌انگیز موبایل',
       description: 'تخفیف ویژه گوشی‌های هوشمند به مدت محدود',
       type: 'flash_sale',
       status: 'scheduled',
       startDate: '2026-08-01T00:00:00.000Z',
       endDate: '2026-08-05T23:59:59.000Z',
       priority: 50, // اولویت بالاتر نسبت به حراج فصلی
       isVisible: true,
       rules: { targetCategoryIds: ['cat-mobile'] }
     },
     {
       id: 'camp-3',
       title: 'بلک فرایدی',
       description: 'بزرگترین حراج سال',
       type: 'marketplace',
       status: 'draft',
       startDate: '2026-11-20T00:00:00.000Z',
       endDate: '2026-11-30T23:59:59.000Z',
       priority: 100,
       isVisible: false,
       rules: {}
     }
   ];
 
   async getCampaignById(id: string): Promise<Campaign | null> {
     return this.campaigns.find(c => c.id === id) || null;
   }
 
   async getAllCampaigns(): Promise<Campaign[]> {
     return this.campaigns;
   }
 }
 
 export class CampaignService {
   private dataSource: CampaignDataSource;
 
   constructor(dataSource: CampaignDataSource = new MockCampaignDataSource()) {
     this.dataSource = dataSource;
   }
 
   /**
    * Retrieves all available campaigns and delegates to CampaignEngine to resolve the winning campaign
    * based on the provided context (e.g., category, brand, time).
    */
   public async resolveActiveCampaign(context: CampaignEvaluationContext): Promise<CampaignResult> {
     try {
       const allCampaigns = await this.dataSource.getAllCampaigns();
       return CampaignEngine.evaluateCandidates(allCampaigns, context);
     } catch (error) {
       console.error('[CampaignService] Failed to resolve active campaign:', error);
       return {
         isValid: false,
         currentStatus: 'cancelled',
         conflictDetected: false,
         priority: 0,
         reason: 'INTERNAL_ERROR'
       };
     }
   }
 
   /**
    * Retrieves a specific campaign and calculates its real-time status.
    */
   public async getCampaignWithRealTimeStatus(id: string): Promise<Campaign | null> {
     try {
       const campaign = await this.dataSource.getCampaignById(id);
       if (!campaign) return null;
 
       const realTimeStatus = CampaignEngine.resolveRealTimeStatus(campaign);
       return { ...campaign, status: realTimeStatus };
     } catch (error) {
       console.error('[CampaignService] Failed to fetch campaign:', error);
       return null;
     }
   }
 }
 
 // Singleton instance for convenience
 export const campaignService = new CampaignService();