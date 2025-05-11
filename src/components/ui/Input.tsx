'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, helperText, className = '', ...props }, ref) => {
    // Base styles
    const baseStyles = 'border rounded-md p-2 focus:outline-none focus:ring-2 transition-all';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Status styles
    const statusStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-[var(--cognac)] focus:border-[var(--sage-green)] focus:ring-[rgba(83,94,75,0.2)]';

    // Combined styles
    const combinedStyles = `${baseStyles} ${widthStyles} ${statusStyles} ${className} text-black`;

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
        <input ref={ref} className={combinedStyles} {...props} />
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
Input.displayName = 'Input';

export default Input;
