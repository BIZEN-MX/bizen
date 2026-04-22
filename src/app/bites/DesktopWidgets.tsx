"use client"

import React from "react"
import { 
  Trophy, 
  Zap, 
  Coins, 
  Flame, 
  LayoutGrid, 
  ChevronRight,
  Target,
  Bot,
  TrendingUp
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface DesktopWidgetsProps {
  bizcoins: number
  streak: number
  activeIndex: number
  totalBites: number
  onCategoryClick: (category: string) => void
  onBillyClick?: () => void
  isAnahuac?: boolean
}

export const LeftStatsWidget: React.FC<DesktopWidgetsProps> = ({ bizcoins, streak, activeIndex, totalBites, onBillyClick, isAnahuac }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex flex-col gap-6 w-56"
    >
      {/* Academy Card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: 24,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: isAnahuac ? "rgba(255, 89, 0, 0.1)" : "rgba(11, 113, 254, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LayoutGrid size={20} color={isAnahuac ? "#FF5900" : "#0B71FE"} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: "#fff", fontSize: 16, fontWeight: 700 }}>Mi Academia</h4>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Progreso de hoy</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Coins size={18} color="#fbbf24" />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Bizcoins</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 700 }}>{bizcoins.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Flame size={18} color="#f59e0b" />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Racha</span>
            </div>
            <span style={{ color: "#fff", fontWeight: 700 }}>{streak} días</span>
          </div>

        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBillyClick}
        style={{
          background: isAnahuac ? "linear-gradient(135deg, #FF5900 0%, #CC4700 100%)" : "linear-gradient(135deg, #0B71FE 0%, #0448A4 100%)",
          borderRadius: 24,
          padding: "24px",
          border: "none",
          color: "#fff",
          textAlign: "left",
          cursor: "pointer",
          boxShadow: isAnahuac ? "0 15px 35px rgba(255, 89, 0, 0.2)" : "0 15px 35px rgba(11, 113, 254, 0.2)",
          display: "block",
          width: "100%",
          marginTop: 20
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <Bot size={20} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Asistente IA</span>
        </div>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, lineHeight: 1.3 }}>
           ¿Cómo me afecta esto?
        </h4>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
           Pregúntale a Billy sobre este contenido
        </p>
      </motion.button>
    </motion.div>
  )
}

export const RightNavigationWidget: React.FC<DesktopWidgetsProps> = ({ onCategoryClick, isAnahuac }) => {
  const categories = [
    { name: "Inversión", icon: TrendingUp, color: "#10b981" },
    { name: "Ahorro", icon: Target, color: "#3b82f6" },
    { name: "Presupuesto", icon: Zap, color: "#f59e0b" },
    { name: "Crédito", icon: Trophy, color: "#8b5cf6" },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex flex-col gap-6 w-56"
    >
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: 24,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}>
        <h4 style={{ margin: "0 0 20px", color: "#fff", fontSize: 16, fontWeight: 700 }}>Explorar Temas</h4>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {categories.map((cat) => (
            <motion.button
              key={cat.name}
              whileHover={{ x: 5, background: "rgba(255,255,255,0.06)" }}
              onClick={() => onCategoryClick(cat.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                cursor: "pointer",
                width: "100%",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${cat.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <cat.icon size={16} color={cat.color} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
              </div>
              <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
            </motion.button>
          ))}
        </div>

        <div style={{ 
          marginTop: 24, 
          padding: 16, 
          borderRadius: 16, 
          background: isAnahuac ? "linear-gradient(135deg, #FF590022 0%, #FF590008 100%)" : "linear-gradient(135deg, #0B71FE22 0%, #0B71FE08 100%)",
          border: isAnahuac ? "1px solid #FF590033" : "1px solid #0B71FE33"
        }}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
            <span style={{ color: "#fff", fontWeight: 600 }}>Tip BIZEN:</span> Desliza hacia arriba para ver el siguiente video.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

