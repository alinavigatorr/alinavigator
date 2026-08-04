import React, { createContext, useContext, useMemo } from 'react';

// 1. Import real database implementations instead of the Mock ones
import { PrismaReviewRepository } from '../database/prisma/repositories/prisma-review-repository';
import { PrismaSellerReplyRepository } from '../database/prisma/repositories/prisma-seller-reply-repository';
import { PrismaReviewDataSource } from '../services/reviews/prisma-review-data-source';

// 2. Import the unchanging Business Service
import { ReviewService } from '../services/reviews/review-service';

// Context definition (Unchanged)
interface ReviewContextType {
  reviewService: ReviewService;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const MountedReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 3. Dependency Injection Wiring (Singleton instance per app lifecycle)
  const reviewService = useMemo(() => {
    // Step A: Instantiate Repositories
    const reviewRepository = new PrismaReviewRepository();
    const sellerReplyRepository = new PrismaSellerReplyRepository();

    // Step B: Inject Repositories into the Real Data Source
    // This used to be: new MockReviewDataSource()
    const reviewDataSource = new PrismaReviewDataSource(reviewRepository, sellerReplyRepository);

    // Step C: Inject Data Source into the Business Service
    return new ReviewService(reviewDataSource);
  }, []);

  return (
    <ReviewContext.Provider value={{ reviewService }}>
      {children}
    </ReviewContext.Provider>
  );
};

// Hook for UI components (Unchanged)
export const useReviewEngine = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewEngine must be used within a MountedReviewProvider');
  }
  return context.reviewService;
};