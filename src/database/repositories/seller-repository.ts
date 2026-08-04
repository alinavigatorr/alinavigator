import { BaseRepository } from './base-repository';

/**
 * Seller Repository Contract
 * Extends the generic base repository with seller-specific query methods.
 */
export interface SellerRepository<TSeller, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TSeller, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves a seller profile by their associated user ID.
   */
  findByUserId(userId: string): Promise<TSeller | null>;

  /**
   * Retrieves a list of all active and verified sellers.
   */
  findActive(): Promise<TSeller[]>;
}