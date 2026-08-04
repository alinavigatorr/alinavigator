import { Product, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { ProductRepository } from '../../repositories/product-repository';

/**
 * Prisma implementation of the ProductRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaProductRepository 
  extends PrismaBaseRepository<Product, Prisma.ProductCreateInput, Prisma.ProductUpdateInput> 
  implements ProductRepository<Product, Prisma.ProductCreateInput, Prisma.ProductUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.product) to the base repository
    super(prisma.product);
  }

  async findBySeller(sellerId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { sellerId },
    });
  }

  async findPublished(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isPublished: true },
    });
  }

  async findDraft(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isPublished: false },
    });
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { categoryId },
    });
  }
}