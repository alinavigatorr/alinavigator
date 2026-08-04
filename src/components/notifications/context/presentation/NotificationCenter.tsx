import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';
import { NotificationBell } from './NotificationBell';
import { NotificationDropdown } from './NotificationDropdown';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Consuming context purely for data passing, no business logic here.
  const { unreadCount } = useNotification();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block z-50">
      <NotificationBell 
        unreadCount={unreadCount} 
        onClick={toggleDropdown} 
        isOpen={isOpen}
      />
      
      {isOpen && (
        <div className="absolute right-0 mt-2 animate-in fade-in zoom-in-95 duration-200">
          <NotificationDropdown onClose={closeDropdown} />
        </div>
      )}
    </div>
  );
};