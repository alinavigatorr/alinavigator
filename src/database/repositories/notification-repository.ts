import { BaseRepository } from './base-repository';

/**
 * Notification Repository Contract
 * Extends the generic base repository with notification-specific query methods.
 */
export interface NotificationRepository<TNotification, TCreateDTO, TUpdateDTO> 
  extends BaseRepository<TNotification, TCreateDTO, TUpdateDTO> {
  
  /**
   * Retrieves all unread notifications for a specific user.
   */
  findUnread(userId: string): Promise<TNotification[]>;

  /**
   * Marks all unread notifications as read for a specific user.
   * Returns the number of updated records or a boolean indicating success.
   */
  markAllRead(userId: string): Promise<number | boolean>;
}