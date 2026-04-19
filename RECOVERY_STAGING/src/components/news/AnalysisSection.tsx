"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
      <div className="py-20 text-center flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-6"
        />
        <p className="text-slate-500 font-bold text-lg animate-pulse">Billy AI está analizando el pulso del mercado...</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8">
        
        {/* Main Analysis Feed */}
        <div className="flex flex-col gap-8">
          
          {/* AI Intelligence Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-10 rounded-[40px] overflow-hidden bg-gradient-to-br from-[#0B1E5E] via-[#0F62FE] to-blue-500 text-white shadow-2xl shadow-blue-500/20"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                    <BrainCircuit size={20} className="text-blue-100" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">Inteligencia Predictiva</span>
                </div>
                <h2 className="text-4xl font-black mb-6 leading-tight tracking-tight">
                  {data?.label || "Análisis de Sentimiento Global"}
                </h2>
                <p className="text-xl text-white/80 leading-relaxed font-medium">
                  {data?.summary || "Billy está procesando las últimas tendencias para darte una ventaja competitiva."}
                </p>
              </div>

              {/* Sentiment Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle className="text-white/10" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <motion.circle 
                      className="text-white" 
                      strokeWidth="10" 
                      strokeDasharray={283}
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * (data?.score || 50) / 100) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="45" cx="50" cy="50" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{data?.score || 50}%</span>
                    <span className="text-[10px] font-black opacity-70 tracking-tighter">
                      {(data?.score || 50) > 50 ? "ALCISTA" : "BAJISTA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topAnalyses.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    item.sentiment === "Bullish" ? "bg-emerald-50 text-emerald-600" :
                    item.sentiment === "Bearish" ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
                  }`}>
                    {item.sentiment}
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-3 h-1 rounded-full transition-colors ${
                        i < (item.impact === "High" ? 3 : item.impact === "Medium" ? 2 : 1) ? "bg-blue-600" : "bg-slate-100" 
                      }`} />
                    ))}
                  </div>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{item.topic}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{item.description}</p>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-dashed border-blue-200 text-[11px] font-bold text-blue-600 flex items-center gap-3">
                  <Activity size={16} /> Correlación: {item.correlation}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Billy AI Analysis */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 text-center shadow-lg shadow-slate-200/50">
            <div className="flex justify-center mb-6">
              <Billy size={140} isStatic={false} mood="thinking" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4">Sugerencia de Billy</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
              "Viendo que el Bitcoin ha roto máximos y que las tasas de la Fed están en pausa, te sugiero revisar tu <strong className="text-blue-600 underline">Simulador de Ahorro</strong>. Podrías estar dejando de ganar interés compuesto por no ajustar tu estrategia."
            </p>
            <button 
              onClick={() => router.push("/cash-flow?tab=simulators")}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              Ir al Simulador <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <h4 className="text-[13px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <Zap size={18} className="text-blue-600" /> TOP NARRATIVAS HOY
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data?.topNarrativas || ["Nearshoring", "IA Crypto", "Inflación", "EEMM", "S&P 500"]).map((tag: any) => (
                <span key={tag} className="px-4 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-xl text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
             <div className="relative z-10">
                <h4 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-6">Métricas Globales</h4>
                <div className="flex flex-col gap-4">
                  {(data?.metrics || [
                    { name: "Nasdaq 100", change: "+0.82%", trend: "up" },
                    { name: "S&P 500", change: "+0.45%", trend: "up" },
                    { name: "BTC / USD", change: "-1.24%", trend: "down" },
                    { name: "DXY (Dólar)", change: "+0.08%", trend: "up" }
                  ]).map((m: any) => (
                    <div key={m.name} className="flex justify-between items-center group/item">
                      <span className="text-xs font-bold text-white/80 group-hover/item:text-white transition-colors">{m.name}</span>
                      <span className={`text-[13px] font-black ${m.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                        {m.change}
                      </span>
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
