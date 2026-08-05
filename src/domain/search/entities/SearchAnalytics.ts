export enum SearchEventType {
    PERFORMED = 'SEARCH_PERFORMED',
    CLICKED = 'SEARCH_CLICKED',
    CONVERTED = 'SEARCH_CONVERTED',
    ABANDONED = 'SEARCH_ABANDONED'
  }
  
  export interface SearchInteraction {
    interactionId: string;
    sessionId: string;
    userId?: string;
    queryTerm: string;
    eventType: SearchEventType;
    timestamp: Date;
  }
  
  export interface ClickSignal extends SearchInteraction {
    documentId: string;
    rankPosition: number;
  }
  
  export interface ConversionSignal extends SearchInteraction {
    documentId: string;
    orderId: string;
    purchaseValue: number;
  }
  
  export interface UserQueryHistory {
    userId: string;
    recentSearches: string[];
    frequentCategories: string[];
    lastUpdated: Date;
  }