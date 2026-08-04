import { Wallet, WalletTransaction, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { WalletRepository } from '../../repositories/wallet-repository';

/**
 * Prisma implementation of the WalletRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaWalletRepository 
  extends PrismaBaseRepository<Wallet, Prisma.WalletCreateInput, Prisma.WalletUpdateInput> 
  implements WalletRepository<Wallet, Prisma.WalletCreateInput, Prisma.WalletUpdateInput, WalletTransaction> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.wallet) to the base repository
    super(prisma.wallet);
  }

  async findByUser(userId: string): Promise<Wallet | null> {
    return prisma.wallet.findUnique({
      where: { userId },
    });
  }

  async findTransactions(walletId: string): Promise<WalletTransaction[]> {
    return prisma.walletTransaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });
  }
}