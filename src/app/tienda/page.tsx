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
} from "lucide-react"

// ─────────────────────────────────────────
// Catalogue
// ─────────────────────────────────────────
const CATEGORIES = ["Avatar", "Ebooks", "Accesorios"] as const
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

const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Marco de Embajador",
        category: "Avatar",
        price: 200,
        description: "Muestra tu estatus de embajador con un marco exclusivo en tu perfil del foro.",
        badge: "Popular",
        icon: <User size={40} strokeWidth={1.5} />,
        accent: "#0F62FE",
        bg: "linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",
    },
    {
        id: 2,
        name: "Marco Dorado VIP",
        category: "Avatar",
        price: 500,
        description: "El marco más exclusivo de la plataforma. Solo para los mejores.",
        badge: "Exclusivo",
        icon: <Star size={40} strokeWidth={1.5} />,
        accent: "#d97706",
        bg: "linear-gradient(135deg,#fffbeb 0%,#fde68a 100%)",
    },
    {
        id: 3,
        name: "Guía de Inversión 2025",
        category: "Ebooks",
        price: 350,
        description: "Todo lo que necesitas para empezar a invertir de forma inteligente y segura.",
        badge: null,
        icon: <BookOpen size={40} strokeWidth={1.5} />,
        accent: "#10b981",
        bg: "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)",
    },
    {
        id: 4,
        name: "Secretos del Cash Flow",
        category: "Ebooks",
        price: 450,
        description: "Aprende a leer estados de resultados y manejar el flujo de efectivo como un pro.",
        badge: "Nuevo",
        icon: <Flame size={40} strokeWidth={1.5} />,
        accent: "#ef4444",
        bg: "linear-gradient(135deg,#fff1f2 0%,#fecdd3 100%)",
    },
    {
        id: 5,
        name: "Tema Oscuro Premium",
        category: "Accesorios",
        price: 300,
        description: "Activa el modo oscuro en toda la plataforma y estudia con estilo.",
        badge: null,
        icon: <Palette size={40} strokeWidth={1.5} />,
        accent: "#7c3aed",
        bg: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)",
    },
    {
        id: 6,
        name: "Escudo Anti-Racha",
        category: "Accesorios",
        price: 150,
        description: "Protege tu racha diaria un día si no puedes completar el reto. ¡Muy práctico!",
        badge: "Oferta",
        icon: <Shield size={40} strokeWidth={1.5} />,
        accent: "#0891b2",
        bg: "linear-gradient(135deg,#ecfeff 0%,#cffafe 100%)",
    },
]

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    Popular: { bg: "#f59e0b", text: "#fff" },
    Exclusivo: { bg: "#7c3aed", text: "#fff" },
    Nuevo: { bg: "#10b981", text: "#fff" },
    Oferta: { bg: "#ef4444", text: "#fff" },
}

// ─────────────────────────────────────────
export default function TiendaPage() {
    const { user, loading, refreshUser, dbProfile } = useAuth()
    const router = useRouter()

    const [stats, setStats] = useState<any>(null)
    const [loadingStats, setLoadingStats] = useState(true)
    const [activeTab, setActiveTab] = useState<"catalogo" | "inventario">("catalogo")
    const [activeCategory, setActiveCategory] = useState<Category | "Todo">("Todo")
    const [search, setSearch] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [searchFocused, setSearchFocused] = useState(false)
    const [purchaseSuccess, setPurchaseSuccess] = useState(false)

    const [inventory, setInventory] = useState<string[]>([])
    const [purchasing, setPurchasing] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    const bizcoins = stats?.bizcoins ?? (dbProfile as any)?.bizcoins ?? 0

    const filtered = PRODUCTS.filter(p => {
        const matchCat = activeCategory === "Todo" || p.category === activeCategory
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const ownedProducts = PRODUCTS.filter(p => inventory.includes(String(p.id)))

    // No longer returning early for loading to keep navbar visible and show skeletons

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
            width: calc(100% - 220px) !important;
            max-width: calc(100% - 220px) !important;
            margin-left: 220px !important;
          }
        }
        @media (min-width: 1161px) {
          .tienda-inner {
            width: calc(100% - 280px) !important;
            max-width: calc(100% - 280px) !important;
            margin-left: 280px !important;
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
        @keyframes tienda-bounce  { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes tienda-wiggle  { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-8deg); } 75% { transform: rotate(8deg); } }

        /* ── product card ── */
        .tienda-card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 8px 32px -8px rgba(15, 98, 254, 0.08);
          overflow: hidden;
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
          animation: tienda-fadeUp 0.45s ease both;
          display: flex;
          flex-direction: column;
        }
        .tienda-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -12px rgba(15, 98, 254, 0.15);
          border-color: #bfdbfe;
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
                <div style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0F62FE 100%)",
                    borderRadius: 32,
                    padding: "clamp(32px, 5vw, 64px) clamp(28px, 5vw, 48px)",
                    marginBottom: 32,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(15,98,254,0.28)",
                    animation: "tienda-fadeUp 0.5s ease both",
                }}>
                    {/* Orbs */}
                    <div style={{ position: "absolute", top: "-25%", right: "-5%", width: 360, height: 360, background: "radial-gradient(circle,rgba(96,165,250,0.18) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-20%", left: "8%", width: 260, height: 260, background: "radial-gradient(circle,rgba(167,139,250,0.13) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.1)", borderRadius: 999, padding: "5px 14px", marginBottom: 14 }}>
                                <ShoppingBag size={13} color="#60a5fa" />
                                <span style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tienda BIZEN</span>
                            </div>
                            <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                                Canjea tus BIZCOINS
                            </h1>
                            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#93c5fd", fontWeight: 400, margin: 0, maxWidth: 480, lineHeight: 1.5 }}>
                                Recompensas exclusivas para los mejores estudiantes. ¡Tú te lo mereces!
                            </p>
                        </div>

                        {/* Balance balloon */}
                        <div style={{
                            background: "rgba(15, 23, 42, 0.4)",
                            border: "1px solid rgba(147, 197, 253, 0.3)",
                            borderRadius: 28,
                            padding: "32px 42px",
                            textAlign: "center",
                            backdropFilter: "blur(16px)",
                            boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
                            flexShrink: 0,
                        }}>
                            <div style={{ fontSize: "clamp(40px,8vw,62px)", fontWeight: 500, lineHeight: 1, background: "linear-gradient(135deg,#fff,#93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {loadingStats ? (
                                    <div style={{ width: 120, height: 50, background: "rgba(255,255,255,0.1)", borderRadius: 12, animation: "tienda-fadeUp 1.5s infinite" }} />
                                ) : (
                                    bizcoins.toLocaleString()
                                )}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4, display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                                <Zap size={12} color="#93c5fd" />
                                BIZCOINS disponibles
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FEATURED PROMO BANNER ── */}
                <div style={{
                    background: "linear-gradient(120deg, #6d28d9 0%, #4f46e5 50%, #0F62FE 100%)",
                    borderRadius: 24,
                    padding: "28px 36px",
                    marginBottom: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    flexWrap: "wrap",
                    position: "relative",
                    overflow: "hidden",
                    animation: "tienda-fadeUp 0.55s ease 0.1s both",
                }}>
                    {/* Shine sweep */}
                    <div style={{ position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)", animation: "tienda-shine 4s ease-in-out infinite", pointerEvents: "none" }} />
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "white" }}>
                        <div style={{ animation: "tienda-wiggle 2s ease infinite" }}>
                            <Gift size={28} color="#fbbf24" fill="#fbbf2430" />
                        </div>
                        <span style={{ fontWeight: 500, fontSize: "clamp(14px,2vw,17px)" }}>¡Oferta de la semana! Doble beneficios en todos los Accesorios</span>
                    </div>
                    <button
                        onClick={() => setActiveCategory("Accesorios")}
                        style={{ whiteSpace: "nowrap", padding: "10px 22px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, color: "white", fontWeight: 500, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(6px)", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.3)" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)" }}
                    >
                        Ver Accesorios <ArrowRight size={15} />
                    </button>
                </div>

                {/* ── NAVIGATION TABS ── */}
                <div style={{
                    display: "flex",
                    gap: 0,
                    marginBottom: 32,
                    borderBottom: "2px solid #e2e8f0",
                    animation: "tienda-fadeUp 0.5s ease 0.12s both"
                }}>
                    {[
                        { id: "catalogo", label: "Catálogo", icon: <ShoppingBag size={18} /> },
                        { id: "inventario", label: "Mis Compras", icon: <ShoppingBag size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
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
                                position: "relative"
                            }}
                        >
                            {tab.id === "catalogo" ? <Search size={18} /> : <ShoppingBag size={18} />}
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

                {/* ── SEARCH + CATEGORIES ── */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 32, animation: "tienda-fadeUp 0.55s ease 0.15s both" }}>
                    {/* Search */}
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

                    {/* Category pills */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── COUNT ── */}
                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginBottom: 20, animation: "tienda-fadeUp 0.5s ease 0.2s both" }}>
                    {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                </div>

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
                                        style={{ animationDelay: `${Math.min(idx * 0.06, 0.4)}s` }}
                                    >
                                        <div style={{ position: "relative", height: 160, background: product.bg, display: "flex", alignItems: "center", justifyContent: "center", color: product.accent }}>
                                            <div style={{ animation: "tienda-float 3s ease-in-out infinite", animationDelay: `${idx * 0.3}s` }}>
                                                {product.icon}
                                            </div>

                                            {isOwned ? (
                                                <div style={{ position: "absolute", top: 14, right: 14, background: "#10b981", color: "#fff", fontSize: 10, fontWeight: 500, padding: "4px 10px", borderRadius: 999 }}>
                                                    ADQUIRIDO
                                                </div>
                                            ) : (
                                                product.badge && badgeStyle && (
                                                    <div style={{
                                                        position: "absolute", top: 14, right: 14,
                                                        background: badgeStyle.bg, color: badgeStyle.text,
                                                        fontSize: 10, fontWeight: 500, padding: "4px 10px",
                                                        borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em",
                                                        boxShadow: `0 3px 10px ${badgeStyle.bg}60`,
                                                    }}>
                                                        {product.badge}
                                                    </div>
                                                )
                                            )}

                                            {!canAfford && !isOwned && (
                                                <div style={{
                                                    position: "absolute", top: 14, left: 14,
                                                    background: "rgba(0,0,0,0.55)", color: "#fff",
                                                    fontSize: 11, fontWeight: 500, padding: "4px 10px",
                                                    borderRadius: 999, display: "flex", alignItems: "center", gap: 5,
                                                    backdropFilter: "blur(4px)",
                                                }}>
                                                    <Lock size={11} />
                                                    Sin saldo
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                                <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                    {product.category}
                                                </span>
                                                <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 500, fontSize: 15, color: isOwned ? "#10b981" : (canAfford ? product.accent : "#94a3b8") }}>
                                                    {isOwned ? <CheckCircle2 size={13} color="#10b981" /> : <Zap size={13} fill={canAfford ? product.accent : "#94a3b8"} color={canAfford ? product.accent : "#94a3b8"} />}
                                                    {isOwned ? "Canjeado" : product.price.toLocaleString()}
                                                    {!isOwned && <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.05em" }}> BIZCOINS</span>}
                                                </div>
                                            </div>

                                            <h3 style={{ fontSize: 17, fontWeight: 500, color: "#0f172a", marginBottom: 8, lineHeight: 1.3 }}>
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
                ) : (
                    /* INVENTARIO TAB */
                    ownedProducts.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 24px", background: "white", borderRadius: 28, border: "2px dashed #e2e8f0" }}>
                            <div style={{ marginBottom: 20, color: "#cbd5e1" }}><ShoppingBag size={64} style={{ margin: "0 auto" }} /></div>
                            <h3 style={{ fontSize: 20, fontWeight: 500, color: "#0f172a", marginBottom: 8 }}>Aún no tienes compras</h3>
                            <p style={{ fontSize: 14, color: "#64748b", maxWidth: 320, margin: "0 auto 24px" }}>
                                Recorre el catálogo y canjea tus BIZCOINS por marcos exclusivos y herramientas para tu estudio.
                            </p>
                            <button
                                onClick={() => setActiveTab("catalogo")}
                                style={{ padding: "12px 24px", background: "#0F62FE", color: "white", border: "none", borderRadius: 12, fontWeight: 500, cursor: "pointer", }}
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
                )}

                {/* ── HOW TO EARN MORE ── */}
                <div style={{ background: "white", borderRadius: 24, padding: "clamp(24px,4vw,36px)", border: "1px solid #e8f0fe", boxShadow: "0 4px 20px rgba(15,98,254,0.04)", marginTop: 48, animation: "tienda-fadeUp 0.5s ease 0.3s both" }}>
                    <h2 style={{ fontSize: "clamp(17px,2.5vw,21px)", fontWeight: 500, color: "#0f172a", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 10 }}>
                        <Sparkles size={20} color="#0F62FE" />
                        ¿Cómo ganar más BIZCOINS?
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                        {[
                            { label: "Reto Diario", xp: "+50", color: "#0F62FE", desc: "Completa el reto del día", icon: <Zap size={22} /> },
                            { label: "Lecciones", xp: "+25", color: "#10b981", desc: "Termina una lección del curso", icon: <BookOpen size={22} /> },
                            { label: "Quizzes", xp: "+30", color: "#f59e0b", desc: "Acierta las preguntas correctas", icon: <Target size={22} /> },
                            { label: "Racha 7 días", xp: "+100", color: "#7c3aed", desc: "Mantén tu racha una semana", icon: <Flame size={22} /> },
                        ].map(item => (
                            <div key={item.label} style={{ background: "#FBFAF5", borderRadius: 14, padding: "18px 16px", border: `1px solid ${item.color}20`, borderLeft: `3px solid ${item.color}`, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10, background: `${item.color}15`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: item.color, marginBottom: 12
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 4 }}>{item.label}</div>
                                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>{item.desc}</div>
                                <div style={{ fontSize: 16, fontWeight: 500, color: item.color }}>{item.xp} BIZCOINS</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
