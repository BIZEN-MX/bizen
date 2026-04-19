import React, { useState } from 'react';
import { Target, ArrowUp, ArrowDown, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { StockLogo } from '@/components/simulators/stocks/StockLogo';
import { STOCK_METADATA } from '@/data/simulators/stock-metadata';

export type PriceAlert = { id: string; symbol: string; targetPrice: number; direction: 'above' | 'below'; triggered: boolean; };

interface WatchlistTabProps {
  processedMarketData: any[];
  portfolio: any;
  selectStock: (symbol: string) => void;
  priceAlerts: PriceAlert[];
  setPriceAlerts: (alerts: PriceAlert[]) => void;
  triggeredAlerts: string[];
}

export const WatchlistTab: React.FC<WatchlistTabProps> = ({
  processedMarketData,
  portfolio,
  selectStock,
  priceAlerts,
  setPriceAlerts,
  triggeredAlerts
}) => {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  React.useEffect(() => {
    fetch("/api/simulators/stocks/watchlist")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setWatchlist(d.map((i: any) => i.symbol)) })
      .catch(console.error)
  }, []);
  const [watchlistInput, setWatchlistInput] = useState("");
  const [alertSymbol, setAlertSymbol] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertDirection, setAlertDirection] = useState<'above'|'below'>('above');

  const toggleWatchlist = async (sym: string) => {
    const isRemoving = watchlist.includes(sym);
    const next = isRemoving ? watchlist.filter(s => s !== sym) : [...watchlist, sym];
    setWatchlist(next);

    try {
      if (isRemoving) {
        await fetch(`/api/simulators/stocks/watchlist?symbol=${sym}`, { method: "DELETE" });
      } else {
        await fetch("/api/simulators/stocks/watchlist", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol: sym }) 
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const availableSymbols = processedMarketData.map((s: any) => s.symbol).filter((s: string) => !watchlist.includes(s));

  return (
    <div style={{ padding: "28px clamp(16px, 4vw, 32px)" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,30,94,0.06)", border: "1.5px solid rgba(11,30,94,0.1)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
          <Target size={12} color="#0B1E5E" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1E5E", textTransform: "uppercase", letterSpacing: "0.08em" }}>Mi Watchlist</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0B1E5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Activos en Vigilancia
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Sigue tus activos favoritos en tiempo real sin necesidad de comprarlos.
        </p>
      </div>

      {/* Add to Watchlist */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <select
          value={watchlistInput}
          onChange={e => setWatchlistInput(e.target.value)}
          style={{
            flex: 1, minWidth: 160, height: 44, padding: "0 14px",
            background: "white", border: "1.5px solid #e2e8f0",
            borderRadius: 12, color: "#0B1E5E", fontSize: 14, fontWeight: 600,
            fontFamily: "inherit", outline: "none", cursor: "pointer",
          }}
        >
          <option value="">Seleccionar activo para agregar...</option>
          {availableSymbols.map((s: string) => (
            <option key={s} value={s}>{s} — {processedMarketData.find((m: any) => m.symbol === s)?.name?.slice(0, 30)}</option>
          ))}
        </select>
        <button
          onClick={() => { if (watchlistInput) { toggleWatchlist(watchlistInput); setWatchlistInput(""); } }}
          disabled={!watchlistInput}
          style={{
            height: 44, padding: "0 20px", borderRadius: 12, border: "none",
            background: watchlistInput ? "#0B1E5E" : "#e2e8f0",
            color: watchlistInput ? "white" : "#94a3b8",
            fontSize: 13, fontWeight: 700, cursor: watchlistInput ? "pointer" : "not-allowed",
            fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s",
          }}
        >
          <ArrowUp size={14} /> Agregar
        </button>
      </div>

      {watchlist.length === 0 ? (
        /* Empty State */
        <div style={{ textAlign: "center", padding: "48px 24px", background: "#f8fafc", borderRadius: 20, border: "2px dashed #e2e8f0" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#0B1E5E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Target size={24} color="white" />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0B1E5E", margin: "0 0 8px" }}>Tu watchlist está vacía</h3>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6 }}>
            Agrega activos que quieras seguir sin necesidad de invertir en ellos todavía.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {["AAPL", "NVDA", "MSFT", "TSLA", "VOO"].map(sym => (
              <button
                key={sym}
                onClick={() => toggleWatchlist(sym)}
                style={{
                  padding: "6px 16px", borderRadius: 99, border: "1px solid #e2e8f0",
                  background: "white", color: "#0B1E5E", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                + {sym}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Watchlist Table */
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {watchlist.map(sym => {
            const stock = processedMarketData.find((s: any) => s.symbol === sym);
            if (!stock) return null;
            const meta = STOCK_METADATA[sym];
            const change = stock.changePercent ?? 0;
            const isUp = change >= 0;
            const isInPortfolio = portfolio?.holdings?.some((h: any) => h.symbol === sym);
            return (
              <motion.div
                key={sym}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "white", borderRadius: 16, padding: "14px 18px",
                  border: "1.5px solid #f1f5f9",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {/* Logo */}
                <div style={{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", background: "#f8fafc", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <StockLogo symbol={sym} size={36} />
                </div>
                {/* Symbol + Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0B1E5E" }}>{sym}</span>
                    {isInPortfolio && (
                      <span style={{ fontSize: 9, background: "rgba(11,30,94,0.08)", color: "#0B1E5E", padding: "2px 7px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.04em" }}>En Portafolio</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 9, background: "#f1f5f9", padding: "2px 7px", borderRadius: 6, color: "#64748b", fontWeight: 600 }}>{meta?.sector || "ETF"}</span>
                    <span style={{ color: "#cbd5e1" }}>|</span>
                    <span>{meta?.risk || "—"}</span>
                  </div>
                </div>
                {/* Price */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0B1E5E" }}>
                    {stock.price.toFixed(0)} bz
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 3 }}>
                    {isUp ? <ArrowUp size={12} color="#10b981" /> : <ArrowDown size={12} color="#ef4444" />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: isUp ? "#10b981" : "#ef4444" }}>
                      {isUp ? "+" : ""}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => { selectStock(sym); }}
                    style={{
                      padding: "6px 12px", borderRadius: 8, border: "none",
                      background: "rgba(16,185,129,0.1)", color: "#10b981",
                      fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => toggleWatchlist(sym)}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "1px solid #f1f5f9",
                      background: "white", color: "#ef4444", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      {/* ====== PRICE ALERTS ====== */}
      <div style={{ marginTop: 32, background: "white", borderRadius: 20, padding: "24px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0B1E5E", margin: "0 0 18px", display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={16} color="#f59e0b" /> Alertas de Precio
        </h3>
        {/* Create Alert Form */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <select
            value={alertSymbol}
            onChange={e => setAlertSymbol(e.target.value)}
            style={{ flex: "1 1 120px", height: 40, padding: "0 10px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "white", color: "#0B1E5E", outline: "none" }}
          >
            <option value="">Activo...</option>
            {processedMarketData.map((s: any) => (
              <option key={s.symbol} value={s.symbol}>{s.symbol}</option>
            ))}
          </select>
          <select
            value={alertDirection}
            onChange={e => setAlertDirection(e.target.value as 'above' | 'below')}
            style={{ flex: "0 0 110px", height: 40, padding: "0 10px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "white", color: "#0B1E5E", outline: "none" }}
          >
            <option value="above">Sube a</option>
            <option value="below">Cae a</option>
          </select>
          <input
            type="number"
            placeholder="Precio bz"
            value={alertPrice}
            onChange={e => setAlertPrice(e.target.value)}
            style={{ flex: "1 1 90px", height: 40, padding: "0 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", color: "#0B1E5E" }}
          />
          <button
            onClick={async () => {
              if (!alertSymbol || !alertPrice) return;
              const sym = alertSymbol;
              const price = alertPrice;
              const dir = alertDirection;
              const tempId = "temp-" + Date.now().toString();
              
              const newAlert: PriceAlert = { id: tempId, symbol: sym, targetPrice: parseFloat(price), direction: dir, triggered: false };
              setPriceAlerts([...priceAlerts, newAlert]);
              setAlertSymbol(""); setAlertPrice("");
              
              try {
                const res = await fetch("/api/simulators/stocks/alerts", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ symbol: sym, targetPrice: price, direction: dir })
                });
                if (res.ok) {
                  const created = await res.json();
                  setPriceAlerts(prev => prev.map(a => a.id === tempId ? created : a));
                }
              } catch (e) { console.error(e) }
            }}
            disabled={!alertSymbol || !alertPrice}
            style={{ height: 40, padding: "0 16px", borderRadius: 10, border: "none", background: alertSymbol && alertPrice ? "#0B1E5E" : "#e2e8f0", color: alertSymbol && alertPrice ? "white" : "#94a3b8", fontSize: 12, fontWeight: 700, cursor: alertSymbol && alertPrice ? "pointer" : "not-allowed", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Zap size={13} /> Crear
          </button>
        </div>
        {/* Alert List */}
        {priceAlerts.length === 0 ? (
          <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "16px 0", margin: 0 }}>Sin alertas activas. Crea una para saber cuándo actuar.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {priceAlerts.map(al => {
              const fired = al.triggered || triggeredAlerts.includes(al.id);
              const currentPrice = (processedMarketData.find((s: any) => s.symbol === al.symbol)?.price ?? 0);
              return (
                <div key={al.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: fired ? "rgba(16,185,129,0.06)" : "#f8fafc", borderRadius: 12, border: `1px solid ${fired ? "rgba(16,185,129,0.25)" : "#f1f5f9"}` }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0B1E5E" }}>{al.symbol}</span>
                    <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>
                      {al.direction === 'above' ? 'Sube a' : 'Cae a'} bz {al.targetPrice.toFixed(0)}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 4 }}>Actual: bz {currentPrice.toFixed(0)}</span>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: fired ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.1)", color: fired ? "#10b981" : "#f59e0b" }}>
                    {fired ? "Disparada" : "Activa"}
                  </span>
                  <button
                    onClick={() => {
                      const updated = priceAlerts.filter(a => a.id !== al.id);
                      setPriceAlerts(updated);
                      if (!al.id.startsWith("temp-")) {
                        fetch(`/api/simulators/stocks/alerts?id=${al.id}`, { method: "DELETE" }).catch(console.error);
                      }
                    }}
                    style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #f1f5f9", background: "white", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
