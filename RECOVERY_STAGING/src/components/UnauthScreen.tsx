"use client"

import Link from "next/link"
import { Heart, Globe, Users, Award } from "lucide-react"

export function UnauthScreen() {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "linear-gradient(145deg, #0a0f1e 0%, #0d1b3e 40%, #0f2761 70%, #1a3a8a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
                    }}>
            {/* Styles moved to globals.css to fix hydration mismatches */}

            {/* Ambient orbs */}
            <div className="unauth-glow-fast" style={{ position: "absolute", top: "-15%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,98,254,0.14) 0%, transparent 70%)" }} />
            <div className="unauth-glow-slow" style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,158,255,0.09) 0%, transparent 65%)" }} />

            {/* Subtle grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 640 }}>

                {/* Badge */}
                <div className="unauth-fadeup-05" style={{ marginBottom: 32, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(15,98,254,0.15)", border: "1px solid rgba(15,98,254,0.4)", borderRadius: 40, padding: "8px 18px" }}>
                    <Heart size={14} color="#60a5fa" fill="#60a5fa" />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>Bizen · Educación Financiera</span>
                </div>

                {/* Heading */}
                <h1 className="unauth-fadeup-06-01" style={{ fontSize: "clamp(32px, 8vw, 54px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                    Aprende finanzas y<br />
                    <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        transforma tu futuro
                    </span>
                </h1>

                {/* Subheading */}
                <p className="unauth-fadeup-06-02" style={{ fontSize: "clamp(15px, 3vw, 17px)", color: "rgba(255,255,255,0.62)", margin: "0 0 44px", lineHeight: 1.75 }}>
                    Con cada lección que completas, tu escuela contribuye a <strong style={{ color: "#93c5fd" }}>Nuqleo Querétaro</strong>.<br />
                    Inicia sesión para ver tu progreso y medir tu impacto real.
                </p>

                {/* Quick stats */}
                <div className="unauth-fadeup-06-28" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
                    <div className="unauth-stat-pill">
                        <Globe size={15} color="#60a5fa" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>$45,000 MXN donados</span>
                    </div>
                    <div className="unauth-stat-pill">
                        <Users size={15} color="#a78bfa" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>90 canastas equivalentes</span>
                    </div>
                    <div className="unauth-stat-pill">
                        <Award size={15} color="#34d399" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>3 donaciones ejecutadas</span>
                    </div>
                </div>

                {/* CTAs */}
                <div className="unauth-fadeup-07-38" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                    <Link href="/signup" className="unauth-cta-primary">
                        Crear cuenta gratis
                    </Link>
                    <Link href="/login" className="unauth-cta-secondary">
                        Ya tengo cuenta — Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}
