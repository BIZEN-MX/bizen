'use client';

/**
 * NumberField Component — Premium BIZEN UI
 * Currency and numeric input with floating prefix/suffix, smooth focus states
 */

import * as React from 'react';
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
    step,
    label,
    hint,
    error,
    className,
    ...props
  }, ref) => {
    const resolvedStep = step ?? (currency ? 1 : 0.01);
    const [displayValue, setDisplayValue] = React.useState(value.toString());
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      if (!isFocused) setDisplayValue(formatDisplay(value));
    }, [value, isFocused]);

    function formatDisplay(num: number): string {
      if (isNaN(num)) return '';
      if (percentage) return num.toFixed(2);
      if (currency) {
        return new Intl.NumberFormat('es-MX', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(num);
      }
      return num.toString();
    }

    function parseInput(str: string): number {
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
      setDisplayValue(value.toString());
    }

    function handleBlur() {
      setIsFocused(false);
      setDisplayValue(formatDisplay(value));
    }

    const prefix = currency ? '$' : '';
    const suffix = percentage ? '%' : '';
    const hasError = !!error;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
        {label && (
          <label style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#475569',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 2,
          }}>
            {label}
          </label>
        )}

        <div style={{ position: 'relative' }} className="group">
          {/* Prefix badge */}
          {prefix && (
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}>
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: isFocused ? '#0B71FE' : '#94a3b8',
                transition: 'color 0.2s',
                userSelect: 'none',
              }}>
                {prefix}
              </span>
            </div>
          )}

          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
              width: '100%',
              height: 48,
              padding: `0 ${suffix ? '44px' : '16px'} 0 ${prefix ? '44px' : '16px'}`,
              background: hasError ? '#fff1f2' : isFocused ? '#ffffff' : '#f8fafc',
              border: `1.5px solid ${hasError ? '#fca5a5' : isFocused ? '#0B71FE' : '#e2e8f0'}`,
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              color: '#0f172a',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: isFocused
                ? hasError
                  ? '0 0 0 3px rgba(239,68,68,0.12)'
                  : '0 0 0 3px rgba(11,113,254,0.1)'
                : 'none',
              fontFamily: "inherit",
              boxSizing: 'border-box',
            }}
            {...props}
          />

          {/* Suffix badge */}
          {suffix && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}>
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: isFocused ? '#0B71FE' : '#94a3b8',
                transition: 'color 0.2s',
                userSelect: 'none',
              }}>
                {suffix}
              </span>
            </div>
          )}
        </div>

        {hint && !error && (
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{hint}</p>
        )}
        {error && (
          <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

NumberField.displayName = 'NumberField';
