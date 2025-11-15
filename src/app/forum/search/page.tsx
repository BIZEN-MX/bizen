"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface SearchResult {
  id: string
  title: string
  body: string
  score: number
  commentCount: number
  status: string
  createdAt: string
  author: {
    nickname: string
    reputation: number
  }
  topic: {
    name: string
    slug: string
    icon: string
  }
  tags: Array<{
    name: string
    slug: string
  }>
}

function ForumSearchContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get("q") || ""

  const [results, setResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState(query)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const bodyEl = document.body
    if (bodyEl) {
      bodyEl.style.background = "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      bodyEl.style.backgroundAttachment = "fixed"
    }
    return () => {
      bodyEl.style.background = "#fff"
      bodyEl.style.backgroundAttachment = "scroll"
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (query) {
      performSearch(query)
    }
  }, [user, loading, router, query])

  const performSearch = async (searchTerm: string) => {
    try {
      setLoadingData(true)
      const response = await fetch(`/api/forum/search?q=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
      }
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/forum/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  if (loading || loadingData) {
    return (
      <div style={{ 
        display: "grid", 
        placeItems: "center", 
        minHeight: "60vh", 
        fontFamily: "Montserrat, sans-serif",
        background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 48,
            height: 48,
            border: "4px solid #0F62FE22",
            borderTop: "4px solid #0F62FE",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ color: "#666", fontSize: 16 }}>Buscando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{
      position: "relative",
      minHeight: "100vh",
      paddingTop: 40,
      paddingBottom: 80,
      fontFamily: "Montserrat, sans-serif",
      backgroundImage: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      <main style={{ 
        position: "relative",
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "clamp(20px, 4vw, 40px)",
        zIndex: 1
      }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Link href="/forum" style={{ color: "#0F62FE", textDecoration: "none" }}>
            Foro
          </Link>
          <span style={{ color: "#9CA3AF" }}>→</span>
          <span style={{ color: "#374151" }}>Búsqueda</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex",
            gap: 12,
            background: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            borderRadius: 16,
            border: "2px solid rgba(255, 255, 255, 0.6)",
            padding: 8,
            boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)"
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar temas..."
              style={{
                flex: 1,
                padding: "12px 16px",
                fontSize: 15,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                border: "none",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.6)",
                color: "#374151",
                outline: "none"
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              style={{
                padding: "12px 24px",
                background: searchQuery.trim() ? "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)" : "#9CA3AF",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: searchQuery.trim() ? "pointer" : "not-allowed",
                boxShadow: searchQuery.trim() ? "0 4px 12px rgba(11, 113, 254, 0.3)" : "none",
                fontFamily: "Montserrat, sans-serif"
              }}
            >
              Buscar
            </button>
          </div>
        </form>

        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800, color: "#1E40AF" }}>
          Resultados de búsqueda
        </h1>
        <p style={{ margin: "0 0 24px", color: "#374151", fontSize: 15, fontWeight: 600 }}>
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para "{query}"
        </p>

        {/* Results */}
        {results.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {results.map(thread => (
              <Link
                key={thread.id}
                href={`/forum/thread/${thread.id}`}
                style={{
                  padding: 24,
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 16,
                  border: "2px solid rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 4px 16px rgba(31, 38, 135, 0.1)",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  display: "block"
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
                <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E40AF" }}>
                  {thread.title}
                </h3>
                <p style={{ margin: "0 0 12px", fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>
                  {thread.body.substring(0, 200)}...
                </p>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9CA3AF", fontWeight: 600, flexWrap: "wrap" }}>
                  <span>{thread.topic.name}</span>
                  <span>por {thread.author.nickname}</span>
                  <span>{thread.score} votos</span>
                  <span>{thread.commentCount} respuestas</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
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
              No se encontraron resultados
            </h3>
            <p style={{ margin: "0 0 24px", color: "#374151", fontSize: 14, fontWeight: 600 }}>
              Intenta con otras palabras clave
            </p>
            <Link href="/forum" style={{
              display: "inline-flex",
              padding: "14px 24px",
              background: "linear-gradient(135deg, #0B71FE 0%, #4A9EFF 100%)",
              color: "white",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
              boxShadow: "0 4px 12px rgba(11, 113, 254, 0.3)",
            }}>
              Volver al Foro
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ForumSearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)" }}>Buscando...</div>}>
      <ForumSearchContent />
    </Suspense>
  )
}

