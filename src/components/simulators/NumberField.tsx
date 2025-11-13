'use client';

/**
 * NumberField Component
 * Currency and numeric input field with proper formatting
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  currency?: boolean;
  percentage?: boolean;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  hint?: string;
  error?: string;
}

export const NumberField = React.forwardRef<HTMLInputElement, NumberFieldProps>(
  ({ 
    value, 
    onChange, 
    currency = false,
    percentage = false,
    min = 0,
    max,
    step = currency ? 1 : 0.01,
    label,
    hint,
    error,
    className,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value.toString());
    const [isFocused, setIsFocused] = React.useState(false);
    
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatDisplay(value));
      }
    }, [value, isFocused]);
    
    function formatDisplay(num: number): string {
      if (isNaN(num)) return '';
      
      if (percentage) {
        return num.toFixed(2);
      }
      
      if (currency) {
        return new Intl.NumberFormat('es-MX', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(num);
      }
      
      return num.toString();
    }
    
    function parseInput(str: string): number {
      // Remove currency formatting (spaces, commas)
      const cleaned = str.replace(/[,\s]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value;
      setDisplayValue(raw);
      
      const parsed = parseInput(raw);
      if (!isNaN(parsed)) {
        let clamped = parsed;
        if (min !== undefined) clamped = Math.max(min, clamped);
        if (max !== undefined) clamped = Math.min(max, clamped);
        onChange(clamped);
      }
    }
    
    function handleFocus() {
      setIsFocused(true);
      // Show raw number when focused
      setDisplayValue(value.toString());
    }
    
    function handleBlur() {
      setIsFocused(false);
      // Format when blurred
      setDisplayValue(formatDisplay(value));
    }
    
    const prefix = currency ? '$' : '';
    const suffix = percentage ? '%' : '';
    
    return (
      <div className="flex flex-col gap-3" style={{ marginBottom: 16 }}>
        {label && (
          <label className="text-sm font-semibold text-gray-700" style={{ marginBottom: 6 }}>
            {label}
          </label>
        )}
        <div className="relative group">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-semibold pointer-events-none transition-colors duration-200 group-focus-within:text-blue-600">
              {prefix}
            </span>
          )}
          <Input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              prefix && 'pl-8',
              suffix && 'pr-10',
              error && 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-100 hover:border-red-300',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-base font-semibold pointer-events-none transition-colors duration-200 group-focus-within:text-blue-600">
              {suffix}
            </span>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-gray-500 italic leading-relaxed">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
      </div>
    );
  }
);

NumberField.displayName = 'NumberField';

