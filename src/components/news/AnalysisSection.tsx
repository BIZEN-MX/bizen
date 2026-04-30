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
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();
  const userEmail = (user?.email || (user as any)?.emailAddresses?.[0]?.emailAddress || "").toLowerCase();
  const isAnahuac = userEmail.endsWith('@anahuac.mx') || userEmail.includes('.anahuac.mx') || userEmail.endsWith('@bizen.mx') || userEmail === 'diegopenita31@gmail.com';

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

  const topAnalyses: AnalysisItem[] = data?.topAnalyses || [
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
    }
  ];

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`w-12 h-12 border-4 ${isAnahuac ? 'border-[#FF5900]' : 'border-blue-600'} border-t-transparent rounded-full mb-6`}
        />
        <p className="text-white/40 font-medium text-lg animate-pulse">Billy AI está analizando el pulso del mercado...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 analysis-section-container">
      <style>{`
        .analysis-section-container div:not(.bg-white *):not(.bg-emerald-500 *):not(.bg-blue-600 *),
        .analysis-section-container p:not(.bg-white *),
        .analysis-section-container span:not(.bg-white *):not(.bg-emerald-500 *):not(.bg-blue-600 *),
        .analysis-section-container h1,
        .analysis-section-container h2,
        .analysis-section-container h3,
        .analysis-section-container h4,
        .analysis-section-container h5,
        .analysis-section-container h6,
        .analysis-section-container label,
        .analysis-section-container input {
          color: #ffffff !important;
          opacity: 1 !important;
          -webkit-text-fill-color: #ffffff !important;
          font-weight: 400 !important;
        }

        .analysis-section-container h1,
        .analysis-section-container h2,
        .analysis-section-container h3,
        .analysis-section-container h4,
        .analysis-section-container h5,
        .analysis-section-container h6 {
          font-weight: 400 !important;
        }

        .analysis-section-container .bg-white,
        .analysis-section-container .bg-white * {
          color: #020617 !important;
          -webkit-text-fill-color: #020617 !important;
        }

        .analysis-section-container .border, 
        .analysis-section-container .border-slate-200 {
          border-color: rgba(255,255,255,0.1) !important;
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8 relative z-10">
        
        {/* Main Analysis Feed */}
        <div className="flex flex-col gap-8">
          
          {/* AI Intelligence Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-10 rounded-[40px] overflow-hidden ${isAnahuac ? 'bg-[#FF5900] bg-gradient-to-br from-[#CC4700] via-[#FF5900] to-[#FF8533]' : 'bg-[#0F62FE] bg-gradient-to-br from-[#0B1E5E] via-[#0F62FE] to-blue-500'} text-white shadow-2xl border border-white/10`}
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                    <BrainCircuit size={20} className="text-white" />
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-[0.2em] text-white`}>Inteligencia Predictiva</span>
                </div>
                <h2 className="text-4xl font-normal mb-6 leading-tight tracking-tight text-white">
                  {data?.label || "Análisis de Sentimiento Global"}
                </h2>
                <p className="text-xl text-white leading-relaxed font-medium">
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
                    <span className="text-3xl font-medium text-white">{data?.score || 50}%</span>
                    <span className="text-[10px] font-medium text-white tracking-tighter">
                      {data?.label || ((data?.score || 50) > 50 ? "ALCISTA" : "BAJISTA")}
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
                className="bg-white/5 backdrop-blur-md p-6 rounded-[32px] border border-white/10 shadow-sm hover:border-blue-500/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-widest ${
                    item.sentiment === "Bullish" ? "bg-emerald-500/20 text-emerald-400" :
                    item.sentiment === "Bearish" ? "bg-rose-500/20 text-rose-400" : "bg-white/10 text-white"
                  }`}>
                    {item.sentiment}
                  </div>
                  <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-3 h-1 rounded-full transition-colors ${
                        i < (item.impact === "High" ? 3 : item.impact === "Medium" ? 2 : 1) ? (isAnahuac ? "bg-[#FF5900]" : "bg-blue-600") : "bg-white/10" 
                      }`} />
                    ))}
                  </div>
                </div>
                <h4 className={`text-lg font-normal text-white mb-2 group-hover:${isAnahuac ? 'text-[#FF5900]' : 'text-blue-400'} transition-colors`}>{item.topic}</h4>
                <p className="text-white text-sm font-medium leading-relaxed mb-6 opacity-80">{item.description}</p>
                <div className={`${isAnahuac ? 'bg-orange-500/10 border-orange-500/20 text-white' : 'bg-blue-500/10 border-blue-500/20 text-white'} p-4 rounded-2xl border border-dashed text-[11px] font-medium flex items-center gap-3`}>
                  <Activity size={16} className={isAnahuac ? "text-[#FF5900]" : "text-blue-400"} /> Correlación: {item.correlation}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Billy AI Analysis */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center shadow-lg">
            <div className="flex justify-center mb-6">
              <Billy size={140} isStatic={false} mood="thinking" />
            </div>
            <h3 className="text-xl font-normal text-white mb-4">Sugerencia de Billy</h3>
            <p className="text-white font-medium text-sm leading-relaxed mb-8 opacity-80">
              "Viendo que el Bitcoin ha roto máximos y que las tasas de la Fed están en pausa, te sugiero revisar tu <strong className={`font-medium ${isAnahuac ? 'text-[#FF5900]' : 'text-blue-400'} underline`}>Simulador de Ahorro</strong>. Podrías estar dejando de ganar interés compuesto por no ajustar tu estrategia."
            </p>
            <button 
              onClick={() => router.push("/cash-flow?tab=simulators")}
              className="w-full py-4 bg-white hover:bg-slate-100 text-[#05081a] rounded-2xl font-medium text-sm flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              Ir al Simulador <ArrowRight size={18} />
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 shadow-sm">
            <h4 className="text-[13px] font-medium text-white mb-6 flex items-center gap-2">
              <Zap size={18} className={isAnahuac ? "text-[#FF5900]" : "text-blue-400"} /> TOP NARRATIVAS HOY
            </h4>
            <div className="flex flex-wrap gap-2">
              {(data?.topNarrativas || ["Nearshoring", "IA Crypto", "Inflación", "EEMM", "S&P 500"]).map((tag: any) => (
                <span key={tag} className={`px-4 py-2 bg-white/5 hover:${isAnahuac ? 'bg-orange-500/20 border-orange-500/30 text-white' : 'bg-blue-500/20 border-blue-500/30 text-white'} border border-white/10 rounded-xl text-[11px] font-medium text-white transition-colors cursor-default`}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[40px] text-white border border-white/10 overflow-hidden relative group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${isAnahuac ? 'bg-orange-600/10' : 'bg-blue-600/10'} blur-3xl rounded-full`} />
             <div className="relative z-10">
                <h4 className="text-[11px] font-medium text-white uppercase tracking-[0.2em] mb-6">Métricas Globales</h4>
                <div className="flex flex-col gap-4">
                  {(data?.metrics || [
                    { name: "Nasdaq 100", change: "+0.82%", trend: "up" },
                    { name: "S&P 500", change: "+0.45%", trend: "up" },
                    { name: "BTC / USD", change: "-1.24%", trend: "down" },
                    { name: "DXY (Dólar)", change: "+0.08%", trend: "up" }
                  ]).map((m: any) => (
                    <div key={m.name} className="flex justify-between items-center group/item">
                      <span className="text-xs font-medium text-white group-hover/item:text-white transition-colors">{m.name}</span>
                      <span className={`text-[13px] font-medium ${m.trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
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
