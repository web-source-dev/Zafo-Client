'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface DropdownMenuItem {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  isLoading?: boolean;
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  items,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (e: React.MouseEvent, onClick: (e: React.MouseEvent) => void) => {
    onClick(e);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get variant styles
  const getVariantStyles = (variant: DropdownMenuItem['variant'] = 'default') => {
    switch (variant) {
      case 'danger':
        return 'text-red-600 hover:bg-red-50';
      case 'success':
        return 'text-green-600 hover:bg-green-50';
      case 'warning':
        return 'text-yellow-600 hover:bg-yellow-50';
      default:
        return 'text-black hover:bg-[var(--taupe)]';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 rounded-full hover:bg-[var(--taupe)] focus:outline-none focus:ring-2 focus:ring-[var(--sage-green)] transition-colors"
        aria-label="Menu"
      >
        <MoreVertical className="h-5 w-5 text-[var(--sage-green)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={(e) => handleItemClick(e, item.onClick)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center ${getVariantStyles(item.variant)} ${
                  item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : item.icon ? (
                  <span className="mr-2">{item.icon}</span>
                ) : null}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 