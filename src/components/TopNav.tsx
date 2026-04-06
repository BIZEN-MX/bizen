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
  Bell
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
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [notifsOpen, setNotifsOpen] = useState(false)
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    if (profileOpen || notifsOpen || searchFocused) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen, notifsOpen, searchFocused])

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

  // 🔎 Search Logic
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setSearchResults(data.results || [])
      } catch (e) {
        console.error("Search failed", e)
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // ⌘K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = document.getElementById('global-search-input')
        input?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
  if (!mounted || loading || isHiddenByGlobalClass) return null

  return (
    <>
      {/* Styles moved to globals.css to fix hydration mismatches */}

      {/* The actual bar */}
      <nav className={`topnav-bar ${scrolled ? 'scrolled' : 'not-scrolled'}`} aria-label="Navegación principal">

        {/* Brand */}
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

        {/* Nav links */}
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
            
            {/* Search Bar - Desktop Only */}
            <div className={`topnav-search ${searchFocused ? 'focused' : ''}`} ref={searchRef}>
              <Search size={14} color={searchFocused ? "#0F62FE" : "#94a3b8"} />
              <input 
                id="global-search-input"
                type="text" 
                className="topnav-search-input" 
                placeholder="Buscar en BIZEN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
              />
              {!searchFocused && searchQuery.length === 0 && <span className="topnav-search-key">⌘K</span>}

              {searchFocused && (searchQuery.length >= 2 || searching) && (
                <div className="topnav-dropdown search-results" style={{ width: 340, top: 'calc(100% + 8px)', left: 0, padding: '4px' }}>
                  {searching ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#64748b', fontSize: 13 }}>Buscando...</div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#64748b', fontSize: 13 }}>No se encontraron resultados para &quot;{searchQuery}&quot;</div>
                  ) : (
                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                      <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resultados</div>
                      {searchResults.map((r, i) => (
                        <button key={i} className="topnav-dropdown-item" onClick={() => { navigateTo(r.url); setSearchFocused(false); setSearchQuery("") }}>
                          <div className="topnav-dropdown-icon" style={{ background: r.type === 'topic' ? '#E0EFFE' : r.type === 'forum' ? '#F1F5F9' : '#FEF3C7' }}>
                            {r.type === 'topic' || r.type === 'course' ? <MapIcon size={14} color="#0F62FE" /> : 
                             r.type === 'lesson' ? <Zap size={14} color="#D97706" /> : 
                             r.type === 'forum' ? <MessageSquare size={14} color="#475569" /> : 
                             <Newspaper size={14} color="#0F62FE" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1e293b', marginBottom: 2 }}>{r.title}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{r.type}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="topnav-right">
          {mounted && !loading && user ? (
            <>
              {/* Streak pill */}
              {isStudentOrGuest && streak > 0 && (
                <div className="topnav-stat-pill" style={{ color: '#d97706', background: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.2)' }}>
                  <Flame size={13} />
                  {streak}
                </div>
              )}
              {/* Bizcoins pill */}
              {isStudentOrGuest && (
                <div className="topnav-stat-pill">
                  <BizcoinIcon size={13} />
                  {bizcoins.toLocaleString()}
                </div>
              )}

              {/* Action Buttons */}
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

              {/* Avatar + dropdown */}
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button className="topnav-avatar-btn" onClick={() => setProfileOpen(prev => !prev)} aria-label="Menú de perfil">
                  <div className="topnav-avatar-ring">
                    <div className="topnav-avatar-inner">
                      <AvatarDisplay
                        avatar={dbProfile?.avatar || user.user_metadata?.avatar || { type: 'emoji', value: (dbProfile?.fullName || user.email || 'U')[0].toUpperCase() }}
                        size={26}
                        frame={dbProfile?.inventory?.includes('2') ? 'vip' : dbProfile?.inventory?.includes('1') ? 'ambassador' : null}
                      />
                    </div>
                  </div>
                  <span className="topnav-avatar-name">
                    {dbProfile?.fullName || user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={13} color="#94a3b8" style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                </button>

                {profileOpen && (
                  <div className="topnav-dropdown">
                    {/* Header */}
                    <div className="topnav-dropdown-header">
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>
                        {dbProfile?.fullName || user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{user.email}</div>
                    </div>

                    <button className="topnav-dropdown-item" onClick={() => navigateTo('/profile')}>
                      <div className="topnav-dropdown-icon"><User size={15} color="#0F62FE" /></div>
                      Mi Perfil
                    </button>
                    <button className="topnav-dropdown-item" onClick={() => navigateTo('/configuracion')}>
                      <div className="topnav-dropdown-icon"><Settings size={15} color="#0F62FE" /></div>
                      Configuración
                    </button>
                    <button className="topnav-dropdown-item" onClick={() => navigateTo('/rankings')}>
                      <div className="topnav-dropdown-icon"><Trophy size={15} color="#0F62FE" /></div>
                      Rankings
                    </button>
                    <button className="topnav-dropdown-item" onClick={() => navigateTo('/news')}>
                      <div className="topnav-dropdown-icon"><Newspaper size={15} color="#0F62FE" /></div>
                      Noticias BIZEN
                    </button>
                    <button className="topnav-dropdown-item" onClick={() => navigateTo('/impacto-social')}>
                      <div className="topnav-dropdown-icon"><Heart size={15} color="#0F62FE" /></div>
                      Impacto Social
                    </button>

                    <div className="topnav-dropdown-divider" />

                    <button className="topnav-dropdown-item danger" onClick={async () => {
                      setProfileOpen(false)
                      await signOut()
                      router.push('/')
                    }}>
                      <div className="topnav-dropdown-icon danger"><LogOut size={15} color="#DC2626" /></div>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : mounted && !loading && !user ? (
            <>
              <button className="topnav-auth-btn ghost" onClick={() => router.push('/login')}>Iniciar sesión</button>
              <button className="topnav-auth-btn primary" onClick={() => router.push('/signup')}>Crear Cuenta</button>
            </>
          ) : null}
        </div>
      </nav>

      {/* Exit lesson dialog */}
      {showExitDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setShowExitDialog(false)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 600, color: '#0f172a' }}>¿Salir de la lección?</h3>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>Tu progreso se guardará automáticamente.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowExitDialog(false)} style={{ flex: 1, padding: '11px 16px', background: '#f1f5f9', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#1e293b' }}>Cancelar</button>
              <button onClick={confirmExit} style={{ flex: 1, padding: '11px 16px', background: '#0F62FE', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white' }}>Salir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
