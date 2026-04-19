import React from 'react';
import { Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';

export const CompanyNewsPanel = ({ symbol, fetchingStockNews, stockNews }: { symbol: string, fetchingStockNews: boolean, stockNews: any[] }) => {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Newspaper size={18} color="#94a3b8" />
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Noticias Recientes de {symbol}
        </h4>
      </div>
      {fetchingStockNews ? (
        <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 24, height: 24, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          {stockNews.map((n) => (
            <motion.div
              key={n.id}
              whileHover={{ background: "rgba(255,255,255,0.05)" }}
              style={{
                display: "flex",
                gap: 14,
                padding: 12,
                borderRadius: 16,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onClick={() => window.open(n.url, "_blank")}
            >
              <img src={n.image} alt={n.title} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#10b981", marginBottom: 4 }}>{n.category} • {n.time}</div>
                <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{n.title}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
