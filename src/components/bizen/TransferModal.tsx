"use client"

import React, { useState, useEffect } from "react"
import { X, Search, Loader2, Check, Send, Coins, UserRound, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AvatarDisplay } from "../AvatarDisplay"

interface TransferModalProps {
  onClose: () => void
  currentBalance: number
  targetUser?: {
    userId: string
    nickname: string
    fullName?: string
    avatar?: any
  }
  onTransferSuccess: (newBalance: number) => void
}

export default function TransferModal({
  onClose,
  currentBalance,
  targetUser: initialTarget,
  onTransferSuccess
}: TransferModalProps) {
  const [step, setStep] = useState<"search" | "amount" | "success">(initialTarget ? "amount" : "search")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(initialTarget || null)
  const [amount, setAmount] = useState("")
  const [concept, setConcept] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

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

  // Debounced effect for live search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        handleSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 450)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Hide sidebar logic
  useEffect(() => {
    document.body.classList.add('hide-sidebar')
    return () => {
      document.body.classList.remove('hide-sidebar')
    }
  }, [])

  const handleTransfer = async () => {
    const amtNum = parseInt(amount)
    if (!amtNum || amtNum <= 0) {
      setError("Monto inválido")
      return
    }
    if (amtNum > currentBalance) {
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
          concept: concept || (initialTarget ? "Regalo" : "Transferencia") 
        })
      })
      const data = await res.json()
      if (res.ok) {
        setStep("success")
        onTransferSuccess(data.newBalance)
      } else {
        setError(data.error || "Error al transferir")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: 20 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{ 
          background: "white", 
          width: "100%", 
          maxWidth: 900, 
          minHeight: 600,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 32, 
          overflow: "hidden", 
          boxShadow: "0 25px 70px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05)" 
        }}
      >
        {/* Header */}
        <div style={{ padding: "24px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to right, #f8fafc, #ffffff)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: step === "success" ? "rgba(16,185,129,0.1)" : "rgba(15,98,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               {step === "success" ? <Check size={20} color="#10B981" /> : <Send size={20} color="#0F62FE" style={{ transform: "rotate(-15deg)", marginLeft: 2 }} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
                {step === "success" ? "Transferencia Exitosa" : initialTarget ? "Enviar Regalo" : "Nueva Transferencia"}
              </h3>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>Saldo disponible: <strong style={{ color: "#0F62FE" }}>{currentBalance} BC</strong></div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", color: "#64748b", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background="#e2e8f0"; e.currentTarget.style.color="#0f172a"}} onMouseLeave={e => {e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#64748b"}}><X size={18} /></button>
        </div>

        <div style={{ padding: "0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait">
            {step === "search" && (
              <motion.div key="search" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                {/* Search Bar Container */}
                <div style={{ padding: "32px 40px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9" }}>
                  <label style={{ display: "block", fontSize: 14, color: "#475569", fontWeight: 700, marginBottom: 12 }}>¿A quién le enviaremos Bizcoins?</label>
                  <div style={{ position: "relative", maxWidth: 600 }}>
                    <input 
                      autoFocus 
                      placeholder="Busca por nombre o @usuario..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      style={{ width: "100%", padding: "20px 20px 20px 56px", borderRadius: 20, border: "2.5px solid #e2e8f0", fontSize: 16, outline: "none", transition: "all 0.2s", background: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
                      onFocus={e => e.currentTarget.style.borderColor = "#0F62FE"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    />
                    <Search size={24} color="#94a3b8" style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }} />
                    <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)" }}>
                      {isSearching ? <Loader2 size={24} className="animate-spin text-blue-500" /> : <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>{searchQuery.length >= 3 ? "Buscando..." : "Mín. 3 letras"}</div>}
                    </div>
                  </div>
                </div>

                {/* Results Container */}
                <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
                  {isSearching ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300, gap: 16 }}>
                      <Loader2 size={40} className="animate-spin" color="#0F62FE" />
                      <span style={{ fontSize: 15, color: "#64748b", fontWeight: 600 }}>Consultando red BIZEN...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
                      <div style={{ gridColumn: "1 / -1", fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Cuentas encontradas ({searchResults.length})</div>
                      {searchResults.map(u => (
                        <div key={u.userId} onClick={() => { setSelectedUser(u); setStep("amount"); }} style={{ padding: 20, borderRadius: 24, border: "2px solid #f1f5f9", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", background: "white" }} onMouseEnter={e => {e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#0F62FE"; e.currentTarget.style.boxShadow = "0 12px 20px rgba(15,98,254,0.1)"}} onMouseLeave={e => {e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"}}>
                          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                            <AvatarDisplay avatar={u.avatar} size={60} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.fullName || u.nickname}</div>
                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginTop: 2 }}>@{u.nickname}</div>
                          </div>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ArrowRight size={18} color="#0F62FE" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length >= 3 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300, gap: 16 }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={32} color="#ef4444" /></div>
                      <div style={{ textAlign: "center" }}>
                        <h4 style={{ margin: 0, fontSize: 18, color: "#0f172a", fontWeight: 800 }}>No hay resultados</h4>
                        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#64748b", fontWeight: 500 }}>No encontramos a "@{searchQuery}". Verifica el nombre e intenta de nuevo.</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 300, gap: 20 }}>
                      <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(15,98,254,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}><UserRound size={40} color="#0F62FE" /></div>
                      <div style={{ textAlign: "center", maxWidth: 300 }}>
                        <h4 style={{ margin: 0, fontSize: 18, color: "#0f172a", fontWeight: 800 }}>Transferir a Amigos</h4>
                        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#64748b", fontWeight: 500, lineHeight: 1.5 }}>Busca por nombre o nombre de usuario para enviar Bizcoins al instante.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === "amount" && (
              <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px" }}>
                <div style={{ maxWidth: 600, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
                   {/* Target User Info Header */}
                   <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px", background: "linear-gradient(135deg, #1e1b4b, #0f172a)", borderRadius: 28, border: "1px solid rgba(255,255,255,0.1)", color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
                     <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" }}>
                       {selectedUser.avatar ? <img src={selectedUser.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (selectedUser.fullName || selectedUser.nickname)?.[0]}
                     </div>
                     <div style={{ flex: 1 }}>
                       <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Destinatario</div>
                       <div style={{ fontSize: 20, fontWeight: 800 }}>{selectedUser.fullName || selectedUser.nickname}</div>
                       <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>@{selectedUser.nickname}</div>
                     </div>
                     {!initialTarget && (
                       <button onClick={() => setStep("search")} style={{ padding: "10px 18px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.2)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>Cambiar</button>
                     )}
                   </div>

                   <div style={{ textAlign: "center" }}>
                     <label style={{ display: "block", fontSize: 15, fontWeight: 800, color: "#475569", marginBottom: 16 }}>¿Cuánto deseas enviar?</label>
                     <div style={{ position: "relative" }}>
                        <input type="number" autoFocus placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "28px 24px", textAlign: "center", borderRadius: 24, border: `3px solid ${parseInt(amount) > currentBalance ? "#e11d48" : "#0F62FE"}`, fontSize: 48, fontWeight: 900, color: "#0f172a", outline: "none", background: "#f8fafc", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: parseInt(amount) > 0 ? `0 10px 40px ${parseInt(amount) > currentBalance ? "rgba(225,29,72,0.1)" : "rgba(15,98,254,0.1)"}` : "none" }} />
                        <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <Coins size={22} color={parseInt(amount) > currentBalance ? "#e11d48" : "#0F62FE"} />
                          <span style={{ fontSize: 18, fontWeight: 900, color: parseInt(amount) > currentBalance ? "#e11d48" : "#0F62FE" }}>BIZCOINS</span>
                        </div>
                     </div>
                     {parseInt(amount) > currentBalance && (
                       <div style={{ marginTop: 16, fontSize: 14, color: "#e11d48", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff1f2", padding: "12px", borderRadius: 12 }}>
                         ⚠️ Excedes tu saldo disponible ({currentBalance} BC)
                       </div>
                     )}
                   </div>

                   <div>
                     <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#475569", marginBottom: 10 }}>Concepto de transferencia</label>
                     <input placeholder="Ej: Regalo por ayudarme con el examen..." value={concept} onChange={(e) => setConcept(e.target.value)} style={{ width: "100%", padding: "18px 24px", borderRadius: 18, border: "2.5px solid #e2e8f0", fontSize: 16, outline: "none", transition: "all 0.2s", background: "#ffffff" }} onFocus={e => e.currentTarget.style.borderColor = "#cbd5e1"} onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
                   </div>

                   {error && <div style={{ padding: "16px", background: "#fef2f2", border: "2px solid #fecdd3", borderRadius: 16, color: "#be123c", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>⚠️ {error}</div>}

                   <button 
                     onClick={handleTransfer}
                     disabled={isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance}
                     style={{ width: "100%", padding: "22px", borderRadius: 20, background: "linear-gradient(135deg, #1e1b4b 0%, #0F62FE 100%)", color: "white", border: "none", fontSize: 18, fontWeight: 900, cursor: isProcessing ? "default" : "pointer", opacity: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? 0.5 : 1, transition: "all 0.3s ease", transform: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? "scale(1)" : "scale(1.02)", boxShadow: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? "none" : "0 15px 35px rgba(15,98,254,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 8 }}
                   >
                     {isProcessing ? <><Loader2 size={22} className="animate-spin" /> Procesando Transferencia...</> : <><Send size={22} /> Confirmar Envío Directo</>}
                   </button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", textAlign: "center" }}>
                 <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, boxShadow: "0 20px 40px rgba(16,185,129,0.2)", border: "4px solid white" }}>
                   <Check size={60} color="#059669" />
                 </div>
                 <h2 style={{ margin: "0 0 16px", fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.04em" }}>¡Operación Realizada!</h2>
                 <p style={{ margin: "0 0 40px", fontSize: 18, color: "#64748b", lineHeight: 1.6, maxWidth: 500 }}>
                   Has transferido satisfactoriamente <strong style={{color: "#1d4ed8", fontSize: 24}}>{amount} BC</strong> a la cuenta de <strong style={{color: "#0f172a"}}>{selectedUser.fullName || selectedUser.nickname}</strong>.
                 </p>
                 <button onClick={onClose} style={{ width: "100%", maxWidth: 300, padding: "20px", borderRadius: 20, background: "#0f172a", color: "white", border: "none", fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>Cerrar Ventanilla</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
