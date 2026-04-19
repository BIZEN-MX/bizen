import React from "react";

export const CandlestickBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!payload || payload.open == null) return null;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? "#10b981" : "#ef4444";
  const bodyTop = Math.min(open, close);
  const bodyBot = Math.max(open, close);
  const bodyH = Math.max(bodyBot - bodyTop, 1);
  // We need to map values to pixel coordinates via the recharts scale
  // recharts passes yAxis scale as a function via props.yAxis.scale
  const scale = props.yAxis?.scale;
  if (!scale) return null;
  const pxHigh = scale(high);
  const pxLow = scale(low);
  const pxOpen = scale(open);
  const pxClose = scale(close);
  const pxBodyTop = Math.min(pxOpen, pxClose);
  const pxBodyBot = Math.max(pxOpen, pxClose);
  const midX = x + width / 2;
  return (
    <g>
      {/* Wick */}
      <line x1={midX} y1={pxHigh} x2={midX} y2={pxLow} stroke={color} strokeWidth={1.5} />
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={pxBodyTop}
        width={width * 0.6}
        height={Math.max(pxBodyBot - pxBodyTop, 1)}
        fill={isUp ? color : color}
        fillOpacity={isUp ? 0.9 : 0.9}
        rx={1}
      />
    </g>
  );
};
