import React from 'react'
import Link from 'next/link'
import { 
    ShieldCheck, 
    School, 
    Megaphone, 
    TrendingUp, 
    BookOpen, 
    Brain, 
    Settings,
    Activity,
    Users,
    Database,
    PlaySquare
} from 'lucide-react'

import { prisma } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export default async function AdminMissionControl() {
    let dbStatus = "Offline"
    let dbTime = 0
    let clerkStatus = "Offline"
    let clerkTime = 0

    // 1. Check Database
    try {
        const start = Date.now()
        await prisma.$queryRaw`SELECT 1`
        dbTime = Date.now() - start
        dbStatus = "Connected"
    } catch (e) {
        dbStatus = "Error"
    }

    // 2. Check Clerk Auth
    try {
        const start = Date.now()
        const client = await clerkClient()
        await client.users.getUserList({ limit: 1 })
        clerkTime = Date.now() - start
        clerkStatus = "Active"
    } catch (e) {
        clerkStatus = "Error"
    }

    return (
        <div className="text-white space-y-8">
            <header>
                <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                    <Activity className="text-emerald-500" />
                    Mission Control
                </h1>
                <p className="text-slate-400 mt-2 text-lg">Panel de control global para desarrollo, configuración y arquitectura de BIZEN.</p>
            </header>

            {/* Real-time Status Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Status API</div>
                        <div className="text-2xl font-bold text-emerald-400 flex items-baseline gap-2">
                            Online
                            <span className="text-xs text-slate-500 font-normal">Next.js</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                    <div className={dbStatus === 'Connected' ? "bg-blue-500/10 p-3 rounded-lg text-blue-500" : "bg-red-500/10 p-3 rounded-lg text-red-500"}>
                        <Database size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Database</div>
                        <div className={`text-2xl font-bold flex items-baseline gap-2 ${dbStatus === 'Connected' ? 'text-white' : 'text-red-400'}`}>
                            {dbStatus}
                            <span className="text-xs text-slate-500 font-normal">{dbTime > 0 ? `${dbTime}ms` : ''}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
                    <div className={clerkStatus === 'Active' ? "bg-purple-500/10 p-3 rounded-lg text-purple-500" : "bg-red-500/10 p-3 rounded-lg text-red-500"}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Clerk Auth</div>
                        <div className={`text-2xl font-bold flex items-baseline gap-2 ${clerkStatus === 'Active' ? 'text-white' : 'text-red-400'}`}>
                            {clerkStatus}
                            <span className="text-xs text-slate-500 font-normal">{clerkTime > 0 ? `${clerkTime}ms` : ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ModuleCard 
                    href="/admin/management" 
                    icon={<ShieldCheck size={32} className="text-blue-400" />} 
                    title="Roles y Accesos" 
                    description="Gestiona roles de usuarios (school_admin, teacher, student) y sincroniza base de datos."
                />
                <ModuleCard 
                    href="/admin/schools" 
                    icon={<School size={32} className="text-emerald-400" />} 
                    title="Gestión de Escuelas" 
                    description="Crea, edita y configura instituciones, licencias y metas de ciclo."
                />
                <ModuleCard 
                    href="/admin/banners" 
                    icon={<Megaphone size={32} className="text-purple-400" />} 
                    title="Anuncios Globales" 
                    description="Configura banners promocionales (Bizcoinvert) y comunicados en TopNav."
                />
                <ModuleCard 
                    href="/admin/market" 
                    icon={<TrendingUp size={32} className="text-amber-400" />} 
                    title="Configuración Market" 
                    description="Ajusta precios de instrumentos, eventos macroeconómicos y ciclos del simulador."
                />
                <ModuleCard 
                    href="/admin/billy" 
                    icon={<Brain size={32} className="text-indigo-400" />} 
                    title="Entrenamiento Billy" 
                    description="Revisa logs del chatbot, ajusta prompts base y configura el Knowledge Base."
                />
                <ModuleCard 
                    href="/admin/curriculum" 
                    icon={<BookOpen size={32} className="text-teal-400" />} 
                    title="Curriculum Builder" 
                    description="Estructura los módulos, cursos interactivos y lecciones de contenido."
                />
                <ModuleCard 
                    href="/admin/glossary" 
                    icon={<BookOpen size={32} className="text-pink-400" />} 
                    title="Glosario y Tags" 
                    description="Administra los conceptos clave que aparecen en las flashcards y definiciones automáticas."
                />
                <ModuleCard 
                    href="/admin/bites" 
                    icon={<PlaySquare size={32} className="text-rose-400" />} 
                    title="BIZEN Bites" 
                    description="Sube y gestiona videos cortos (tipo TikTok/Shorts) para la comunidad."
                />
                <ModuleCard 
                    href="/admin/system" 
                    icon={<Settings size={32} className="text-slate-400" />} 
                    title="Sistema Maestro" 
                    description="Variables de entorno, logs de errores, mantenimiento y acciones destructivas."
                />
            </div>
        </div>
    )
}

function ModuleCard({ href, icon, title, description }: { href: string, icon: React.ReactNode, title: string, description: string }) {
    return (
        <Link href={href} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:bg-slate-800 transition-colors group">
            <div className="mb-4 bg-slate-950 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-slate-800">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </Link>
    )
}
