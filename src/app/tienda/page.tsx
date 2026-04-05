"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
    ShoppingBag,
    Search,
    Zap,
    Star,
    ArrowRight,
    User,
    BookOpen,
    Sparkles,
    Lock,
    CheckCircle2,
    Gift,
    ChevronRight,
    X,
    Flame,
    Shield,
    Palette,
    PartyPopper,
    Trophy,
    Target,
    QrCode,
    History,
    TrendingUp,
} from "lucide-react"
import PageLoader from "@/components/PageLoader"
import BizenVirtualCard, { CardTheme } from "@/components/BizenVirtualCard"
import StreakWidget from "@/components/StreakWidget"
import { useSettings } from "@/contexts/SettingsContext"
import { useTranslation } from "@/lib/translations"

// ─────────────────────────────────────────
// Catalogue
// ─────────────────────────────────────────
const CATEGORIES = ["Ebooks", "Herramientas", "Insignias"] as const
type Category = (typeof CATEGORIES)[number]

interface Product {
    id: number
    name: string
    category: Category
    price: number
    description: string
    badge: string | null
    icon: React.ReactNode
    accent: string
    bg: string
}

// ── Rarity visual system ─────────────────────────────────────────────────────
const RARITY_STYLES: Record<string, { bg: string; text: string; glow: string }> = {
    "Común":      { bg: "#64748b",                                text: "#fff", glow: "rgba(100,116,139,0.25)" },
    "Raro":       { bg: "linear-gradient(90deg,#0ea5e9,#38bdf8)", text: "#fff", glow: "rgba(14,165,233,0.35)"  },
    "Épico":      { bg: "linear-gradient(90deg,#8b5cf6,#a78bfa)", text: "#fff", glow: "rgba(139,92,246,0.4)"   },
    "Legendario": { bg: "linear-gradient(90deg,#f59e0b,#ef4444)", text: "#fff", glow: "rgba(245,158,11,0.55)"  },
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const IcoBlueFr   = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="24" cy="16" r="10" fill="#3b82f6" fillOpacity=".9"/><path d="M4 44c0-11 9-20 20-20s20 9 20 20" fill="#3b82f6" fillOpacity=".7"/><circle cx="24" cy="16" r="10" stroke="#fff" strokeWidth="2" strokeDasharray="4 2"/></svg>
const IcoGoldFr   = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="24" cy="14" r="9" fill="#f59e0b"/><path d="M10 44c0-9 6.3-16.5 14-16.5S38 35 38 44" fill="#f59e0b" fillOpacity=".7"/><polygon points="24,4 26,12 34,12 28,17 30,26 24,21 18,26 20,17 14,12 22,12" fill="#fff" fillOpacity=".6"/></svg>
const IcoGalaxyFr = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><defs><radialGradient id="gal"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#2563eb"/></radialGradient></defs><circle cx="24" cy="14" r="11" fill="url(#gal)"/><ellipse cx="24" cy="14" rx="16" ry="6" stroke="#c4b5fd" strokeWidth="1.5" fill="none"/><circle cx="24" cy="14" r="4" fill="#fff" fillOpacity=".6"/></svg>
const IcoFlameFr  = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><path d="M24 4C18 14 10 18 14 28c2 5 6 8 10 8s8-3 10-8c4-10-4-14-10-24z" fill="#f97316"/><path d="M24 20c-2 4-2 8 0 10 2-2 2-6 0-10z" fill="#fde68a"/></svg>
const IcoBook1    = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="8" y="6" width="28" height="36" rx="4" fill="#10b981" fillOpacity=".85"/><path d="M14 14h16M14 20h16M14 26h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><rect x="6" y="8" width="4" height="32" rx="2" fill="#059669"/></svg>
const IcoBook2    = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="8" y="6" width="28" height="36" rx="4" fill="#ef4444" fillOpacity=".85"/><path d="M24 12v24M14 24h20" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round"/><rect x="6" y="8" width="4" height="32" rx="2" fill="#dc2626"/></svg>
const IcoBook3    = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="8" y="6" width="28" height="36" rx="4" fill="#0ea5e9" fillOpacity=".85"/><circle cx="24" cy="18" r="5" fill="#fff" fillOpacity=".7"/><path d="M14 30h20M14 36h12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><rect x="6" y="8" width="4" height="32" rx="2" fill="#0284c7"/></svg>
const IcoBook4    = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="8" y="6" width="28" height="36" rx="4" fill="#8b5cf6" fillOpacity=".85"/><path d="M20 14l8 8-8 8" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="8" width="4" height="32" rx="2" fill="#7c3aed"/></svg>
const IcoROI      = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="6" y="6" width="36" height="36" rx="8" fill="#6366f1" fillOpacity=".9"/><path d="M14 34l8-12 6 6 8-14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="38" cy="14" r="4" fill="#a5f3fc"/></svg>
const IcoPlan     = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><rect x="6" y="8" width="36" height="34" rx="6" fill="#0f172a" fillOpacity=".85"/><rect x="14" y="4" width="4" height="8" rx="2" fill="#38bdf8"/><rect x="30" y="4" width="4" height="8" rx="2" fill="#38bdf8"/><path d="M6 18h36" stroke="#38bdf8" strokeWidth="2"/><rect x="12" y="24" width="6" height="6" rx="2" fill="#4ade80"/><rect x="22" y="24" width="6" height="6" rx="2" fill="#facc15"/><rect x="32" y="24" width="6" height="6" rx="2" fill="#f87171"/></svg>
const IcoRisk     = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><path d="M24 6L6 42h36L24 6z" fill="#f97316" fillOpacity=".85"/><path d="M24 20v10M24 34v2" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
const IcoShield   = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><path d="M24 4L8 12v14c0 10 7 18 16 20 9-2 16-10 16-20V12L24 4z" fill="#0891b2" fillOpacity=".9"/><path d="M17 24l5 5 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IcoDarkMode = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="24" cy="24" r="18" fill="#1e1b4b"/><path d="M30 14a14 14 0 1 1-16 16 10 10 0 0 0 16-16z" fill="#a78bfa"/><circle cx="30" cy="12" r="2" fill="#e0e7ff"/></svg>
const IcoBoost    = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><path d="M24 4l4 12h12l-10 8 4 12-10-8-10 8 4-12L8 16h12z" fill="#f59e0b"/><path d="M24 16l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#fde68a"/></svg>
const IcoBadge1   = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><circle cx="24" cy="24" r="16" fill="#fb923c" fillOpacity=".85"/><circle cx="24" cy="24" r="10" fill="none" stroke="#fff" strokeWidth="2"/><path d="M19 24l4 4 6-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IcoBadge2   = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><defs><linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#ef4444"/></linearGradient></defs><polygon points="24,6 29,18 42,18 32,27 36,40 24,32 12,40 16,27 6,18 19,18" fill="url(#bg2)"/><polygon points="24,14 27,22 35,22 29,27 31,35 24,30 17,35 19,27 13,22 21,22" fill="#fde68a" fillOpacity=".8"/></svg>
const IcoBadge3   = () => <svg viewBox="0 0 48 48" width="44" height="44" fill="none"><defs><linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient></defs><polygon points="24,4 28,16 42,16 31,25 35,38 24,30 13,38 17,25 6,16 20,16" fill="url(#bg3)"/><circle cx="24" cy="22" r="6" fill="#fff" fillOpacity=".7"/></svg>

const PRODUCTS: Product[] = [
    // ── EBOOKS ─────────────────────────────────────────────────────────────────
    {
        id: 5, name: "Guía de Inversión 2025", category: "Ebooks", price: 350,
        description: "Todo lo que necesitas para empezar a invertir de forma inteligente. Desde CETES hasta ETFs sin jerga.",
        badge: "Raro", icon: <IcoBook1 />, accent: "#10b981",
        bg: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
    },
    {
        id: 6, name: "Secretos del Cash Flow", category: "Ebooks", price: 450,
        description: "Aprende a leer estados de resultados y a manejar el flujo de efectivo como lo hace un CFO.",
        badge: "Raro", icon: <IcoBook2 />, accent: "#ef4444",
        bg: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)",
    },
    {
        id: 7, name: "Psicología del Dinero", category: "Ebooks", price: 300,
        description: "¿Por qué tomamos malas decisiones financieras? Las herramientas mentales para dinero inteligente.",
        badge: "Común", icon: <IcoBook3 />, accent: "#0ea5e9",
        bg: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)",
    },
    {
        id: 8, name: "El Inversor Inteligente", category: "Ebooks", price: 700,
        description: "El clásico de Benjamin Graham adaptado al contexto mexicano. Análisis de empresas de la BMV incluido.",
        badge: "Épico", icon: <IcoBook4 />, accent: "#8b5cf6",
        bg: "linear-gradient(135deg, #2e1065 0%, #8b5cf6 100%)",
    },
    // ── HERRAMIENTAS ───────────────────────────────────────────────────────────
    {
        id: 9, name: "Calculadora de ROI", category: "Herramientas", price: 500,
        description: "Herramienta interactiva para calcular el retorno sobre inversión de cualquier proyecto. Exporta en PDF.",
        badge: "Raro", icon: <IcoROI />, accent: "#6366f1",
        bg: "linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)",
    },
    {
        id: 10, name: "Planeador Financiero", category: "Herramientas", price: 800,
        description: "Planea tu presupuesto, rastrea gastos y visualiza tu progreso hacia tus metas. Diseñado para estudiantes.",
        badge: "Épico", icon: <IcoPlan />, accent: "#38bdf8",
        bg: "linear-gradient(135deg, #082f49 0%, #0369a1 100%)",
    },
    {
        id: 11, name: "Analizador de Riesgo", category: "Herramientas", price: 650,
        description: "Evalúa el riesgo de cualquier inversión con métricas profesionales: VaR, Sharpe Ratio, Drawdown máximo.",
        badge: "Raro", icon: <IcoRisk />, accent: "#f97316",
        bg: "linear-gradient(135deg, #431407 0%, #c2410c 100%)",
    },
    // ── INSIGNIAS ──────────────────────────────────────────────────────────────
    {
        id: 15, name: "Insignia Pionero", category: "Insignias", price: 250,
        description: "Demuestra que fuiste de los primeros en llegar a Bizen. Esta placa hace destacar tu perfil en el foro.",
        badge: "Común", icon: <IcoBadge1 />, accent: "#fb923c",
        bg: "linear-gradient(135deg, #431407 0%, #ea580c 100%)",
    },
    {
        id: 16, name: "Maestro Finance", category: "Insignias", price: 800,
        description: "Para los que dominaron todos los módulos del curso. Una insignia que inspira respeto en la comunidad.",
        badge: "Épico", icon: <IcoBadge2 />, accent: "#f59e0b",
        bg: "linear-gradient(135deg, #292524 0%, #78350f 50%, #b45309 100%)",
    },
    {
        id: 17, name: "Millennial Rico", category: "Insignias", price: 1200,
        description: "La insignia más rara. Este título legendario solo lo han alcanzado menos del 1% de usuarios de Bizen.",
        badge: "Legendario", icon: <IcoBadge3 />, accent: "#8b5cf6",
        bg: "linear-gradient(135deg, #0f172a 0%, #4c1d95 40%, #1d4ed8 100%)",
    },
]

const GIFT_CARDS = [
    { id: 101, store: "Amazon", color: "#FF9900", bg: "linear-gradient(135deg, #1a0a00 0%, #4a1a00 100%)", logo: "amazon", points: 5000, value: "$50 MXN", description: "Para cualquier compra en Amazon.com.mx" },
    { id: 102, store: "Oxxo", color: "#da291c", bg: "linear-gradient(135deg, #1a0000 0%, #5a0000 100%)", logo: "oxxo", points: 3000, value: "$30 MXN", description: "Canjeable en cualquier tienda Oxxo" },
    { id: 103, store: "Liverpool", color: "#b8005c", bg: "linear-gradient(135deg, #1a0020 0%, #5a0040 100%)", logo: "liverpool", points: 10000, value: "$100 MXN", description: "Para usar en tiendas Liverpool" },
    { id: 104, store: "Cinépolis", color: "#0057b8", bg: "linear-gradient(135deg, #00102a 0%, #003070 100%)", logo: "cinepolis", points: 4000, value: "$40 MXN", description: "2 boletos de cine en cualquier sede" },
    { id: 105, store: "Starbucks", color: "#00704A", bg: "linear-gradient(135deg, #001a0a 0%, #004a26 100%)", logo: "starbucks", points: 2500, value: "$25 MXN", description: "Para tu bebida favorita" },
    { id: 106, store: "Spotify", color: "#1DB954", bg: "linear-gradient(135deg, #001a06 0%, #004a1a 100%)", logo: "spotify", points: 6000, value: "1 mes Premium", description: "Música sin anuncios por 30 días" },
]

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    "Común":      { bg: "#64748b", text: "#fff" },
    "Raro":       { bg: "#0ea5e9", text: "#fff" },
    "Épico":      { bg: "#8b5cf6", text: "#fff" },
    "Legendario": { bg: "#f59e0b", text: "#fff" },
    // legacy
    Popular:   { bg: "#f59e0b", text: "#fff" },
    Exclusivo: { bg: "#7c3aed", text: "#fff" },
    Nuevo:     { bg: "#10b981", text: "#fff" },
    Oferta:    { bg: "#ef4444", text: "#fff" },
}

// ─────────────────────────────────────────
export default function TiendaPage() {
    const { user, loading, refreshUser, dbProfile } = useAuth()
    const router = useRouter()

    const [stats, setStats] = useState<any>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [activeTab, setActiveTab] = useState<"catalogo" | "inventario" | "bizcoins">("catalogo")
    const [activeCategory, setActiveCategory] = useState<Category | "Todo">("Todo")
    const [search, setSearch] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [searchFocused, setSearchFocused] = useState(false)
    const [purchaseSuccess, setPurchaseSuccess] = useState(false)

    // For bizcoins tab
    const { settings } = useSettings()
    const t_loc = useTranslation(settings.language)
    const [selectedGCId, setSelectedGCId] = useState<number | null>(null)
    const [redeemModal, setRedeemModal] = useState(false)

    const [inventory, setInventory] = useState<string[]>([])
    const [purchasing, setPurchasing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loadingRedeem, setLoadingRedeem] = useState(false)
    const [redeemSuccess, setRedeemSuccess] = useState(false)

    useEffect(() => {
        if (loading) return
        if (!user) { router.push("/login"); return }

        const fetchAll = async () => {
            setLoadingStats(true)
            try {
                // Fetch stats (bizcoins, etc.)
                const statsRes = await fetch("/api/user/stats")
                if (statsRes.ok) setStats(await statsRes.json())

                // Fetch inventory separately to ensure 'inventory' state is populated
                const invRes = await fetch("/api/tienda/inventory")
                if (invRes.ok) {
                    const data = await invRes.json()
                    setInventory(data.inventory || [])
                }
            } catch { /* silent */ }
            finally { setLoadingStats(false) }
        }

        fetchAll()
    }, [user, loading, router])

    const handleConfirmPurchase = async () => {
        if (!selectedProduct) return
        setPurchasing(true)
        setError(null)
        try {
            const res = await fetch("/api/tienda/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: selectedProduct.id,
                    price: selectedProduct.price,
                    name: selectedProduct.name
                })
            })
            const data = await res.json()
            if (res.ok) {
                setPurchaseSuccess(true)
                // Update local stats immediately
                if (data.bizcoins !== undefined) {
                    setStats((s: any) => ({ ...s, bizcoins: data.bizcoins }))
                }
                // Add to local inventory so the button disables immediately
                setInventory(prev => [...new Set([...prev, String(selectedProduct.id)])])

                // Refresh global profile (Avatar frames, Sidebar points, etc.)
                try {
                    await refreshUser()
                    // Add confetti celebration
                    const confetti = (await import("canvas-confetti")).default
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#0F62FE", "#4A9EFF", "#10b981", "#fbbf24"]
                    })
                } catch (e) {
                    console.error("Error refreshing global user state:", e)
                }
            } else {
                setError(data.error || "Error al completar la compra")
            }
        } catch {
            setError("Error de conexión al servidor")
        } finally {
            setPurchasing(false)
        }
    }

    const handleRedeemGC = async () => {
        if (!selectedGC || loadingRedeem || userPoints < selectedGC.points) return
        setLoadingRedeem(true)
        setError(null)
        try {
            const res = await fetch("/api/user/redeem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ giftCardId: selectedGC.id })
            })
            const data = await res.json()
            if (res.ok) {
                setRedeemSuccess(true)
                // celebration
                const confetti = (await import("canvas-confetti")).default
                confetti({
                    particleCount: 150, spread: 70, origin: { y: 0.6 },
                    colors: ["#0F62FE", "#4A9EFF", "#10b981", "#fbbf24"]
                })
                await refreshUser()
                setTimeout(() => {
                    setRedeemModal(false)
                    setRedeemSuccess(false)
                    setSelectedGCId(null)
                }, 2500)
            } else {
                setError(data.error || "Error al completar el canje")
            }
        } catch {
            setError("Error de conexión")
        } finally {
            setLoadingRedeem(false)
        }
    }

    const bizcoins = stats?.bizcoins ?? (dbProfile as any)?.bizcoins ?? 0
    const userPoints = bizcoins
    const selectedGC = GIFT_CARDS.find(c => c.id === selectedGCId)

    const filtered = PRODUCTS.filter(p => {
        const matchCat = activeCategory === "Todo" || p.category === activeCategory
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const ownedProducts = PRODUCTS.filter(p => inventory.includes(String(p.id)))

    if (loading || loadingStats) return <PageLoader />

    return (
        <div
            className="tienda-outer"
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <style>{`
        /* ── layout offsets ── */
        @media (max-width: 767px) {
          .tienda-outer { padding-bottom: 80px !important; }
          .tienda-inner { width: 100% !important; max-width: 100% !important; margin-left: 0 !important; }
        }
        @media (min-width: 768px) and (max-width: 1160px) {
          .tienda-inner {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
          }
        }
        @media (min-width: 1161px) {
          .tienda-inner {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
          }
        }

        /* ── keyframes ── */
        @keyframes tienda-fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tienda-float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
        @keyframes tienda-shine   { 0% { left:-100%; } 20%,100% { left:110%; } }
        @keyframes tienda-pulse   {
          0%,100% { box-shadow: 0 4px 20px rgba(15,98,254,0.4); }
          50%      { box-shadow: 0 4px 28px rgba(15,98,254,0.65); }
        }
        @keyframes tienda-spin    { to { transform: rotate(360deg); } }
        @keyframes tienda-orb     { 0%,100% { transform: scale(1) translateY(0); opacity:0.6; } 50% { transform: scale(1.15) translateY(-8px); opacity:1; } }
        @keyframes tienda-badge-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.5); } 60% { box-shadow: 0 0 0 8px rgba(251,191,36,0); } }
        @keyframes tienda-x2-shine { 0% { left:-60%; } 100% { left:140%; } }
        @keyframes tienda-bounce  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes tienda-wiggle  { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }
        @keyframes tienda-glow    { 0%,100% { filter: drop-shadow(0 0 4px rgba(15,98,254,0.3)); } 50% { filter: drop-shadow(0 0 12px rgba(15,98,254,0.6)); } }
        @keyframes card-scanline  { 0% { top: -100%; } 100% { top: 200%; } }

        /* ── horizontal scroll helpers ── */
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── responsive adjustments ── */
        @media (max-width: 767px) {
            .tienda-tabs-container {
                overflow-x: auto;
                padding-bottom: 2px;
                margin-bottom: 12px !important;
                gap: 8px !important;
            }
            .tienda-tab-btn {
                padding: 10px 14px !important;
                font-size: 13px !important;
                flex-shrink: 0;
            }
            .tienda-cat-container {
                overflow-x: auto;
                padding: 4px 0;
                margin-top: 8px;
                gap: 6px !important;
            }
            .tienda-cat {
                padding: 6px 12px !important;
                font-size: 11px !important;
            }
            .tienda-card {
                border-radius: 20px !important;
            }
            .tienda-card > div:first-child {
                height: 100px !important;
            }
            .tienda-card > div:nth-child(2) {
                padding: 14px 12px !important;
            }
            .tienda-card h3 {
                font-size: 13px !important;
                margin-bottom: 2px !important;
            }
            .tienda-card p {
                font-size: 10px !important;
                margin-bottom: 6px !important;
                line-height: 1.3 !important;
            }
            .canjear-btn {
                padding: 8px 10px !important;
                font-size: 11px !important;
                border-radius: 10px !important;
            }
            .puntos-stat-card {
                padding: 16px 12px !important;
                border-radius: 16px !important;
            }
            .puntos-stat-card div:nth-child(2) {
                font-size: 24px !important;
            }
            .tienda-inner {
                padding: 12px 14px !important;
            }
            .tienda-hero {
                padding: 24px 20px !important;
                border-radius: 24px !important;
                margin-bottom: 20px !important;
                min-height: auto !important;
            }
            .tienda-hero h1 {
                font-size: 26px !important;
                margin-bottom: 6px !important;
            }
            .tienda-hero p {
                font-size: 13px !important;
                margin-bottom: 0 !important;
            }
            .tienda-hero > div {
              flex-direction: column !important;
              gap: 16px !important;
              align-items: flex-start !important;
            }
            .tienda-promo {
                padding: 14px 18px !important;
                border-radius: 14px !important;
                margin-bottom: 20px !important;
            }
            .tienda-promo span {
                font-size: 11px !important;
            }
            .gift-card-item div:first-child {
                padding: 20px 16px !important;
                min-height: 100px !important;
            }
            .gift-card-item div:nth-child(2) {
                padding: 12px 16px !important;
            }
            .tienda-modal {
                padding: 20px !important;
                border-radius: 20px !important;
            }
            /* Guide and Footers Section */
            .tienda-guide-container {
                padding: 20px !important;
                border-radius: 24px !important;
            }
            .tienda-guide-container h3 {
                font-size: 19px !important;
                margin-bottom: 20px !important;
            }
            .tienda-guide-item {
                padding: 18px !important;
                border-radius: 20px !important;
            }
            .tienda-guide-item div:first-child {
                width: 40px !important;
                height: 40px !important;
                margin-bottom: 10px !important;
            }
            .tienda-guide-item div:nth-child(2) {
                font-size: 14px !important;
            }
            .tienda-footer-section {
                padding: 20px !important;
                border-radius: 24px !important;
                margin-top: 28px !important;
            }
            .tienda-footer-header h2 {
                font-size: 18px !important;
            }
            .tienda-footer-header p {
                font-size: 13px !important;
            }
        }

        /* ── product card ── */
        .tienda-card {
            background: white;
            border-radius: 32px;
            border: 1px solid #f1f5f9;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: tienda-fadeUp 0.6s ease both;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .tienda-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 30px 60px -12px rgba(15, 98, 254, 0.15);
            border-color: #bfdbfe;
        }
        
        /* ── gift card items ── */
        .gift-card-item {
            cursor: pointer;
            border-radius: 24px;
            overflow: hidden;
            transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
            border: 2px solid transparent;
            position: relative;
            background: white;
        }
        .gift-card-item:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        }
        .gift-card-item.selected {
            border-color: #0F62FE;
            box-shadow: 0 0 0 4px rgba(15,98,254,0.2) !important;
        }
        .gift-card-item.locked {
            filter: grayscale(0.5);
            opacity: 0.8;
        }
        .gift-card-scanline {
            position: absolute;
            left: 0; right: 0;
            height: 40%;
            background: linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent);
            animation: card-scanline 3s ease-in-out infinite;
            pointer-events: none;
        }
        .puntos-stat-card { animation: tienda-fadeUp 0.6s cubic-bezier(0.2,0.8,0.2,1) both; }
        .tienda-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 32px;
          border: 2px solid transparent;
          transition: border-color 0.4s ease;
          pointer-events: none;
        }
        .tienda-card:hover::after {
          border-color: rgba(15, 98, 254, 0.1);
        }

        /* ── canjear btn ── */
        .canjear-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.22s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .canjear-btn.can-afford {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          color: white;
          box-shadow: 0 6px 20px rgba(15,98,254,0.3);
          animation: tienda-pulse 2.5s ease infinite;
        }
        .canjear-btn.can-afford:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.4);
        }
        .canjear-btn.locked {
          background: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
        }

        /* ── modal ── */
        .tienda-modal-bg {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: tienda-fadeUp 0.25s ease both;
        }
        .tienda-modal {
          background: white;
          border-radius: 28px;
          width: 100%;
          max-width: 440px;
          padding: clamp(28px,5vw,40px);
          box-shadow: 0 40px 100px rgba(0,0,0,0.28);
          animation: tienda-fadeUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        /* ── search input ── */
        .tienda-search:focus { border-color: #0F62FE !important; outline: none; }

        /* ── category pill ── */
        .tienda-cat { transition: all 0.2s ease; }
        .tienda-cat:hover { transform: translateY(-1px); }
      `}</style>

            {/* ── PURCHASE MODAL ── */}
            {selectedProduct && (
                <div
                    className="tienda-modal-bg"
                    onClick={(e) => { if (e.target === e.currentTarget) { setSelectedProduct(null); setPurchaseSuccess(false) } }}
                >
                    <div className="tienda-modal">
                        {purchaseSuccess ? (
                            /* SUCCESS STATE */
                            <div style={{ textAlign: "center" }}>
                                <div style={{
                                    width: 80, height: 80, background: "#f0fdf4", borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 20px", color: "#16a34a",
                                    animation: "tienda-bounce 1s ease infinite"
                                }}>
                                    <PartyPopper size={48} />
                                </div>
                                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.01em" }}>¡Canje exitoso!</h2>
                                <p style={{ fontSize: 15, color: "#64748b", marginBottom: 32, lineHeight: 1.5 }}>
                                    <strong>{selectedProduct.name}</strong> ya está en tu perfil.
                                </p>
                                <button
                                    onClick={() => { setSelectedProduct(null); setPurchaseSuccess(false) }}
                                    style={{
                                        padding: "13px 32px", background: "linear-gradient(135deg,#0F62FE,#4A9EFF)",
                                        color: "white", border: "none", borderRadius: 12,
                                        fontWeight: 500, fontSize: 14, cursor: "pointer",
                                        display: "inline-flex", alignItems: "center", gap: 8
                                    }}
                                >
                                    ¡Genial! <CheckCircle2 size={16} />
                                </button>
                            </div>
                        ) : (
                            /* CONFIRM STATE */
                            <>
                                {/* Close */}
                                <button
                                    onClick={() => { setSelectedProduct(null); setPurchaseSuccess(false) }}
                                    style={{ position: "absolute", marginLeft: "calc(100% - 96px)", marginTop: -12, background: "#f1f5f9", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                >
                                    <X size={16} color="#64748b" />
                                </button>

                                {/* Product preview inside modal */}
                                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
                                    <div style={{
                                        width: 68, height: 68, borderRadius: 18,
                                        background: selectedProduct.bg,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: selectedProduct.accent, flexShrink: 0,
                                        border: `1.5px solid ${selectedProduct.accent}30`,
                                        boxShadow: `0 6px 18px ${selectedProduct.accent}25`,
                                    }}>
                                        {selectedProduct.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", marginBottom: 3 }}>{selectedProduct.name}</div>
                                        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginBottom: 6 }}>{selectedProduct.category}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 500, color: selectedProduct.accent, fontSize: 17 }}>
                                            <Zap size={14} fill={selectedProduct.accent} color={selectedProduct.accent} />
                                            {selectedProduct.price.toLocaleString()} BIZCOINS
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: "#f8fafc", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
                                    <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{selectedProduct.description}</p>
                                </div>

                                {/* Balance check */}
                                {bizcoins < selectedProduct.price ? (
                                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "11px 16px", marginBottom: 18, display: "flex", gap: 8, alignItems: "center", color: "#dc2626", fontSize: 13, fontWeight: 500 }}>
                                        <Lock size={14} />
                                        Te faltan {(selectedProduct.price - bizcoins).toLocaleString()} BIZCOINS para este canje.
                                    </div>
                                ) : (
                                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "11px 16px", marginBottom: 18, display: "flex", gap: 8, alignItems: "center", color: "#16a34a", fontSize: 13, fontWeight: 500 }}>
                                        <CheckCircle2 size={14} />
                                        Saldo disponible: {bizcoins.toLocaleString()} BIZCOINS
                                    </div>
                                )}

                                {error && (
                                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "11px 16px", marginBottom: 18, color: "#dc2626", fontSize: 12, fontWeight: 500 }}>
                                        {error}
                                    </div>
                                )}

                                <div style={{ display: "flex", gap: 10 }}>
                                    <button
                                        onClick={() => { setSelectedProduct(null); setPurchaseSuccess(false); setError(null) }}
                                        disabled={purchasing}
                                        style={{ flex: 1, padding: "13px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, fontWeight: 500, cursor: "pointer", fontSize: 14, color: "#64748b", }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={bizcoins < selectedProduct.price || purchasing}
                                        onClick={handleConfirmPurchase}
                                        style={{
                                            flex: 2, padding: "14px", borderRadius: 14, border: "none",
                                            background: bizcoins >= selectedProduct.price && !purchasing
                                                ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)"
                                                : "#e2e8f0",
                                            color: bizcoins >= selectedProduct.price && !purchasing ? "white" : "#94a3b8",
                                            fontWeight: 600, fontSize: 14, cursor: (bizcoins >= selectedProduct.price && !purchasing) ? "pointer" : "not-allowed",
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                                        }}
                                    >
                                        {purchasing ? (
                                            <>
                                                <div style={{ width: 14, height: 14, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "tienda-spin 0.6s linear infinite" }} />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Confirmar canje <ChevronRight size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── REDEEM CONFIRMATION MODAL ── */}
            {redeemModal && selectedGC && (
                <div className="tienda-modal-bg" onClick={e => { if (e.target === e.currentTarget) setRedeemModal(false) }}>
                    <div className="tienda-modal" style={{ maxWidth: 520, position: "relative" }}>
                        <button onClick={() => setRedeemModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "#f1f5f9", border: "none", padding: 8, borderRadius: 12, cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
                        
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(15,98,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "tienda-bounce 2s infinite ease" }}>
                                <Gift size={40} color="#0F62FE" />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>¿Canjear tarjeta?</h2>
                            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>Descontaremos {selectedGC.points.toLocaleString()} BIZCOINS de tu saldo actual.</p>
                        </div>

                        <div style={{ background: selectedGC.bg, borderRadius: 24, padding: "28px", marginBottom: 28, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", position: "relative", overflow: "hidden" }}>
                            <div className="gift-card-scanline" />
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.9, marginBottom: 4 }}>{selectedGC.store}</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: selectedGC.color }}>{selectedGC.value}</div>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "12px 18px", textAlign: "right", position: "relative", zIndex: 1 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", opacity: 0.8, marginBottom: 2 }}>Costo</div>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedGC.points.toLocaleString()}</div>
                            </div>
                        </div>

                        {userPoints < selectedGC.points && (
                            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "16px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center", color: "#dc2626" }}>
                                <Lock size={20} />
                                <span style={{ fontSize: 14, fontWeight: 600 }}>No tienes suficientes BIZCOINS para este canje.</span>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 14 }}>
                            <button onClick={() => setRedeemModal(false)} disabled={loadingRedeem} style={{ flex: 1, padding: "16px", background: "#f1f5f9", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", fontSize: 15, color: "#64748b" }}>Cancelar</button>
                            <button
                                disabled={userPoints < selectedGC.points || loadingRedeem || redeemSuccess}
                                onClick={handleRedeemGC}
                                style={{ flex: 2, padding: "16px", background: userPoints >= selectedGC.points && !loadingRedeem ? (redeemSuccess ? "#10b981" : "linear-gradient(135deg, #0F62FE, #4A9EFF)") : "#e2e8f0", color: "white", border: "none", borderRadius: 16, fontWeight: 700, cursor: (userPoints >= selectedGC.points && !loadingRedeem) ? "pointer" : "not-allowed", fontSize: 15, boxShadow: userPoints >= selectedGC.points ? "0 8px 25px rgba(15,98,254,0.3)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                            >
                                {loadingRedeem ? "Procesando..." : (redeemSuccess ? <><CheckCircle2 size={18} /> ¡Canje Exitoso!</> : "Confirmar Canje")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PAGE CONTENT ── */}
            <div
                className="tienda-inner"
                style={{
                    position: "relative",
                    padding: "clamp(24px, 5vw, 48px)",
                    boxSizing: "border-box",
                    zIndex: 1,
                }}
            >
                {/* ── HERO HEADER ── */}
                <div 
                    className="tienda-hero"
                    style={{
                        background: "linear-gradient(135deg, #0B1E5E 0%, #1e3a8a 55%, #0F62FE 100%)",
                        borderRadius: 40,
                        padding: "clamp(40px, 6vw, 80px) clamp(32px, 5vw, 64px)",
                        marginBottom: 40,
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: "0 24px 70px rgba(15,98,254,0.3)",
                        animation: "tienda-fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both",
                    }}
                >
                    {/* Artistic backgrounds */}
                    <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-30%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: "20%", left: "40%", width: 200, height: 200, background: "rgba(255,255,255,0.03)", filter: "blur(40px)", borderRadius: "50%" }} />

                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
                        <div style={{ flex: "1 1 500px" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 16px", marginBottom: 20 }}>
                                <ShoppingBag size={14} color="#60a5fa" />
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#93C5FD", textTransform: "uppercase", letterSpacing: "0.1em" }}>Marketplace Premium</span>
                            </div>
                            <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
                                Personaliza tu <span style={{ color: "#60A5FA" }}>Experiencia</span>
                            </h1>
                            <p style={{ fontSize: "clamp(16px, 1.8vw, 20px)", color: "rgba(147, 197, 253, 0.8)", fontWeight: 400, margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
                                Invierte tus BIZCOINS en artículos exclusivos, herramientas y contenido premium para potenciar tu crecimiento.
                            </p>
                        </div>

                        {/* Balance display -> Virtual Card */}
                        <div style={{
                            flexShrink: 0,
                            width: "100%",
                            maxWidth: 420,
                            animation: "tienda-fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both",
                        }}>
                            <BizenVirtualCard 
                                bizcoins={bizcoins} 
                                holderName={dbProfile?.fullName || user?.email?.split("@")[0] || "Usuario"} 
                                colorTheme={(dbProfile?.cardTheme || "blue") as CardTheme}
                                level={dbProfile?.level || 1}
                            />
                        </div>
                    </div>
                </div>

                {/* ── FEATURED PROMO BANNER ── */}
                <div
                    className="tienda-promo"
                    style={{
                        background: "linear-gradient(135deg, #18002e 0%, #3b0764 30%, #1e3a8a 70%, #0f172a 100%)",
                        borderRadius: 28,
                        padding: "32px 40px",
                        marginBottom: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        flexWrap: "wrap",
                        position: "relative",
                        overflow: "hidden",
                        animation: "tienda-fadeUp 0.55s ease 0.1s both",
                        border: "1px solid rgba(139,92,246,0.3)",
                        boxShadow: "0 24px 60px rgba(109,40,217,0.35), 0 1px 0 rgba(255,255,255,0.05) inset",
                    }}
                >
                    {/* Background orbs */}
                    <div style={{ position:"absolute", top:"-30%", right:"-5%", width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)", animation:"tienda-orb 6s ease-in-out infinite", pointerEvents:"none" }} />
                    <div style={{ position:"absolute", bottom:"-40%", left:"5%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)", animation:"tienda-orb 8s ease-in-out infinite 2s", pointerEvents:"none" }} />
                    {/* Shine sweep */}
                    <div style={{ position:"absolute", top:0, left:"-100%", width:"55%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", animation:"tienda-shine 5s ease-in-out infinite", pointerEvents:"none" }} />
                    {/* Grid dots */}
                    <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }} />

                    {/* Left: badge + copy */}
                    <div style={{ display:"flex", flexDirection:"column", gap:10, position:"relative", zIndex:1 }}>
                        {/* Pill badge */}
                        <div style={{ display:"inline-flex", alignItems:"center", gap:8, width:"fit-content" }}>
                            <div style={{
                                display:"inline-flex", alignItems:"center", gap:6,
                                background:"rgba(251,191,36,0.15)",
                                border:"1px solid rgba(251,191,36,0.45)",
                                borderRadius:999, padding:"4px 12px",
                                animation:"tienda-badge-pulse 2.5s ease infinite"
                            }}>
                                <Flame size={13} color="#fbbf24" fill="#fbbf24" />
                                <span style={{ fontSize:11, fontWeight:800, color:"#fbbf24", letterSpacing:"0.08em", textTransform:"uppercase" }}>Oferta Global Activa</span>
                            </div>
                            {/* 2x pill */}
                            <div style={{
                                position:"relative", overflow:"hidden",
                                background:"linear-gradient(135deg,#f59e0b,#ef4444)",
                                borderRadius:999, padding:"3px 10px",
                                boxShadow:"0 4px 12px rgba(239,68,68,0.5)"
                            }}>
                                <div style={{ position:"absolute", top:0, left:"-60%", width:"40%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)", animation:"tienda-x2-shine 2s ease-in-out infinite" }} />
                                <span style={{ fontSize:12, fontWeight:900, color:"#fff", letterSpacing:"0.02em" }}>×2</span>
                            </div>
                        </div>
                        {/* Headline */}
                        <div>
                            <div style={{ fontSize:"clamp(20px,3vw,26px)", fontWeight:900, color:"#fff", lineHeight:1.15, letterSpacing:"-0.02em", marginBottom:4 }}>
                                Doble XP y BIZCOINS
                            </div>
                            <div style={{ fontSize:"clamp(13px,1.5vw,15px)", color:"rgba(196,181,253,0.9)", fontWeight:500 }}>
                                En cada lección completada — automáticamente para todos
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── NAVIGATION TABS ── */}
                <div 
                    className="tienda-tabs-container scroll-hide"
                    style={{
                        display: "flex",
                        gap: 0,
                        marginBottom: 32,
                        borderBottom: "2px solid #e2e8f0",
                        animation: "tienda-fadeUp 0.5s ease 0.12s both",
                        position: "relative"
                    }}
                >
                    {[
                        { id: "catalogo", label: "Catálogo", icon: <ShoppingBag size={18} /> },
                        { id: "inventario", label: "Mis Compras", icon: <ShoppingBag size={18} /> },
                        { id: "bizcoins", label: "Mis BIZCOINS", icon: <Star size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className="tienda-tab-btn"
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "14px 28px",
                                background: "none",
                                border: "none",
                                borderBottom: activeTab === tab.id ? "3px solid #0F62FE" : "3px solid transparent",
                                color: activeTab === tab.id ? "#0F62FE" : "#64748b",
                                fontWeight: 500,
                                fontSize: 15,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                marginBottom: -2,
                                position: "relative",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.id === "inventario" && ownedProducts.length > 0 && (
                                <span style={{
                                    marginLeft: 4,
                                    background: activeTab === "inventario" ? "#0F62FE" : "#94a3b8",
                                    color: "white",
                                    fontSize: 10,
                                    padding: "2px 7px",
                                    borderRadius: 10,
                                    fontWeight: 500
                                }}>
                                    {ownedProducts.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── SEARCH + CATEGORIES (Only for Catalogue) ── */}
                {activeTab === "catalogo" && (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 32, animation: "tienda-fadeUp 0.55s ease 0.15s both" }}>
                            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
                                <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} size={17} />
                                <input
                                    className="tienda-search"
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    placeholder="Buscar recompensas..."
                                    style={{
                                        width: "100%",
                                        padding: "14px 16px 14px 44px",
                                        borderRadius: 16,
                                        border: `2px solid ${searchFocused ? "#0F62FE" : "transparent"}`,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        color: "#0f172a",
                                        background: "white",
                                        boxShadow: searchFocused
                                            ? "0 8px 24px rgba(15,98,254,0.15)"
                                            : "0 4px 12px rgba(0,0,0,0.05)",
                                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxSizing: "border-box",
                                        outline: "none",
                                    }}
                                />
                            </div>

                            <div 
                                className="tienda-cat-container scroll-hide"
                                style={{ display: "flex", gap: 8 }}
                            >
                                {(["Todo", ...CATEGORIES] as const).map(cat => (
                                    <button
                                        key={cat}
                                        className="tienda-cat"
                                        onClick={() => setActiveCategory(cat as Category | "Todo")}
                                        style={{
                                            padding: "10px 22px",
                                            borderRadius: 999,
                                            fontWeight: 600,
                                            fontSize: 14,
                                            cursor: "pointer",
                                            whiteSpace: "nowrap",
                                            background: activeCategory === cat
                                                ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)"
                                                : "white",
                                            color: activeCategory === cat ? "white" : "#64748b",
                                            boxShadow: activeCategory === cat
                                                ? "0 8px 20px rgba(15, 23, 42, 0.25)"
                                                : "0 2px 8px rgba(0,0,0,0.04)",
                                            border: activeCategory === cat ? "none" : "1.5px solid #e2e8f0",
                                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                            flexShrink: 0
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginBottom: 20, animation: "tienda-fadeUp 0.5s ease 0.2s both" }}>
                            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                        </div>
                    </>
                )}

                {/* ── PRODUCT GRID (CATALOGO OR INVENTORY) ── */}
                {activeTab === "catalogo" ? (
                    filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 24px", color: "#94a3b8", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                            <Search size={48} strokeWidth={1} style={{ opacity: 0.5 }} />
                            <div style={{ fontSize: 15, fontWeight: 500 }}>No encontramos productos que coincidan.</div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 24 }}>
                            {filtered.map((product, idx) => {
                                const canAfford = bizcoins >= product.price
                                const isOwned = inventory.includes(String(product.id))
                                const badgeStyle = product.badge ? BADGE_COLORS[product.badge] : null
                                return (
                                    <div
                                        key={product.id}
                                        className="tienda-card"
                                        style={{
                                            animationDelay: `${Math.min(idx * 0.06, 0.4)}s`,
                                            boxShadow: product.badge && RARITY_STYLES[product.badge]
                                                ? `0 4px 20px ${RARITY_STYLES[product.badge].glow}, 0 1px 3px rgba(0,0,0,0.05)`
                                                : undefined,
                                        }}
                                    >
                                        {/* ── Card hero ── */}
                                        <div style={{ position: "relative", height: 172, background: product.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                                            {/* Ambient glow orb */}
                                            <div style={{ position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)", width: 120, height: 60, background: `radial-gradient(circle, ${product.accent}60 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(12px)", pointerEvents: "none" }} />
                                            {/* Shine sweep for Legendario */}
                                            {product.badge === "Legendario" && (
                                                <div style={{ position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)", animation: "tienda-shine 3s ease-in-out infinite", pointerEvents: "none" }} />
                                            )}
                                            {/* Icon */}
                                            <div style={{ animation: "tienda-float 3.5s ease-in-out infinite", animationDelay: `${idx * 0.3}s`, position: "relative", zIndex: 1, filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.3))" }}>
                                                {product.icon}
                                            </div>

                                            {/* Rarity / Owned badge */}
                                            {isOwned ? (
                                                <div style={{
                                                    position: "absolute", top: 12, right: 12,
                                                    display: "flex", alignItems: "center", gap: 5,
                                                    background: "rgba(16,185,129,0.2)",
                                                    border: "1px solid rgba(16,185,129,0.5)",
                                                    backdropFilter: "blur(8px)",
                                                    color: "#10b981", fontSize: 10, fontWeight: 800,
                                                    padding: "5px 10px", borderRadius: 999,
                                                    boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                                                    letterSpacing: "0.06em"
                                                }}>
                                                    <CheckCircle2 size={11} /> ADQUIRIDO
                                                </div>
                                            ) : product.badge && RARITY_STYLES[product.badge] ? (
                                                <div style={{
                                                    position: "absolute", top: 12, right: 12,
                                                    display: "flex", alignItems: "center", gap: 5,
                                                    background: "rgba(0,0,0,0.35)",
                                                    border: `1px solid ${RARITY_STYLES[product.badge].glow.replace("rgba","rgba").replace(/,[\d.]+\)$/, ",0.6)")}`,
                                                    backdropFilter: "blur(10px)",
                                                    color: "#fff", fontSize: 10, fontWeight: 800,
                                                    padding: "5px 11px", borderRadius: 999,
                                                    letterSpacing: "0.07em", textTransform: "uppercase",
                                                    boxShadow: `0 4px 14px ${RARITY_STYLES[product.badge].glow}`,
                                                }}>
                                                    {product.badge === "Legendario" && <Trophy size={10} />}
                                                    {product.badge === "Épico" && <Star size={10} fill="currentColor" />}
                                                    {product.badge === "Raro" && <Sparkles size={10} />}
                                                    {product.badge === "Común" && <Shield size={10} />}
                                                    {product.badge}
                                                </div>
                                            ) : null}

                                            {/* Global 2x offer indicator */}
                                            {!isOwned && (
                                                <div style={{
                                                    position: "absolute", top: 12, left: 12,
                                                    display: "flex", alignItems: "center", gap: 4,
                                                    background: "linear-gradient(135deg,rgba(245,158,11,0.9),rgba(239,68,68,0.9))",
                                                    backdropFilter: "blur(6px)",
                                                    color: "#fff", fontSize: 10, fontWeight: 900,
                                                    padding: "4px 8px", borderRadius: 8,
                                                    boxShadow: "0 3px 10px rgba(239,68,68,0.4)",
                                                    letterSpacing: "0.04em"
                                                }}>
                                                    <Zap size={10} fill="white" /> ×2 XP
                                                </div>
                                            )}

                                            {/* Insufficient funds lock */}
                                            {!canAfford && !isOwned && (
                                                <div style={{
                                                    position: "absolute", bottom: 12, left: 12,
                                                    background: "rgba(0,0,0,0.5)", color: "#fff",
                                                    fontSize: 10, fontWeight: 600,
                                                    padding: "4px 10px", borderRadius: 999,
                                                    display: "flex", alignItems: "center", gap: 4,
                                                    backdropFilter: "blur(6px)"
                                                }}>
                                                    <Lock size={10} />Saldo insuficiente
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Card body ── */}
                                        <div style={{ padding: "20px 22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                                    {product.category}
                                                </span>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 14, color: isOwned ? "#10b981" : (canAfford ? product.accent : "#94a3b8") }}>
                                                    {isOwned ? <CheckCircle2 size={13} color="#10b981" /> : <Zap size={13} fill={canAfford ? product.accent : "#cbd5e1"} color={canAfford ? product.accent : "#94a3b8"} />}
                                                    {isOwned ? "Canjeado" : product.price.toLocaleString()}
                                                    {!isOwned && <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em" }}>BZ</span>}
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8, lineHeight: 1.3 }}>
                                                {product.name}
                                            </h3>

                                            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.6, flex: 1 }}>
                                                {product.description}
                                            </p>

                                            <button
                                                className={`canjear-btn ${isOwned ? "locked" : (canAfford ? "can-afford" : "locked")}`}
                                                disabled={isOwned}
                                                onClick={() => !isOwned && canAfford && setSelectedProduct(product)}
                                                style={isOwned ? { background: "#ecfdf5", color: "#10b981", cursor: "default" } : {}}
                                            >
                                                {isOwned ? (
                                                    <><CheckCircle2 size={16} /> Ya canjeado</>
                                                ) : canAfford ? (
                                                    <><Gift size={16} /> Canjear ahora <ChevronRight size={15} /></>
                                                ) : (
                                                    <><Lock size={14} /> Necesitas {(product.price - bizcoins).toLocaleString()} más</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                ) : activeTab === "inventario" ? (
                    /* ── INVENTARIO TAB ── */
                    ownedProducts.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 24px", background: "white", borderRadius: 28, border: "2px dashed #e2e8f0" }}>
                            <div style={{ marginBottom: 20, color: "#cbd5e1" }}><ShoppingBag size={64} style={{ margin: "0 auto" }} /></div>
                            <h3 style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>Aún no tienes compras</h3>
                            <p style={{ fontSize: 14, color: "#64748b", maxWidth: 320, margin: "0 auto 24px" }}>
                                Recorre el catálogo y canjea tus BIZCOINS por marcos exclusivos y herramientas para tu estudio.
                            </p>
                            <button
                                onClick={() => setActiveTab("catalogo")}
                                style={{ padding: "12px 24px", background: "#0F62FE", color: "white", border: "none", borderRadius: 12, fontWeight: 500, cursor: "pointer" }}
                            >
                                Explorar catálogo
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 24 }}>
                            {ownedProducts.map((product, idx) => (
                                <div key={product.id} className="tienda-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div style={{ height: 140, background: product.bg, display: "flex", alignItems: "center", justifyContent: "center", color: product.accent, position: "relative" }}>
                                        {product.icon}
                                        <div style={{ position: "absolute", top: 12, right: 12, background: "#10b981", color: "white", fontSize: 10, fontWeight: 500, padding: "4px 10px", borderRadius: 999 }}>
                                            ARTÍCULO ADQUIRIDO
                                        </div>
                                    </div>
                                    <div style={{ padding: 20 }}>
                                        <div style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>{product.category}</div>
                                        <h3 style={{ fontSize: 16, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>{product.name}</h3>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontSize: 13, fontWeight: 500 }}>
                                            <CheckCircle2 size={16} />
                                            Disponible en tu perfil
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* ── MIS BIZCOINS TAB CONTENT (PREMIUM DASHBOARD) ── */
                    <div style={{ animation: "tienda-fadeUp 0.6s ease both" }}>
                        {/* Stats Summary Widgets removed per user request */}


                        {/* Gift Cards Section */}
                        <div style={{ marginBottom: 60 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                                <div>
                                    <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Tarjetas de Regalo</h2>
                                    <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>Canjea tus BIZCOINS acumulados por beneficios reales en tiendas populares.</p>
                                </div>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#0F62FE12", border: "1.5px solid #0F62FE25", borderRadius: 16, padding: "12px 24px" }}>
                                    <Star size={20} fill="#0F62FE" color="#0F62FE" />
                                    <span style={{ fontSize: 18, fontWeight: 800, color: "#0F62FE" }}>{bizcoins.toLocaleString()} BIZCOINS</span>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 28 }}>
                                {GIFT_CARDS.map((card) => {
                                    const canAfford = userPoints >= card.points
                                    const isSelected = selectedGCId === card.id
                                    return (
                                        <div
                                            key={card.id}
                                            className={`gift-card-item ${isSelected ? "selected" : ""} ${!canAfford ? "locked" : ""}`}
                                            style={{ boxShadow: "0 12px 35px rgba(0,0,0,0.08)" }}
                                            onClick={() => setSelectedGCId(isSelected ? null : card.id)}
                                        >
                                            <div style={{ background: card.bg, padding: "36px 30px", position: "relative", minHeight: 150 }}>
                                                <div className="gift-card-scanline" />
                                                <div style={{ position: "absolute", top: 20, right: 20, width: 40, height: 28, background: "rgba(255,255,255,0.12)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)" }} />
                                                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 6, opacity: 0.9 }}>{card.store}</div>
                                                <div style={{ fontSize: 38, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.value}</div>
                                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 12, lineHeight: 1.4 }}>{card.description}</div>
                                            </div>
                                            <div style={{ padding: "20px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
                                                <div>
                                                    <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Costo del canje</div>
                                                    <div style={{ fontSize: 19, fontWeight: 800, color: canAfford ? "#0F62FE" : "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                                                        <Star size={16} fill={canAfford ? "#0F62FE" : "#94a3b8"} color={canAfford ? "#0F62FE" : "#94a3b8"} />
                                                        {card.points.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div style={{ width: 48, height: 48, borderRadius: 16, background: isSelected && canAfford ? "#0F62FE" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                                                    {canAfford ? (isSelected ? <CheckCircle2 size={24} color="white" /> : <ChevronRight size={24} color="#0F62FE" />) : <Lock size={20} color="#94a3b8" />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Main Redeem Button */}
                            <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
                                <button
                                    onClick={() => setRedeemModal(true)}
                                    disabled={!selectedGCId}
                                    style={{
                                        padding: "20px 56px",
                                        background: selectedGCId ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" : "#F1F5F9",
                                        color: selectedGCId ? "white" : "#94a3b8",
                                        border: "none",
                                        borderRadius: 20,
                                        fontWeight: 800,
                                        fontSize: 18,
                                        cursor: selectedGCId ? "pointer" : "not-allowed",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        boxShadow: selectedGCId ? "0 15px 40px rgba(15,98,254,0.3)" : "none",
                                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    }}
                                    onMouseEnter={e => { if (selectedGCId) e.currentTarget.style.transform = "scale(1.03) translateY(-4px)" }}
                                    onMouseLeave={e => { if (selectedGCId) e.currentTarget.style.transform = "scale(1) translateY(0)" }}
                                >
                                    <Gift size={24} />
                                    {selectedGCId ? `Canjear Beneficio ${selectedGC?.store}` : "Elige una Recompensa"}
                                </button>
                            </div>
                        </div>
                        </div>
                    )}

            </div>
        </div>
    )
}
