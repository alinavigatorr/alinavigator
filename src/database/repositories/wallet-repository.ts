import { BaseRepository } from './base-repository';

/**
 * Wallet Repository Contract
 * Extends the generic base repository with wallet-specific query methods.
 */
export interface WalletRepository<TWallet, TCreateDTO, TUpdateDTO, TTransaction = any> 
  extends BaseRepository<TWallet, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves the wallet associated with a specific user.
   */
  findByUser(userId: string): Promise<TWallet | null>;

  /**
   * Retrieves all transactions associated with a specific wallet.
   */
  findTransactions(walletId: string): Promise<TTransaction[]>;
}