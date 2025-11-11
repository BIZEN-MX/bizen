'use client';

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AIButtonProps {
  label: string;
  loading?: boolean;
  onClick: () => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AIButton({
  label,
  loading = false,
  onClick,
  variant = 'default',
  size = 'default',
  className,
  disabled = false
}: AIButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      variant={variant}
      size={size}
      className={cn(
        'group relative overflow-hidden',
        variant === 'default' &&
          'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          {label}
        </>
      )}
    </Button>
  );
}

