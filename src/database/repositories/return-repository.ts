import { BaseRepository } from './base-repository';

/**
 * Return Request Repository Contract
 * Extends the generic base repository with return-request-specific query methods.
 */
export interface ReturnRepository<TReturnRequest, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TReturnRequest, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all pending return requests awaiting admin or seller review.
   */
  findPending(): Promise<TReturnRequest[]>;

  /**
   * Retrieves all approved return requests.
   */
  findApproved(): Promise<TReturnRequest[]>;

  /**
   * Retrieves all rejected return requests.
   */
  findRejected(): Promise<TReturnRequest[]>;
}