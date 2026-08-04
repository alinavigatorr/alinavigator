import { Campaign, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { CampaignRepository } from '../../repositories/campaign-repository';

/**
 * Prisma implementation of the CampaignRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaCampaignRepository 
  extends PrismaBaseRepository<Campaign, Prisma.CampaignCreateInput, Prisma.CampaignUpdateInput> 
  implements CampaignRepository<Campaign, Prisma.CampaignCreateInput, Prisma.CampaignUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.campaign) to the base repository
    super(prisma.campaign);
  }

  async findRunning(): Promise<Campaign[]> {
    const now = new Date();
    return prisma.campaign.findMany({
      where: {
        isActive: true,
        startDate: { lte: now }, // Campaign has already started
        OR: [
          { endDate: { gt: now } }, // Has not ended yet
          { endDate: null },        // Or runs indefinitely
        ],
      },
    });
  }

  async findScheduled(): Promise<Campaign[]> {
    const now = new Date();
    return prisma.campaign.findMany({
      where: {
        isActive: true,
        startDate: { gt: now }, // Start date is in the future
      },
    });
  }
}