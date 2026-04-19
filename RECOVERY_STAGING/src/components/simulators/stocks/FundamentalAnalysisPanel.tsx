import React from 'react';
import { BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { STOCK_METADATA, STOCK_FUNDAMENTALS } from "@/data/simulators/stock-metadata";

export const FundamentalAnalysisPanel = ({ symbol, currentPrice }: { symbol: string, currentPrice: number }) => {
  if (!symbol) return null;

  const meta = STOCK_METADATA[symbol] || {
    desc: `Estás analizando ${symbol}. Investiga el activo y diversifica tu portafolio.`,
    sector: "Mercado Global", risk: "Variable", stats: "—"
  };
  const fund = STOCK_FUNDAMENTALS[symbol] ?? null;

  // Rating colour helper
  const ratingColor = (score: number) =>
    score >= 5 ? "#10b981" : score >= 4 ? "#3b82f6" : score >= 3 ? "#f59e0b" : "#ef4444";

  // 52W progress %
  const rangePos = fund && fund.week52Low < fund.week52High && currentPrice > 0
    ? Math.min(100, Math.max(0, ((currentPrice - fund.week52Low) / (fund.week52High - fund.week52Low)) * 100))
    : null;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <BarChart3 size={16} color="#3b82f6" />
        <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "#3b82f6", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
          Análisis Fundamental
        </h4>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
          {meta.sector}
        </span>
      </div>

      {/* Description */}
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
        {meta.desc}
      </p>

      {fund ? (
        <>
          {/* ---- Row 1: Key Metrics Grid ---- */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
            {/* Market Cap */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Cap. Mercado</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{fund.marketCap}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>bz</div>
            </div>
            {/* P/E Ratio */}
            <div style={{
              background: fund.pe === null ? "rgba(255,255,255,0.03)" : fund.pe > 40 ? "rgba(239,68,68,0.08)" : fund.pe > 25 ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
              border: `1px solid ${fund.pe === null ? "rgba(255,255,255,0.06)" : fund.pe > 40 ? "rgba(239,68,68,0.25)" : fund.pe > 25 ? "rgba(245,158,11,0.25)" : "rgba(16,185,129,0.25)"}`,
              borderRadius: 12, padding: "12px 14px"
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>P/E Ratio</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: fund.pe === null ? "rgba(255,255,255,0.3)" : fund.pe > 40 ? "#fca5a5" : fund.pe > 25 ? "#fcd34d" : "#6ee7b7" }}>
                {fund.pe !== null ? fund.pe.toFixed(1) : "N/A"}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {fund.pe === null ? "No aplica" : fund.pe > 40 ? "Caro" : fund.pe > 25 ? "Moderado" : "Barato"}
              </div>
            </div>
            {/* Dividend Yield */}
            <div style={{
              background: fund.divYield && fund.divYield > 2 ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${fund.divYield && fund.divYield > 2 ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 12, padding: "12px 14px"
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Dividendo</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: fund.divYield ? "#93c5fd" : "rgba(255,255,255,0.3)" }}>
                {fund.divYield !== null ? `${fund.divYield}%` : "—"}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Yield Anual</div>
            </div>
          </div>

          {/* ---- Row 2: Beta, EPS, Revenue Growth ---- */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
            {/* Beta */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Beta</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: Math.abs(fund.beta) > 1.5 ? "#fca5a5" : Math.abs(fund.beta) > 1.0 ? "#fcd34d" : "#6ee7b7" }}>
                {fund.beta.toFixed(2)}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {Math.abs(fund.beta) > 1.5 ? "Muy Volátil" : Math.abs(fund.beta) > 1.0 ? "Volátil" : fund.beta < 0 ? "Inverso" : "Estable"}
              </div>
            </div>
            {/* EPS */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>EPS</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: fund.eps !== null ? (fund.eps > 0 ? "#a78bfa" : "#fca5a5") : "rgba(255,255,255,0.3)" }}>
                {fund.eps !== null ? `bz ${fund.eps.toFixed(0)}` : "N/A"}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Ganancia/Acción</div>
            </div>
            {/* Revenue Growth */}
            <div style={{
              background: fund.revenueGrowthYoY === null ? "rgba(255,255,255,0.03)" : fund.revenueGrowthYoY > 10 ? "rgba(16,185,129,0.08)" : fund.revenueGrowthYoY > 0 ? "rgba(245,158,11,0.05)" : "rgba(239,68,68,0.07)",
              border: `1px solid ${fund.revenueGrowthYoY === null ? "rgba(255,255,255,0.06)" : fund.revenueGrowthYoY > 10 ? "rgba(16,185,129,0.25)" : fund.revenueGrowthYoY > 0 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.25)"}`,
              borderRadius: 12, padding: "12px 14px"
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Ingresos YoY</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: fund.revenueGrowthYoY === null ? "rgba(255,255,255,0.3)" : fund.revenueGrowthYoY > 10 ? "#6ee7b7" : fund.revenueGrowthYoY > 0 ? "#fcd34d" : "#fca5a5", display: "flex", alignItems: "center", gap: 4 }}>
                {fund.revenueGrowthYoY !== null
                  ? <>{fund.revenueGrowthYoY > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(fund.revenueGrowthYoY)}%</>
                  : "N/A"
                }
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Crecimiento</div>
            </div>
          </div>

          {/* ---- 52-Week Range Bar ---- */}
          <div style={{ marginBottom: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Rango 52 Semanas (bz)</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>
                bz {fund.week52Low.toFixed(0)} — bz {fund.week52High.toFixed(0)}
              </span>
            </div>
            <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${rangePos ?? 50}%`, background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)", borderRadius: 4, transition: "width 0.5s ease" }} />
              {rangePos !== null && (
                <div style={{ position: "absolute", top: "50%", left: `${rangePos}%`, transform: "translate(-50%, -50%)", width: 12, height: 12, background: "white", borderRadius: "50%", border: "2px solid #0f172a", boxShadow: "0 0 6px rgba(255,255,255,0.4)" }} />
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 9, color: "#ef4444", fontWeight: 700 }}>MIN</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Precio actual en rango anual</span>
              <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>MAX</span>
            </div>
          </div>

          {/* ---- Analyst Rating ---- */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Consenso Analistas</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: ratingColor(fund.ratingScore) }}>{fund.ratingLabel}</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= fund.ratingScore ? ratingColor(fund.ratingScore) : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Venta</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Compra Fuerte</span>
            </div>
          </div>
        </>
      ) : (
        /* Fallback if no fundamentals data */
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          <span style={{ fontSize: 11, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: 8, color: "rgba(255,255,255,0.7)" }}>
            Sector: {meta.sector}
          </span>
          <span style={{ fontSize: 11, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "5px 12px", borderRadius: 8, color: "#fcd34d" }}>
            Riesgo: {meta.risk}
          </span>
        </div>
      )}
    </div>
  );
};
