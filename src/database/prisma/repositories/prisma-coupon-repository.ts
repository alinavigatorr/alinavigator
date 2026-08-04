import { Coupon, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { CouponRepository } from '../../repositories/coupon-repository';

/**
 * Prisma implementation of the CouponRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaCouponRepository 
  extends PrismaBaseRepository<Coupon, Prisma.CouponCreateInput, Prisma.CouponUpdateInput> 
  implements CouponRepository<Coupon, Prisma.CouponCreateInput, Prisma.CouponUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.coupon) to the base repository
    super(prisma.coupon);
  }

  async findValid(): Promise<Coupon[]> {
    const now = new Date();
    return prisma.coupon.findMany({
      where: {
        isActive: true, // Assuming an active toggle exists
        OR: [
          { endDate: { gt: now } }, // Has not expired yet
          { endDate: null },        // Or has no expiration date
        ],
      },
    });
  }

  async findExpired(): Promise<Coupon[]> {
    const now = new Date();
    return prisma.coupon.findMany({
      where: {
        endDate: { lt: now }, // Expiration date is in the past
      },
    });
  }
}