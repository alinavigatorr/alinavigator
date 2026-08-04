import React from 'react';

export interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  isOpen: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  unreadCount, 
  onClick,
  isOpen
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 rounded-full transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        hover:bg-black/5 dark:hover:bg-white/10
        ${isOpen ? 'bg-black/5 dark:bg-white/10' : 'bg-transparent'}
      `}
      aria-label="Notifications"
      aria-expanded={isOpen}
    >
      {/* Bell Icon SVG */}
      <svg 
        className="w-6 h-6 text-gray-700 dark:text-gray-200" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="1.5" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {/* Unread Badge with pure CSS Pulse Animation */}
      {unreadCount > 0 && (
        <div className="absolute top-0 right-0 flex items-center justify-center transform translate-x-1 -translate-y-1">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-red-400 animate-ping"></span>
          <span className="relative inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        </div>
      )}
    </button>
  );
};