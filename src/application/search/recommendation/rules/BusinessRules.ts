export interface IBusinessRule {
    filter(candidateIds: string[], metadataMap: Record<string, any>): string[];
  }
  
  export class InStockRule implements IBusinessRule {
    filter(candidateIds: string[], metadataMap: Record<string, any>): string[] {
      return candidateIds.filter(id => metadataMap[id]?.stock > 0);
    }
  }
  
  export class ProductVisibilityRule implements IBusinessRule {
    filter(candidateIds: string[], metadataMap: Record<string, any>): string[] {
      return candidateIds.filter(id => metadataMap[id]?.status === 'ACTIVE' && metadataMap[id]?.isVisible);
    }
  }
  
  export class CampaignBoostRule {
    applyBoost(scores: any[], metadataMap: Record<string, any>): any[] {
      // Placeholder: Boost products in an active marketing campaign
      return scores;
    }
  }