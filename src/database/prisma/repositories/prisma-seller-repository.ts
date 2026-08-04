import { Seller, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { SellerRepository } from '../../repositories/seller-repository';

/**
 * Prisma implementation of the SellerRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaSellerRepository 
  extends PrismaBaseRepository<Seller, Prisma.SellerCreateInput, Prisma.SellerUpdateInput> 
  implements SellerRepository<Seller, Prisma.SellerCreateInput, Prisma.SellerUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.seller) to the base repository
    super(prisma.seller);
  }

  async findByUserId(userId: string): Promise<Seller | null> {
    return prisma.seller.findUnique({
      where: { userId },
    });
  }

  async findActive(): Promise<Seller[]> {
    return prisma.seller.findMany({
      where: { 
        isVerified: true 
      },
    });
  }
}