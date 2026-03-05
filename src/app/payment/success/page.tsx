"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react"

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
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FBFAF5",
        fontFamily: "Helvetica, 'Inter', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(15,98,254,0.1)", borderTopColor: "#0F62FE", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontSize: 15, fontWeight: 600 }}>Verificando suscripción...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

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
        .success-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; border-radius: 14px; font-size: 15px; font-weight: 800;
          cursor: pointer; text-decoration: none;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: white; border: none;
          box-shadow: 0 8px 24px rgba(37,99,235,0.25);
          transition: all 0.25s;
        }
        .success-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.35); }
        
        @media (max-height: 700px) {
          .success-icon-box { width: 72px !important; height: 72px !important; margin-bottom: 20px !important; }
          .success-icon-box svg { width: 36px !important; height: 36px !important; }
          .success-title { font-size: 32px !important; margin-bottom: 8px !important; }
          .success-info-box { padding: 16px !important; margin-bottom: 24px !important; }
          .success-info-item { gap: 8px !important; }
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.06)", padding: "6px 14px", borderRadius: 999 }}>
          <ShieldCheck size={14} color="#2563eb" />
          <span style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase" }}>Suscripción Activa</span>
        </div>
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
        <div style={{ width: "100%", maxWidth: 560, textAlign: "center", animation: "fadeUp 0.5s ease both" }}>

          <div className="success-icon-box" style={{
            width: 84, height: 84, borderRadius: 24,
            background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
            border: "1.5px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 10px 25px rgba(16,185,129,0.12)"
          }}>
            <CheckCircle size={40} color="#10b981" />
          </div>

          <h1 className="success-title" style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
            ¡Ya eres Premium!
          </h1>

          <p style={{ margin: "0 0 24px", fontSize: 16, color: "#64748b", fontWeight: 500, lineHeight: 1.5, maxWidth: 460, marginInline: "auto" }}>
            Pago procesado. Tienes acceso total a todos los cursos y temas de <span style={{ color: "#1e3a8a", fontWeight: 700 }}>BIZEN</span>.
          </p>

          <div className="success-info-box" style={{
            background: "white",
            border: "1px solid rgba(15,98,254,0.08)",
            borderRadius: 20,
            padding: "20px",
            marginBottom: 32,
            textAlign: "left",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <div className="success-info-item" style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <Zap size={14} color="#10b981" style={{ marginTop: 3 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Temas desbloqueados</div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Explora el contenido premium en tu biblioteca.</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Link href="/courses" className="success-btn-primary">
              Empezar a aprender
              <ArrowRight size={18} />
            </Link>
            <Link href="/" style={{ fontSize: 14, fontWeight: 700, color: "#64748b", textDecoration: "none" }}>
              Volver al inicio
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
