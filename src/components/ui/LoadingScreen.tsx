import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 'sm',
  text,
  className,
  fullScreen = true,
  overlay = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center h-full',
    fullScreen && 'fixed inset-0 z-50 bg-white',
    overlay && 'absolute inset-0 z-40 bg-white/80 backdrop-blur-sm',
    !fullScreen && !overlay && 'w-full h-full min-h-[200px]',
    className
  );

  const dotClasses = cn(
    'inline-block rounded-full bg-[var(--sage-green)]',
    sizeClasses[size]
  );

  return (
    <div className={containerClasses}>
      <div className="flex items-center space-x-1 mb-4">
        <div className={cn(dotClasses, 'animate-bounce')} style={{ animationDelay: '0ms' }}></div>
        <div className={cn(dotClasses, 'animate-bounce')} style={{ animationDelay: '150ms' }}></div>
        <div className={cn(dotClasses, 'animate-bounce')} style={{ animationDelay: '300ms' }}></div>
      </div>
      {text && (
        <p className="text-sm font-medium text-center text-[var(--sage-green)]">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingScreen; 