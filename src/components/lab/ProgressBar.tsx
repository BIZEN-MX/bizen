'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showNumbers?: boolean;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  label,
  showNumbers = true,
  className
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showNumbers) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium text-gray-700">{label}</span>}
          {showNumbers && (
            <span className="text-gray-500">
              {current} de {total} completados
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

