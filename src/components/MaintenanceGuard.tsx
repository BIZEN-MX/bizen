"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { Construction, Loader2 } from 'lucide-react'

/**
 * MaintenanceGuard - Bloqueo total de plataforma para modo mantenimiento.
 * Solo permite acceso a diego@bizen.mx
 * Los datos se consultan dinámicamente de la base de datos.
 */
export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const pathname = usePathname()
  const [config, setConfig] = useState<{ active: boolean; message: string } | null>(null)
  const [loadingConfig, setLoadingConfig] = useState(true)
  
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/admin/system')
        const data = await res.json()
        if (res.ok) {
          setConfig({
            active: data.maintenanceMode === true,
            message: data.maintenanceMessage || "Billy está realizando algunos ajustes técnicos para mejorar tu experiencia de aprendizaje. Volveremos muy pronto."
          })
        }
      } catch (err) {
        console.error("Error fetching maintenance config:", err)
      } finally {
        setLoadingConfig(false)
      }
    }
    fetchConfig()
  }, [])

  // Bypass si es el Super Admin
  const userEmail = (user?.email || user?.emailAddresses?.[0]?.emailAddress || "").toLowerCase();
  const isSuperAdmin = userEmail === "diego@bizen.mx"

  // Permitir siempre el acceso a las rutas de login/signup para que el admin pueda identificarse
  const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/auth")

  // Si estamos cargando la configuración o el auth, no bloqueamos aún para evitar saltos bruscos
  if (loadingConfig || authLoading) {
    return <>{children}</>
  }

  // Si el mantenimiento está activo, NO es el super admin y NO es una ruta de auth, bloqueamos
  if (config?.active && !isSuperAdmin && !isAuthRoute) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#060f20] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        {/* Efectos de fondo premium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-xl w-full">
          {/* Icono animado */}
          <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <Construction className="text-blue-500 animate-bounce" size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            BIZEN está en <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Mantenimiento</span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-md mx-auto whitespace-pre-wrap">
            {config.message}
          </p>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Servidor: Operaciones Especiales</span>
          </div>
          
          {/* Branding sutil */}
          <div className="mt-20 opacity-20 select-none">
            <img src="/thumbs up.png" alt="BIZEN" className="h-12 mx-auto grayscale" />
          </div>
        </div>
        
        <style jsx global>{`
          body {
            overflow: hidden !important;
            height: 100vh !important;
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}
