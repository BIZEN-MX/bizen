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
    Download,
    FileText,
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
    downloadUrl?: string
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
    {
        id: 20, name: "Historia del Dinero", category: "Ebooks", price: 400,
        description: "Descubre los orígenes del sistema financiero y cómo ha evolucionado el concepto de valor hasta la era digital.",
        badge: "Común", icon: <IcoBook2 />, accent: "#ef4444",
        bg: "linear-gradient(135deg, #450a0a 0%, #dc2626 100%)",
        downloadUrl: "/api/content/pdf/BIZEN_Historia_del_Dinero",
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

        // Auto-switch to bizcoins tab if URL hash is #bizcoins
        if (typeof window !== "undefined" && window.location.hash === "#bizcoins") {
            setActiveTab("bizcoins")
            // Smooth scroll after a tick so the section renders first
            setTimeout(() => {
                document.getElementById("tienda-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }, 300)
        }

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
        <div className="min-h-screen bg-slate-50 pt-3 pb-28 px-4 md:py-10 md:px-8 lg:py-6 lg:px-16 w-full max-w-[1400px] mx-auto relative z-10">
            {/* ── PURCHASE MODAL ── */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-[fadeIn_0.25s_ease]"
                    onClick={(e) => { if (e.target === e.currentTarget) { setSelectedProduct(null); setPurchaseSuccess(false) } }}
                >
                    <div className="bg-white rounded-[2rem] w-full max-w-[440px] p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.25)] relative animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                        {purchaseSuccess ? (
                            /* SUCCESS STATE */
                            <div className="text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 animate-[bounce_1s_ease_infinite]">
                                    <PartyPopper size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">¡Canje exitoso!</h2>
                                <p className="text-[15px] text-slate-500 mb-8 leading-relaxed">
                                    <strong className="text-slate-700 font-bold">{selectedProduct.name}</strong> ya está en tu perfil.
                                </p>
                                <button
                                    onClick={() => { setSelectedProduct(null); setPurchaseSuccess(false) }}
                                    className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-[15px] hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-flex items-center gap-2 active:scale-95"
                                >
                                    ¡Genial! <CheckCircle2 size={18} />
                                </button>
                            </div>
                        ) : (
                            /* CONFIRM STATE */
                            <>
                                {/* Close */}
                                <button
                                    onClick={() => { setSelectedProduct(null); setPurchaseSuccess(false) }}
                                    className="absolute -top-3 -right-3 md:top-4 md:right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors shadow-sm"
                                >
                                    <X size={18} />
                                </button>

                                {/* Product preview inside modal */}
                                <div className="flex gap-4 items-center mb-6">
                                    <div
                                        className="w-[72px] h-[72px] rounded-[1.25rem] flex items-center justify-center shrink-0 border border-white/20 shadow-lg"
                                        style={{ background: selectedProduct.bg, color: selectedProduct.accent, boxShadow: `0 8px 24px ${selectedProduct.accent}30` }}
                                    >
                                        {selectedProduct.icon}
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-slate-900 mb-1 leading-tight">{selectedProduct.name}</div>
                                        <div className="text-[13px] text-slate-500 font-bold mb-1.5 tracking-wide uppercase">{selectedProduct.category}</div>
                                        <div className="flex items-center gap-1.5 font-black text-lg" style={{ color: selectedProduct.accent }}>
                                            <Zap size={16} className="fill-current" />
                                            {selectedProduct.price.toLocaleString()} BIZCOINS
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100/50">
                                    <p className="text-[14px] text-slate-600 leading-relaxed font-medium m-0">{selectedProduct.description}</p>
                                </div>

                                {/* Balance check */}
                                {bizcoins < selectedProduct.price ? (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-6 flex gap-2.5 items-center text-red-600 text-[13px] font-bold">
                                        <Lock size={16} />
                                        Te faltan {(selectedProduct.price - bizcoins).toLocaleString()} BIZCOINS para este canje.
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6 flex gap-2.5 items-center text-emerald-600 text-[13px] font-bold">
                                        <CheckCircle2 size={16} />
                                        Saldo disponible: {bizcoins.toLocaleString()} BIZCOINS
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-6 text-red-600 text-[13px] font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setSelectedProduct(null); setPurchaseSuccess(false); setError(null) }}
                                        disabled={purchasing}
                                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-slate-600 text-[14px] transition-colors disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={bizcoins < selectedProduct.price || purchasing}
                                        onClick={handleConfirmPurchase}
                                        className={`flex-[2] py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                                            bizcoins >= selectedProduct.price && !purchasing
                                                ? "bg-slate-900 text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/20 active:scale-95"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
                                    >
                                        {purchasing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
                <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-[fadeIn_0.25s_ease]" onClick={e => { if (e.target === e.currentTarget) setRedeemModal(false) }}>
                    <div className="bg-white w-full max-w-[520px] rounded-[2rem] p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.25)] relative animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                        <button onClick={() => setRedeemModal(false)} className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors">
                            <X size={20} />
                        </button>
                        
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 flex items-center justify-center mx-auto mb-5 text-blue-600 animate-[bounce_2s_infinite]">
                                <Gift size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">¿Canjear tarjeta?</h2>
                            <p className="text-[15px] font-medium text-slate-500 m-0">Descontaremos <strong className="text-slate-700">{selectedGC.points.toLocaleString()} BIZCOINS</strong> de tu saldo actual.</p>
                        </div>

                        <div className="rounded-[1.5rem] p-8 mb-8 text-white flex justify-between items-center shadow-[0_15px_35px_rgba(0,0,0,0.15)] relative overflow-hidden" style={{ background: selectedGC.bg }}>
                            <div className="absolute inset-x-0 h-[40%] bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full animate-[scanline_3s_ease-in-out_infinite]" />
                            <div className="relative z-10">
                                <div className="text-lg font-bold opacity-90 mb-1">{selectedGC.store}</div>
                                <div className="text-3xl font-black tracking-tight" style={{ color: selectedGC.color }}>{selectedGC.value}</div>
                            </div>
                            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl py-3 px-4 text-right relative z-10">
                                <div className="text-[11px] font-black uppercase opacity-80 mb-1 tracking-wider">Costo</div>
                                <div className="text-xl font-black">{selectedGC.points.toLocaleString()}</div>
                            </div>
                        </div>

                        {userPoints < selectedGC.points && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3 items-center text-red-600">
                                <Lock size={20} className="shrink-0" />
                                <span className="text-[14px] font-bold">No tienes suficientes BIZCOINS para este canje.</span>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button onClick={() => setRedeemModal(false)} disabled={loadingRedeem} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-[1.25rem] font-bold text-slate-600 text-[15px] transition-colors disabled:opacity-50">Cancelar</button>
                            <button
                                disabled={userPoints < selectedGC.points || loadingRedeem || redeemSuccess}
                                onClick={handleRedeemGC}
                                className={`flex-[2] py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center gap-2 transition-all ${
                                    userPoints >= selectedGC.points && !loadingRedeem && !redeemSuccess
                                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
                                        : redeemSuccess 
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                {loadingRedeem ? (
                                    <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Procesando...</>
                                ) : redeemSuccess ? (
                                    <><CheckCircle2 size={20} /> ¡Canje Exitoso!</>
                                ) : (
                                    "Confirmar Canje"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PAGE CONTENT ── */}
            <div className="relative w-full z-10 tienda-inner-wrap">
                {/* ── HERO HEADER ── */}
                <div className="relative overflow-hidden mb-8 md:mb-10 rounded-[1.75rem] md:rounded-[2.5rem] p-6 md:p-12 lg:p-16 bg-gradient-to-br from-[#0b1e5e] via-[#1e3a8a] to-[#0F62FE] shadow-[0_24px_70px_rgba(15,98,254,0.3)] animate-[slideUp_0.7s_cubic-bezier(0.2,0.8,0.2,1)_both]">
                    {/* Artistic backgrounds */}
                    <div className="absolute -top-[50%] -right-[10%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)" }} />
                    <div className="absolute -bottom-[30%] -left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
                    <div className="absolute top-[20%] left-[40%] w-[200px] h-[200px] bg-white/5 blur-[40px] rounded-full" />

                    <div className="relative z-10 flex flex-col xl:flex-row items-center xl:justify-between flex-wrap gap-8 xl:gap-12">
                        <div className="flex-1 w-full text-center xl:text-left min-w-[50%]">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-5">
                                <ShoppingBag size={14} className="text-blue-400" />
                                <span className="text-[11px] md:text-xs font-bold text-blue-300 uppercase tracking-wider">Marketplace Premium</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                                Personaliza tu <span className="text-blue-400">Experiencia</span>
                            </h1>
                            <p className="text-sm md:text-lg text-blue-200 font-medium max-w-xl mx-auto xl:mx-0 leading-relaxed">
                                Invierte tus BIZCOINS en artículos exclusivos, herramientas y contenido premium para potenciar tu crecimiento.
                            </p>
                        </div>

                        {/* Balance display -> Virtual Card */}
                        <div className="shrink-0 w-full max-w-[420px] animate-[slideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_both]">
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
                    className="relative overflow-hidden mb-8 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 bg-gradient-to-br from-[#18002e] via-[#3b0764] to-[#1e3a8a] border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_24px_60px_rgba(109,40,217,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] animate-[slideUp_0.55s_ease_0.1s_both]"
                >
                    {/* Background orbs */}
                    <div className="absolute -top-[30%] -right-[5%] w-[260px] h-[260px] rounded-full pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" style={{ background:"radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)" }} />
                    <div className="absolute -bottom-[40%] left-[5%] w-[200px] h-[200px] rounded-full pointer-events-none animate-[pulse_8s_ease-in-out_infinite_2s]" style={{ background:"radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)" }} />
                    {/* Shine sweep */}
                    <div className="absolute top-0 -left-full w-[55%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-[scanline_5s_ease-in-out_infinite]" />
                    {/* Grid dots */}
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px" }} />

                    {/* Left: badge + copy */}
                    <div className="relative z-10 flex flex-col gap-2.5">
                        {/* Pill badge */}
                        <div className="inline-flex items-center gap-2 w-fit">
                            <div className="inline-flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/40 rounded-full px-3 py-1 animate-[pulse_2.5s_ease_infinite]">
                                <Flame size={13} className="text-amber-400 fill-amber-400" />
                                <span className="text-[11px] font-black text-amber-400 tracking-wider uppercase">Oferta Global Activa</span>
                            </div>
                            {/* 2x pill */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-red-500 rounded-full px-2.5 py-[3px] shadow-[0_4px_12px_rgba(239,68,68,0.5)]">
                                <div className="absolute top-0 -left-[60%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[scanline_2s_ease-in-out_infinite]" />
                                <span className="text-[12px] font-black text-white tracking-wide">×2</span>
                            </div>
                        </div>
                        {/* Headline */}
                        <div>
                            <div className="text-[clamp(20px,3vw,26px)] font-black text-white leading-tight tracking-tight mb-1">
                                Doble XP y BIZCOINS
                            </div>
                            <div className="text-[clamp(13px,1.5vw,15px)] text-purple-200/90 font-medium font-sans">
                                En cada lección completada — automáticamente para todos
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── NAVIGATION TABS ── */}
                <div 
                    id="tienda-tabs"
                    className="flex flex-nowrap overflow-x-auto gap-2 md:gap-4 mb-8 border-b-2 border-slate-200 animate-[fadeIn_0.5s_ease_0.12s_both] relative overflow-y-hidden pb-0.5 custom-scrollbar-hide"
                >
                    {[
                        { id: "catalogo", label: "Catálogo", icon: <ShoppingBag size={18} /> },
                        { id: "inventario", label: "Mis Compras", icon: <ShoppingBag size={18} /> },
                        { id: "bizcoins", label: "Mis BIZCOINS", icon: <Star size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2.5 px-7 py-3.5 bg-transparent font-medium text-[15px] cursor-pointer transition-all -mb-0.5 relative whitespace-nowrap border-b-[3px] ${
                                activeTab === tab.id 
                                    ? "border-blue-600 text-blue-600" 
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-t-xl"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.id === "inventario" && ownedProducts.length > 0 && (
                                <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold text-white ${
                                    activeTab === "inventario" ? "bg-blue-600" : "bg-slate-400"
                                }`}>
                                    {ownedProducts.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── SEARCH + CATEGORIES (Only for Catalogue) ── */}
                {activeTab === "catalogo" && (
                    <>
                        <div className="flex items-center gap-4 flex-wrap mb-8 animate-[slideUp_0.55s_ease_0.15s_both]">
                            <div className="relative flex-[1_1_220px] min-w-[180px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    placeholder="Buscar recompensas..."
                                    className={`w-full py-3.5 pr-4 pl-11 rounded-2xl border-2 text-[15px] font-medium text-slate-900 bg-white transition-all outline-none box-border ${
                                        searchFocused 
                                            ? "border-blue-600 shadow-[0_8px_24px_rgba(15,98,254,0.15)]" 
                                            : "border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                                    }`}
                                />
                            </div>

                            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide shrink-0">
                                {(["Todo", ...CATEGORIES] as const).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat as Category | "Todo")}
                                        className={`px-5 py-2.5 rounded-full font-bold text-[14px] whitespace-nowrap transition-all shrink-0 ${
                                            activeCategory === cat
                                                ? "bg-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.25)] hover:bg-slate-800"
                                                : "bg-white text-slate-500 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="text-[14px] text-slate-500 font-medium mb-6 animate-[fadeIn_0.5s_ease_0.2s_both]">
                            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                        </div>
                    </>
                )}

                {/* ── PRODUCT GRID (CATALOGO OR INVENTORY) ── */}
                {activeTab === "catalogo" ? (
                    filtered.length === 0 ? (
                        <div className="text-center py-24 px-6 text-slate-400 flex flex-col items-center gap-5">
                            <Search size={56} strokeWidth={1} className="opacity-40" />
                            <div className="text-[16px] font-medium text-slate-500">No encontramos productos que coincidan.</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map((product, idx) => {
                                const canAfford = bizcoins >= product.price
                                const isOwned = inventory.includes(String(product.id))
                                return (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_-12px_rgba(15,98,254,0.15)] hover:border-blue-200 animate-[fadeIn_0.6s_ease_both] flex flex-col relative group"
                                        style={{
                                            animationDelay: `${Math.min(idx * 0.06, 0.4)}s`,
                                            boxShadow: product.badge && RARITY_STYLES[product.badge]
                                                ? `0 4px 20px ${RARITY_STYLES[product.badge].glow}, 0 1px 3px rgba(0,0,0,0.05)`
                                                : undefined,
                                        }}
                                    >
                                        {/* ── Card hero ── */}
                                        <div className="relative h-[210px] flex items-center justify-center overflow-hidden" style={{ background: product.bg }}>
                                            {/* Dot-grid pattern overlay */}
                                            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                                            {/* Top-left diagonal lines */}
                                            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 18px)` }} />
                                            {/* Bottom ambient glow */}
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[160px] h-[80px] rounded-full blur-[20px] pointer-events-none" style={{ background: `radial-gradient(circle, ${product.accent}80 0%, transparent 70%)` }} />
                                            {/* Top right soft light */}
                                            <div className="absolute -top-10 -right-10 w-[120px] h-[120px] rounded-full blur-[30px] pointer-events-none opacity-40" style={{ background: `radial-gradient(circle, ${product.accent}90 0%, transparent 80%)` }} />
                                            {/* Shine sweep for Legendario */}
                                            {product.badge === "Legendario" && (
                                                <div className="absolute top-0 -left-full w-[60%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[scanline_3s_ease-in-out_infinite] pointer-events-none" />
                                            )}
                                            {/* Category label top-left */}
                                            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                                                {product.category}
                                            </div>
                                            {/* Icon */}
                                            <div className="relative z-10 drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)] scale-110 animate-[float_3.5s_ease-in-out_infinite]" style={{ animationDelay: `${idx * 0.3}s` }}>
                                                {product.icon}
                                            </div>

                                            {/* Rarity / Owned badge */}
                                            {isOwned ? (
                                                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-sm text-emerald-400 text-[10px] font-black px-2.5 py-1.5 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.3)] tracking-wider">
                                                    <CheckCircle2 size={12} /> ADQUIRIDO
                                                </div>
                                            ) : product.badge && RARITY_STYLES[product.badge] ? (
                                                <div 
                                                    className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider uppercase"
                                                    style={{ 
                                                        border: `1px solid ${RARITY_STYLES[product.badge].glow.replace("rgba","rgba").replace(/,[\d.]+\)$/, ",0.6)")}`,
                                                        boxShadow: `0 4px 14px ${RARITY_STYLES[product.badge].glow}`
                                                    }}
                                                >
                                                    {product.badge === "Legendario" && <Trophy size={11} />}
                                                    {product.badge === "Épico" && <Star size={11} fill="currentColor" />}
                                                    {product.badge === "Raro" && <Sparkles size={11} />}
                                                    {product.badge === "Común" && <Shield size={11} />}
                                                    {product.badge}
                                                </div>
                                            ) : null}

                                            {/* Global 2x offer indicator */}
                                            {!isOwned && (
                                                <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-br from-amber-500/90 to-red-500/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-xl shadow-[0_3px_10px_rgba(239,68,68,0.4)] tracking-wide">
                                                    <Zap size={11} className="fill-white" /> ×2 XP
                                                </div>
                                            )}

                                            {/* Insufficient funds lock */}
                                            {!canAfford && !isOwned && (
                                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-end justify-start p-3">
                                                    <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
                                                        <Lock size={11} /> Saldo insuficiente
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Card body ── */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                    {product.category}
                                                </span>
                                                <div className={`flex items-center gap-1 font-black text-[15px] ${isOwned ? "text-emerald-500" : (canAfford ? "" : "text-slate-400")}`} style={!isOwned && canAfford ? { color: product.accent } : {}}>
                                                    {isOwned ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Zap size={14} className={canAfford ? "fill-current" : "fill-slate-300 text-slate-400"} />}
                                                    {isOwned ? "Canjeado" : product.price.toLocaleString()}
                                                    {!isOwned && <span className="text-[10px] font-bold tracking-wider">BZ</span>}
                                                </div>
                                            </div>

                                            <h3 className="text-[17px] font-bold text-slate-900 mb-2.5 leading-tight">
                                                {product.name}
                                            </h3>

                                            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed flex-1">
                                                {product.description}
                                            </p>

                                            <button
                                                disabled={isOwned}
                                                onClick={() => !isOwned && canAfford && setSelectedProduct(product)}
                                                className={`w-full py-3.5 rounded-[0.85rem] font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                                                    isOwned
                                                        ? "bg-emerald-50 text-emerald-600 cursor-default"
                                                        : canAfford
                                                            ? "bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-[0_6px_20px_rgba(15,98,254,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.4)] active:scale-95 group-hover:animate-[pulse_2.5s_ease_infinite]"
                                                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                                style={isOwned && product.category === "Ebooks" && product.downloadUrl ? { marginBottom: 12 } : {}}
                                            >
                                                {isOwned ? (
                                                    <><CheckCircle2 size={18} /> Ya canjeado</>
                                                ) : canAfford ? (
                                                    <><Gift size={18} /> Canjear ahora <ChevronRight size={16} /></>
                                                ) : (
                                                    <><Lock size={16} /> Faltan {(product.price - bizcoins).toLocaleString()} BZ</>
                                                )}
                                            </button>
                                            
                                            {isOwned && product.category === "Ebooks" && product.downloadUrl && (
                                                <a 
                                                    href={product.downloadUrl} 
                                                    download 
                                                    className="w-full py-3.5 rounded-[0.85rem] bg-gradient-to-br from-slate-900 to-blue-900 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,98,254,0.2)] hover:-translate-y-1 transition-transform"
                                                >
                                                    <Download size={18} /> Descargar PDF
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                ) : activeTab === "inventario" ? (
                    /* ── INVENTARIO TAB ── */
                    ownedProducts.length === 0 ? (
                        <div className="text-center py-24 px-6 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                            <div className="mb-6 text-slate-300"><ShoppingBag size={72} strokeWidth={1} className="mx-auto" /></div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Aún no tienes compras</h3>
                            <p className="text-[15px] text-slate-500 max-w-[340px] mx-auto mb-8 leading-relaxed">
                                Recorre el catálogo y canjea tus BIZCOINS por marcos exclusivos y herramientas para tu estudio.
                            </p>
                            <button
                                onClick={() => setActiveTab("catalogo")}
                                className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-[15px] hover:bg-blue-700 transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                            >
                                Explorar catálogo
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {ownedProducts.map((product, idx) => (
                                <div key={product.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden animate-[fadeIn_0.5s_ease_both]" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div className="h-[150px] flex items-center justify-center relative" style={{ background: product.bg, color: product.accent }}>
                                        <div className="scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]">{product.icon}</div>
                                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black tracking-wider px-2.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
                                            ARTÍCULO ADQUIRIDO
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{product.category}</div>
                                        <h3 className="text-[17px] font-bold text-slate-900 mb-3 leading-tight">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-emerald-500 text-[14px] font-bold mb-4">
                                            <CheckCircle2 size={16} />
                                            Disponible en tu perfil
                                        </div>
                                        {product.category === "Ebooks" && product.downloadUrl && (
                                            <a 
                                                href={product.downloadUrl} 
                                                download 
                                                className="w-full py-3 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(15,98,254,0.2)] hover:-translate-y-1 transition-transform"
                                            >
                                                <Download size={16} /> Descargar PDF
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* ── MIS BIZCOINS TAB CONTENT (PREMIUM DASHBOARD) ── */
                    <div className="animate-[fadeIn_0.6s_ease_both]">
                        {/* Stats Summary Widgets removed per user request */}

                        {/* Gift Cards Section */}
                        <div className="mb-16">
                            <div className="flex items-center justify-between mb-8 flex-wrap gap-5">
                                <div>
                                    <h2 className="text-[clamp(24px,4vw,32px)] font-black text-slate-900 mb-2 tracking-tight leading-none">Tarjetas de Regalo</h2>
                                    <p className="text-[16px] text-slate-500 m-0 leading-relaxed font-medium">Canjea tus BIZCOINS acumulados por beneficios reales en tiendas populares.</p>
                                </div>
                                <div className="inline-flex items-center gap-2.5 bg-blue-50/50 border-[1.5px] border-blue-200/50 rounded-2xl px-5 py-3 shadow-sm backdrop-blur-sm">
                                    <Star size={22} className="fill-blue-600 text-blue-600" />
                                    <span className="text-[20px] font-black text-blue-600 tracking-tight">{bizcoins.toLocaleString()} <span className="text-[14px]">BIZCOINS</span></span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                                {GIFT_CARDS.map((card, idx) => {
                                    const canAfford = userPoints >= card.points
                                    const isSelected = selectedGCId === card.id
                                    return (
                                        <div
                                            key={card.id}
                                            className={`rounded-[1.75rem] overflow-hidden transition-all duration-300 relative group bg-white border-2 cursor-pointer ${
                                                !canAfford ? "grayscale-[0.5] opacity-80" : "hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
                                            } ${isSelected ? "border-blue-600 ring-4 ring-blue-600/20 shadow-[0_25px_50px_rgba(0,0,0,0.15)]" : "border-slate-100 shadow-[0_12px_35px_rgba(0,0,0,0.04)]"}`}
                                            onClick={() => setSelectedGCId(isSelected ? null : card.id)}
                                            style={{ animation: `fadeIn 0.5s ease both ${idx * 0.05}s` }}
                                        >
                                            <div className="p-8 pb-10 relative object-cover min-h-[160px] flex flex-col justify-end" style={{ background: card.bg }}>
                                                <div className="absolute top-0 -left-full w-[60%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[scanline_3s_ease-in-out_infinite] pointer-events-none" />
                                                <div className="absolute top-5 right-5 w-10 h-7 bg-white/15 rounded-md border border-white/20 backdrop-blur-sm shadow-sm" />
                                                
                                                <div className="text-[22px] font-bold text-white mb-1.5 opacity-90 leading-none">{card.store}</div>
                                                <div className="text-[40px] font-black leading-none drop-shadow-md" style={{ color: card.color }}>{card.value}</div>
                                            </div>
                                            
                                            <div className="p-6 flex items-center justify-between bg-white relative">
                                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                                                <div>
                                                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Costo del canje</div>
                                                    <div className={`text-[20px] font-black flex items-center gap-1.5 ${canAfford ? "text-blue-600" : "text-slate-400"}`}>
                                                        <Star size={18} className={canAfford ? "fill-blue-600" : "fill-slate-300"} />
                                                        {card.points.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                                    isSelected && canAfford ? "bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.4)]" : "bg-slate-100 group-hover:bg-blue-50"
                                                }`}>
                                                    {canAfford ? (
                                                        isSelected ? <CheckCircle2 size={24} className="text-white" /> : <ChevronRight size={24} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                                                    ) : (
                                                        <Lock size={20} className="text-slate-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Main Redeem Button */}
                            <div className="flex justify-center mt-12 mb-8">
                                <button
                                    onClick={() => setRedeemModal(true)}
                                    disabled={!selectedGCId}
                                    className={`px-10 py-5 rounded-[1.25rem] font-black text-[17px] flex items-center gap-3 transition-all duration-300 ${
                                        selectedGCId 
                                            ? "bg-gradient-to-br from-slate-900 to-blue-900 text-white shadow-[0_15px_40px_rgba(15,98,254,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.4)] active:scale-95" 
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                                >
                                    <Gift size={24} className={selectedGCId ? "animate-[bounce_2s_ease_infinite]" : ""} />
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
