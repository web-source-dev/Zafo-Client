'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  // Base button styles
  const baseStyles = 'font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
  }[size];
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-[var(--sage)] text-black hover:bg-[var(--sage-green)] focus:ring-[var(--sage-green)]',
    secondary: 'bg-[var(--cognac)] text-black hover:bg-[var(--cognac)] focus:ring-[var(--cognac)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent text-[var(--sage-green)] border border-[var(--sage-green)] hover:bg-[#f2f3ed] focus:ring-[var(--sage-green)]',
  }[variant];
  
  // Disabled styles
  const disabledStyles = (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Loading indicator
  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 mr-2 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  return (
    <button
      className={`${baseStyles} ${widthStyles} ${sizeStyles} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {children}
      </div>
    </button>
  );
};

export default Button; 