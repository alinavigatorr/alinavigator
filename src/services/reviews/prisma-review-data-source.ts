import { ReviewDataSource } from './review-data-source';
import { PrismaReviewRepository } from '../../database/prisma/repositories/prisma-review-repository';
import { PrismaSellerReplyRepository } from '../../database/prisma/repositories/prisma-seller-reply-repository';
import { 
  ReviewDTO, 
  CreateReviewDTO, 
  UpdateReviewDTO, 
  SellerReplyDTO 
} from './dto/review.dto';

/**
 * Real Database implementation of ReviewDataSource using Prisma Repositories.
 */
export class PrismaReviewDataSource implements ReviewDataSource {
  
  constructor(
    private readonly reviewRepository: PrismaReviewRepository,
    private readonly sellerReplyRepository: PrismaSellerReplyRepository
  ) {}

  async getReviews(productId?: string): Promise<ReviewDTO[]> {
    const reviews = productId 
      ? await this.reviewRepository.findByProduct(productId)
      : await this.reviewRepository.findMany({ sortBy: 'createdAt', sortOrder: 'desc' });

    return reviews.map(review => this.mapToReviewDTO(review));
  }

  async getReview(id: string): Promise<ReviewDTO | null> {
    const review = await this.reviewRepository.findById(id);
    if (!review) return null;

    return this.mapToReviewDTO(review);
  }

  async createReview(data: CreateReviewDTO): Promise<ReviewDTO> {
    const createdReview = await this.reviewRepository.create({
      userId: data.userId,
      productId: data.productId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      status: 'PENDING', // Default to pending moderation
    } as any);

    return this.mapToReviewDTO(createdReview);
  }

  async updateReview(id: string, data: UpdateReviewDTO): Promise<ReviewDTO> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new Error('Review not found.');
    }

    const updatedReview = await this.reviewRepository.update(id, {
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    } as any);

    return this.mapToReviewDTO(updatedReview);
  }

  async deleteReview(id: string): Promise<boolean> {
    return await this.reviewRepository.delete(id);
  }

  async submitSellerReply(reviewId: string, data: SellerReplyDTO): Promise<ReviewDTO> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    // Assuming a seller reply relation or table exists
    await this.sellerReplyRepository.create({
      reviewId,
      sellerId: data.sellerId,
      reply: data.reply,
    } as any);

    const updatedReview = await this.reviewRepository.findById(reviewId);
    return this.mapToReviewDTO(updatedReview);
  }

  async voteHelpful(reviewId: string, userId: string): Promise<ReviewDTO> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    // Increment helpful votes count (or handle via a dedicated votes table)
    const currentHelpful = (review as any).helpfulVotes || 0;
    const updatedReview = await this.reviewRepository.update(reviewId, {
      helpfulVotes: currentHelpful + 1,
    } as any);

    return this.mapToReviewDTO(updatedReview);
  }

  async reportReview(reviewId: string, userId: string, reason: string): Promise<boolean> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    // Log the report in database or flag the review
    await this.reviewRepository.update(reviewId, {
      isReported: true,
      reportReason: reason,
    } as any);

    return true;
  }

  /**
   * Helper mapper to convert Prisma Review entity to ReviewDTO
   */
  private mapToReviewDTO(review: any): ReviewDTO {
    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      status: review.status,
      helpfulVotes: review.helpfulVotes ?? 0,
      sellerReply: review.sellerReply ? {
        id: review.sellerReply.id,
        sellerId: review.sellerReply.sellerId,
        reply: review.sellerReply.reply,
        createdAt: review.sellerReply.createdAt,
      } : undefined,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}