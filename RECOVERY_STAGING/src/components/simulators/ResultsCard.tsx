'use client';

/**
 * ResultsCard Component — Premium BIZEN UI
 */

import * as React from 'react';

export interface ResultsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  hint?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

const VARIANTS = {
  default:  { bg: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', border: '#e2e8f0', label: '#64748b', value: '#0f172a', badge: '#475569' },
  success:  { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '#86efac', label: '#166534', value: '#14532d', badge: '#16a34a' },
  warning:  { bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '#fde68a', label: '#92400e', value: '#78350f', badge: '#d97706' },
  danger:   { bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', border: '#fca5a5', label: '#991b1b', value: '#7f1d1d', badge: '#dc2626' },
  info:     { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#93c5fd', label: '#1e40af', value: '#1e3a8a', badge: '#2563eb' },
};

export function ResultsCard({
  title,
  value,
  subtitle,
  hint,
  variant = 'default',
  icon,
}: ResultsCardProps) {
  const v = VARIANTS[variant];

  return (
    <div style={{
      background: v.bg,
      border: `1.5px solid ${v.border}`,
      borderRadius: 18,
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: v.label, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', opacity: 0.8 }}>
          {title}
        </p>
        <p style={{ fontSize: 26, fontWeight: 600, color: v.value, margin: '0 0 4px', letterSpacing: '-0.025em', lineHeight: 1.1, wordBreak: 'break-word' }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: 12, color: v.label, margin: '4px 0 0', opacity: 0.75 }}>{subtitle}</p>
        )}
        {hint && (
          <p style={{ fontSize: 11, color: v.label, margin: '6px 0 0', fontStyle: 'italic', opacity: 0.6 }}>{hint}</p>
        )}
      </div>
      {icon && (
        <div style={{ fontSize: 28, flexShrink: 0, opacity: 0.85 }}>{icon}</div>
      )}
    </div>
  );
}
