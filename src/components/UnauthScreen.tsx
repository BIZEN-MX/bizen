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
            <style>{`
                @keyframes unauth-glow   { 0%,100%{opacity:.4} 50%{opacity:.8} }
                @keyframes unauth-fadeup { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }

                .unauth-cta-primary {
                    background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
                    color: #fff !important;
                    border: none;
                    border-radius: 18px;
                    padding: 20px 52px;
                    font-size: 19px;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(15, 98, 254, 0.45);
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: inline-block;
                    text-decoration: none;
                    letter-spacing: -0.02em;
                }
                .unauth-cta-primary:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 16px 48px rgba(15, 98, 254, 0.6);
                }
                .unauth-cta-secondary {
                    color: rgba(255,255,255,0.7);
                    font-size: 15px;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(255,255,255,0.28);
                    padding-bottom: 2px;
                    transition: color 0.2s, border-color 0.2s;
                    cursor: pointer;
                    background: none;
                }
                .unauth-cta-secondary:hover {
                    color: #fff;
                    border-color: #fff;
                }
                .unauth-stat-pill {
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 40px;
                    padding: 10px 22px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    backdrop-filter: blur(8px);
                }
            `}</style>

            {/* Ambient orbs */}
            <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(15,98,254,0.14) 0%, transparent 70%)", animation: "unauth-glow 6s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,158,255,0.09) 0%, transparent 65%)", animation: "unauth-glow 8s ease-in-out infinite 2s" }} />

            {/* Subtle grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />

            {/* Main content */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 640 }}>

                {/* Badge */}
                <div style={{ animation: "unauth-fadeup 0.5s ease both", marginBottom: 32, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(15,98,254,0.15)", border: "1px solid rgba(15,98,254,0.4)", borderRadius: 40, padding: "8px 18px" }}>
                    <Heart size={14} color="#60a5fa" fill="#60a5fa" />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>Bizen · Educación Financiera</span>
                </div>

                {/* Heading */}
                <h1 style={{ animation: "unauth-fadeup 0.6s 0.1s ease both", fontSize: "clamp(32px, 8vw, 54px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                    Aprende finanzas y<br />
                    <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        transforma tu futuro
                    </span>
                </h1>

                {/* Subheading */}
                <p style={{ animation: "unauth-fadeup 0.6s 0.2s ease both", fontSize: "clamp(15px, 3vw, 17px)", color: "rgba(255,255,255,0.62)", margin: "0 0 44px", lineHeight: 1.75 }}>
                    Con cada lección que completas, tu escuela contribuye a <strong style={{ color: "#93c5fd" }}>Nuqleo Querétaro</strong>.<br />
                    Inicia sesión para ver tu progreso y medir tu impacto real.
                </p>

                {/* Quick stats */}
                <div style={{ animation: "unauth-fadeup 0.6s 0.28s ease both", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
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
                <div style={{ animation: "unauth-fadeup 0.7s 0.38s ease both", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
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
