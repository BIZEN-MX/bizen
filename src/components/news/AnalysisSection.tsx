"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  BrainCircuit, 
  Activity, 
  Target,
  ArrowRight,
  Sparkles,
  PieChart,
  BarChart3,
  Globe
} from "lucide-react";
import { Billy } from "@/components/Billy";

interface AnalysisItem {
  id: string;
  topic: string;
  impact: "High" | "Medium" | "Low";
  sentiment: "Bullish" | "Bearish" | "Neutral";
  description: string;
  correlation: string;
}

export default function AnalysisSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/news/analysis");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error("Analysis fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const topAnalyses: AnalysisItem[] = [
    {
      id: "1",
      topic: "Adopción Institucional Cripto",
      impact: "High",
      sentiment: "Bullish",
      description: "La entrada de fondos soberanos a Bitcoin valida el activo como reserva de valor global.",
      correlation: "Estimula el Simulador de Cripto y Ahorro en Bizcoins."
    },
    {
      id: "2",
      topic: "Tasas de Interés FED",
      impact: "High",
      sentiment: "Neutral",
      description: "La pausa en las tasas sugiere un aterrizaje suave, pero la inflación subyacente sigue bajo la lupa.",
      correlation: "Afecta directamente el rendimiento del Simulador de Interés Compuesto."
    },
    {
      id: "3",
      topic: "Nearshoring en México",
      impact: "Medium",
      sentiment: "Bullish",
      description: "El flujo de inversión extranjera directa en manufactura fortalece el peso y las PYMES locales.",
      correlation: "Clave para proyectos en el Simulador de Negocios y Emprendimiento."
    },
    {
      id: "4",
      topic: "Escasez de Semiconductores",
      impact: "Medium",
      sentiment: "Bearish",
      description: "La alta demanda en IA está creando cuellos de botella en la producción de hardware tradicional.",
      correlation: "Presiona a la baja los márgenes en el Simulador de Bolsa (Sector Tech)."
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid #0F62FE", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 20px" }}
        />
        <p style={{ color: "#64748b", fontWeight: 600 }}>Billy AI está analizando el pulso del mercado...</p>
      </div>
    );
  }

  return (
    <div className="analysis-container" style={{ padding: "0 0 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 30 }}>
        
        {/* Main Analysis Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* AI Intelligence Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, #0B1E5E 0%, #0F62FE 100%)",
              borderRadius: 32,
              padding: 40,
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(15, 98, 254, 0.15)"
            }}
          >
            {/* Background elements */}
            <div style={{ position: "absolute", top: -20, right: -20, width: 200, height: 200, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 150, height: 150, background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(40px)" }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ maxWidth: "70%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <BrainCircuit size={20} color="#93c5fd" />
                  <span style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "#93c5fd" }}>Inteligencia Predictiva</span>
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>{data?.label || "Análisis Global"}</h2>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.8)", marginBottom: 0 }}>
                  {data?.summary || "Analizando mercado..."}
                </p>
              </div>

              {/* Sentiment Gauge */}
              <div style={{ textAlign: "center" }}>
                <div style={{ position: "relative", width: 120, height: 120 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                    <motion.circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="10" 
                      strokeDasharray="282.7" 
                      initial={{ strokeDashoffset: 282.7 }}
                      animate={{ strokeDashoffset: 282.7 - (282.7 * (data?.score || 50) / 100) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 28, fontWeight: 900 }}>{data?.score || 50}%</span>
                    <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.8 }}>{(data?.score || 50) > 50 ? "ALCISTA" : "BAJISTA"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {topAnalyses.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  background: "white",
                  borderRadius: 24,
                  padding: 24,
                  border: "1.5px solid #eef2f8",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ 
                    padding: "6px 12px", 
                    borderRadius: 10, 
                    fontSize: 10, 
                    fontWeight: 900, 
                    background: item.sentiment === "Bullish" ? "#ecfdf5" : item.sentiment === "Bearish" ? "#fff1f2" : "#f8fafc",
                    color: item.sentiment === "Bullish" ? "#059669" : item.sentiment === "Bearish" ? "#e11d48" : "#64748b"
                  }}>
                    {item.sentiment}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ 
                        width: 12, 
                        height: 4, 
                        borderRadius: 2, 
                        background: i < (item.impact === "High" ? 3 : item.impact === "Medium" ? 2 : 1) ? "#0F62FE" : "#e2e8f0" 
                      }} />
                    ))}
                  </div>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 850, color: "#0B1E5E", marginBottom: 10 }}>{item.topic}</h4>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>{item.description}</p>
                <div style={{ 
                  background: "#f8fafc", 
                  padding: "12px 14px", 
                  borderRadius: 12, 
                  border: "1px dashed #cbd5e1",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#0F62FE",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}>
                  <Activity size={14} /> Correlación: {item.correlation}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Billy AI Analysis */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{
            background: "white",
            borderRadius: 32,
            padding: 30,
            border: "1.5px solid #eef2f8",
            textAlign: "center"
          }}>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
              <Billy size={120} isStatic={false} mood="thinking" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0B1E5E", marginBottom: 12 }}>Sugerencia de Billy</h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, marginBottom: 24 }}>
              "Viendo que el Bitcoin ha roto máximos y que las tasas de la Fed están en pausa, te sugiero revisar tu **Simulador de Ahorro**. Podrías estar dejando de ganar interés compuesto por no ajustar tu estrategia."
            </p>
            <button 
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 16,
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                color: "#0F62FE",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10
              }}
            >
              Ir al Simulador <ArrowRight size={16} />
            </button>
          </div>

          <div style={{
            background: "white",
            borderRadius: 32,
            padding: 24,
            border: "1.5px solid #eef2f8",
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0B1E5E", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={16} color="#0F62FE" /> Top Narrativas Hoy
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(data?.topNarrativas || ["Cargando..."]).map((tag: any) => (
                <span key={tag} style={{ padding: "6px 12px", background: "#f1f5f9", borderRadius: 10, fontSize: 11, fontWeight: 700, color: "#475569" }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{
            background: "#0B1E5E",
            borderRadius: 32,
            padding: 24,
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}>
             <div style={{ position: "relative", zIndex: 1 }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 16 }}>Métricas en Tiempo Real</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(data?.metrics || []).map((m: any) => (
                    <div key={m.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: m.trend === "up" ? "#4ade80" : "#f87171" }}>{m.change}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
