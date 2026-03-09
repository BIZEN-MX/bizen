"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, ShieldCheck, Zap, BookOpen, Trophy, Star } from "lucide-react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      router.push('/payment')
      return
    }
    const verify = async () => {
      try {
        const res = await fetch('/api/payment/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
        if (!res.ok) throw new Error('Verification failed')
      } catch {
        // Verification logic
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [sessionId, router])

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFAF5", }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid rgba(15,98,254,0.12)", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "ps-spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: 15, fontWeight: 500, margin: 0 }}>Verificando suscripción...</p>
        </div>
        <style>{`@keyframes ps-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF5", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes ps-fadeUp   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ps-scaleIn  { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes ps-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes ps-pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0.4)} 70%{box-shadow:0 0 0 16px rgba(37,99,235,0)} }
        @keyframes ps-glow     { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @keyframes ps-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .ps-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 16px; font-size: 16px; font-weight: 500;
          cursor: pointer; text-decoration: none;
          background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
          color: white; border: none;
          box-shadow: 0 8px 28px rgba(15,98,254,0.35);
          transition: opacity 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .ps-btn-primary:hover { opacity: 0.85; }
        .ps-btn-primary:active { opacity: 0.7; }
        .ps-feature-card {
          background: white;
          border: 1.5px solid #f1f5f9;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: opacity 0.2s;
        }
        .ps-feature-card:hover { opacity: 0.9; }
        .ps-feature-card:active { opacity: 0.8; }
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", padding: "6px 14px", borderRadius: 999, border: "1px solid #bfdbfe" }}>
          <ShieldCheck size={14} color="#2563eb" />
          <span style={{ fontSize: 11, fontWeight: 500, color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Suscripción Activa</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px clamp(20px,5vw,48px)", position: "relative", overflow: "hidden" }}>

        {/* Background orbs */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", animation: "ps-glow 6s ease-in-out infinite", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,98,254,0.04) 0%, transparent 65%)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 580, textAlign: "center", animation: "ps-fadeUp 0.6s ease both" }}>

          {/* Success icon */}
          <div style={{ animation: "ps-scaleIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both", marginBottom: 32 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 28,
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "2px solid rgba(37,99,235,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 12px 32px rgba(37,99,235,0.18)",
              animation: "ps-pulse 2.5s ease-in-out infinite",
            }}>
              <CheckCircle size={48} color="#2563eb" strokeWidth={2} />
            </div>
          </div>

          {/* Shimmer badge */}
          <div style={{ animation: "ps-fadeUp 0.5s 0.2s ease both", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(90deg, #eff6ff, #dbeafe, #eff6ff)", backgroundSize: "200% auto", border: "1px solid #bfdbfe", borderRadius: 40, padding: "6px 16px", animation: "ps-shimmer 4s linear infinite" }}>
            <Trophy size={13} color="#2563eb" />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#1e40af", letterSpacing: "0.06em" }}>¡ACCESO COMPLETO DESBLOQUEADO!</span>
          </div>

          <h1 style={{ margin: "0 0 14px", fontSize: "clamp(32px,6vw,48px)", fontWeight: 500, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            ¡Ya eres{" "}
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Premium!
            </span>
          </h1>

          <p style={{ margin: "0 0 36px", fontSize: 17, color: "#64748b", fontWeight: 500, lineHeight: 1.65, maxWidth: 440, marginInline: "auto" }}>
            Pago procesado exitosamente. Tienes acceso total a todos los cursos y funciones de{" "}
            <strong style={{ color: "#0f172a", fontWeight: 500 }}>BIZEN</strong>.
          </p>

          {/* Feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12, marginBottom: 36, textAlign: "left" }}>
            {[
              { icon: <BookOpen size={18} color="#0F62FE" />, bg: "#eff6ff", title: "Todos los cursos", desc: "Accede a todos los temas y unidades sin límite." },
              { icon: <Zap size={18} color="#2563eb" />, bg: "#e0e7ff", title: "Retos diarios", desc: "Completa retos y acumula XP cada día." },
              { icon: <Star size={18} color="#1d4ed8" />, bg: "#dbeafe", title: "Rankings y logros", desc: "Compite con tu escuela y sube en el ranking." },
            ].map((f, i) => (
              <div key={i} className="ps-feature-card" style={{ animationDelay: `${0.3 + i * 0.07}s`, animation: "ps-fadeUp 0.5s ease both" }}>
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, animation: "ps-fadeUp 0.5s 0.5s ease both" }}>
            <Link href="/courses" className="ps-btn-primary">
              Empezar a aprender
              <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseDown={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseUp={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Ir al dashboard →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

