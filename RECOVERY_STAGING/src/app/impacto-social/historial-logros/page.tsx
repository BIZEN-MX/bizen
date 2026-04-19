"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Card from "@/components/ui/card"
import PageLoader from "@/components/PageLoader"
import {
    Award,
    CheckCircle2,
    Lock,
    Target as TargetIcon,
    ChevronLeft,
    Calendar,
    Trophy,
    History
} from "lucide-react"

export default function HistorialLogrosPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return
        if (!user) {
            router.push("/login")
            return
        }

        // Hide sidebar on mount
        document.body.classList.add('hide-sidebar')
        return () => {
            document.body.classList.remove('hide-sidebar')
        }
    }, [user, loading, router])

    if (loading) return <PageLoader />

    if (!user) return null

    const achievements = [
        {
            icon: <CheckCircle2 size={24} color="#10B981" />,
            title: "Donación ejecutada",
            date: "15 Dic",
            desc: "Se entregaron $15,000 MXN",
            category: "Financiero",
            status: "Completado"
        },
        {
            icon: <TargetIcon size={24} color="#0F62FE" />,
            title: "Meta de sesiones lograda",
            date: "02 Feb",
            desc: "Promedio >3 sesiones",
            category: "Actividad",
            status: "Completado"
        },
        {
            icon: <Lock size={24} color="#64748b" />,
            title: "Base asegurada",
            date: "01 Ene",
            desc: "Convenio 2026 firmado",
            category: "Institucional",
            status: "Completado"
        }
    ]

    return (
        <div style={{
            minHeight: "100vh",
            background: "#FBFAF5",
                        color: "#1e3a5f",
            width: "100%",
            overflowX: "hidden",
            boxSizing: "border-box"
        }}>
            <style>{`
                @media (max-width: 767px) {
                    .historial-inner { padding-bottom: 80px !important; }
                    .historial-content { padding: 20px !important; }
                }
                @media (min-width: 768px) {
                    .historial-inner { margin-left: 0 !important; }
                    .historial-content { padding: 40px !important; width: 100%; max-width: 1000px; margin: 0 auto; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="historial-inner" style={{ boxSizing: "border-box" }}>
                <div className="historial-content">
                    {/* Header */}
                    <div style={{ marginBottom: 32, animation: "fadeIn 0.5s ease both" }}>
                        <button
                            onClick={() => router.back()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "none",
                                border: "none",
                                color: "#0F62FE",
                                cursor: "pointer",
                                fontSize: 14,
                                fontWeight: 500,
                                padding: 0,
                                marginBottom: 16
                            }}
                        >
                            <ChevronLeft size={18} /> Volver
                        </button>
                        <h1 style={{ fontSize: 32, fontWeight: 500, margin: "0 0 8px", color: "#111827" }}>
                            Historial de Logros
                        </h1>
                        <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
                            Registro de metas alcanzadas y acciones de impacto.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {achievements.map((item, i) => (
                            <Card key={i} style={{
                                padding: "16px 20px",
                                border: "1px solid #eef2f6",
                                animation: `fadeIn 0.5s ease ${i * 0.1}s both`,
                                display: "flex",
                                alignItems: "center",
                                gap: 14
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: "#FBFAF5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0, color: "#111827" }}>{item.title}</h3>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#0F62FE", whiteSpace: "nowrap" }}>{item.date}</span>
                                    </div>
                                    <p style={{ fontSize: 14, color: "#475569", margin: "0 0 8px" }}>{item.desc}</p>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <span style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            padding: "4px 8px",
                                            background: "#f1f5f9",
                                            borderRadius: 6,
                                            color: "#64748b"
                                        }}>
                                            {item.category}
                                        </span>
                                        <span style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em",
                                            padding: "4px 8px",
                                            background: "#dcfce7",
                                            borderRadius: 6,
                                            color: "#166534"
                                        }}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Fun Stats Row */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 16,
                        marginTop: 24,
                        animation: "fadeIn 0.5s ease 0.4s both"
                    }}>
                        <div style={{ padding: 20, background: "#FBFAF5", borderRadius: 20 }}>
                            <div style={{ color: "#0F62FE", marginBottom: 8 }}><Calendar size={20} /></div>
                            <div style={{ fontSize: 20, fontWeight: 500, color: "#111827" }}>2026</div>
                            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Ciclo Escolar</div>
                        </div>
                        <div style={{ padding: 20, background: "#FBFAF5", borderRadius: 20 }}>
                            <div style={{ color: "#F59E0B", marginBottom: 8 }}><Trophy size={20} /></div>
                            <div style={{ fontSize: 20, fontWeight: 500, color: "#111827" }}>3</div>
                            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Logros Clave</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
