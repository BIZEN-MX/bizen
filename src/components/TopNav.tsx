"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import {
  Map as MapIcon,
  BarChart2,
  MessageSquare,
  ShoppingBag,
  Zap,
  Settings,
  User,
  LogOut,
  Trophy,
  Heart,
  Newspaper,
  ChevronDown,
  Flame,
  Search,
  Bell,
  Star,
  ArrowUpRight,
  Crown
} from "lucide-react"
import BizcoinIcon from "@/components/BizcoinIcon"
import { ShieldIcon } from "@/components/CustomIcons"

// Grid icon inline (same as sidebar)
const IcoGrid = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, dbProfile, loading, signOut } = useAuth()
  const { settings } = useSettings()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isHiddenByGlobalClass, setIsHiddenByGlobalClass] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const isOnLessonPage = pathname?.includes('/learn/')
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher
  const protectedRoutes = ['/forum', '/profile', '/cuenta', '/configuracion', '/tienda', '/impacto-social']

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const check = () => setIsHiddenByGlobalClass(document.body.classList.contains('hide-sidebar'))
    check()
    const observer = new MutationObserver(() => check())
    observer.observe(document.body, { attributes: true })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifsOpen(false)
      }
    }
    if (profileOpen || notifsOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen, notifsOpen])

  const navigateTo = (path: string) => {
    setProfileOpen(false)
    if (!user && protectedRoutes.some(r => path.startsWith(r))) {
      router.push('/login')
      return
    }
    if (isOnLessonPage) {
      setPendingNavigation(path)
      setShowExitDialog(true)
    } else {
      router.push(path)
    }
  }

  const confirmExit = () => {
    setShowExitDialog(false)
    if (pendingNavigation) { router.push(pendingNavigation); setPendingNavigation(null) }
  }

  const isActive = (path: string) => {
    if (path === '/courses') return pathname === path
    if (path === '/configuracion') return pathname === '/cuenta' || pathname === '/configuracion' || pathname?.startsWith('/cuenta/') || pathname?.startsWith('/configuracion/')
    return pathname === path || pathname?.startsWith(path + '/')
  }

  // Plan info
  const role = dbProfile?.role
  const isPremium = dbProfile?.subscriptionStatus === 'active' || (dbProfile?.school?.licenses?.length || 0) > 0
  let planLabel = 'Plan Básico'
  if (role === 'teacher') planLabel = 'Docente'
  else if (role === 'school_admin' || role === 'admin') planLabel = 'Admin'
  else if (role === 'student') planLabel = 'Institucional'
  else if (role === 'particular') planLabel = isPremium ? 'Premium' : 'Plan Básico'
  else if (role) planLabel = 'Institucional'
  const isBasicPlan = planLabel === 'Plan Básico'

  // Nav items for students
  const studentNavItems = [
    { label: 'Inicio', path: isAdminOrTeacher ? '/teacher/dashboard' : '/dashboard', icon: <IcoGrid size={16} color="currentColor" /> },
    { label: 'Cursos', path: '/courses', icon: <MapIcon size={16} /> },
    { label: 'Simuladores', path: '/cash-flow', icon: <BarChart2 size={16} /> },
    { label: 'Comunidad', path: '/comunidad', icon: <MessageSquare size={16} /> },
    { label: 'Tienda', path: '/tienda', icon: <ShoppingBag size={16} /> },
    { label: 'Live', path: '/live/join', icon: <Zap size={16} /> },
  ]

  const teacherNavItems = [
    { label: 'Panel Escolar', path: '/teacher/dashboard', icon: <IcoGrid size={16} color="currentColor" /> },
    { label: 'Mis Cursos', path: '/teacher/courses', icon: <MapIcon size={16} /> },
    { label: 'Live', path: '/live/join', icon: <Zap size={16} /> },
  ]

  const navItems = user ? (isAdminOrTeacher ? teacherNavItems : studentNavItems) : []
  const bizcoins = (dbProfile as any)?.bizcoins || 0
  const streak = (dbProfile as any)?.streak || 0

  // 🔔 Notifications Fetch
  const fetchNotifs = async () => {
    if (!user) return
    try {
      setLoadingNotifs(true)
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadNotifs(data.unreadCount || 0)
    } catch (e) {
      console.error("Notifs failed", e)
    } finally {
      setLoadingNotifs(false)
    }
  }

  useEffect(() => {
    if (user) fetchNotifs()
  }, [user])

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      setUnreadNotifs(0)
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date() })))
    } catch (e) {}
  }

  if (!mounted) return null

  return (
    <>
      <nav className={`topnav-bar ${scrolled ? 'scrolled' : 'not-scrolled'}`} aria-label="Navegación principal">
        <div className="topnav-brand" onClick={() => navigateTo(user ? (isAdminOrTeacher ? '/teacher/dashboard' : '/dashboard') : '/')}>
          <span className="topnav-logo">
            BIZEN<span className="topnav-logo-dot" />
          </span>
          {mounted && !loading && dbProfile && (
            <span
              className={`topnav-plan-badge ${isBasicPlan ? 'basic' : 'premium'}`}
              onClick={isBasicPlan ? (e) => { e.stopPropagation(); router.push('/payment') } : undefined}
            >
              <span className="topnav-plan-dot" style={{ background: isBasicPlan ? '#94a3b8' : '#0F62FE' }} />
              {planLabel}
            </span>
          )}
        </div>

        {user && (
          <div className="topnav-links">
            {navItems.map((item) => {
              const active = isActive(item.path)
              const isLive = item.label === 'Live'
              return (
                <button
                  key={item.path}
                  className={`topnav-link ${isLive ? 'live-link' : ''} ${active ? 'active' : ''}`}
                  onClick={() => navigateTo(item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {!isLive && <span className="topnav-link-dot" />}
                </button>
              )
            })}
          </div>
        )}

        <div className="topnav-right">
          {mounted && !loading && user ? (
            <>
              {isStudentOrGuest && streak > 0 && (
                <div className="topnav-stat-pill" style={{ color: '#d97706', background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.2)' }}>
                  <Flame size={13} />
                  {streak}
                </div>
              )}
              {isStudentOrGuest && (
                <div className="topnav-stat-pill">
                  <BizcoinIcon size={13} />
                  {bizcoins.toLocaleString()}
                </div>
              )}

              <div style={{ position: 'relative' }} ref={notifRef}>
                <button 
                  className="topnav-icon-btn" 
                  aria-label="Notificaciones"
                  onClick={() => { setNotifsOpen(!notifsOpen); if (!notifsOpen) fetchNotifs() }}
                >
                  <Bell size={18} />
                  {unreadNotifs > 0 && <span className="topnav-notif-dot" />}
                </button>

                {notifsOpen && (
                  <div className="topnav-dropdown" style={{ width: 320, top: 'calc(100% + 10px)', right: 0 }}>
                    <div className="topnav-dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Notificaciones</span>
                      {unreadNotifs > 0 && (
                        <button onClick={markAllRead} style={{ fontSize: 11, fontWeight: 600, color: '#0F62FE', border: 'none', background: 'transparent', cursor: 'pointer' }}>Marcar todo como leído</button>
                      )}
                    </div>
                    
                    <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                      {loadingNotifs && notifications.length === 0 ? (
                        <div style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 13 }}>Cargando...</div>
                      ) : notifications.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center' }}>
                          <Bell size={24} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
                          <div style={{ fontSize: 13, color: '#64748b' }}>No tienes notificaciones aún</div>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button 
                            key={n.id} 
                            className="topnav-dropdown-item" 
                            style={{ 
                              opacity: n.readAt ? 0.6 : 1, 
                              borderLeft: n.readAt ? 'none' : '3px solid #0F62FE',
                              background: n.readAt ? 'transparent' : 'rgba(15,98,254,0.02)',
                              marginTop: 2
                            }}
                            onClick={() => {
                              if (n.data?.url || n.link) navigateTo(n.data?.url || n.link)
                              setNotifsOpen(false)
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: n.readAt ? 500 : 700, color: '#1e293b', marginBottom: 4, lineHeight: 1.4 }}>
                                {n.title || n.message}
                              </div>
                              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Hace poco'}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    
                    <div className="topnav-dropdown-divider" />
                    <button className="topnav-dropdown-item" style={{ justifyContent: 'center', color: '#64748b', fontSize: 12 }} onClick={() => navigateTo('/comunidad/notificaciones')}>
                      Ver todas las notificaciones
                    </button>
                  </div>
                )}
              </div>

              <div style={{ position: 'relative' }} ref={profileRef}>
                <button className="topnav-avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <AvatarDisplay avatar={dbProfile?.avatarUrl} size={34} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b', marginRight: 4 }}>{dbProfile?.fullName || user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: '#64748b' }} />
                </button>

                {profileOpen && (
                  <div className="profile-dropdown-panel" ref={profileRef}>
                    <div className="profile-dropdown-hero">
                      <div className="profile-dropdown-orb1" />
                      <div className="profile-dropdown-orb2" />
                      
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <AvatarDisplay avatar={dbProfile?.avatarUrl} size={54} />
                        <div className="profile-dropdown-info">
                          <div className="profile-dropdown-name">
                            {dbProfile?.fullName || user.email?.split('@')[0]}
                          </div>
                          <span className={`${isBasicPlan ? 'plan-badge-gratuito' : 'plan-badge-premium'}`}>
                            <div className="plan-dot" />
                            {planLabel}
                          </span>
                        </div>
                      </div>

                      <div className="profile-stats-grid">
                        <div className="profile-stat-item">
                          <span className="profile-stat-value">{streak}</span>
                          <span className="profile-stat-label">Racha</span>
                        </div>
                        <div className="profile-stat-item">
                          <span className="profile-stat-value">{bizcoins.toLocaleString()}</span>
                          <span className="profile-stat-label">BZ</span>
                        </div>
                        <div className="profile-stat-item">
                          <span className="profile-stat-value">Lvl 1</span>
                          <span className="profile-stat-label">Nivel</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-dropdown-nav-list">
                      <button className="profile-dropdown-nav-item" onClick={() => navigateTo('/rankings')}>
                        <Trophy size={18} /> 
                        <span className="profile-dropdown-nav-label">Rankings</span>
                      </button>
                      <button className="profile-dropdown-nav-item" onClick={() => navigateTo('/simulator')}>
                        <BarChart2 size={18} /> 
                        <span className="profile-dropdown-nav-label">BIZEN Market</span>
                      </button>
                      <button className="profile-dropdown-nav-item" onClick={() => navigateTo('/forum')}>
                        <MessageSquare size={18} /> 
                        <span className="profile-dropdown-nav-label">Foro</span>
                      </button>
                      
                      <div className="profile-dropdown-divider" />
                      
                      <button className="profile-dropdown-nav-item" onClick={() => navigateTo('/profile')}>
                        <AvatarDisplay avatar={dbProfile?.avatarUrl} size={18} /> 
                        <span className="profile-dropdown-nav-label">Mi Perfil</span>
                      </button>
                      <button className="profile-dropdown-nav-item" onClick={() => navigateTo('/configuracion')}>
                        <Settings size={18} /> 
                        <span className="profile-dropdown-nav-label">Ajustes</span>
                      </button>
                      
                      <div className="profile-dropdown-divider" />
                      
                      <button className="profile-dropdown-signout-btn" onClick={() => signOut()}>
                        <LogOut size={18} /> 
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
             <div style={{ display: 'flex', gap: 12 }}>
                <button className="topnav-btn-outline" onClick={() => router.push('/login')}>Entrar</button>
                <button className="topnav-btn-primary" onClick={() => router.push('/onboarding')}>Empezar</button>
             </div>
          )}
        </div>
      </nav>

      {/* Exit Dialog for lessons */}
      {showExitDialog && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <LogOut size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 text-center mb-2">¿Quieres salir de la lección?</h3>
             <p className="text-slate-500 text-center mb-8">Tu progreso en esta lección no se guardará si sales ahora.</p>
             <div className="flex flex-col gap-3">
                <button onClick={confirmExit} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Sí, salir ahora</button>
                <button onClick={() => setShowExitDialog(false)} className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Continuar aprendiendo</button>
             </div>
          </div>
        </div>
      )}
    </>
  )
}
