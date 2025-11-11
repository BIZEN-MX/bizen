'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItemProps {
  text: string;
  done: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  className?: string;
}

export function ChecklistItem({
  text,
  done,
  onToggle,
  onDelete,
  className
}: ChecklistItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group',
        className
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded border-2 transition-all',
          done
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500'
            : 'border-gray-300 hover:border-blue-400'
        )}
      >
        {done && <Check className="w-4 h-4 text-white" />}
      </button>
      <p
        className={cn(
          'flex-1 text-sm',
          done ? 'text-gray-500 line-through' : 'text-gray-700'
        )}
      >
        {text}
      </p>
      {onDelete && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-sm transition-opacity"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}

