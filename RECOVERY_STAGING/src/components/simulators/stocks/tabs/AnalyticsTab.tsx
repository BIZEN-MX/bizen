import React from 'react';
import { Activity, BarChart3, Info } from 'lucide-react';
import { STOCK_METADATA } from '@/data/simulators/stock-metadata';

type JournalEntry = { id: string; symbol: string; side: string; qty: number; price: number; note: string; date: string; };

interface AnalyticsTabProps {
  portfolio: any;
  processedMarketData: any[];
  history: any[];
  tradeJournal: JournalEntry[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  portfolio,
  processedMarketData,
  history,
  tradeJournal
}) => {
  const holdings = portfolio?.holdings ?? [];
  const totalVal = holdings.reduce((s: number, h: any) => {
    const price = processedMarketData.find((m: any) => m.symbol === h.symbol)?.price ?? Number(h.avg_price);
    return s + price * Number(h.quantity);
  }, 0) + Number(portfolio?.cash_balance ?? 0);

  // Sector allocation
  const sectorMap: Record<string, number> = {};
  holdings.forEach((h: any) => {
    const price = processedMarketData.find((m: any) => m.symbol === h.symbol)?.price ?? h.avg_price;
    const val = price * h.quantity;
    const sector = STOCK_METADATA[h.symbol]?.sector ?? "Otro";
    sectorMap[sector] = (sectorMap[sector] ?? 0) + val;
  });
  const sectorEntries = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
  const SECTOR_COLORS = ["#3b82f6","#10b981","#f59e0b","#a78bfa","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#8b5cf6"];

  // Donut math
  const total = sectorEntries.reduce((s, [, v]) => s + v, 0);
  let cumAngle = -90;
  const donutSlices = sectorEntries.map(([name, val], i) => {
    const pct = total > 0 ? val / total : 0;
    const startAngle = cumAngle;
    cumAngle += pct * 360;
    return { name, val, pct, startAngle, endAngle: cumAngle, color: SECTOR_COLORS[i % SECTOR_COLORS.length] };
  });
  const polarToXY = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
    const s = polarToXY(cx, cy, r, startDeg);
    const e = polarToXY(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  // Risk metrics (approximated from price history)
  const histPrices = history.map((h: any) => h.price ?? 0).filter(Boolean);
  const returns = histPrices.slice(1).map((p: number, i: number) => (p - histPrices[i]) / histPrices[i]);
  const avgReturn = returns.length > 0 ? returns.reduce((a: number, b: number) => a + b, 0) / returns.length : 0;
  const variance = returns.length > 0 ? returns.reduce((s: number, r: number) => s + Math.pow(r - avgReturn, 2), 0) / returns.length : 0;
  const volatility = Math.sqrt(variance * 252) * 100; // annualized
  const riskFreeRate = 0.05 / 252;
  const sharpe = returns.length > 0 && variance > 0
    ? ((avgReturn - riskFreeRate) / Math.sqrt(variance)) * Math.sqrt(252)
    : 0;
  const peaks = histPrices.reduce((acc: number[], p: number) => [...acc, Math.max(p, acc[acc.length - 1] ?? p)], []);
  const drawdowns = histPrices.map((p: number, i: number) => peaks[i] > 0 ? (p - peaks[i]) / peaks[i] * 100 : 0);
  const maxDrawdown = Math.min(...drawdowns, 0);

  return (
    <div style={{ padding: "28px clamp(16px,4vw,32px)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,30,94,0.06)", border: "1.5px solid rgba(11,30,94,0.1)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
        <Activity size={12} color="#0B1E5E" />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1E5E", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Portfolio Analytics</span>
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0B1E5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Análisis Avanzado</h2>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 28px" }}>Métricas de riesgo y retorno de tu portafolio.</p>

      {/* --- Risk Metrics Row --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Valor Total", value: `${totalVal.toFixed(0)} bz`, sub: "Portafolio + Cash", color: "#0B1E5E" },
          { label: "Volatilidad", value: volatility > 0 ? `${volatility.toFixed(1)}%` : "—", sub: "Anualizada", color: volatility > 30 ? "#ef4444" : volatility > 15 ? "#f59e0b" : "#10b981" },
          { label: "Sharpe Ratio", value: sharpe !== 0 ? sharpe.toFixed(2) : "—", sub: sharpe > 1 ? "Bueno" : sharpe > 0 ? "Moderado" : "Bajo", color: sharpe > 1 ? "#10b981" : sharpe > 0 ? "#f59e0b" : "#ef4444" },
          { label: "Max Drawdown", value: maxDrawdown !== 0 ? `${maxDrawdown.toFixed(1)}%` : "—", sub: "Peor caída", color: maxDrawdown < -20 ? "#ef4444" : maxDrawdown < -10 ? "#f59e0b" : "#10b981" },
        ].map(m => (
          <div key={m.label} style={{ background: "white", borderRadius: 16, padding: "16px 18px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* --- Sector Donut + Legend --- */}
      {sectorEntries.length > 0 && (
        <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1.5px solid #f1f5f9", marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={16} color="#0B1E5E" /> Distribución por Sector
          </h3>
          <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" as const }}>
            <svg width={140} height={140} viewBox="0 0 140 140">
              {donutSlices.map((s, i) => (
                s.pct > 0.01 && (
                  <path
                    key={i}
                    d={describeArc(70, 70, 54, s.startAngle, s.endAngle - 0.5)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={20}
                    strokeLinecap="butt"
                  />
                )
              ))}
              <circle cx={70} cy={70} r={36} fill="white" />
              <text x={70} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0B1E5E">{sectorEntries.length}</text>
              <text x={70} y={82} textAnchor="middle" fontSize={9} fill="#94a3b8">sectores</text>
            </svg>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {donutSlices.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{s.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0B1E5E" }}>{(s.pct * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Trading Journal --- */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", margin: "0 0 18px", display: "flex", alignItems: "center", gap: 8 }}>
          <Info size={16} color="#0B1E5E" /> Bitácora de Trading ({tradeJournal.length})
        </h3>
        {tradeJournal.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "32px 16px", color: "#94a3b8" }}>
            <Info size={28} style={{ opacity: 0.3, marginBottom: 10 }} />
            <p style={{ fontSize: 13, margin: 0 }}>Ninguna operación registrada aún.<br />Escribe tu tesis antes de cada operación en el formulario de orden.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {tradeJournal.map(entry => (
              <div key={entry.id} style={{ padding: "14px 18px", background: "#f8fafc", borderRadius: 14, border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: entry.note ? 10 : 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1E5E" }}>{entry.symbol}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: entry.side === "buy" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: entry.side === "buy" ? "#10b981" : "#ef4444" }}>
                    {entry.side === "buy" ? "Compra" : "Venta"}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{entry.qty} acciones @ {entry.price.toFixed(0)} bz</span>
                  <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>{entry.date}</span>
                </div>
                {entry.note && (
                  <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.6, fontStyle: "italic", borderLeft: "3px solid #e2e8f0", paddingLeft: 12 }}>
                    "{entry.note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
