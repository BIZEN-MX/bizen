import React from 'react'
import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { 
    ShieldCheck, 
    School, 
    Megaphone, 
    TrendingUp, 
    BookOpen, 
    Brain, 
    Settings, 
    LogOut,
    LayoutDashboard,
    PlaySquare
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const SUPER_ADMINS = ["diego@bizen.mx"]

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
        redirect('/login')
    }

    const email = user.emailAddresses[0]?.emailAddress.toLowerCase()
    
    // Solo permitir acceso a Super Admins explícitos
    if (!email || !SUPER_ADMINS.includes(email)) {
        redirect('/dashboard') // O /teacher/dashboard si es admin escolar
    }

    return (
        <div className="flex flex-row flex-1 h-full w-full bg-slate-950 text-slate-300 font-sans overflow-hidden" style={{ flexDirection: 'row' }}>
            {/* Sidebar Técnico */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <ShieldCheck className="text-emerald-500 mr-3" size={24} />
                    <span className="text-white font-bold tracking-wider">BIZEN SYSTEM</span>
                </div>
                
                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Core</div>
                    <nav className="flex flex-col gap-1 px-2">
                        <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Mission Control" />
                        <NavLink href="/admin/system" icon={<Settings size={18} />} label="Sistema Maestro" />
                    </nav>

                    <div className="px-4 text-xs font-black uppercase tracking-widest text-slate-500 mt-6 mb-2">Modules</div>
                    <nav className="flex flex-col gap-1 px-2">
                        <NavLink href="/admin/management" icon={<ShieldCheck size={18} />} label="Roles" color="text-blue-400" />
                        <NavLink href="/admin/schools" icon={<School size={18} />} label="Escuelas" color="text-emerald-400" />
                        <NavLink href="/admin/banners" icon={<Megaphone size={18} />} label="Anuncios" color="text-purple-400" />
                        <NavLink href="/admin/market" icon={<TrendingUp size={18} />} label="Mercado/Sim" color="text-amber-400" />
                        <NavLink href="/admin/billy" icon={<Brain size={18} />} label="Billy AI" color="text-indigo-400" />
                        <NavLink href="/admin/curriculum" icon={<BookOpen size={18} />} label="Currículum" color="text-teal-400" />
                        <NavLink href="/admin/glossary" icon={<BookOpen size={18} />} label="Glosario" color="text-pink-400" />
                        <NavLink href="/admin/bites" icon={<PlaySquare size={18} />} label="BIZEN Bites" color="text-rose-400" />
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center justify-between gap-2 px-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                {email.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-xs truncate">
                                <div className="text-white font-bold truncate">Super Admin</div>
                                <div className="text-slate-500 truncate">{email}</div>
                            </div>
                        </div>
                        
                        <SignOutButton redirectUrl="/login">
                            <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0" title="Cerrar sesión">
                                <LogOut size={16} />
                            </button>
                        </SignOutButton>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#0a0f1c]">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavLink({ href, icon, label, color = "text-slate-400" }: { href: string, icon: React.ReactNode, label: string, color?: string }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/50 transition-colors ${color} hover:text-white`}
        >
            {icon}
            {label}
        </Link>
    )
}
