import React, { useEffect, useRef, useMemo } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries, AreaSeries, LineSeries } from 'lightweight-charts';

interface TVChartProps {
  data: any[];
  chartType: "area" | "candle";
  showSMA: boolean;
  showEMA: boolean;
}

export default function TradingViewChart({ data, chartType, showSMA, showEMA }: TVChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Process data for TV
  const { mainSeriesData, smaData, emaData } = useMemo(() => {
    const main: any[] = [];
    const sma: any[] = [];
    const ema: any[] = [];

    data.forEach((d, i) => {
      // time must be YYYY-MM-DD or unix timestamp
      // Assuming d.date is 'YYYY-MM-DD' or similar string/number representation.
      const time = d.date;

      const closeVal = d.bizcoins;
      const prevVal = i > 0 ? data[i - 1].bizcoins : closeVal * 0.999;
      
      const open = prevVal;
      const high = Math.max(open, closeVal) * 1.002;
      const low = Math.min(open, closeVal) * 0.998;

      if (chartType === "candle") {
        main.push({ time, open, high, low, close: closeVal });
      } else {
        main.push({ time, value: closeVal });
      }

      if (d.sma !== undefined && d.sma !== null) sma.push({ time, value: d.sma });
      if (d.ema !== undefined && d.ema !== null) ema.push({ time, value: d.ema });
    });

    return { mainSeriesData: main, smaData: sma, emaData: ema };
  }, [data, chartType]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Remove existing chart on re-init
    if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.5)',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
      },
      autoSize: true,
    });

    chartRef.current = chart;

    let mainSeries: any;

    if (chartType === "candle") {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
      mainSeries.setData(mainSeriesData);
    } else {
      mainSeries = chart.addSeries(AreaSeries, {
        lineColor: '#10b981',
        topColor: 'rgba(16, 185, 129, 0.25)',
        bottomColor: 'rgba(16, 185, 129, 0.0)',
        lineWidth: 2,
      });
      mainSeries.setData(mainSeriesData);
    }

    // Add Indicators
    if (showSMA) {
      const smaSeries = chart.addSeries(LineSeries, {
        color: '#fbbf24',
        lineWidth: 1.5,
        lineStyle: 1, // Dotted
        crosshairMarkerVisible: false,
      });
      smaSeries.setData(smaData);
    }

    if (showEMA) {
      const emaSeries = chart.addSeries(LineSeries, {
        color: '#a78bfa',
        lineWidth: 1.5,
        crosshairMarkerVisible: false,
      });
      emaSeries.setData(emaData);
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [mainSeriesData, smaData, emaData, chartType, showSMA, showEMA]);

  return (
    <div 
      ref={chartContainerRef} 
      style={{ width: '100%', height: '100%' }} 
    />
  );
}
