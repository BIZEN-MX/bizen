import React, { useState, useEffect } from "react";
import { Flame, TrendingUp, TrendingDown } from "lucide-react";

export const RankingsTab: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [fetchingRankings, setFetchingRankings] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      if (leaderboard.length > 0) return;
      setFetchingRankings(true);
      try {
        const res = await fetch("/api/simulators/stocks/leaderboard");
        if (res.ok) setLeaderboard(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingRankings(false);
      }
    };
    fetchRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "28px clamp(16px, 4vw, 32px)" }}>
      {/* Rankings Header - Reto Actinver Style */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(11,30,94,0.06)", border: "1.5px solid rgba(11,30,94,0.1)", borderRadius: 99, padding: "4px 14px", marginBottom: 14 }}>
          <Flame size={12} color="#0B1E5E" />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0B1E5E", textTransform: "uppercase", letterSpacing: "0.08em" }}>Leaderboard Global</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0B1E5E", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Top Inversionistas
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Los mejores retornos de la comunidad evaluados en tiempo real contra el mercado.
        </p>
      </div>
      {/* Column headers */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 6 }}>Lugar</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 6 }}>Participante</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px", borderRadius: 6 }}>Rendimiento</span>
      </div>
      
      {fetchingRankings ? (
          <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
            Cargando leaderboard mundial...
          </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {leaderboard.map((user, i) => (
            <div
              key={i}
              style={{
                border: i === 0 ? "1px solid #f97316" : i === 1 ? "1px solid #00e5ff" : "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "14px 20px",
                background: i === 0 ? "#fffcf5" : i === 1 ? "#f0fdf4" : "white",
                boxShadow: i === 0 ? "0 4px 20px rgba(249,115,22,0.1)" : "0 2px 8px rgba(0,0,0,0.02)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 10, 
                  background: i === 0 ? "#f97316" : i === 1 ? "#00e5ff" : "#f1f5f9", 
                  border: i === 0 ? "1px solid #f97316" : i === 1 ? "1px solid #00e5ff" : "1px solid #e2e8f0",
                  color: i <= 1 ? "white" : "#64748b", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontWeight: 800, 
                  fontSize: 16,
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </div>
                {user.userPicture ? (
                  <img src={user.userPicture} alt="User" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #f1f5f9" }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", border: "2px solid #e2e8f0" }} />
                )}
                <div>
                  <p style={{ fontWeight: 700, color: "#0B1E5E", fontSize: 15, margin: "0 0 2px" }}>
                    @{(user.userName || "usuario").toLowerCase().replace(/\s+/g, "") || "usuario"}
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontWeight: 500 }}>
                    Total BIZ: {Math.round(user.totalValue).toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: user.yield >= 0 ? "#4ade80" : "#f87171",
                    background: "transparent",
                    border: `1px solid ${user.yield >= 0 ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)"}`,
                    padding: "5px 14px",
                    borderRadius: 99,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  {user.yield >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {user.yield > 0 ? "+" : ""}{user.yield.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
              Aún no hay inversionistas registrados con Bizcoins. ¡Sé el primero!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
