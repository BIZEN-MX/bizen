import React from "react";
import { StockLogo } from "./StockLogo";
import { SYMBOL_DOMAINS, TICKER_STOCKS } from "@/data/simulators/stocks-constants";

export const TickerTape = ({ marketData }: { marketData: any[] }) => {
  const displayData = marketData && marketData.length > 0
    ? marketData
    : TICKER_STOCKS.map(t => ({ symbol: t.symbol, price: 100, changePercent: t.change }));
  return (
    <div
      className="bizen-ticker-bar"
      style={{
        background: "linear-gradient(90deg,#071540 0%,#0d2275 50%,#071540 100%)",
        height: 86,
        display: "flex",
        alignItems: "center",
        borderBottom: "2px solid rgba(255,255,255,0.07)",
        userSelect: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <div className="bizen-ticker-track" style={{ display: "flex", alignItems: "center" }}>
        {[...displayData, ...displayData].map((s: any, i: number) => {
          const chg = s.changePercent ?? s.change ?? 0;
          const up  = chg >= 0;
          const dom = ((SYMBOL_DOMAINS as Record<string, string>)[s.symbol]) ?? (s.symbol.toLowerCase() + ".com");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 34px", borderRight: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" as const, height: 86, cursor: "default" }}>
              {/* Logo */}
              <StockLogo symbol={s.symbol} size={36} />
              {/* Symbol */}
              <span style={{ fontSize: 16, fontWeight: 800, color: "rgba(255,255,255,0.93)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.05em" }}>{s.symbol}</span>
              {/* Price */}
              <span style={{ fontSize: 18, fontWeight: 700, color: "white", fontFamily: "'JetBrains Mono',monospace" }}>{s.price?.toFixed(0) ?? "—"}</span>
              {/* Change */}
              <span style={{ fontSize: 14, fontWeight: 700, color: up ? "#34d399" : "#f87171", background: up ? "rgba(52,211,153,0.13)" : "rgba(248,113,113,0.13)", border: "1px solid " + (up ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"), borderRadius: 8, padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "'JetBrains Mono',monospace" }}>
                {up ? "▲" : "▼"} {Math.abs(chg).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
