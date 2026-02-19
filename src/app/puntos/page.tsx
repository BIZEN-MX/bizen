"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    Trophy,
    Target,
    Flame,
    Star,
    ArrowRight,
    Gift,
    History,
    TrendingUp,
    Layout
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/lib/translations"
import { useSettings } from "@/contexts/SettingsContext"

export default function PuntosPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const { settings } = useSettings()
    const t = useTranslation(settings.language)
    const [stats, setStats] = useState<any>(null)
    const [loadingStats, setLoadingStats] = useState(true)

    useEffect(() => {
        if (loading) return
        if (!user) {
            router.push("/login")
            return
        }

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/stats")
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (err) {
                console.error("Error fetching stats:", err)
            } finally {
                setLoadingStats(false)
            }
        }

        fetchStats()
    }, [user, loading, router])

    if (loading || loadingStats) {
        return (
            <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                <div style={{ width: 40, height: 40, border: "4px solid #f3f3f3", borderTop: "4px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    return (
        <div className="puntos-outer" style={{
            minHeight: "100vh",
            background: "#ffffff",
            fontFamily: "'Montserrat', sans-serif",
            width: "100%",
            boxSizing: "border-box"
        }}>
            <style>{`
                /* Mobile - account for footer */
                @media (max-width: 767px) {
                    .puntos-outer {
                        padding-bottom: 65px !important;
                    }
                    .puntos-inner {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin-right: 0 !important;
                    }
                }
                /* Tablet/iPad (768px-1160px) - account for left sidebar (220px) */
                @media (min-width: 768px) and (max-width: 1160px) {
                    .puntos-inner {
                        width: calc(100% - 220px) !important;
                        max-width: calc(100% - 220px) !important;
                        margin-left: 220px !important;
                        margin-right: 0 !important;
                    }
                }
                /* Desktop (1161px+) - account for left sidebar (280px) */
                @media (min-width: 1161px) {
                    .puntos-inner {
                        width: calc(100% - 280px) !important;
                        max-width: calc(100% - 280px) !important;
                        margin-left: 280px !important;
                        margin-right: 0 !important;
                    }
                }
            `}</style>

            <div className="puntos-inner" style={{
                position: "relative",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "clamp(20px, 5vw, 40px)",
                boxSizing: "border-box"
            }}>
                {/* Header */}
                <div style={{ marginBottom: "40px" }}>
                    <h1 style={{
                        fontSize: "clamp(28px, 5vw, 40px)",
                        fontWeight: 800,
                        color: "#1e3a5f",
                        marginBottom: "8px"
                    }}>
                        Mis Puntos
                    </h1>
                    <p style={{ color: "#64748b", fontSize: "16px", fontWeight: 500 }}>
                        Sigue tu progreso, gana insignias y sube de nivel
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "24px",
                    marginBottom: "48px"
                }}>
                    {/* XP Card */}
                    <Card style={{ border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)", color: "white" }}>
                        <CardContent style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: 700, fontSize: "18px", opacity: 0.9 }}>Total XP</span>
                                <Star fill="white" size={24} />
                            </div>
                            <div style={{ fontSize: "48px", fontWeight: 900 }}>{stats?.xp || 0}</div>
                            <div style={{ background: "rgba(255,255,255,0.2)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                                <div style={{ width: `${(stats?.xpInCurrentLevel / stats?.xpNeeded) * 100 || 0}%`, height: "100%", background: "white" }} />
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: 600, opacity: 0.9 }}>
                                {stats?.xpNeeded - stats?.xpInCurrentLevel} XP para Nivel {stats?.level + 1}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Level Card */}
                    <Card style={{ border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", background: "white" }}>
                        <CardContent style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: 700, fontSize: "18px", color: "#64748b" }}>Nivel Actual</span>
                                <Trophy color="#F59E0B" size={24} />
                            </div>
                            <div style={{ fontSize: "48px", fontWeight: 900, color: "#1e3a5f" }}>{stats?.level || 1}</div>
                            <span style={{ color: "#F59E0B", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                Bizen Explorer
                            </span>
                        </CardContent>
                    </Card>

                    {/* Streak Card */}
                    <Card style={{ border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", background: "white" }}>
                        <CardContent style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontWeight: 700, fontSize: "18px", color: "#64748b" }}>Racha</span>
                                <Flame color="#EF4444" size={24} />
                            </div>
                            <div style={{ fontSize: "48px", fontWeight: 900, color: "#1e3a5f" }}>{stats?.currentStreak || 0}</div>
                            <span style={{ color: "#64748b", fontWeight: 600, fontSize: "14px" }}>
                                ¡Sigue así! No rompas tu racha.
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Actions / Info */}
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1e3a5f", marginBottom: "24px" }}>Próximamente</h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px"
                }}>
                    {[
                        { icon: <Gift size={24} />, title: "Canjear Puntos", desc: "Usa tus puntos en la tienda", color: "#8B5CF6" },
                        { icon: <History size={24} />, title: "Historial", desc: "Revisa tus actividades recientes", color: "#10B981" },
                        { icon: <TrendingUp size={24} />, title: "Ranking", desc: "Compite con otros usuarios", color: "#0B71FE" }
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: "24px",
                            background: "#f8fafc",
                            borderRadius: "16px",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            opacity: 0.8
                        }}>
                            <div style={{ color: item.color }}>{item.icon}</div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{item.title}</h3>
                            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
