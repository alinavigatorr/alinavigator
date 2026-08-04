import { BaseRepository } from './base-repository';

/**
 * User Repository Contract
 * Extends the generic base repository with user-specific query methods.
 */
export interface UserRepository<TUser, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TUser, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves a user by their exact email address.
   */
  findByEmail(email: string): Promise<TUser | null>;

  /**
   * Retrieves a user by their exact username.
   */
  findByUsername(username: string): Promise<TUser | null>;

  /**
   * Retrieves all users associated with a specific role.
   * @param roleName The name of the role (e.g., 'SUPER_ADMIN', 'SELLER')
   */
  findByRole(roleName: string): Promise<TUser[]>;
}