// src/services/reviews/review-types.ts

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITED';

export interface SellerReply {
  text: string;
  repliedAt: string;
  sellerId: string;
}

export interface ReviewMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  score: number; // Helpfulness score / upvotes
  sellerReply?: SellerReply | null;
  media?: ReviewMedia[];
  createdAt: string;
  editedAt?: string;
}

export interface ReviewSubmission {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
}

export interface ReviewValidationResult {
  isValid: boolean;
  errors: string[];
}