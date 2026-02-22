'use client';

/**
 * ResultsCard Component
 * Display key metrics from simulator calculations
 */

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ResultsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  hint?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export function ResultsCard({
  title,
  value,
  subtitle,
  hint,
  variant = 'default',
  icon,
  className,
}: ResultsCardProps) {
  const variantStyles = {
    default: 'border-gray-200 bg-white',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
    info: 'border-blue-200 bg-blue-50',
  };

  const textStyles = {
    default: 'text-gray-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    danger: 'text-red-900',
    info: 'text-blue-900',
  };

  const subtitleStyles = {
    default: 'text-gray-600',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    info: 'text-blue-700',
  };

  return (
    <Card className={cn(variantStyles[variant], 'border-2', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className={cn('text-xl sm:text-2xl font-bold', textStyles[variant])}>
              {value}
            </p>
            {subtitle && (
              <p className={cn('text-sm mt-1', subtitleStyles[variant])}>
                {subtitle}
              </p>
            )}
            {hint && (
              <p className="text-xs text-gray-500 mt-2 italic">
                {hint}
              </p>
            )}
          </div>
          {icon && (
            <div className="ml-4 text-3xl opacity-70">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
