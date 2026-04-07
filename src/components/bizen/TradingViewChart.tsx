import React, { useEffect, useRef, useMemo, useState } from 'react';
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
  const seriesRef = useRef<any>(null);
  const [lastLivePrice, setLastLivePrice] = useState<number | null>(null);
  const liveHighLowRef = useRef<{ high: number, low: number } | null>(null);

  // Process data for TV
  const { mainSeriesData, smaData, emaData } = useMemo(() => {
    const main: any[] = [];
    const sma: any[] = [];
    const ema: any[] = [];

    data.forEach((d, i) => {
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

  // Initial chart setup
  useEffect(() => {
    if (!chartContainerRef.current) return;

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
        autoScale: true,
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
        upColor: '#10b981', downColor: '#ef4444', borderVisible: false,
        wickUpColor: '#10b981', wickDownColor: '#ef4444',
      });
    } else {
      mainSeries = chart.addSeries(AreaSeries, {
        lineColor: '#10b981', topColor: 'rgba(16, 185, 129, 0.25)',
        bottomColor: 'rgba(16, 185, 129, 0.0)', lineWidth: 2,
      });
    }
    mainSeries.setData(mainSeriesData);
    seriesRef.current = mainSeries;

    // Reset live session tracking
    if (mainSeriesData.length > 0) {
        const last = mainSeriesData[mainSeriesData.length - 1];
        if (chartType === "candle") {
            liveHighLowRef.current = { high: last.high, low: last.low };
            setLastLivePrice(last.close);
        } else {
            setLastLivePrice(last.value);
        }
    }

    // Indicators
    if (showSMA) {
      const smaSeries = chart.addSeries(LineSeries, { color: '#fbbf24', lineWidth: 1.5, lineStyle: 1, crosshairMarkerVisible: false });
      smaSeries.setData(smaData);
    }
    if (showEMA) {
      const emaSeries = chart.addSeries(LineSeries, { color: '#a78bfa', lineWidth: 1.5, crosshairMarkerVisible: false });
      emaSeries.setData(emaData);
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [mainSeriesData, smaData, emaData, chartType, showSMA, showEMA]);

  // LIVE PRICE SIMULATION: Updated more frequently (800ms) with slightly more volatility
  useEffect(() => {
    if (!seriesRef.current || mainSeriesData.length === 0) return;

    const interval = setInterval(() => {
      const lastPoint = mainSeriesData[mainSeriesData.length - 1];
      const currentPrice = lastLivePrice || (chartType === "candle" ? lastPoint.close : lastPoint.value);
      
      // Simulado: jitter de +/- 0.08% cada 800ms
      const jitter = 1 + (Math.random() * 0.0016 - 0.0008);
      const newPrice = currentPrice * jitter;
      setLastLivePrice(newPrice);

      if (chartType === "candle") {
        if (!liveHighLowRef.current) liveHighLowRef.current = { high: lastPoint.high, low: lastPoint.low };
        
        liveHighLowRef.current.high = Math.max(liveHighLowRef.current.high, newPrice);
        liveHighLowRef.current.low = Math.min(liveHighLowRef.current.low, newPrice);

        seriesRef.current.update({
          ...lastPoint,
          close: newPrice,
          high: liveHighLowRef.current.high,
          low: liveHighLowRef.current.low,
        });
      } else {
        seriesRef.current.update({
          ...lastPoint,
          value: newPrice,
        });
      }
    }, 800);

    return () => clearInterval(interval);
  }, [mainSeriesData, chartType, lastLivePrice]);

  return (
    <div 
      ref={chartContainerRef} 
      style={{ width: '100%', height: '100%' }} 
    />
  );
}
