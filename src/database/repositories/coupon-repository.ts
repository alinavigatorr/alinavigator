import { BaseRepository } from './base-repository';

/**
 * Coupon Repository Contract
 * Extends the generic base repository with coupon-specific query methods.
 */
export interface CouponRepository<TCoupon, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TCoupon, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all currently valid and active coupons.
   */
  findValid(): Promise<TCoupon[]>;

  /**
   * Retrieves all expired coupons.
   */
  findExpired(): Promise<TCoupon[]>;
}