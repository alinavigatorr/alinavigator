import { Review, Prisma, ReviewStatus } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { ReviewRepository } from '../../repositories/review-repository';

/**
 * Prisma implementation of the ReviewRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaReviewRepository 
  extends PrismaBaseRepository<Review, Prisma.ReviewCreateInput, Prisma.ReviewUpdateInput> 
  implements ReviewRepository<Review, Prisma.ReviewCreateInput, Prisma.ReviewUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.review) to the base repository
    super(prisma.review);
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }, // Order by newest reviews first
    });
  }

  async findApproved(): Promise<Review[]> {
    return prisma.review.findMany({
      where: { status: ReviewStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPending(): Promise<Review[]> {
    return prisma.review.findMany({
      where: { status: ReviewStatus.PENDING },
      orderBy: { createdAt: 'asc' }, // Order by oldest first for moderation queue
    });
  }
}