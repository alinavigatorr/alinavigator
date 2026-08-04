import { NotificationDataSource } from './notification-data-source';
import { PrismaNotificationRepository } from '../../database/prisma/repositories/prisma-notification-repository';
import { 
  NotificationDTO, 
  CreateNotificationDTO 
} from './dto/notification.dto';

/**
 * Real Database implementation of NotificationDataSource using Prisma Repositories.
 */
export class PrismaNotificationDataSource implements NotificationDataSource {
  
  constructor(
    private readonly notificationRepository: PrismaNotificationRepository
  ) {}

  async getNotifications(userId: string): Promise<NotificationDTO[]> {
    const notifications = await this.notificationRepository.findMany({
      where: { userId },
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });

    return notifications.map(n => this.mapToNotificationDTO(n));
  }

  async getUnreadNotifications(userId: string): Promise<NotificationDTO[]> {
    const notifications = await this.notificationRepository.findUnread(userId);
    return notifications.map(n => this.mapToNotificationDTO(n));
  }

  async markAsRead(id: string): Promise<NotificationDTO> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new Error('Notification not found.');
    }

    const updated = await this.notificationRepository.update(id, {
      isRead: true,
    } as any);

    return this.mapToNotificationDTO(updated);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return await this.notificationRepository.markAllRead(userId);
  }

  async archiveNotification(id: string): Promise<NotificationDTO> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new Error('Notification not found.');
    }

    // Assuming an 'isArchived' flag exists in the schema/DTO model
    const updated = await this.notificationRepository.update(id, {
      isArchived: true,
    } as any);

    return this.mapToNotificationDTO(updated);
  }

  async deleteNotification(id: string): Promise<boolean> {
    return await this.notificationRepository.delete(id);
  }

  /**
   * Helper mapper to convert Prisma Notification entity to NotificationDTO
   */
  private mapToNotificationDTO(notification: any): NotificationDTO {
    return {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      isArchived: notification.isArchived ?? false,
      createdAt: notification.createdAt,
    };
  }
}