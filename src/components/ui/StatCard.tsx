'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const StatCard = ({
  title,
  value,
  icon,
  className,
  variant = 'default',
}: StatCardProps) => {
  const variantStyles = {
    default: 'bg-white text-[var(--sage-green)]',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
  };

  return (
    <div
      className={cn(
        'rounded-lg shadow-sm p-5 border border-[var(--cognac)]',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dt className="text-sm font-medium truncate">
            {title}
          </dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold">
              {value}
            </div>
          </dd>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 