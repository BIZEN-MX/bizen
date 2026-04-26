"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Lock, ShoppingBag, Sparkles, ChevronRight, ArrowLeft } from "lucide-react"
import PageLoader from "@/components/PageLoader"
import { motion } from "framer-motion"

interface LockedToolGuardProps {
    children: React.ReactNode
    productId: string
    toolName: string
}

export default function LockedToolGuard({ children, productId, toolName }: LockedToolGuardProps) {
    const { user, loading: authLoading } = useAuth()
    const [isOwned, setIsOwned] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            setLoading(false)
            return
        }

        const checkOwnership = async () => {
            try {
                const res = await fetch("/api/tienda/inventory")
                if (res.ok) {
                    const data = await res.json()
                    const inventory = data.inventory || []
                    setIsOwned(inventory.includes(String(productId)))
                } else {
                    setIsOwned(false)
                }
            } catch (err) {
                console.error("Error checking tool ownership:", err)
                setIsOwned(false)
            } finally {
                setLoading(false)
            }
        }

        checkOwnership()
    }, [user, authLoading, productId])

    if (authLoading || loading) return <PageLoader />

    if (!isOwned) {
        return (
            <div className="min-h-screen bg-[#FBFAF5] flex flex-col items-center justify-center p-6 text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[500px] w-full bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60" />

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-900/20 group">
                            <Lock size={40} className="text-white group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 border border-blue-100">
                            <Sparkles size={14} /> Contenido Premium
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                            {toolName} <span className="text-blue-600 text-slate-400">Bloqueado</span>
                        </h1>

                        <p className="text-[16px] text-slate-500 font-medium leading-relaxed mb-10">
                            Esta herramienta avanzada requiere ser desbloqueada en la **Bizen Store** para ser utilizada. Potencia tu gestión financiera hoy mismo.
                        </p>

                        <div className="flex flex-col gap-4">
                            <Link 
                                href="/tienda"
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/30 transition-all active:scale-95"
                            >
                                <ShoppingBag size={18} /> Ir a la Tienda <ChevronRight size={18} />
                            </Link>
                            
                            <Link 
                                href="/cash-flow"
                                className="w-full py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                            >
                                <ArrowLeft size={16} /> Volver a Simuladores
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return <>{children}</>
}
