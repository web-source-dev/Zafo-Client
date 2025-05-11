'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, helperText, options, className = '', ...props }, ref) => {
    // Base styles
    const baseStyles = 'border rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 transition-all appearance-none';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Status styles
    const statusStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-[var(--cognac)] focus:border-[var(--sage-green)] focus:ring-[rgba(83,94,75,0.2)]';

    // Combined styles
    const combinedStyles = `${baseStyles} ${widthStyles} ${statusStyles} ${className} text-black bg-white`;

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={props.id || props.name} 
            className="block text-sm font-medium text-black mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select 
            ref={ref} 
            className={combinedStyles}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
            <ChevronDown className="h-4 w-4 text-[var(--sage-green)]" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-[var(--sage-green)]">{helperText}</p>
        )}
      </div>
    );
  }
);

// Display name for debugging
Select.displayName = 'Select';

export default Select; 