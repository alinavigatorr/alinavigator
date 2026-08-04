import React from 'react';

export const NotificationEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800/50">
        <svg 
          className="w-8 h-8 text-gray-400 dark:text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
        You're all caught up!
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
        There are no new notifications for you right now. Check back later.
      </p>
    </div>
  );
};