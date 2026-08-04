import React from 'react';
import { useNotification } from '../hooks/useNotification';
import { NotificationItem } from './NotificationItem';
import { NotificationEmptyState } from './NotificationEmptyState';

export interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, isLoading, unreadCount, markAllAsRead } = useNotification();

  return (
    <div className="w-80 sm:w-96 rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between bg-white/50 dark:bg-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markAllAsRead();
            }}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Scrollable Notification List */}
      <div className="max-h-[400px] overflow-y-auto overscroll-contain flex flex-col">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <div className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
            {notifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Settings / Footer */}
      <div className="p-2 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        <button 
          onClick={onClose}
          className="w-full text-center px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
        >
          Notification Settings
        </button>
      </div>
    </div>
  );
};