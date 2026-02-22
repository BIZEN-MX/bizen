'use client';

/**
 * Label Component
 * Simple label for form fields with optional tooltip
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  tooltip?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, tooltip, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-semibold text-gray-800', className)}
        style={{ marginBottom: 10, display: 'block' }}
        {...props}
      >
        {children}
        {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        {tooltip && (
          <span className="tooltip-text" style={{ marginLeft: 8, fontSize: '0.75rem', color: '#64748b', fontWeight: 400, fontStyle: 'italic' }}>
            ({tooltip})
          </span>
        )}
        <style jsx>{`
          @media (max-width: 640px) {
            .tooltip-text {
              display: block !important;
              margin-left: 0 !important;
              margin-top: 4px !important;
            }
          }
        `}</style>
      </label>
    );
  }
);

Label.displayName = 'Label';

