"use client"

import React, { useState } from "react"
import { X, Search, Loader2, Check, Send, Coins, UserRound, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  const handleSearch = async () => {
    if (searchQuery.length < 3) return
    setIsSearching(true)
    try {
      const res = await fetch(`/api/wallet/search-users?query=${searchQuery}`)
      const data = await res.json()
      setSearchResults(data.users || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsSearching(false)
    }
  }

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
        style={{ background: "white", width: "100%", maxWidth: 440, borderRadius: 28, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}
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

        <div style={{ padding: 24, position: "relative" }}>
          <AnimatePresence mode="wait">
            {step === "search" && (
              <motion.div key="search" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "#475569", fontWeight: 700, marginBottom: 8 }}>¿A quién le enviaremos Bizcoins?</label>
                  <div style={{ position: "relative" }}>
                    <input 
                      autoFocus 
                      placeholder="Buscar por nombre o @usuario..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()} 
                      style={{ width: "100%", padding: "16px 16px 16px 46px", borderRadius: 16, border: "2px solid #e2e8f0", fontSize: 15, outline: "none", transition: "border-color 0.2s", background: "#f8fafc" }}
                      onFocus={e => e.currentTarget.style.borderColor = "#0F62FE"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    />
                    <Search size={20} color="#94a3b8" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                    <button onClick={handleSearch} disabled={searchQuery.length < 3} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: "8px 12px", background: searchQuery.length >= 3 ? "#0F62FE" : "#cbd5e1", color: "white", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: searchQuery.length >= 3 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>Buscar</button>
                  </div>
                </div>

                <div style={{ minHeight: 150 }}>
                  {isSearching ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 150, gap: 12 }}>
                      <Loader2 size={28} className="animate-spin" color="#0F62FE" />
                      <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Buscando a {searchQuery}...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Resultados</div>
                      {searchResults.map(u => (
                        <div key={u.userId} onClick={() => { setSelectedUser(u); setStep("amount"); }} style={{ padding: 12, borderRadius: 16, border: "1.5px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.borderColor = "#bfdbfe"}} onMouseLeave={e => {e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#f1f5f9"}}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e2e8f0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {u.avatar ? <img src={u.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <UserRound size={20} color="#94a3b8" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{u.fullName || "Sin nombre"}</div>
                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginTop: 2 }}>@{u.nickname}</div>
                          </div>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ArrowRight size={16} color="#0F62FE" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length >= 3 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 150, gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}><Search size={24} color="#94a3b8" /></div>
                      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>No encontramos a "@{searchQuery}".</span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 150, gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}><UserRound size={24} color="#e2e8f0" /></div>
                      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Busca a tus amigos para enviarles regalos.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === "amount" && (
              <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Target User Info Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", borderRadius: 16, border: "1px solid #e2e8f0" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0F62FE", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 800, overflow: "hidden" }}>
                    {selectedUser.avatar ? <img src={selectedUser.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (selectedUser.fullName || selectedUser.nickname)?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Enviando a</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{selectedUser.fullName || selectedUser.nickname}</div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>@{selectedUser.nickname}</div>
                  </div>
                  {!initialTarget && (
                    <button onClick={() => setStep("search")} style={{ padding: "8px 12px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10, color: "#475569", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.borderColor="#0F62FE"; e.currentTarget.style.color="#0F62FE"}} onMouseLeave={e => {e.currentTarget.style.borderColor="#e2e8f0"; e.currentTarget.style.color="#475569"}}>Cambiar</button>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 10 }}>Monto a enviar</label>
                  <div style={{ position: "relative" }}>
                     <input type="number" autoFocus placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "20px 80px 20px 24px", borderRadius: 16, border: `2px solid ${parseInt(amount) > currentBalance ? "#e11d48" : "#0F62FE"}`, fontSize: 32, fontWeight: 900, color: "#0f172a", outline: "none", background: "#f8fafc", transition: "border-color 0.2s" }} />
                     <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 6, opacity: 0.8 }}>
                       <Coins size={20} color="#0F62FE" />
                       <span style={{ fontSize: 15, fontWeight: 800, color: "#0F62FE" }}>BC</span>
                     </div>
                  </div>
                  {parseInt(amount) > currentBalance && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#e11d48", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      ⚠️ No tienes suficientes Bizcoins.
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 10 }}>Añade un mensaje (Opcional)</label>
                  <input placeholder="Ej: Pago de apuesta, Regalo de cumple..." value={concept} onChange={(e) => setConcept(e.target.value)} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "2px solid #e2e8f0", fontSize: 14, outline: "none", transition: "border-color 0.2s", background: "#f8fafc" }} onFocus={e => e.currentTarget.style.borderColor = "#cbd5e1"} onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"} />
                </div>

                {error && <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1.5px solid #fecdd3", borderRadius: 12, color: "#be123c", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>⚠️ {error}</div>}

                <button 
                  onClick={handleTransfer}
                  disabled={isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance}
                  style={{ width: "100%", padding: "18px", borderRadius: 16, background: "linear-gradient(135deg, #0b1e5e 0%, #0F62FE 100%)", color: "white", border: "none", fontSize: 16, fontWeight: 800, cursor: isProcessing ? "default" : "pointer", opacity: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? 0.5 : 1, transition: "all 0.2s", transform: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? "scale(1)" : "scale(1.02)", boxShadow: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? "none" : "0 10px 25px rgba(15,98,254,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Procesando...</> : <><Send size={18} /> Confirmar Envío de {amount || 0} BC</>}
                </button>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "10px 0 20px" }}>
                 <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 10px 30px rgba(16,185,129,0.2)" }}>
                   <Check size={44} color="#059669" />
                 </div>
                 <h2 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>¡Transferencia Exitosa!</h2>
                 <p style={{ margin: "0 0 32px", fontSize: 15, color: "#64748b", lineHeight: 1.6, padding: "0 20px" }}>Has enviado <strong style={{color: "#1d4ed8", fontSize: 18}}>{amount} BC</strong> a <strong style={{color: "#0f172a"}}>{selectedUser.fullName || selectedUser.nickname}</strong>. Los fondos ya están en su cuenta.</p>
                 <button onClick={onClose} style={{ width: "100%", padding: "16px", borderRadius: 16, background: "#0f172a", color: "white", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}>Volver</button>
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
