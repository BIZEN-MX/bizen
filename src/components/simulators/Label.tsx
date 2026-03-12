'use client';

import * as React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  tooltip?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, tooltip, style, ...props }, ref) => {
    return (
      <label
        ref={ref}
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 700,
          color: '#475569',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 8,
          ...style,
        }}
        {...props}
      >
        {children}
        {required && <span style={{ color: '#ef4444', marginLeft: 4, fontWeight: 800 }}>*</span>}
        {tooltip && (
          <span style={{ marginLeft: 8, fontSize: 11, color: '#94a3b8', fontWeight: 500, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>
            ({tooltip})
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
