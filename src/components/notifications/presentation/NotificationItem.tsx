import React from 'react';
import { Notification } from '../../../domain/notifications/notification-types';
import { useNotification } from '../hooks/useNotification';

export interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotification();
  const isUnread = notification.status !== 'READ';

  // Helper to determine badge/icon colors based on priority
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
      case 'LOW':
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700/50';
      case 'NORMAL':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
    }
  };

  const priorityStyles = getPriorityStyles(notification.priority);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnread) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div 
      onClick={handleContainerClick}
      className={`
        group relative p-4 flex gap-3 cursor-pointer transition-colors
        hover:bg-gray-50/80 dark:hover:bg-gray-800/60
        ${isUnread ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-transparent'}
      `}
      role="button"
      tabIndex={0}
    >
      {/* Unread indicator line */}
      {isUnread && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
      )}

      {/* Priority Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <span className={`flex items-center justify-center w-8 h-8 rounded-full border ${priorityStyles}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex justify-between items-start mb-1">
          <p className={`text-sm font-medium truncate ${isUnread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
            {notification.title}
          </p>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        {/* Tags */}
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border ${priorityStyles}`}>
            {notification.priority}
          </span>
          {notification.channels[0] && (
            <span className="text-[9px] font-medium tracking-wide text-gray-400 uppercase">
              • {notification.channels[0]}
            </span>
          )}
        </div>
      </div>

      {/* Delete Action (Visible on Hover) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <button 
          onClick={handleDelete}
          className="p-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors"
          title="Delete Notification"
          aria-label="Delete Notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};