import { BaseRepository } from './base-repository';

/**
 * Review Repository Contract
 * Extends the generic base repository with review-specific query methods.
 */
export interface ReviewRepository<TReview, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TReview, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all reviews associated with a specific product.
   */
  findByProduct(productId: string): Promise<TReview[]>;

  /**
   * Retrieves all reviews that have been approved by moderators.
   */
  findApproved(): Promise<TReview[]>;

  /**
   * Retrieves all pending reviews awaiting moderation.
   */
  findPending(): Promise<TReview[]>;
}