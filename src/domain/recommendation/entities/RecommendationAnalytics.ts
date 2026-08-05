export enum RecommendationAction {
    SHOWN = 'SHOWN',
    CLICKED = 'CLICKED',
    PURCHASED = 'PURCHASED',
    DISMISSED = 'DISMISSED'
  }
  
  export interface RecommendationEvent {
    eventId: string;
    action: RecommendationAction;
    recommendationType: RecommendationType;
    userId?: string;
    sessionId: string;
    productId: string;
    positionIndex: number; // Where it appeared in the grid (0 to 13)
    timestamp: Date;
  }