import { Notification, Prisma } from '@prisma/client';
import { prisma } from '../prisma-client';
import { PrismaBaseRepository } from '../prisma-base-repository';
import { NotificationRepository } from '../../repositories/notification-repository';

/**
 * Prisma implementation of the NotificationRepository.
 * Inherits generic CRUD operations from PrismaBaseRepository.
 */
export class PrismaNotificationRepository 
  extends PrismaBaseRepository<Notification, Prisma.NotificationCreateInput, Prisma.NotificationUpdateInput> 
  implements NotificationRepository<Notification, Prisma.NotificationCreateInput, Prisma.NotificationUpdateInput> 
{
  constructor() {
    // Pass the specific Prisma delegate (prisma.notification) to the base repository
    super(prisma.notification);
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { 
        userId: userId,
        isRead: false 
      },
      orderBy: { createdAt: 'desc' }, // Show newest notifications first
    });
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { 
        userId: userId,
        isRead: false 
      },
      data: { 
        isRead: true 
      },
    });
    
    // Return the number of updated records
    return result.count;
  }
}