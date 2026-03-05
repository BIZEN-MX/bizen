"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCcw, BookOpen, ShieldOff } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div style={{
      height: "100vh",
      background: "#FBFAF5",
      fontFamily: "Helvetica, 'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .cancel-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 14px; font-size: 14px; font-weight: 800;
          cursor: pointer; text-decoration: none;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: white; border: none;
          box-shadow: 0 8px 24px rgba(37,99,235,0.25);
          transition: all 0.25s;
        }
        .cancel-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.35); }
        
        @media (max-height: 700px) {
          .cancel-icon-box { width: 72px !important; height: 72px !important; margin-bottom: 20px !important; }
          .cancel-icon-box svg { width: 32px !important; height: 32px !important; }
          .cancel-title { font-size: 28px !important; margin-bottom: 8px !important; }
          .cancel-info-box { padding: 16px !important; margin-bottom: 24px !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        height: 64, zIndex: 100,
        background: "rgba(251,250,245,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(15,98,254,0.08)",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#475569", fontFamily: "Helvetica, Arial, sans-serif", letterSpacing: "-0.03em" }}>
            BIZEN
          </span>
        </Link>
        <Link href="/" style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={15} />
          Volver al inicio
        </Link>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 40px",
        overflowY: "auto",
        zIndex: 1
      }}>
        <div style={{ width: "100%", maxWidth: 500, textAlign: "center", animation: "fadeUp 0.5s ease both" }}>

          {/* Icon Section */}
          <div className="cancel-icon-box" style={{
            width: 84, height: 84, borderRadius: 24,
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            border: "1.5px solid rgba(245,158,11,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 10px 25px rgba(245,158,11,0.12)"
          }}>
            <ShieldOff size={40} color="#d97706" />
          </div>

          <h1 className="cancel-title" style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
            Pago cancelado
          </h1>

          <p style={{ margin: "0 0 24px", fontSize: 15, color: "#64748b", fontWeight: 500, lineHeight: 1.6 }}>
            No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
          </p>

          <div className="cancel-info-box" style={{
            background: "white",
            border: "1px solid rgba(15,98,254,0.08)",
            borderRadius: 18,
            padding: "18px 20px",
            marginBottom: 32,
            textAlign: "left",
            display: "flex", flexDirection: "column", gap: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", gap: 10 }}>
              <BookOpen size={14} color="#2563eb" style={{ marginTop: 2 }} />
              <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Tus datos y progreso están seguros.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <RefreshCcw size={14} color="#2563eb" style={{ marginTop: 2 }} />
              <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>Reintenta el pago en cualquier momento.</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Link href="/payment" className="cancel-btn-primary">
              <RefreshCcw size={16} />
              Intentar de nuevo
            </Link>
            <Link href="/courses" style={{ fontSize: 14, fontWeight: 700, color: "#64748b", textDecoration: "none" }}>
              Ver cursos gratuitos
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
