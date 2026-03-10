'use client';

/**
 * Alert Component
 * Display notices and educational disclaimers
 * Light theme version matching BIZEN white aesthetic
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'warning' | 'success' | 'danger';
  icon?: React.ReactNode;
}

export function Alert({
  variant = 'default',
  icon,
  className,
  children,
  ...props
}: AlertProps) {
  const variantStyles = {
    default: 'bg-gray-100 border-gray-200 text-gray-800',
    info: 'bg-blue-50 border-blue-100 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
  };

  const defaultIcons = {
    default: 'ℹ️',
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    danger: '❌',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">
        {icon || defaultIcons[variant]}
      </span>
      <div className="flex-1 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
