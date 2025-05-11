'use client';

import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = false, helperText, className = '', ...props }, ref) => {
    // Base styles
    const baseStyles = 'border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition-all min-h-[100px] text-base';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : 'min-w-[300px]';
    
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
            className="block text-sm font-medium text-black mb-2"
          >
            {label}
          </label>
        )}
        <textarea 
          ref={ref} 
          className={combinedStyles} 
          rows={props.rows || 4}
          {...props} 
        />
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
Textarea.displayName = 'Textarea';

export default Textarea;
