import { BaseRepository } from './base-repository';

/**
 * Product Repository Contract
 * Extends the generic base repository with product-specific query methods.
 */
export interface ProductRepository<TProduct, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TProduct, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all products belonging to a specific seller.
   */
  findBySeller(sellerId: string): Promise<TProduct[]>;

  /**
   * Retrieves all published (publicly visible) products.
   */
  findPublished(): Promise<TProduct[]>;

  /**
   * Retrieves all draft (unpublished) products.
   */
  findDraft(): Promise<TProduct[]>;

  /**
   * Retrieves all products belonging to a specific category.
   */
  findByCategory(categoryId: string): Promise<TProduct[]>;
}