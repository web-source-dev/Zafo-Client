'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, helperText, options, icon, className = '', ...props }, ref) => {
    // Base styles
    const baseStyles = 'border rounded-lg py-3 px-4 pr-10 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none text-sm';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Status styles
    const statusStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
      : 'border-gray-200 focus:border-[var(--sage-green)] focus:ring-[rgba(83,94,75,0.15)] bg-white hover:border-gray-300';

    // Combined styles
    const combinedStyles = `${baseStyles} ${widthStyles} ${statusStyles} ${className} text-gray-900`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={props.id || props.name} 
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">
                {icon}
              </div>
            </div>
          )}
          <select 
            ref={ref} 
            className={`${combinedStyles} ${icon ? 'pl-10' : ''}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-focus-within:rotate-180" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-600 flex items-center">
            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Display name for debugging
Select.displayName = 'Select';

export default Select; 