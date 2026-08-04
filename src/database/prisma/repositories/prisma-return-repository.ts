import { ReturnRequest, Prisma, ReturnStatus } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { ReturnRepository } from '../../repositories/return-repository';

/**
 * Prisma implementation of the ReturnRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaReturnRepository 
  extends PrismaBaseRepository<ReturnRequest, Prisma.ReturnRequestCreateInput, Prisma.ReturnRequestUpdateInput> 
  implements ReturnRepository<ReturnRequest, Prisma.ReturnRequestCreateInput, Prisma.ReturnRequestUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.returnRequest) to the base repository
    super(prisma.returnRequest);
  }

  async findPending(): Promise<ReturnRequest[]> {
    return prisma.returnRequest.findMany({
      where: { status: ReturnStatus.PENDING },
      orderBy: { createdAt: 'asc' }, // Older requests first for the review queue
    });
  }

  async findApproved(): Promise<ReturnRequest[]> {
    return prisma.returnRequest.findMany({
      where: { status: ReturnStatus.APPROVED },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRejected(): Promise<ReturnRequest[]> {
    return prisma.returnRequest.findMany({
      where: { status: ReturnStatus.REJECTED },
      orderBy: { createdAt: 'desc' },
    });
  }
}