import React, { useState } from "react";
import { SYMBOL_DOMAINS } from "@/data/simulators/stocks-constants";

export const StockLogo = ({
  symbol,
  size = 32,
}: {
  symbol: string;
  size?: number;
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const domain = SYMBOL_DOMAINS[symbol];

  if (!domain || showFallback) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 4,
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #e2e8f0",
          fontSize: size * 0.4,
          fontWeight: 800,
          color: "#94a3b8",
          flexShrink: 0,
        }}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const handleLogoError = () => {
    setShowFallback(true);
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 4,
        background: "white",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
      }}
    >
      <img
        src={logoUrl}
        alt={symbol}
        style={{ width: "85%", height: "85%", objectFit: "contain" }}
        onError={handleLogoError}
      />
    </div>
  );
};
