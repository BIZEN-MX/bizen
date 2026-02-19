"use client"

import { useState } from "react"
import {
    ShoppingBag,
    Search,
    Filter,
    Tag as TagIcon,
    Zap,
    Layout,
    Star,
    Info,
    Clock,
    ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const PRODUCTS = [
    {
        id: 1,
        name: "Master en Presupuestos",
        category: "Cursos",
        price: 500,
        image: "/courses/placeholder.png",
        description: "Domina tus finanzas con plantillas exclusivas.",
        badge: "Nuevo"
    },
    {
        id: 2,
        name: "Insignia de Embajador",
        category: "Avatar",
        price: 200,
        image: "/avatar/placeholder.png",
        description: "Muestra tu estatus en el foro comunitario.",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Guía de Inversión 2024",
        category: "Ebooks",
        price: 350,
        image: "/ebooks/placeholder.png",
        description: "Todo lo que necesitas para empezar a invertir.",
        badge: null
    }
]

export default function TiendaPage() {
    const [activeCategory, setActiveCategory] = useState("Todos")

    return (
        <div className="tienda-outer" style={{
            minHeight: "100vh",
            background: "#ffffff",
            fontFamily: "'Montserrat', sans-serif",
            width: "100%",
            boxSizing: "border-box"
        }}>
            <style>{`
                /* Mobile - account for footer */
                @media (max-width: 767px) {
                    .tienda-outer {
                        padding-bottom: 65px !important;
                    }
                    .tienda-inner {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin-right: 0 !important;
                    }
                }
                /* Tablet/iPad (768px-1160px) - account for left sidebar (220px) */
                @media (min-width: 768px) and (max-width: 1160px) {
                    .tienda-inner {
                        width: calc(100% - 220px) !important;
                        max-width: calc(100% - 220px) !important;
                        margin-left: 220px !important;
                        margin-right: 0 !important;
                    }
                }
                /* Desktop (1161px+) - account for left sidebar (280px) */
                @media (min-width: 1161px) {
                    .tienda-inner {
                        width: calc(100% - 280px) !important;
                        max-width: calc(100% - 280px) !important;
                        margin-left: 280px !important;
                        margin-right: 0 !important;
                    }
                }
            `}</style>

            <div className="tienda-inner" style={{
                position: "relative",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "clamp(20px, 5vw, 40px)",
                boxSizing: "border-box"
            }}>
                {/* Header with Search */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "24px",
                    marginBottom: "40px"
                }}>
                    <div>
                        <h1 style={{
                            fontSize: "clamp(28px, 5vw, 40px)",
                            fontWeight: 800,
                            color: "#1e3a5f",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}>
                            <ShoppingBag size={40} />
                            Tienda Bizen
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "16px", fontWeight: 500 }}>
                            Canjea tus puntos por recompensas exclusivas
                        </p>
                    </div>

                    <div style={{
                        position: "relative",
                        minWidth: "300px"
                    }}>
                        <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
                        <input
                            type="text"
                            placeholder="Buscar recompensas..."
                            style={{
                                width: "100%",
                                padding: "14px 16px 14px 48px",
                                borderRadius: "12px",
                                border: "2px solid #e2e8f0",
                                fontSize: "15px",
                                outline: "none",
                                transition: "border-color 0.2s"
                            }}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "40px",
                    overflowX: "auto",
                    paddingBottom: "8px"
                }}>
                    {["Todos", "Cursos", "Avatar", "Ebooks", "Consultoría"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: "10px 24px",
                                borderRadius: "999px",
                                border: "none",
                                background: activeCategory === cat ? "#0B71FE" : "#f1f5f9",
                                color: activeCategory === cat ? "white" : "#64748b",
                                fontWeight: 700,
                                fontSize: "14px",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s"
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Banner */}
                <div style={{
                    background: "linear-gradient(135deg, #1e3a5f 0%, #0B71FE 100%)",
                    borderRadius: "24px",
                    padding: "40px",
                    color: "white",
                    marginBottom: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "32px",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{ position: "relative", zIndex: 1, maxWidth: "500px" }}>
                        <Badge style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "16px" }}>OFERTA LIMITADA</Badge>
                        <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px" }}>¡Doble XP en la Tienda!</h2>
                        <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "24px" }}>
                            Esta semana obtén el doble de beneficios por cada punto canjeado. ¡No dejes pasar la oportunidad!
                        </p>
                        <button style={{
                            background: "white",
                            color: "#0B71FE",
                            border: "none",
                            padding: "12px 32px",
                            borderRadius: "12px",
                            fontWeight: 800,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            Explorar Ahora <ArrowRight size={20} />
                        </button>
                    </div>
                    <div style={{ position: "relative", zIndex: 1, fontSize: "100px", opacity: 0.2 }}>
                        <Zap size={140} fill="white" />
                    </div>
                </div>

                {/* Product Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "32px"
                }}>
                    {PRODUCTS.map((product) => (
                        <Card key={product.id} style={{
                            border: "none",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                            overflow: "hidden",
                            transition: "transform 0.2s"
                        }}>
                            <div style={{ position: "relative", height: "200px", background: "#f8fafc" }}>
                                <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: "40px" }}>
                                    {product.category === "Cursos" && "🎓"}
                                    {product.category === "Avatar" && "👤"}
                                    {product.category === "Ebooks" && "📚"}
                                </div>
                                {product.badge && (
                                    <Badge style={{ position: "absolute", top: "16px", right: "16px", background: product.badge === "Nuevo" ? "#10B981" : "#F59E0B" }}>
                                        {product.badge}
                                    </Badge>
                                )}
                            </div>
                            <CardContent style={{ padding: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{product.category}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontWeight: 800 }}>
                                        <span>{product.price}</span>
                                        <Star fill="#F59E0B" size={14} />
                                    </div>
                                </div>
                                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e3a5f", marginBottom: "12px" }}>{product.name}</h3>
                                <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.5" }}>{product.description}</p>
                                <button style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    border: "2px solid #0B71FE",
                                    background: "transparent",
                                    color: "#0B71FE",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.2s"
                                }}>
                                    Canjear Ahora
                                </button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
