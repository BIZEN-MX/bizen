import React from 'react';
import { BarChart2 } from 'lucide-react';

export const OrderBookPanel = ({ orderBook }: { orderBook: any[] }) => {
  if (!orderBook || orderBook.length === 0) return null;

  const asks = orderBook.filter(o => o.type === 'ask');
  const bids = orderBook.filter(o => o.type === 'bid');
  const maxTotal = Math.max(...orderBook.map(o => o.total));
  const totalBidVol = bids.reduce((s, b) => s + b.size, 0);
  const totalAskVol = asks.reduce((s, a) => s + a.size, 0);
  const buyPressure = Math.round((totalBidVol / (totalBidVol + totalAskVol)) * 100);
  const midPrice = asks.length > 0 && bids.length > 0
    ? ((asks[asks.length - 1].price + bids[0].price) / 2)
    : 0;
  const spread = asks.length > 0 && bids.length > 0
    ? (asks[asks.length - 1].price - bids[0].price)
    : 0;

  return (
    <div style={{ marginBottom: 24, background: "#0a0f1e", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart2 size={13} color="#64748b" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Libro de Órdenes</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
          <span>Spread: <strong style={{ color: "#f59e0b" }}>{spread.toFixed(2)}</strong></span>
          <span>Mid: <strong style={{ color: "white" }}>bz {midPrice.toFixed(2)}</strong></span>
        </div>
      </div>

      {/* Column Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const }}>Precio (bz)</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const, textAlign: "center" as const }}>Tamaño</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" as const, textAlign: "right" as const }}>Acumulado</span>
      </div>

      {/* Ask rows (sell orders — red) */}
      <div>
        {asks.map((row, i) => (
          <div key={`ask-${i}`} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "5px 16px", alignItems: "center" }}>
            <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${(row.total / maxTotal) * 100}%`, background: "rgba(239,68,68,0.08)", transition: "width 0.4s ease" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.price.toFixed(2)}</span>
            <span style={{ fontSize: 11, color: "rgba(239,68,68,0.8)", textAlign: "center" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.size.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.total.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Mid price separator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "0.02em" }}>bz {midPrice.toFixed(2)}</span>
        <span style={{ fontSize: 10, color: spread > 0 ? "#10b981" : "#ef4444", fontWeight: 700 }}>Spread {spread.toFixed(3)}</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Bid rows (buy orders — green) */}
      <div>
        {bids.map((row, i) => (
          <div key={`bid-${i}`} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "5px 16px", alignItems: "center" }}>
            <div style={{ position: "absolute", right: 0, top: 0, height: "100%", width: `${(row.total / maxTotal) * 100}%`, background: "rgba(16,185,129,0.08)", transition: "width 0.4s ease" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.price.toFixed(2)}</span>
            <span style={{ fontSize: 11, color: "rgba(16,185,129,0.8)", textAlign: "center" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.size.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "right" as const, fontVariantNumeric: "tabular-nums", zIndex: 1 }}>{row.total.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Buy/Sell Pressure Bar */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981" }}>Compra {buyPressure}%</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#ef4444" }}>Venta {100 - buyPressure}%</span>
        </div>
        <div style={{ display: "flex", height: 4, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${buyPressure}%`, background: "#10b981", transition: "width 0.6s ease" }} />
          <div style={{ flex: 1, background: "#ef4444" }} />
        </div>
      </div>
    </div>
  );
};
