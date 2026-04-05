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

  if (!mounted || loading || isHiddenByGlobalClass) return null

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

  return (
    <>
      <style>{`
        .topnav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          z-index: 1000;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 0;
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
          box-sizing: border-box;
        }
        .topnav-bar.scrolled {
          background: rgba(251, 250, 245, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
        }
        .topnav-bar.not-scrolled {
          background: rgba(251, 250, 245, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.04);
        }
        .topnav-bar::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #0F62FE, transparent);
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .topnav-bar.scrolled::after {
          width: 100%;
        }
        .topnav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
          margin-right: 32px;
          text-decoration: none;
          user-select: none;
        }
        .topnav-logo {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.05em;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 2px;
          position: relative;
        }
        .topnav-logo:hover {
          filter: brightness(1.2);
        }
        .topnav-logo-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #0F62FE;
          display: inline-block;
          box-shadow: 0 0 10px rgba(15, 98, 254, 0.5);
          animation: topnav-dot-pulse 2s infinite;
        }
        @keyframes topnav-dot-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .topnav-links {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          margin-right: 12px;
        }
        @media (max-width: 1100px) {
          .topnav-links { gap: 1px; }
          .topnav-link { padding: 7px 10px; font-size: 13px; }
        }
        @media (max-width: 980px) {
          .topnav-link span:not(.topnav-link-dot) { display: none; }
          .topnav-link { padding: 8px; }
        }
        @media (max-width: 768px) {
          .topnav-links { display: none; }
        }
        .topnav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 9px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          position: relative;
          letter-spacing: -0.01em;
          text-decoration: none;
          font-family: inherit;
        }
        .topnav-link:hover {
          background: rgba(15, 98, 254, 0.07);
          color: #0F62FE;
        }
        .topnav-link.active {
          background: rgba(15, 98, 254, 0.1);
          color: #0F62FE;
          font-weight: 600;
          box-shadow: inset 0 0 0 1px rgba(15, 98, 254, 0.1);
        }
        .topnav-link:active {
          transform: scale(0.96);
        }
        .topnav-link.live-link {
          color: #92400e;
          background: rgba(251, 191, 36, 0.1);
        }
        .topnav-link.live-link:hover, .topnav-link.live-link.active {
          background: rgba(251, 191, 36, 0.18);
          color: #b45309;
        }
        .topnav-link-dot {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #0F62FE;
          opacity: 0;
          transition: opacity 0.18s ease;
        }
        .topnav-link.active .topnav-link-dot {
          opacity: 1;
          bottom: 4px;
        }
        
        /* Search Bar */
        .topnav-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 12px;
          padding: 0 12px;
          height: 36px;
          width: 180px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin: 0 16px;
        }
        @media (max-width: 1200px) {
          .topnav-search { margin: 0 8px; width: 140px; }
          .topnav-search.focused { width: 220px; }
        }
        @media (max-width: 1024px) {
          .topnav-search { width: 40px; padding: 0; justify-content: center; }
          .topnav-search-input, .topnav-search-key { display: none; }
          .topnav-search.focused { width: 200px; padding: 0 12px; justify-content: flex-start; }
          .topnav-search.focused .topnav-search-input { display: block; }
        }
        .topnav-search.focused {
          width: 280px;
          background: #fff;
          border-color: rgba(15, 98, 254, 0.4);
          box-shadow: 0 4px 12px rgba(15, 98, 254, 0.08);
        }
        .topnav-search-input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 13px;
          color: #1e293b;
          width: 100%;
          font-family: inherit;
        }
        .topnav-search-input::placeholder {
          color: #94a3b8;
        }
        .topnav-search-key {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          background: rgba(0,0,0,0.05);
          padding: 2px 5px;
          border-radius: 4px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .topnav-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.05);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .topnav-icon-btn:hover {
          background: rgba(15, 98, 254, 0.06);
          color: #0F62FE;
          border-color: rgba(15, 98, 254, 0.15);
        }
        .topnav-notif-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: #EF4444;
          border-radius: 50%;
          border: 1.5px solid #fff;
        }
        .topnav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: auto;
        }
        .topnav-plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 99px;
          cursor: default;
          user-select: none;
          white-space: nowrap;
        }
        .topnav-plan-badge.basic {
          background: #F1F5F9;
          color: #475569;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .topnav-plan-badge.basic:hover {
          background: #E0EFFE;
          border-color: #0F62FE;
          color: #0F62FE;
          transform: translateY(-1px);
        }
        .topnav-plan-badge.premium {
          background: linear-gradient(135deg, rgba(15,98,254,0.1), rgba(15,98,254,0.05));
          color: #0F62FE;
          border: 1px solid rgba(15,98,254,0.2);
        }
        .topnav-plan-dot {
          width: 5px; height: 5px; border-radius: 50%;
          flex-shrink: 0;
        }
        @media (max-width: 1150px) {
          .topnav-plan-badge { display: none; }
        }
        .topnav-stat-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          background: rgba(15,98,254,0.06);
          color: #0F62FE;
          border: 1px solid rgba(15,98,254,0.1);
          white-space: nowrap;
          font-family: inherit;
        }
        .topnav-avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px 4px 4px;
          border-radius: 99px;
          border: 1px solid rgba(15,98,254,0.15);
          background: rgba(255,255,255,0.8);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
          font-family: inherit;
        }
        .topnav-avatar-btn:hover {
          border-color: rgba(15,98,254,0.35);
          background: #fff;
          box-shadow: 0 4px 12px rgba(15,98,254,0.12);
        }
        .topnav-avatar-ring {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0F62FE, #6366f1);
          padding: 2px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .topnav-avatar-inner {
          width: 100%; height: 100%;
          border-radius: 50%; background: white;
          overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
        .topnav-avatar-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #1e293b;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 850px) {
          .topnav-avatar-name, .topnav-stat-pill { display: none; }
          .topnav-bar { padding: 0 12px; }
          .topnav-brand { margin-right: 12px; }
        }
        /* Profile Dropdown */
        .topnav-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 260px;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
          padding: 8px;
          z-index: 1001;
          animation: topnav-dropdown-in 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;
          overflow: hidden;
        }
        @keyframes topnav-dropdown-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .topnav-dropdown-header {
          padding: 12px 16px 8px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          margin-bottom: 4px;
        }
        .topnav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
          font-size: 13.5px;
          font-weight: 500;
          color: #374151;
          text-align: left;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .topnav-dropdown-item:hover {
          background: #F8FAFC;
          color: #0F62FE;
        }
        .topnav-dropdown-item.danger {
          color: #DC2626;
        }
        .topnav-dropdown-item.danger:hover {
          background: rgba(220,38,38,0.06);
          color: #DC2626;
        }
        .topnav-dropdown-divider {
          height: 1px;
          background: rgba(0,0,0,0.05);
          margin: 4px 6px;
        }
        .topnav-dropdown-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(15,98,254,0.08);
          flex-shrink: 0;
        }
        .topnav-dropdown-icon.danger {
          background: rgba(220,38,38,0.08);
        }
        /* Unauthenticated buttons */
        .topnav-auth-btn {
          display: flex; align-items: center; justify-content: center;
          padding: 7px 16px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          border: none;
          font-family: inherit;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .topnav-auth-btn.ghost {
          background: transparent;
          color: #475569;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .topnav-auth-btn.ghost:hover {
          border-color: #0F62FE;
          color: #0F62FE;
          background: rgba(15,98,254,0.05);
        }
        .topnav-auth-btn.primary {
          background: linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(11,113,254,0.35);
        }
        .topnav-auth-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(11,113,254,0.45);
        }

        /* Spacer to push page content below the nav */
        .topnav-spacer {
          height: 60px;
          flex-shrink: 0;
        }
      `}</style>

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
