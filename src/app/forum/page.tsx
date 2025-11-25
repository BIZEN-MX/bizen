"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { ThreadCardSkeleton } from "@/components/forum/SkeletonLoader"
import { LoadingBar } from "@/components/forum/LoadingBar"
import { usePullToRefresh } from "@/hooks/usePullToRefresh"
import { useSwipeGesture } from "@/hooks/useSwipeGesture"
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator"
import { haptic } from "@/utils/hapticFeedback"
import AgeVerificationModal from "@/components/forum/AgeVerificationModal"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

interface ForumThread {
  id: string
  title: string
  body: string
  status: 'open' | 'resolved' | 'locked'
  score: number
  viewCount: number
  commentCount: number
  isPinned: boolean
  createdAt: string
  author: {
    userId: string
    nickname: string
    reputation: number
    isMinor?: boolean
  }
  topic: {
    id: string
    name: string
    slug: string
    icon: string
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  hasAcceptedAnswer: boolean
}

interface ForumTopic {
  id: string
  name: string
  slug: string
  icon: string
}

type SortOption = 'new' | 'top' | 'unanswered'

function ForumContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('new')
  const [loadingData, setLoadingData] = useState(true)
  const [showTopicFilter, setShowTopicFilter] = useState(false)
  const topicFilterRef = useRef<HTMLDivElement>(null)
  const [showAgeModal, setShowAgeModal] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      // Don't use fixed background on mobile - it causes scrolling issues
      const isMobile = window.innerWidth <= 767
      bodyEl.style.background = "#ffffff"
      bodyEl.style.backgroundAttachment = isMobile ? "scroll" : "fixed"
    }
    return () => {
      bodyEl.style.backgroundImage = "none"
      bodyEl.style.backgroundColor = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }

    // Check if age is verified
    checkAgeVerification()
  }, [user, loading, router])

  const checkAgeVerification = async () => {
    try {
      const response = await fetch("/api/forum/verify-age")
      
      if (!response.ok) {
        // If API error, allow access but show modal
        console.error("Error checking age verification:", response.status)
        setShowAgeModal(true)
        // Allow threads to load even if there's an error
        setAgeVerified(true)
        return
      }
      
      const data = await response.json()
      
      if (!data.ageVerified) {
        setShowAgeModal(true)
        // Allow threads to load even if modal is shown (user can verify later)
        setAgeVerified(true)
      } else {
        setAgeVerified(true)
      }
    } catch (error) {
      console.error("Error checking age verification:", error)
      // If error, allow access and load threads
      setShowAgeModal(true)
      setAgeVerified(true)
    }
  }

  const handleAgeVerified = () => {
    setShowAgeModal(false)
    setAgeVerified(true)
    // fetchData will be called by the useEffect
  }

  useEffect(() => {
    if (ageVerified && user && !loading) {
      fetchData()
    }
  }, [selectedTopic, sortBy, ageVerified, user, loading])

  const containerRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    try {
      setLoadingData(true)
      
      // Fetch topics and threads in parallel
      const [topicsRes, threadsRes] = await Promise.all([
        fetch('/api/forum/topics'),
        fetch(`/api/forum/threads?sort=${sortBy}&topic=${selectedTopic}`)
      ])

      if (topicsRes.ok) {
        const topicsData = await topicsRes.json()
        setTopics(topicsData)
      }

      if (threadsRes.ok) {
        const threadsData = await threadsRes.json()
        setThreads(threadsData)
      }
    } catch (error) {
      console.error("Error fetching forum data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  // Pull-to-refresh hook - DISABLED to prevent scroll interference
  const { isPulling, pullDistance, isRefreshing, attachPullListeners, refreshThreshold } = usePullToRefresh({
    onRefresh: async () => {
      haptic.medium()
      await fetchData()
      haptic.success()
    },
    threshold: 80,
    disabled: true // Disable pull-to-refresh to allow normal scrolling
  })

  // Swipe gestures for navigation
  const { swipeDirection, attachSwipeListeners } = useSwipeGesture({
    onSwipeLeft: () => {
      // Swipe left to go to bookmarks
      haptic.light()
      router.push('/forum/bookmarks')
    },
    onSwipeRight: () => {
      // Swipe right to create new thread
      haptic.light()
      router.push('/forum/new')
    },
    threshold: 50,
    velocity: 0.3
  })

  // Attach pull-to-refresh and swipe listeners
  useEffect(() => {
    if (containerRef.current) {
      const cleanupPull = attachPullListeners(containerRef.current)
      const cleanupSwipe = attachSwipeListeners(containerRef.current)
      
      return () => {
        cleanupPull?.()
        cleanupSwipe?.()
      }
    }
  }, [attachPullListeners, attachSwipeListeners])

  // Close topic filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (topicFilterRef.current && !topicFilterRef.current.contains(event.target as Node)) {
        setShowTopicFilter(false)
      }
    }

    if (showTopicFilter) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTopicFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return '#10B981'
      case 'locked': return '#EF4444'
      default: return '#0F62FE'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resuelto'
      case 'locked': return 'Cerrado'
      default: return 'Abierto'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "hace un momento"
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)}d`
    
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return null // Quick flash instead of spinner
  }

  if (!user) return null

  return (
    <>
      <LoadingBar />
      <PullToRefreshIndicator
        isPulling={isPulling}
        pullDistance={pullDistance}
        threshold={refreshThreshold}
        isRefreshing={isRefreshing}
      />
      <>
        <style>{`
          /* Fix app-shell and app-scroll on mobile for forum */
          @media (max-width: 767px) {
            .app-shell,
            .app-scroll,
            .app-main {
              width: 100% !important;
              max-width: 100vw !important;
              left: 0 !important;
              right: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              transform: none !important;
            }
          }
          
          /* Mobile - account for footer */
          @media (max-width: 767px) {
            /* Let app-scroll handle scrolling, not forum-outer */
            .app-scroll {
              overflow-y: auto !important;
              overflow-x: hidden !important;
              -webkit-overflow-scrolling: touch !important;
              touch-action: pan-y !important;
            }
            
            .forum-outer {
              padding-bottom: 65px !important;
              flex: 1 !important;
              overflow-y: visible !important;
              overflow-x: hidden !important;
              height: auto !important;
              min-height: 100% !important;
              position: relative !important;
              width: 100% !important;
              max-width: 100vw !important;
              left: 0 !important;
              right: 0 !important;
              touch-action: pan-y !important;
              pointer-events: auto !important;
            }
            .forum-container {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow-y: visible !important;
              overflow-x: hidden !important;
              height: auto !important;
              min-height: 100% !important;
              touch-action: pan-y !important;
              pointer-events: auto !important;
            }
            .forum-container main {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: clamp(16px, 4vw, 24px) !important;
              box-sizing: border-box !important;
              left: 0 !important;
              right: 0 !important;
              transform: none !important;
            }
          }
          /* Tablet/iPad - no gap, sidebar overlays */
          @media (min-width: 768px) and (max-width: 1024px) {
            .forum-outer {
              width: 100% !important;
              max-width: 100% !important;
            }
            .forum-container {
              width: calc(100% - clamp(240px, 25vw, 320px)) !important;
              max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
              margin-right: 0 !important;
              padding: clamp(24px, 3vw, 40px) !important;
            }
          }
          /* Desktop - no gap, sidebar overlays */
          @media (min-width: 1025px) {
            .forum-outer {
              width: 100% !important;
              max-width: 100% !important;
            }
            .forum-container {
              width: calc(100% - clamp(240px, 25vw, 320px)) !important;
              max-width: calc(100% - clamp(240px, 25vw, 320px)) !important;
              margin-right: 0 !important;
              padding: clamp(24px, 4vw, 40px) !important;
            }
          }
        `}</style>
        <div className="forum-outer" data-bizen-tour="foro" style={{
          position: "relative",
          flex: 1,
          fontFamily: "'Montserrat', sans-serif",
          background: "#ffffff",
          backgroundAttachment: typeof window !== "undefined" && window.innerWidth <= 767 ? "scroll" : "fixed",
          width: "100%",
          maxWidth: "100vw",
          boxSizing: "border-box",
          overflowX: "hidden",
          overflowY: typeof window !== "undefined" && window.innerWidth <= 767 ? "visible" : "auto",
          WebkitOverflowScrolling: "touch",
          left: 0,
          right: 0,
          margin: 0,
          padding: 0,
          touchAction: "pan-y",
          pointerEvents: "auto"
        }}>
          <div 
            ref={containerRef}
            className="forum-container"
            style={{
              position: "relative",
              flex: 1,
              paddingTop: 40,
              paddingBottom: 80,
              touchAction: "pan-y", // Allow vertical scrolling, enable gestures
              overflowX: "hidden",
              overflowY: "visible", // Don't make this scrollable, let parent handle it
              boxSizing: "border-box",
              WebkitOverflowScrolling: "touch",
              width: "100%",
              maxWidth: "100%",
              left: 0,
              right: 0,
              margin: 0,
              pointerEvents: "auto"
            }}
          >
        <main style={{ 
        position: "relative",
        margin: "0", 
        padding: "clamp(16px, 4vw, 40px)",
        paddingRight: "clamp(16px, 4vw, 40px)",
        paddingLeft: "clamp(16px, 4vw, 40px)",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        zIndex: 1,
        left: 0,
        right: 0,
        transform: "none"
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: "clamp(28px, 6vw, 36px)", 
              fontWeight: 800,
              color: "#1E40AF"
            }}>
              Foro
            </h1>
            <p style={{ margin: "8px 0 0", color: "#374151", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 600 }}>
              Comparte ideas, haz preguntas y aprende de otros emprendedores
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/forum/bookmarks"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                background: "rgba(255, 255, 255, 0.8)",
                color: "#374151",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 14,
                border: "2px solid #E5E7EB",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FEF3C7"
                e.currentTarget.style.borderColor = "#F59E0B"
                e.currentTarget.style.color = "#92400E"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.color = "#374151"
              }}
            >
              ⭐ Guardados
            </Link>
            <Link
              href="/forum/following"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 18px",
                background: "rgba(255, 255, 255, 0.8)",
                color: "#374151",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 14,
                border: "2px solid #E5E7EB",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#EDE9FE"
                e.currentTarget.style.borderColor = "#8B5CF6"
                e.currentTarget.style.color = "#6D28D9"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.color = "#374151"
              }}
            >
              🔔 Siguiendo
            </Link>
            <Link
              href="/forum/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 15,
                transition: "transform 0.2s ease",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(11, 113, 254, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(11, 113, 254, 0.3)"
              }}
            >
              Crear Tema
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 16,
          marginBottom: 24,
          alignItems: "flex-start"
        }}>
          {/* Topic Filter - Desktop: show all buttons, Mobile: show filter button */}
          <div ref={topicFilterRef} className="topic-filter-container" style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            position: "relative"
          }}>
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowTopicFilter(!showTopicFilter)}
              className="mobile-topic-filter-btn"
              style={{
                display: "none", // Hidden by default, shown on mobile via CSS
                padding: "10px 18px",
                background: selectedTopic !== 'all' 
                  ? "linear-gradient(135deg, rgba(11, 113, 254, 0.9) 0%, rgba(74, 158, 255, 0.9) 100%)" 
                  : "rgba(255, 255, 255, 0.6)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                color: selectedTopic !== 'all' ? "white" : "#1E40AF",
                border: selectedTopic !== 'all' 
                  ? "1px solid rgba(255, 255, 255, 0.3)" 
                  : "2px solid rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "Montserrat, sans-serif",
                boxShadow: selectedTopic !== 'all' 
                  ? "0 4px 12px rgba(11, 113, 254, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)" 
                  : "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                alignItems: "center",
                gap: 8
              }}
            >
              <span>📋 {selectedTopic === 'all' ? 'Filtrar por Tema' : topics.find(t => t.slug === selectedTopic)?.name || 'Tema'}</span>
              <span style={{ fontSize: 12 }}>{showTopicFilter ? '▲' : '▼'}</span>
            </button>

            {/* Mobile Topic Dropdown */}
            {showTopicFilter && (
              <div className="mobile-topic-dropdown" style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 8,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: 12,
                border: "2px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                padding: 12,
                zIndex: 1000,
                minWidth: 200,
                maxWidth: "90vw",
                display: "flex",
                flexDirection: "column",
                gap: 6
              }}>
                <button
                  onClick={() => {
                    setSelectedTopic('all')
                    setShowTopicFilter(false)
                  }}
                  style={{
                    padding: "10px 16px",
                    background: selectedTopic === 'all' 
                      ? "linear-gradient(135deg, rgba(11, 113, 254, 0.9) 0%, rgba(74, 158, 255, 0.9) 100%)" 
                      : "rgba(255, 255, 255, 0.6)",
                    color: selectedTopic === 'all' ? "white" : "#1E40AF",
                    border: selectedTopic === 'all' 
                      ? "1px solid rgba(255, 255, 255, 0.3)" 
                      : "2px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    textAlign: "left"
                  }}
                >
                  Todos
                </button>
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.slug)
                      setShowTopicFilter(false)
                    }}
                    style={{
                      padding: "10px 16px",
                      background: selectedTopic === topic.slug 
                        ? "linear-gradient(135deg, rgba(11, 113, 254, 0.9) 0%, rgba(74, 158, 255, 0.9) 100%)" 
                        : "rgba(255, 255, 255, 0.6)",
                      color: selectedTopic === topic.slug ? "white" : "#1E40AF",
                      border: selectedTopic === topic.slug 
                        ? "1px solid rgba(255, 255, 255, 0.3)" 
                        : "2px solid rgba(255, 255, 255, 0.5)",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontFamily: "Montserrat, sans-serif",
                      textAlign: "left"
                    }}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Topic Buttons */}
            <div className="desktop-topic-buttons" style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center"
            }}>
              <button
                onClick={() => setSelectedTopic('all')}
                style={{
                  padding: "8px 16px",
                  background: selectedTopic === 'all' 
                    ? "linear-gradient(135deg, rgba(11, 113, 254, 0.9) 0%, rgba(74, 158, 255, 0.9) 100%)" 
                    : "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  color: selectedTopic === 'all' ? "white" : "#1E40AF",
                  border: selectedTopic === 'all' 
                    ? "1px solid rgba(255, 255, 255, 0.3)" 
                    : "2px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: selectedTopic === 'all' 
                    ? "0 4px 12px rgba(11, 113, 254, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)" 
                    : "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                }}
              >
                Todos
              </button>
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.slug)}
                  style={{
                    padding: "8px 16px",
                    background: selectedTopic === topic.slug 
                      ? "linear-gradient(135deg, rgba(11, 113, 254, 0.9) 0%, rgba(74, 158, 255, 0.9) 100%)" 
                      : "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    color: selectedTopic === topic.slug ? "white" : "#1E40AF",
                    border: selectedTopic === topic.slug 
                      ? "1px solid rgba(255, 255, 255, 0.3)" 
                      : "2px solid rgba(255, 255, 255, 0.5)",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "Montserrat, sans-serif",
                    boxShadow: selectedTopic === topic.slug 
                      ? "0 4px 12px rgba(11, 113, 254, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)" 
                      : "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
                  }}
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            style={{
              padding: "3px 8px",
              background: "rgba(255, 255, 255, 0.6)",
              border: "none",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              color: "#374151",
              lineHeight: "1.2",
              alignSelf: "flex-start"
            }}
          >
            <option value="new">Más Recientes</option>
            <option value="top">Más Votados</option>
            <option value="unanswered">Sin Responder</option>
          </select>
        </div>

        {/* Threads List */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 16,
          opacity: loadingData ? 0.6 : 1,
          transition: "opacity 0.3s ease"
        }}>
          {loadingData ? (
            // Show skeleton loaders while loading
            <>
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
              <ThreadCardSkeleton />
            </>
          ) : threads.map((thread, index) => (
            <Link
              key={thread.id}
              href={`/forum/thread/${thread.id}`}
              style={{
                padding: "clamp(16px, 4vw, 24px)",
                background: "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                borderRadius: 16,
                border: "2px solid rgba(255, 255, 255, 0.6)",
                boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                textDecoration: "none",
                transition: "all 0.3s ease",
                display: "block",
                borderLeft: thread.isPinned ? "4px solid #F59E0B" : undefined,
                animation: `fadeInUp 0.5s ease ${index * 0.05}s both`,
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(4px)"
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 98, 254, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)"
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(31, 38, 135, 0.1)"
              }}
            >
              <div style={{ display: "flex", gap: 20 }}>
                {/* Vote Score */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  minWidth: 60
                }}>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: thread.score > 0 ? "#10B981" : thread.score < 0 ? "#EF4444" : "#6B7280"
                  }}>
                    {thread.score}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                    votos
                  </div>
                </div>

                {/* Thread Content */}
                <div style={{ flex: 1 }}>
                  {/* Title and Status */}
                  <div style={{ marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <h3 style={{ 
                      margin: 0,
                      flex: 1,
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: "#1E40AF",
                      lineHeight: 1.4
                    }}>
                      {thread.title}
                    </h3>
                    <span style={{
                      padding: "4px 10px",
                      background: getStatusColor(thread.status) + "22",
                      color: getStatusColor(thread.status),
                      fontSize: 11,
                      fontWeight: 700,
                      borderRadius: 6,
                      whiteSpace: "nowrap"
                    }}>
                      {getStatusLabel(thread.status)}
                    </span>
                  </div>

                  {/* Preview */}
                  <p style={{ 
                    margin: "0 0 12px", 
                    fontSize: 14, 
                    color: "#6B7280",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    fontWeight: 500
                  }}>
                    {thread.body.substring(0, 150)}...
                  </p>

                  {/* Tags */}
                  {thread.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                      {thread.tags.map(tag => (
                        <span
                          key={tag.id}
                          style={{
                            padding: "4px 10px",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#0F62FE",
                            fontSize: 12,
                            fontWeight: 600,
                            borderRadius: 6
                          }}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div style={{ 
                    display: "flex", 
                    gap: 16, 
                    fontSize: 13, 
                    color: "#9CA3AF",
                    fontWeight: 600,
                    flexWrap: "wrap"
                  }}>
                    <span>{thread.topic.name}</span>
                    <span>por <span 
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push(`/forum/profile/${thread.author.userId}`)
                      }}
                      style={{ 
                        color: "#0F62FE", 
                        textDecoration: "none", 
                        fontWeight: 700,
                        cursor: "pointer"
                      }} 
                      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline" }} 
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}
                    >{thread.author.nickname}</span> ({thread.author.reputation} pts)
                    {thread.author.isMinor && (
                      <span style={{
                        marginLeft: 8,
                        padding: "2px 8px",
                        background: "#FEF3C7",
                        color: "#92400E",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        border: "1px solid #FCD34D"
                      }}>
                        Menor de 18
                      </span>
                    )}
                    </span>
                    <span>{formatDate(thread.createdAt)}</span>
                    <span>{thread.commentCount} respuestas</span>
                    <span>{thread.viewCount} vistas</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {!loadingData && threads.length === 0 && (
          <div style={{
            padding: "60px 24px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)"
          }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1E40AF" }}>
              No hay temas todavía
            </h3>
            <p style={{ margin: "0 0 24px", color: "#374151", fontSize: 14, fontWeight: 600 }}>
              Sé el primero en iniciar una conversación
            </p>
            <Link
              href="/forum/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
                color: "white",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 15,
                transition: "transform 0.2s ease",
                boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
              }}
            >
              Crear Primer Tema
            </Link>
          </div>
        )}
      </main>
          </div>
        </div>
      </>
    
      <style>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Hide desktop topic buttons on all devices, show filter button */
      .desktop-topic-buttons {
        display: none !important;
      }
      .mobile-topic-filter-btn {
        display: flex !important;
      }
      
      /* Mobile specific styles */
      @media (max-width: 767px) {
        .forum-outer {
              overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch !important;
          flex: 1 !important;
              min-height: 100vh !important;
              min-height: 100dvh !important;
              height: auto !important;
              background-attachment: scroll !important;
        }
        /* Ensure container allows scroll */
        .forum-container {
          position: relative !important;
          height: auto !important;
              min-height: 100% !important;
          flex: 1 !important;
              overflow-y: auto !important;
          overflow-x: hidden !important;
          margin-right: 0 !important;
          padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
          -webkit-overflow-scrolling: touch !important;
        }
        
        /* Ensure app-scroll allows scrolling */
        .app-scroll {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          -webkit-overflow-scrolling: touch !important;
        }
        
        /* Ensure app-main allows scrolling */
        .app-main {
          overflow-y: visible !important;
          overflow-x: hidden !important;
        }
        
        /* Adjust main content padding on mobile */
        main[style*="position: relative"] {
          padding: 20px 16px !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
      }
    `}</style>
    <AgeVerificationModal 
      isOpen={showAgeModal} 
      onVerified={handleAgeVerified}
    />
    </>
  )
}

export default function ForumPage() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>Cargando...</div>}>
      <ForumContent />
    </Suspense>
  )
}
