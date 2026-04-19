"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCcw, BookOpen, Shield, AlertTriangle } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF5", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes pc-fadeUp  { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pc-scaleIn { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes pc-glow    { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @keyframes pc-shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }

        .pc-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 16px; font-size: 16px; font-weight: 500;
          cursor: pointer; text-decoration: none;
          background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
          color: white; border: none;
          box-shadow: 0 8px 28px rgba(15,98,254,0.35);
          transition: opacity 0.2s;
        }
        .pc-btn-primary:hover { opacity: 0.85; }
        .pc-btn-primary:active { opacity: 0.7; }
        .pc-feature-card {
          background: white;
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: opacity 0.2s;
        }
        .pc-feature-card:hover { opacity: 0.9; }
        .pc-feature-card:active { opacity: 0.8; }
      `}</style>

      {/* Header */}
      <header style={{
        height: 64, zIndex: 10,
        background: "rgba(251,250,245,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(15,98,254,0.08)",
        padding: "0 clamp(20px,5vw,48px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0,
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 500, color: "#64748b", letterSpacing: "-0.04em" }}>BIZEN</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#0F62FE", letterSpacing: "0.08em", marginTop: 2 }}>.</span>
        </Link>
        <Link href="/" style={{ fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s" }}
          onMouseDown={e => (e.currentTarget.style.opacity = "0.6")}
          onMouseUp={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <ArrowLeft size={15} />
          Volver al inicio
        </Link>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px clamp(20px,5vw,48px)", position: "relative", overflow: "hidden" }}>

        {/* Background orbs */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)", animation: "pc-glow 6s ease-in-out infinite", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,98,254,0.04) 0%, transparent 65%)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 520, textAlign: "center", animation: "pc-fadeUp 0.6s ease both" }}>

          {/* Warning icon (Blue) */}
          <div style={{ animation: "pc-scaleIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both", marginBottom: 32 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 28,
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "2px solid rgba(37,99,235,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 12px 32px rgba(37,99,235,0.18)",
            }}>
              <AlertTriangle size={48} color="#2563eb" strokeWidth={2} />
            </div>
          </div>

          {/* Badge */}
          <div style={{ animation: "pc-fadeUp 0.5s 0.2s ease both", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, background: "#dbeafe", border: "1px solid #bfdbfe", borderRadius: 40, padding: "6px 16px" }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#1e3a8a", letterSpacing: "0.06em" }}>PAGO NO COMPLETADO</span>
          </div>

          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(28px,5vw,42px)", fontWeight: 500, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            No hay problema,{" "}
            <span style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              puedes reintentar
            </span>
          </h1>

          <p style={{ margin: "0 0 36px", fontSize: 16, color: "#64748b", fontWeight: 500, lineHeight: 1.65, maxWidth: 400, marginInline: "auto" }}>
            No se realizó ningún cargo a tu cuenta. Tu progreso y datos están completamente seguros.
          </p>

          {/* Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36, textAlign: "left" }}>
            {[
              { icon: <Shield size={18} color="#2563eb" />, bg: "#dbeafe", title: "Sin cargos realizados", desc: "Tu cuenta bancaria no fue afectada en ningún momento." },
              { icon: <BookOpen size={18} color="#0F62FE" />, bg: "#eff6ff", title: "Tu progreso está a salvo", desc: "Tus lecciones y XP continúan disponibles sin cambios." },
              { icon: <RefreshCcw size={18} color="#1d4ed8" />, bg: "#e0e7ff", title: "Puedes reintentar cuando quieras", desc: "El proceso es rápido, seguro y sin compromisos." },
            ].map((f, i) => (
              <div key={i} className="pc-feature-card" style={{ animation: `pc-fadeUp 0.5s ${0.3 + i * 0.07}s ease both` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, animation: "pc-fadeUp 0.5s 0.55s ease both" }}>
            <Link href="/payment" className="pc-btn-primary">
              <RefreshCcw size={17} />
              Intentar de nuevo
            </Link>
            <Link href="/courses" style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseDown={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseUp={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Ver cursos gratuitos →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

