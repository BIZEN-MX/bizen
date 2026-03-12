'use client';

/**
 * Chart Component — Premium BIZEN UI
 * Recharts wrapper with custom premium tooltip and axis styles
 */

import * as React from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { currencyMXN, formatNumber } from '@/lib/simulators';

export interface ChartProps {
  data: any[];
  type?: 'line' | 'bar';
  lines?: Array<{ dataKey: string; name: string; color: string }>;
  xAxisKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  formatYAxis?: 'currency' | 'number' | 'percent';
  height?: number;
}

export function Chart({
  data,
  type = 'line',
  lines = [],
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  formatYAxis = 'currency',
  height = 300,
}: ChartProps) {
  function formatYValue(value: number): string {
    if (formatYAxis === 'currency') return currencyMXN(value, 0);
    if (formatYAxis === 'percent') return `${value.toFixed(1)}%`;
    return formatNumber(value, 0);
  }

  function formatTooltipValue(value: number): string {
    if (formatYAxis === 'currency') return currencyMXN(value, 2);
    if (formatYAxis === 'percent') return `${value.toFixed(2)}%`;
    return formatNumber(value, 2);
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        minWidth: 180,
        fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {xAxisLabel || 'Periodo'} {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < payload.length - 1 ? 6 : 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: 13, color: '#475569', flex: 1 }}>{entry.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{formatTooltipValue(entry.value as number)}</span>
          </div>
        ))}
      </div>
    );
  };

  const axisStyle = { fontSize: 12, fill: '#94a3b8', fontFamily: '-apple-system,sans-serif' };
  const gridStyle = { stroke: '#f1f5f9', strokeDasharray: '4 4' };
  const margin = { top: 16, right: 20, left: 10, bottom: 24 };

  const sharedXAxis = (
    <XAxis
      dataKey={xAxisKey}
      tick={axisStyle}
      axisLine={{ stroke: '#e2e8f0' }}
      tickLine={false}
      height={48}
      label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 12 } : undefined}
    />
  );

  const sharedYAxis = (
    <YAxis
      tickFormatter={formatYValue}
      tick={axisStyle}
      axisLine={false}
      tickLine={false}
      width={90}
      label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 } : undefined}
    />
  );

  const sharedLegend = (
    <Legend
      wrapperStyle={{ fontSize: '13px', paddingTop: '16px', color: '#475569', fontFamily: '-apple-system,sans-serif' }}
      iconType={type === 'bar' ? 'square' : 'circle'}
      iconSize={10}
    />
  );

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={margin}>
          <CartesianGrid {...gridStyle} vertical={false} />
          {sharedXAxis}
          {sharedYAxis}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(11,113,254,0.04)' }} />
          {sharedLegend}
          {lines.map(line => (
            <Bar key={line.dataKey} dataKey={line.dataKey} name={line.name} fill={line.color} radius={[6, 6, 0, 0]} maxBarSize={48} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        <CartesianGrid {...gridStyle} vertical={false} />
        {sharedXAxis}
        {sharedYAxis}
        <Tooltip content={<CustomTooltip />} />
        {sharedLegend}
        {lines.map(line => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'white' }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
