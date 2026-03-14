"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    Trophy, Flame, Star, ArrowRight, Gift, History,
    TrendingUp, Zap, ShieldCheck, ChevronRight, Sparkles,
    CreditCard, QrCode, Lock, CheckCircle2, BookOpen, Target, BarChart2
} from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"
import StreakWidget from "@/components/StreakWidget"

const GIFT_CARDS = [
    { id: 1, store: "Amazon", color: "#FF9900", bg: "linear-gradient(135deg, #1a0a00 0%, #4a1a00 100%)", logo: "amazon", points: 5000, value: "$50 MXN", description: "Para cualquier compra en Amazon.com.mx" },
    { id: 2, store: "Oxxo", color: "#da291c", bg: "linear-gradient(135deg, #1a0000 0%, #5a0000 100%)", logo: "oxxo", points: 3000, value: "$30 MXN", description: "Canjeable en cualquier tienda Oxxo" },
    { id: 3, store: "Liverpool", color: "#b8005c", bg: "linear-gradient(135deg, #1a0020 0%, #5a0040 100%)", logo: "liverpool", points: 10000, value: "$100 MXN", description: "Para usar en tiendas Liverpool" },
    { id: 4, store: "Cinépolis", color: "#0057b8", bg: "linear-gradient(135deg, #00102a 0%, #003070 100%)", logo: "cinepolis", points: 4000, value: "$40 MXN", description: "2 boletos de cine en cualquier sede" },
    { id: 5, store: "Starbucks", color: "#00704A", bg: "linear-gradient(135deg, #001a0a 0%, #004a26 100%)", logo: "starbucks", points: 2500, value: "$25 MXN", description: "Para tu bebida favorita" },
    { id: 6, store: "Spotify", color: "#1DB954", bg: "linear-gradient(135deg, #001a06 0%, #004a1a 100%)", logo: "spotify", points: 6000, value: "1 mes Premium", description: "Música sin anuncios por 30 días" },
]

import PageLoader from "@/components/PageLoader"

export default function PuntosPage() {
    const { user, loading, dbProfile } = useAuth()
    const router = useRouter()
    const { settings } = useSettings()
    const t = useTranslation(settings.language)
    const [stats, setStats] = useState<any>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [selectedCard, setSelectedCard] = useState<number | null>(null)
    const [redeemModal, setRedeemModal] = useState(false)

    useEffect(() => {
        if (loading) return
        if (!user) { router.push("/login"); return }
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/stats")
                if (res.ok) setStats(await res.json())
            } catch (err) { console.error(err) }
            finally { setLoadingStats(false) }
        }
        fetchStats()
    }, [user, loading, router])

    const userPoints = stats?.bizcoins ?? (dbProfile as any)?.bizcoins ?? 0
    const selectedGC = GIFT_CARDS.find(c => c.id === selectedCard)

    if (loading || loadingStats) return <PageLoader />

    return (
        <div className="puntos-outer" style={{
            minHeight: "100vh",
            background: "#FBFAF5",
            width: "100%",
            boxSizing: "border-box"
        }}>
            <style>{`
                @media (max-width: 767px) {
                    .puntos-outer { padding-bottom: 80px !important; }
                    .puntos-inner { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; }
                }
                @media (min-width: 768px) and (max-width: 1160px) {
                    .puntos-inner { 
                        width: calc(100% - 220px) !important; 
                        max-width: calc(100% - 220px) !important; 
                        margin-left: 220px !important; 
                    }
                }
                @media (min-width: 1161px) {
                    .puntos-inner { 
                        width: calc(100% - 280px) !important; 
                        max-width: calc(100% - 280px) !important; 
                        margin-left: 280px !important; 
                    }
                }

                @keyframes puntos-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes puntos-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
                @keyframes puntos-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                @keyframes puntos-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(15,98,254,0.4); } 50% { box-shadow: 0 0 0 14px rgba(15,98,254,0); } }
                @keyframes puntos-glow { 0%, 100% { filter: drop-shadow(0 0 6px rgba(15,98,254,0.5)); } 50% { filter: drop-shadow(0 0 16px rgba(15,98,254,0.8)); } }
                @keyframes card-scanline { 0% { top: -100%; } 100% { top: 200%; } }

                .puntos-stat-card { animation: puntos-fadeUp 0.6s cubic-bezier(0.2,0.8,0.2,1) both; }
                .puntos-stat-card:nth-child(1) { animation-delay: 0s; }
                .puntos-stat-card:nth-child(2) { animation-delay: 0.1s; }
                .puntos-stat-card:nth-child(3) { animation-delay: 0.2s; }

                .gift-card-item {
                    cursor: pointer;
                    border-radius: 20px;
                    overflow: hidden;
                    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
                    border: 2px solid transparent;
                    position: relative;
                }
                .gift-card-item:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.18) !important;
                }
                .gift-card-item.selected {
                    border-color: #0F62FE;
                    box-shadow: 0 0 0 3px rgba(15,98,254,0.2) !important;
                }
                .gift-card-item.locked {
                    filter: grayscale(0.4);
                    opacity: 0.7;
                }
                .gift-card-scanline {
                    position: absolute;
                    left: 0; right: 0;
                    height: 40%;
                    background: linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent);
                    animation: card-scanline 3s ease-in-out infinite;
                    pointer-events: none;
                }

                .redeem-btn {
                    background: linear-gradient(135deg, #0F62FE 0%, #4A9EFF 100%);
                    color: white; border: none; border-radius: 16px;
                    font-weight: 500; font-size: 16px;
                    cursor: pointer; transition: all 0.3s ease;
                    box-shadow: 0 8px 30px rgba(15,98,254,0.4);
                    animation: puntos-pulse 2.5s ease infinite;
                    display: flex; align-items: center; gap: 10px;
                    padding: 16px 32px;
                }
                .redeem-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(15,98,254,0.55); }
                .redeem-btn:disabled { background: #cbd5e1; box-shadow: none; animation: none; cursor: not-allowed; opacity: 0.7; transform: none; }

                .modal-bg {
                    position: fixed; inset: 0; z-index: 1000;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                }
                .modal-box {
                    background: white; border-radius: 28px;
                    max-width: 440px; width: 100%;
                    padding: clamp(28px, 5vw, 40px);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.3);
                    animation: puntos-fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
                }
            `}</style>

            {/* Redeem Confirmation Modal */}
            {redeemModal && selectedGC && (
                <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setRedeemModal(false) }}>
                    <style>{`
                            @keyframes gift-pulse {
                                0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(15,98,254,0)); }
                                50% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(15,98,254,0.4)); }
                                100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(15,98,254,0)); }
                            }
                            .gift-pulse {
                                animation: gift-pulse 2s infinite ease-in-out;
                                color: #0F62FE;
                            }
                        `}</style>
                    <div className="modal-box">
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                                <Gift size={48} className="gift-pulse" />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 500, color: "#0f172a", margin: "0 0 8px" }}>¿Canjear tarjeta?</h2>
                            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Esto descontará {selectedGC.points.toLocaleString()} BIZCOINS de tu saldo</p>
                        </div>

                        {/* Mini gift card preview */}
                        <div style={{ background: selectedGC.bg, borderRadius: 16, padding: "20px 24px", marginBottom: 20, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 500 }}>{selectedGC.store}</div>
                                <div style={{ fontSize: 22, fontWeight: 500, color: selectedGC.color }}>{selectedGC.value}</div>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 14px", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                                -{selectedGC.points.toLocaleString()} BIZCOINS
                            </div>
                        </div>

                        {userPoints < selectedGC.points && (
                            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center", color: "#dc2626", fontSize: 13, fontWeight: 500 }}>
                                <Lock size={15} /> No tienes suficientes BIZCOINS para este canje.
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setRedeemModal(false)} style={{ flex: 1, padding: "13px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, fontWeight: 500, cursor: "pointer", fontSize: 14, color: "#64748b", }}>
                                Cancelar
                            </button>
                            <button
                                disabled={userPoints < selectedGC.points}
                                style={{ flex: 2, padding: "13px", background: userPoints >= selectedGC.points ? "linear-gradient(135deg, #0F62FE, #4A9EFF)" : "#e2e8f0", color: userPoints >= selectedGC.points ? "white" : "#94a3b8", border: "none", borderRadius: 12, fontWeight: 500, cursor: userPoints >= selectedGC.points ? "pointer" : "not-allowed", fontSize: 14, }}
                            >
                                Confirmar canje →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="puntos-inner" style={{
                position: "relative",
                zIndex: 1,
                padding: "clamp(20px, 5vw, 48px)",
                boxSizing: "border-box"
            }}>

                {/* === HERO HEADER === */}
                <div style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #0F62FE 100%)",
                    borderRadius: 28,
                    padding: "clamp(32px, 5vw, 52px) clamp(28px, 5vw, 48px)",
                    marginBottom: 32,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(15,98,254,0.25)",
                    animation: "puntos-fadeUp 0.6s ease both"
                }}>
                    {/* Orbs */}
                    <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 350, height: 350, background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-20%", left: "5%", width: 250, height: 250, background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 14px", marginBottom: 14 }}>
                                <Zap size={13} color="#60a5fa" />
                                <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tu saldo de BIZCOINS</span>
                            </div>
                            <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 500, color: "#ffffff", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                                Mis BIZCOINS
                            </h1>
                            <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#93c5fd", margin: 0 }}>
                                Aprende, acumula BIZCOINS y canjéalos por premios reales
                            </p>
                        </div>

                        {/* Big BIZCOINS balloon */}
                        <div style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 24,
                            padding: "24px 36px",
                            textAlign: "center",
                            backdropFilter: "blur(10px)",
                        }}>
                            <div style={{
                                fontSize: "clamp(42px, 8vw, 64px)",
                                fontWeight: 500,
                                color: "#fff",
                                lineHeight: 1,
                                background: "linear-gradient(135deg, #fff, #93c5fd)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                {loadingStats ? (
                                    <div style={{ width: 120, height: 60, background: "rgba(255,255,255,0.1)", borderRadius: 12, animation: "puntos-shimmer 2s infinite linear", backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
                                ) : (
                                    (userPoints).toLocaleString()
                                )}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>BIZCOINS disponibles</div>
                        </div>
                    </div>
                </div>

                {/* === STATS GRID === */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {/* Level */}
                    <div className="puntos-stat-card" style={{
                        background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                        borderRadius: 24,
                        padding: "32px 20px",
                        border: "1.5px solid #fde68a",
                        boxShadow: "0 8px 30px rgba(217,119,6,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Nivel actual</div>
                        <div style={{ fontSize: 52, fontWeight: 950, color: "#b45309", lineHeight: 1, marginBottom: 6, textShadow: "0 2px 10px rgba(180,83,9,0.2)" }}>{stats?.level || (dbProfile as any)?.level || 1}</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bizen Explorer</div>
                    </div>

                    {/* Streak */}
                    <div className="puntos-stat-card" style={{
                        background: "linear-gradient(135deg, #fffaf5 0%, #fff7ed 100%)",
                        borderRadius: 24,
                        padding: "32px 20px",
                        border: "1.5px solid #ffedd5",
                        boxShadow: "0 8px 30px rgba(249,115,22,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        overflow: "hidden",
                        position: "relative"
                    }}>
                        {loadingStats ? (
                            <div style={{ width: 80, height: 40, background: "#f1f5f9", borderRadius: 12, animation: "puntos-shimmer 2s infinite" }} />
                        ) : (
                            <StreakWidget
                                streak={stats?.currentStreak ?? (dbProfile as any)?.currentStreak ?? 0}
                                showCalendar={false}
                                iconSize={34}
                                fontSize={52}
                                badgeStyle={{
                                    background: "transparent",
                                    border: "none",
                                    boxShadow: "none",
                                    padding: "0",
                                    gap: "12px",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            />
                        )}
                    </div>

                    {/* Progress to next level */}
                    <div className="puntos-stat-card" style={{
                        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                        borderRadius: 24,
                        padding: "32px 20px",
                        border: "1.5px solid #bae6fd",
                        boxShadow: "0 8px 30px rgba(14,165,233,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center"
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Siguiente: Nivel {(stats?.level || (dbProfile as any)?.level || 1) + 1}</div>

                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                            <span style={{ fontSize: 52, fontWeight: 950, color: "#0c4a6e", lineHeight: 1 }}>{stats?.xpInCurrentLevel || 0}</span>
                            <span style={{ fontSize: 14, fontWeight: 500, color: "#38bdf8" }}>/ {stats?.xpNeeded || 100} XP</span>
                        </div>

                        <div style={{ width: "80%", maxWidth: "160px", height: 10, background: "rgba(255,255,255,0.5)", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(14,165,233,0.2)", marginBottom: 10 }}>
                            <div style={{ width: `${Math.min(100, ((stats?.xpInCurrentLevel || 0) / (stats?.xpNeeded || 100)) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #0F62FE)", borderRadius: 10, boxShadow: "0 0 10px rgba(15,98,254,0.3)", transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 500, color: "#075985", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stats?.xpToNextLevel || 100} XP para subir</div>
                    </div>
                </div>

                {/* === GIFT CARDS SECTION === */}
                <div style={{ marginBottom: 40 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, color: "#0f172a", margin: "0 0 4px" }}>
                                Canjea tus BIZCOINS
                            </h2>
                            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                                Convierte tus BIZCOINS en tarjetas de regalo para usar en tiendas reales
                            </p>
                        </div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe", borderRadius: 999, padding: "8px 16px" }}>
                            <Star size={14} color="#2563eb" fill="#2563eb" />
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#1d4ed8" }}>{userPoints.toLocaleString()} BIZCOINS disponibles</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                        {GIFT_CARDS.map((card) => {
                            const canAfford = userPoints >= card.points
                            const isSelected = selectedCard === card.id
                            return (
                                <div
                                    key={card.id}
                                    className={`gift-card-item ${isSelected ? "selected" : ""} ${!canAfford ? "locked" : ""}`}
                                    style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
                                    onClick={() => { setSelectedCard(isSelected ? null : card.id) }}
                                >
                                    {/* Card face */}
                                    <div style={{ background: card.bg, padding: "28px 24px 20px", position: "relative", minHeight: 130 }}>
                                        <div className="gift-card-scanline" />
                                        {/* Card chip decoration */}
                                        <div style={{ position: "absolute", top: 16, right: 16, width: 32, height: 24, background: "rgba(255,255,255,0.12)", borderRadius: 5, border: "1px solid rgba(255,255,255,0.2)" }} />

                                        <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{card.store}</div>
                                        <div style={{ fontSize: 32, fontWeight: 500, color: card.color, lineHeight: 1 }}>{card.value}</div>
                                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 8 }}>{card.description}</div>
                                    </div>

                                    {/* Card bottom */}
                                    <div style={{ background: "white", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Costo</div>
                                            <div style={{ fontSize: 18, fontWeight: 500, color: canAfford ? "#0F62FE" : "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
                                                <Star size={14} fill={canAfford ? "#0F62FE" : "#94a3b8"} color={canAfford ? "#0F62FE" : "#94a3b8"} />
                                                {card.points.toLocaleString()} BIZCOINS
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            {!canAfford && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: "#94a3b8" }}><Lock size={12} /> Sin saldo</div>}
                                            {isSelected && canAfford && <CheckCircle2 size={22} color="#0F62FE" />}
                                            {!isSelected && canAfford && <ChevronRight size={20} color="#0F62FE" />}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Redeem button */}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                        <button
                            className="redeem-btn"
                            disabled={!selectedCard}
                            onClick={() => selectedCard && setRedeemModal(true)}
                        >
                            <Gift size={20} />
                            {selectedCard ? `Canjear tarjeta ${GIFT_CARDS.find(c => c.id === selectedCard)?.store}` : "Selecciona una tarjeta"}
                            {selectedCard && <ArrowRight size={18} />}
                        </button>
                    </div>
                </div>

                {/* === HOW TO EARN MORE === */}
                <div style={{ background: "white", borderRadius: 24, padding: "clamp(24px,4vw,36px)", border: "1px solid #e8f0fe", boxShadow: "0 4px 20px rgba(15,98,254,0.04)", marginBottom: 32 }}>
                    <h2 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 500, color: "#0f172a", margin: "0 0 20px" }}>Cómo ganar más BIZCOINS y XP</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                        {[
                            { IconComp: Zap, label: "Reto Diario", xp: "+50 BIZCOINS", color: "#0F62FE", desc: "Completa el reto del día" },
                            { IconComp: BookOpen, label: "Lecciones", xp: "+25 BIZCOINS", color: "#10b981", desc: "Termina una lección del curso" },
                            { IconComp: Target, label: "Quizzes", xp: "+30 BIZCOINS", color: "#f59e0b", desc: "Responde preguntas correctamente" },
                            { IconComp: Flame, label: "Racha 7 días", xp: "+100 BIZCOINS", color: "#0F62FE", desc: "Mantén tu racha una semana" },
                        ].map(item => (
                            <div key={item.label} style={{ background: "#FBFAF5", borderRadius: 16, padding: "20px", border: `1px solid ${item.color}18`, borderLeft: `3px solid ${item.color}` }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, border: `1px solid ${item.color}20` }}>
                                    <item.IconComp size={22} color={item.color} strokeWidth={2.2} />
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 4 }}>{item.label}</div>
                                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>{item.desc}</div>
                                <div style={{ fontSize: 16, fontWeight: 500, color: item.color }}>{item.xp}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div >
    )
}
