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
  updatedAt?: string;
}