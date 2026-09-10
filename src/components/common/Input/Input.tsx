import React, { forwardRef, useState } from 'react';
import { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className = '',
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  iconPosition = 'left',
  type = 'text',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = 'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200 outline-none';
  
  const stateStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400'
    : isFocused
    ? 'border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-primary-400'
    : 'border-gray-200 dark:border-gray-700';
  
  const bgStyles = 'bg-white dark:bg-gray-800';
  const textStyles = 'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500';
  
  const iconStyles = Icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';
  const rightIconStyles = RightIcon ? 'pr-10' : '';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`${baseStyles} ${stateStyles} ${bgStyles} ${textStyles} ${iconStyles} ${rightIconStyles} ${className}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';