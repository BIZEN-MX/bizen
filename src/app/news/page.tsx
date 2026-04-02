"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Newspaper, 
  TrendingUp, 
  ChevronRight, 
  Clock, 
  Share2,
  ExternalLink,
  Search,
  Filter,
  Zap,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  const router = useRouter();

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        setNews(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categories = useMemo(() => {
    const cats = ["Todas", ...new Set(news.map(n => n.category))];
    return cats;
  }, [news]);

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todas" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px clamp(16px, 5vw, 60px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button 
              onClick={() => router.push("/dashboard")}
              style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 14, 
                background: "white", 
                border: "1.5px solid #e2e8f0", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
                transition: "all 0.2s"
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ padding: "4px 8px", background: "rgba(15, 98, 254, 0.1)", borderRadius: 6 }}>
                  <Zap size={14} color="#0F62FE" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#0F62FE", textTransform: "uppercase", letterSpacing: "0.1em" }}>Market Intelligence</span>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0B1E5E", margin: 0, letterSpacing: "-0.025em" }}>
                Noticias BIZEN
              </h1>
            </div>
          </div>
          
          <div style={{ 
            background: "white", 
            borderRadius: 16, 
            padding: "4px 16px", 
            border: "1.5px solid #e2e8f0", 
            display: "flex", 
            alignItems: "center" ,
            gap: 12,
            minWidth: 300,
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="¿Qué buscas hoy?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                flex: 1, 
                border: "none", 
                padding: "12px 0", 
                fontSize: 14, 
                fontWeight: 600, 
                outline: "none",
                color: "#0f172a"
              }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ marginBottom: 32, overflowX: "auto", display: "flex", gap: 10, paddingBottom: 10 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "10px 18px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                border: activeCategory === cat ? "1.5px solid #0F62FE" : "1.5px solid #e2e8f0",
                background: activeCategory === cat ? "#0F62FE" : "white",
                color: activeCategory === cat ? "white" : "#64748b",
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(15, 98, 254, 0.25)" : "none"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <PageLoader />
        ) : (
          <>
            {/* Featured Section */}
            {filteredNews.length > 0 && searchTerm === "" && activeCategory === "Todas" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  width: "100%",
                  height: 500,
                  borderRadius: 32,
                  overflow: "hidden",
                  marginBottom: 60,
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                onClick={() => window.open(filteredNews[0].url, "_blank")}
              >
                <img 
                  src={filteredNews[0].image} 
                  alt={filteredNews[0].title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
                <div style={{ 
                  position: "absolute", 
                  inset: 0, 
                  background: "linear-gradient(to top, rgba(11, 30, 94, 0.95), transparent)" 
                }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, padding: 60, width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <span style={{ padding: "6px 16px", background: "#0F62FE", borderRadius: 10, fontSize: 12, fontWeight: 900, color: "white", textTransform: "uppercase" }}>Destacado</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 700 }}>{filteredNews[0].source} • {filteredNews[0].time}</span>
                  </div>
                  <h2 style={{ fontSize: 42, fontWeight: 900, color: "white", marginBottom: 20, maxWidth: 900, lineHeight: 1.1 }}>
                    {filteredNews[0].title}
                  </h2>
                  <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 700, lineHeight: 1.6, marginBottom: 30 }}>
                    {filteredNews[0].fullDesc}
                  </p>
                  <div style={{ display: "flex", gap: 20 }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", background: "white", borderRadius: 14, color: "#0B1E5E", fontWeight: 800, fontSize: 15 }}>
                       Leer Historia Completa <ChevronRight size={18} />
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 30 }}>
              <AnimatePresence>
                {(searchTerm !== "" || activeCategory !== "Todas" ? filteredNews : filteredNews.slice(1)).map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08)" }}
                    style={{
                      background: "white",
                      borderRadius: 32,
                      overflow: "hidden",
                      border: "1.5px solid #eef2f8",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      position: "relative"
                    }}
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    <div style={{ width: "100%", height: 280, overflow: "hidden", position: "relative" }}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                      <div style={{ 
                        position: "absolute", 
                        bottom: 20, 
                        left: 20, 
                        background: "rgba(11, 30, 94, 0.85)", 
                        backdropFilter: "blur(12px)",
                        padding: "6px 14px", 
                        borderRadius: 10, 
                        fontSize: 10, 
                        fontWeight: 900, 
                        color: "white",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}>
                        {item.category}
                      </div>
                    </div>
                    <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 12, color: "#0F62FE", fontWeight: 800 }}>{item.source}</span>
                        <span style={{ fontSize: 10, color: "#e2e8f0" }}>•</span>
                        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>{item.time}</span>
                      </div>
                      <h3 style={{ margin: "0 0 16px", fontSize: 19, fontWeight: 850, color: "#0B1E5E", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                        {item.title}
                      </h3>
                      <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>
                        {item.fullDesc ? item.fullDesc.substring(0, 150) + "..." : item.desc}
                      </p>
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>ESCRITO POR</span>
                          <span style={{ fontSize: 13, color: "#0B1E5E", fontWeight: 800 }}>{item.author || "Redacción BIZEN"}</span>
                        </div>
                        <div style={{ 
                          width: 36, 
                          height: 36, 
                          borderRadius: 12, 
                          background: "#f8fafc", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: "#94a3b8"
                        }}>
                          <Share2 size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {!loading && filteredNews.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "100px 0" }}
          >
            <div style={{ width: 80, height: 80, background: "white", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
              <Newspaper size={32} color="#cbd5e1" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0B1E5E", marginBottom: 10 }}>No se encontraron resultados</h2>
            <p style={{ color: "#64748b", fontWeight: 500 }}>Intenta ajustar tus filtros o búsqueda para encontrar lo que necesitas.</p>
            <button 
              onClick={() => { setSearchTerm(""); setActiveCategory("Todas"); }}
              style={{ marginTop: 20, color: "#0F62FE", fontWeight: 800, background: "rgba(15, 98, 254, 0.1)", border: "none", padding: "10px 24px", borderRadius: 12, cursor: "pointer" }}
            >
              Restablecer filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
