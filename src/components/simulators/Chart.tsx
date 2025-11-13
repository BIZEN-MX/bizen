'use client';

/**
 * Chart Component
 * Recharts wrapper for financial simulators
 */

import * as React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { currencyMXN, formatNumber } from '@/lib/simulators';

export interface ChartProps {
  data: any[];
  type?: 'line' | 'bar';
  lines?: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
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
    if (formatYAxis === 'currency') {
      return currencyMXN(value, 0);
    } else if (formatYAxis === 'percent') {
      return `${value.toFixed(1)}%`;
    } else {
      return formatNumber(value, 0);
    }
  }
  
  function formatTooltipValue(value: number): string {
    if (formatYAxis === 'currency') {
      return currencyMXN(value, 2);
    } else if (formatYAxis === 'percent') {
      return `${value.toFixed(2)}%`;
    } else {
      return formatNumber(value, 2);
    }
  }
  
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="text-sm font-semibold text-gray-900 mb-2">
          {xAxisLabel || 'Periodo'}: {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span>{' '}
            {formatTooltipValue(entry.value as number)}
          </p>
        ))}
      </div>
    );
  };
  
  const chartMargin = { top: 20, right: 30, left: 10, bottom: 20 };
  
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
            tick={{ fontSize: 13, fill: '#374151' }}
            height={60}
          />
          <YAxis
            tickFormatter={formatYValue}
            tick={{ fontSize: 12, fill: '#374151' }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '20px', paddingBottom: '10px' }} 
            iconType="square"
          />
          {lines.map((line) => (
            <Bar
              key={line.dataKey}
              dataKey={line.dataKey}
              name={line.name}
              fill={line.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xAxisKey}
          label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          tick={{ fontSize: 13, fill: '#374151' }}
          height={60}
        />
        <YAxis
          tickFormatter={formatYValue}
          tick={{ fontSize: 12, fill: '#374151' }}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ fontSize: '14px', paddingTop: '20px', paddingBottom: '10px' }} 
          iconType="circle"
        />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

