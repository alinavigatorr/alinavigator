import { BaseRepository } from './base-repository';

/**
 * Order Repository Contract
 * Extends the generic base repository with order-specific query methods.
 */
export interface OrderRepository<TOrder, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TOrder, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all orders placed by a specific customer (user).
   */
  findByCustomer(customerId: string): Promise<TOrder[]>;

  /**
   * Retrieves all orders that contain products from a specific seller.
   */
  findBySeller(sellerId: string): Promise<TOrder[]>;

  /**
   * Retrieves all orders currently in a specific status (e.g., PENDING, PAID, SHIPPED).
   */
  findByStatus(status: string): Promise<TOrder[]>;
}