"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, Search, Loader2, Check, Coins, UserRound, ArrowRight, RotateCcw } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import PageLoader from "@/components/PageLoader"

export default function TransferPage() {
  const { user, dbProfile, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const targetId = searchParams.get("target")
  
  const [step, setStep] = useState<"search" | "amount" | "success">("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [concept, setConcept] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [bizcoins, setBizcoins] = useState(0)

  // Sync bizcoins from profile and handle direct target
  useEffect(() => {
    if (dbProfile) {
      setBizcoins(dbProfile.bizcoins || 0)
    }
  }, [dbProfile])

  useEffect(() => {
    if (targetId && step === "search") {
      const fetchTarget = async () => {
        try {
          const res = await fetch(`/api/forum/profile/${targetId}`)
          if (res.ok) {
            const data = await res.json()
            setSelectedUser({ userId: targetId, nickname: data.nickname, fullName: data.fullName, avatar: data.avatar })
            setStep("amount")
          }
        } catch (err) {
          console.error("Error fetching target user:", err)
        }
      }
      fetchTarget()
    }
  }, [targetId])

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const res = await fetch(`/api/wallet/search-users?query=${query}`)
      const data = await res.json()
      setSearchResults(data.users || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) handleSearch(searchQuery)
      else setSearchResults([])
    }, 450)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleTransfer = async () => {
    const amtNum = parseInt(amount)
    if (!amtNum || amtNum <= 0) {
      setError("Monto inválido")
      return
    }
    if (amtNum > bizcoins) {
      setError("Saldo insuficiente")
      return
    }

    setIsProcessing(true)
    setError("")
    try {
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetUserId: selectedUser.userId, 
          amount: amtNum, 
          concept: concept || "Transferencia" 
        })
      })
      const data = await res.json()
      if (res.ok) {
        setStep("success")
        setBizcoins(data.newBalance)
      } else {
        setError(data.error || "Error al transferir")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return <PageLoader />
  if (!user) {
    router.replace("/login")
    return null
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FBFAF5", display: "flex", flexDirection: "column", fontFamily: '"SF Pro Display", sans-serif' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .animate-spin { animation: spin 1s linear infinite; }
        .input-focus:focus { border-color: #0F62FE !important; box-shadow: 0 0 0 4px rgba(15, 98, 254, 0.1) !important; }
      `}</style>
      
      {/* Header Area */}
      <header style={{ 
        padding: "24px 40px", 
        background: "white", 
        borderBottom: "1.5px solid #e2e8f0", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button 
            onClick={() => step === "amount" ? setStep("search") : router.back()}
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 14, 
              background: "#f1f5f9", 
              border: "none", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              transition: "all 0.2s"
            }}
          >
            <ArrowLeft size={20} color="#0f172a" />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
              {step === "success" ? "Transferencia Exitosa" : "Cajero BIZEN"}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 }}>
              {step === "amount" ? `Enviando a ${selectedUser.nickname}` : "Envía Bizcoins a tus amigos instantáneamente"}
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right", background: "rgba(15, 98, 254, 0.05)", padding: "10px 20px", borderRadius: 16, border: "1px solid rgba(15, 98, 254, 0.1)" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Tu Balance</div>
          <div style={{ fontSize: 20, fontWeight: 950, color: "#0F62FE", display: "flex", alignItems: "center", gap: 6 }}>
            <Coins size={18} color="#f59e0b" />
            {bizcoins.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 700 }}>BC</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "40px 20px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
        <AnimatePresence mode="wait">
          {step === "search" && (
            <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <div style={{ position: "relative", marginBottom: 40 }}>
                  <input 
                    autoFocus
                    placeholder="Busca por nombre de usuario..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-focus"
                    style={{ 
                      width: "100%", 
                      padding: "20px 20px 20px 60px", 
                      borderRadius: 24, 
                      border: "2px solid #e2e8f0", 
                      fontSize: 18, 
                      fontWeight: 500,
                      outline: "none", 
                      transition: "all 0.3s",
                      background: "white",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                    }}
                  />
                  <Search size={28} color="#94a3b8" style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }} />
                  {isSearching && (
                    <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)" }}>
                      <Loader2 size={24} className="animate-spin" color="#0F62FE" />
                    </div>
                  )}
                </div>

                {searchQuery.length < 3 && !isSearching && (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ width: 100, height: 100, borderRadius: 32, background: "rgba(15, 98, 254, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                      <Send size={44} color="#0F62FE" style={{ transform: "rotate(-15deg)" }} />
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>¿A quién le enviaremos?</h2>
                    <p style={{ color: "#64748b", fontSize: 16, maxWidth: 320, margin: "0 auto", lineHeight: 1.6 }}>Escribe al menos 3 letras para buscar entre la comunidad BIZEN.</p>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                    {searchResults.map(u => (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={u.userId} 
                        onClick={() => { setSelectedUser(u); setStep("amount"); }} 
                        style={{ 
                          padding: 20, 
                          borderRadius: 24, 
                          background: "white", 
                          border: "2px solid #e2e8f0", 
                          cursor: "pointer", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 16,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                        }}
                      >
                        <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "3px solid #f1f5f9", flexShrink: 0 }}>
                          <AvatarDisplay avatar={u.avatar} size={64} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{u.fullName || u.nickname}</div>
                          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>@{u.nickname}</div>
                        </div>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ArrowRight size={20} color="#0F62FE" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === "amount" && (
            <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ maxWidth: 500, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
                {/* User Card */}
                <div style={{ 
                  padding: "32px", 
                  background: "linear-gradient(135deg, #0f172a, #1a365d)", 
                  borderRadius: 32, 
                  color: "white", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  textAlign: "center",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
                }}>
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
                    <AvatarDisplay avatar={selectedUser.avatar} size={100} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>{selectedUser.fullName || selectedUser.nickname}</h3>
                    <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>@{selectedUser.nickname}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <div style={{ background: "white", borderRadius: 32, padding: 40, border: "2px solid #e2e8f0", textAlign: "center" }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Monto a Transferir</label>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                    <Coins size={40} color="#f59e0b" />
                    <input 
                      type="number" 
                      autoFocus
                      placeholder="0" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ 
                        background: "transparent", 
                        border: "none", 
                        fontSize: 64, 
                        fontWeight: 950, 
                        color: "#0f172a", 
                        outline: "none", 
                        width: "180px", 
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontSize: 24, fontWeight: 900, color: "#94a3b8" }}>BC</span>
                  </div>
                  <div style={{ marginTop: 24, height: 4, background: "#f1f5f9", borderRadius: 2, width: "100%", overflow: "hidden" }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (parseInt(amount) || 0) / bizcoins * 100)}%` }}
                      style={{ height: "100%", background: parseInt(amount) > bizcoins ? "#ef4444" : "#0F62FE" }}
                    />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: parseInt(amount) > bizcoins ? "#ef4444" : "#64748b" }}>
                    {parseInt(amount) > bizcoins ? "Saldo insuficiente" : `Límite disponible: ${bizcoins.toLocaleString()} BC`}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Concepto (opcional)</label>
                    <input 
                      placeholder="¿Para qué es este envío?"
                      value={concept}
                      onChange={(e) => setConcept(e.target.value)}
                      style={{ 
                        width: "100%", 
                        padding: "20px", 
                        borderRadius: 20, 
                        border: "2px solid #e2e8f0", 
                        fontSize: 16, 
                        outline: "none",
                        background: "white"
                      }}
                    />
                  </div>

                  <button 
                    onClick={handleTransfer}
                    disabled={isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > bizcoins}
                    style={{ 
                      width: "100%", 
                      padding: "24px", 
                      borderRadius: 24, 
                      background: "linear-gradient(135deg, #0f172a, #0F62FE)", 
                      color: "white", 
                      border: "none", 
                      fontSize: 18, 
                      fontWeight: 900, 
                      cursor: "pointer",
                      boxShadow: "0 15px 35px rgba(15, 98, 254, 0.3)",
                      transition: "all 0.3s",
                      opacity: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > bizcoins) ? 0.5 : 1
                    }}
                  >
                    {isProcessing ? "Procesando envío..." : "Confirmar Envío Seguro"}
                  </button>
                  {error && <div style={{ textAlign: "center", color: "#ef4444", fontWeight: 700, fontSize: 14 }}>{error}</div>}
                </div>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)" }}>
                  <Check size={60} color="#10b981" />
                </div>
                <h2 style={{ fontSize: 36, fontWeight: 950, color: "#0f172a", marginBottom: 12 }}>¡Transferido!</h2>
                <p style={{ fontSize: 18, color: "#64748b", lineHeight: 1.6, marginBottom: 40 }}>
                  Has enviado <strong style={{ color: "#0F62FE" }}>{amount} BC</strong> a <strong style={{ color: "#0f172a" }}>{selectedUser.fullName || selectedUser.nickname}</strong> de forma exitosa.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <button 
                    onClick={() => router.push("/dashboard")}
                    style={{ 
                      width: "100%", 
                      padding: "20px", 
                      borderRadius: 20, 
                      background: "#0f172a", 
                      color: "white", 
                      border: "none", 
                      fontSize: 16, 
                      fontWeight: 800, 
                      cursor: "pointer"
                    }}
                  >
                    Volver al Dashboard
                  </button>
                  <button 
                    onClick={() => { setStep("search"); setAmount(""); setConcept(""); setSelectedUser(null); setSearchQuery(""); }}
                    style={{ 
                      width: "100%", 
                      padding: "20px", 
                      borderRadius: 20, 
                      background: "white", 
                      color: "#0f172a", 
                      border: "2px solid #e2e8f0", 
                      fontSize: 16, 
                      fontWeight: 700, 
                      cursor: "pointer"
                    }}
                  >
                    Hacer otro envío
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Security Note */}
      <footer style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Check size={14} /> Sistema transaccional protegido por BIZEN Secure Ledger
      </footer>
    </div>
  )
}
