'use client';

/**
 * Alert Component — Premium BIZEN UI
 */

import { Info, Lightbulb, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'warning' | 'success' | 'danger';
  icon?: React.ReactNode;
}

const VARIANTS = {
  default: { bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '#e2e8f0', text: '#475569', icon: <Info size={18} /> },
  info:    { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#93c5fd', text: '#1e40af', icon: <Lightbulb size={18} /> },
  warning: { bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a', text: '#92400e', icon: <AlertTriangle size={18} /> },
  success: { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '#86efac', text: '#166534', icon: <CheckCircle2 size={18} /> },
  danger:  { bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', border: '#fca5a5', text: '#991b1b', icon: <XCircle size={18} /> },
};

export function Alert({ variant = 'default', icon, className, children, style, ...props }: AlertProps) {
  const v = VARIANTS[variant];
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 18px',
        borderRadius: 16,
        border: `1.5px solid ${v.border}`,
        background: v.bg,
        color: v.text,
        ...style,
      }}
      {...props}
    >
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1, lineHeight: 1 }}>{icon || v.icon}</span>
      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{children}</div>
    </div>
  );
}
