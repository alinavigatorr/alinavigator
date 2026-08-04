import { WalletDataSource } from './wallet-data-source';
import { PrismaWalletRepository } from '../../database/prisma/repositories/prisma-wallet-repository';
import { PrismaWalletTransactionRepository } from '../../database/prisma/repositories/prisma-wallet-transaction-repository';
import { 
  WalletDTO, 
  TransactionDTO, 
  CreateTransactionDTO 
} from './dto/wallet.dto';

/**
 * Real Database implementation of WalletDataSource using Prisma Repositories.
 */
export class PrismaWalletDataSource implements WalletDataSource {
  
  constructor(
    private readonly walletRepository: PrismaWalletRepository,
    private readonly transactionRepository: PrismaWalletTransactionRepository
  ) {}

  async getWallet(userId: string): Promise<WalletDTO | null> {
    const wallet = await this.walletRepository.findByUser(userId);
    
    if (!wallet) {
      return null;
    }

    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      currency: wallet.currency,
      isActive: wallet.isActive,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.walletRepository.findByUser(userId);
    
    if (!wallet) {
      throw new Error('Wallet not found for the specified user.');
    }

    return wallet.balance;
  }

  async getTransactions(walletId: string): Promise<TransactionDTO[]> {
    // Assuming the repository has a specific method to fetch transactions for a wallet
    // Alternatively, this could be handled by PrismaWalletRepository depending on structure
    const transactions = await this.transactionRepository.findMany({
      where: { walletId },
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    return transactions.map(tx => ({
      id: tx.id,
      walletId: tx.walletId,
      amount: tx.amount,
      type: tx.type, // e.g., 'CREDIT' | 'DEBIT'
      status: tx.status,
      description: tx.description,
      referenceId: tx.referenceId,
      createdAt: tx.createdAt,
    }));
  }

  async createTransaction(data: CreateTransactionDTO): Promise<TransactionDTO> {
    const wallet = await this.walletRepository.findById(data.walletId);
    
    if (!wallet) {
      throw new Error('Wallet not found.');
    }

    if (!wallet.isActive) {
      throw new Error('Wallet is currently inactive.');
    }

    // Business check for DEBIT transactions
    if (data.type === 'DEBIT' && wallet.balance < data.amount) {
      throw new Error('Insufficient funds.');
    }

    // Note: In a true production environment, this should be wrapped in a Prisma Transaction 
    // at the repository/service layer to ensure atomicity. For standard repository patterns 
    // without crossing domain boundaries, we update sequentially:

    const newTransaction = await this.transactionRepository.create({
      walletId: data.walletId,
      amount: data.amount,
      type: data.type,
      status: 'COMPLETED', // Or 'PENDING' depending on business rules
      description: data.description,
      referenceId: data.referenceId,
    });

    // Calculate new balance
    const newBalance = data.type === 'CREDIT' 
      ? wallet.balance + data.amount 
      : wallet.balance - data.amount;

    // Update wallet balance
    await this.walletRepository.update(wallet.id, {
      balance: newBalance,
    });

    return {
      id: newTransaction.id,
      walletId: newTransaction.walletId,
      amount: newTransaction.amount,
      type: newTransaction.type,
      status: newTransaction.status,
      description: newTransaction.description,
      referenceId: newTransaction.referenceId,
      createdAt: newTransaction.createdAt,
    };
  }
}