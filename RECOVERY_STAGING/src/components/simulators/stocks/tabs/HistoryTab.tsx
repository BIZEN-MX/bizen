import React from 'react';
import { Clock } from 'lucide-react';

interface HistoryTabProps {
  portfolio: any;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ portfolio }) => {
  return (
    <div style={{ padding: "28px 32px" }}>
      <h2
        style={{
          fontSize: 19,
          fontWeight: 500,
          color: "#0B1E5E",
          margin: "0 0 22px",
        }}
      >
        Historial de Órdenes
      </h2>
      {!portfolio?.orders?.length ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "#f8fafc",
            borderRadius: 18,
            border: "2px dashed #e2e8f0",
          }}
        >
          <Clock
            size={32}
            color="#94a3b8"
            style={{ display: "block", margin: "0 auto 12px" }}
          />
          <p
            style={{
              color: "#64748b",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            No has colocado órdenes todavía.
          </p>
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              {["Fecha", "Símbolo", "Tipo", "Cant.", "Estado"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#94a3b8",
                      textAlign: "left",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {portfolio.orders.map((o: any) => (
              <tr
                key={o.id}
                className="sim-row-table"
                style={{ borderBottom: "1px solid #f8fafc" }}
              >
                <td
                  style={{
                    padding: "14px",
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  {new Date(o.placed_at).toLocaleDateString("es-MX")}
                </td>
                <td
                  style={{
                    padding: "14px",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {o.symbol}
                </td>
                <td style={{ padding: "14px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      background:
                        o.side === "buy" ? "#d1fae5" : "#fee2e2",
                      color: o.side === "buy" ? "#065f46" : "#991b1b",
                    }}
                  >
                    {o.side === "buy" ? "▲ Compra" : "▼ Venta"}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  {Number(o.quantity).toFixed(4)}
                </td>
                <td style={{ padding: "14px" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 8,
                      textTransform: "uppercase" as const,
                      background:
                        o.status === "pending"
                          ? "#fef3c7"
                          : o.status === "filled"
                            ? "#d1fae5"
                            : "#f1f5f9",
                      color:
                        o.status === "pending"
                          ? "#92400e"
                          : o.status === "filled"
                            ? "#065f46"
                            : "#475569",
                    }}
                  >
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
