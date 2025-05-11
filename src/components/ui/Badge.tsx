'use client';

import React from 'react';

type BadgeVariant = 
  | 'default' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ 
  variant = 'default', 
  children, 
  className = '' 
}: BadgeProps) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700'
  };

  return (
    <span 
      className={`
        px-2 inline-flex text-xs leading-5 font-semibold rounded-full
        ${variantStyles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge; 