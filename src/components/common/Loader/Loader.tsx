import React from 'react';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white' | 'success' | 'danger';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  const variants = {
    primary: 'border-primary-600 dark:border-primary-400',
    secondary: 'border-gray-600 dark:border-gray-400',
    white: 'border-white',
    success: 'border-green-600 dark:border-green-400',
    danger: 'border-red-600 dark:border-red-400',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          animate-spin rounded-full
          ${sizes[size]}
          ${variants[variant]}
          border-t-transparent
          shadow-lg
          ${className}
        `}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 animate-fade-in">
        {spinner}
      </div>
    );
  }

  return spinner;
};