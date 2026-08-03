// src/types/community.ts

export interface ReviewMedia {
  id: string;
  type: 'image' | 'video_placeholder';
  url: string;
  alt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  media?: ReviewMedia[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
  isOwner?: boolean;
}

export interface Question {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  userId: string;
  userName: string;
  content: string;
  isAdmin: boolean;
  isAccepted: boolean;
  upvotes: number;
  createdAt: string;
}