"use client"

import React from "react"
import { motion } from "framer-motion"
import { Dna, Sparkles, AlertCircle, TrendingUp, Target, ArrowRight } from "lucide-react"
import { Billy } from "@/components/Billy"
import { useRouter } from "next/navigation"

interface ADNInsightPanelProps {
    adnProfile: string
    lessonTitle: string
}

export default function ADNInsightPanel({ adnProfile, lessonTitle }: ADNInsightPanelProps) {
    const router = useRouter()
    // Definimos los mensajes personalizados según el perfil
    const getInsight = () => {
        switch (adnProfile) {
            case "Gastador Digital":
                return {
                    icon: <AlertCircle className="text-rose-500" size={20} />,
                    title: "Tip de Disciplina Billy",
                    message: `Hey, como tu ADN es de Gastador, pon mucha atención aquí: este concepto te ayudará a identificar compras emocionales antes de que vacíen tu cuenta.`,
                    color: "rose"
                }
            case "Ahorrador Estancado":
                return {
                    icon: <TrendingUp className="text-emerald-500" size={20} />,
                    title: "Tip de Crecimiento Billy",
                    message: `Tu ADN dice que eres gran ahorrador, ¡bien! Pero en esta lección veremos cómo hacer que ese dinero no se quede quieto y empiece a trabajar para ti.`,
                    color: "emerald"
                }
            case "Explorador Arriesgado":
                return {
                    icon: <Target className="text-amber-500" size={20} />,
                    title: "Tip de Seguridad Billy",
                    message: `Como te gusta explorar, recuerda: la clave no es dejar de arriesgar, sino saber gestionar el riesgo. Esta lección es tu red de seguridad.`,
                    color: "amber"
                }
            case "Maestro BIZEN":
                return {
                    icon: <Sparkles className="text-indigo-500" size={20} />,
                    title: "Tip Avanzado Billy",
                    message: `Ya tienes un ADN nivel Maestro. No te quedes solo con lo básico de esta lección; piensa en cómo aplicarlo a una estrategia de interés compuesto hoy mismo.`,
                    color: "indigo"
                }
            case "Sin Diagnosticar":
            default:
                return {
                    icon: <Dna className="text-slate-400" size={20} />,
                    title: "Potencial de ADN",
                    message: `¡Hola! Aún no conozco tu ADN Financiero. Completa el test en tu Dashboard para que pueda darte tips personalizados en cada lección.`,
                    color: "slate"
                }
        }
    }

    const insight = getInsight()
    
    // Safety check: if adnProfile is a JSON string or contains object-like data, fall back to a clean label
    const displayProfile = (adnProfile && adnProfile.includes("{")) ? "Sin Diagnosticar" : adnProfile

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="group relative overflow-hidden mb-12 rounded-[32px] border border-white/80 bg-white/40 backdrop-blur-2xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.06)]"
        >
            {/* Animated Glow Backdrops */}
            <div className={`absolute -right-24 -top-24 h-72 w-72 opacity-[0.12] pointer-events-none rounded-full bg-${insight.color}-500 blur-[90px] animate-pulse`} />
            <div className={`absolute -left-20 -bottom-20 h-64 w-64 opacity-[0.06] pointer-events-none rounded-full bg-blue-400 blur-[80px]`} />

            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start relative z-10">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2.5 mb-4">
                        <div className={`p-2 rounded-xl bg-${insight.color}-100/80 text-${insight.color}-600 shadow-sm`}>
                            {insight.icon}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] text-${insight.color}-600/90`}>
                            {insight.title}
                        </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        Personalizado para tu perfil <span className={`text-${insight.color}-600 bg-clip-text`}>{displayProfile}</span>
                    </h3>
                    
                    <p className="text-[16px] md:text-[17px] text-slate-600 leading-relaxed font-medium max-w-2xl">
                        {insight.message}
                    </p>

                    {adnProfile === "Sin Diagnosticar" && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push("/dashboard?startADN=true")}
                            className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 group/btn"
                        >
                            Descubrir mi ADN 🧬
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                        </motion.button>
                    )}

                    {adnProfile !== "Sin Diagnosticar" && !adnProfile.includes("{") && (
                      <div className="mt-8 pt-6 border-t border-slate-200/50 flex flex-col md:flex-row items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className={`w-7 h-7 rounded-full border-2 border-white bg-${insight.color}-${i*100 + 100} shadow-sm`} />
                                ))}
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Este tip es exclusivo para tu arquetipo financiero</span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Aesthetic Top Accent Bar */}
            <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-${insight.color}-500 via-${insight.color}-400 to-transparent opacity-40`} />
        </motion.div>
    )
}
