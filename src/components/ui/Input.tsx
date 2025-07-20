'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import {  X } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, helperText, icon, clearable = false, onClear, className = '', disabled, ...props }, ref) => {
    // Base styles
    const baseStyles = 'border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 text-sm';
    
    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';
    
    // Status styles
    const statusStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
      : disabled
      ? 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
      : 'border-gray-200 focus:border-[var(--sage-green)] focus:ring-[rgba(83,94,75,0.15)] bg-white hover:border-gray-300';

    // Combined styles
    const combinedStyles = `${baseStyles} ${widthStyles} ${statusStyles} ${className} text-gray-900`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label 
            htmlFor={props.id || props.name} 
            className={`block text-sm font-semibold mb-2 ${disabled ? 'text-gray-500' : 'text-gray-700'}`}
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
          <input 
            ref={ref} 
            className={`${combinedStyles} ${icon ? 'pl-10' : ''} ${clearable && props.value ? 'pr-10' : ''}`}
            disabled={disabled}
            {...props} 
          />
          {clearable && props.value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={`mt-1 text-sm flex items-center ${disabled ? 'text-gray-500' : 'text-gray-600'}`}>
            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Display name for debugging
Input.displayName = 'Input';

export default Input;
