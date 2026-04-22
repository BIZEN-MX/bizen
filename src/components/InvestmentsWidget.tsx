"use client"

import React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { TrendingUp, ArrowRight, Zap, ShieldCheck } from "lucide-react"

export default function InvestmentsWidget() {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 30px 60px rgba(14, 165, 233, 0.35)" }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden group cursor-pointer h-full min-h-[240px] rounded-[2.5rem] p-8 flex flex-col justify-between border-[1.5px] border-white/20 bg-gradient-to-br from-sky-900 via-sky-800 to-sky-500 shadow-2xl transition-all duration-300"
      onClick={() => router.push("/investments")}
    >
      {/* Decorative Orbs */}
      <div className="absolute -top-1/2 -right-[10%] w-48 h-48 bg-blue-400/20 rounded-full blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-[30%] left-[5%] w-40 h-40 bg-purple-400/15 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
            <TrendingUp size={24} className="text-white" />
          </div>
          <span className="text-xs font-black text-white/60 uppercase tracking-[0.15em]">Centro de Inversión</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-[1.05] mb-4">
          Haz crecer tus <span className="text-blue-300">Bizcoins</span>
        </h3>
        <p className="text-base text-white/80 font-semibold leading-relaxed max-w-[90%]">
          Pon tus ahorros a trabajar con rendimientos de hasta el <strong className="text-white underline decoration-blue-400 decoration-2">15%</strong>.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-8">
        <div className="flex gap-2">
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2 backdrop-blur-sm">
                <Zap size={15} className="text-amber-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Alta Rentabilidad</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2 backdrop-blur-sm">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Seguro</span>
            </div>
        </div>
        
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-xl shadow-primary/10 group-hover:shadow-white/20 group-hover:scale-110 transition-all duration-300">
          <ArrowRight size={24} strokeWidth={2.5} />
        </div>
      </div>
    </motion.div>
  )
}
