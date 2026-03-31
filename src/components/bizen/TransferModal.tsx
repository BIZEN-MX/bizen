"use client"

import React, { useState, useEffect } from "react"
import { X, Search, Loader2, Check, Send, Coins, UserRound, ArrowRight, RotateCcw } from "lucide-react"
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
    <div className="transfer-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="transfer-modal-container"
      >
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to right, #f8fafc, #ffffff)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: step === "success" ? "rgba(16,185,129,0.1)" : "rgba(15,98,254,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
               {step === "success" ? <Check size={20} color="#10B981" /> : <Send size={20} color="#0F62FE" style={{ transform: "rotate(-15deg)", marginLeft: 2 }} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
                {step === "success" ? "Transferencia Exitosa" : initialTarget ? "Enviar Regalo" : "Nueva Transferencia"}
              </h3>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>Saldo: <strong style={{ color: "#0F62FE" }}>{currentBalance} BC</strong></div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", color: "#64748b", cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => {e.currentTarget.style.background="#e2e8f0"; e.currentTarget.style.color="#0f172a"}} onMouseLeave={e => {e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.color="#64748b"}}><X size={18} /></button>
        </div>

        <div style={{ padding: "0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          <AnimatePresence mode="wait">
            {step === "search" && (
              <motion.div key="search" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                {/* Search Bar Container */}
                <div style={{ padding: "24px", background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9" }}>
                  <label style={{ display: "block", fontSize: 13, color: "#475569", fontWeight: 700, marginBottom: 10 }}>¿A quién le enviaremos Bizcoins?</label>
                  <div style={{ position: "relative", maxWidth: 600 }}>
                    <input 
                      autoFocus 
                      placeholder="Busca por nombre..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      style={{ width: "100%", padding: "16px 16px 16px 48px", borderRadius: 16, border: "2px solid #e2e8f0", fontSize: 15, outline: "none", transition: "all 0.2s", background: "#ffffff", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}
                    />
                    <Search size={20} color="#94a3b8" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                    <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
                      {isSearching ? <Loader2 size={20} className="animate-spin text-blue-500" /> : <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>{searchQuery.length >= 3 ? "Buscando..." : ""}</div>}
                    </div>
                  </div>
                </div>

                {/* Results Container */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                  {isSearching ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, gap: 16 }}>
                      <Loader2 size={32} className="animate-spin" color="#0F62FE" />
                      <span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>Consultando red BIZEN...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="search-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                      <div style={{ gridColumn: "1 / -1", fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Cuentas encontradas</div>
                      {searchResults.map(u => (
                        <div key={u.userId} onClick={() => { setSelectedUser(u); setStep("amount"); }} style={{ padding: 14, borderRadius: 20, border: "2px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.25s ease", background: "white" }}>
                          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", flexShrink: 0 }}>
                            <AvatarDisplay avatar={u.avatar} size={52} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.fullName || u.nickname}</div>
                            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginTop: 1 }}>@{u.nickname}</div>
                          </div>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <ArrowRight size={16} color="#0F62FE" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.length >= 3 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, gap: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={28} color="#ef4444" /></div>
                      <div style={{ textAlign: "center" }}>
                        <h4 style={{ margin: 0, fontSize: 17, color: "#0f172a", fontWeight: 800 }}>No hay resultados</h4>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, gap: 16 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(15,98,254,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}><UserRound size={32} color="#0F62FE" /></div>
                      <div style={{ textAlign: "center", maxWidth: 260 }}>
                        <h4 style={{ margin: 0, fontSize: 17, color: "#0f172a", fontWeight: 800 }}>Enviar Bizcoins</h4>
                        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b", fontWeight: 500, lineHeight: 1.4 }}>Busca a tus amigos por nombre de usuario para transferir saldo.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === "amount" && (
              <motion.div key="amount" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} 
                style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "24px" }}
              >
                <div style={{ maxWidth: 500, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
                   {/* Target User Info Header */}
                   <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: "linear-gradient(135deg, #0f172a, #1e3a8a)", borderRadius: 24, color: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
                     <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>
                       <AvatarDisplay avatar={selectedUser.avatar} size={60} />
                     </div>
                     <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 2 }}>Enviar a</div>
                       <div style={{ fontSize: 18, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedUser.fullName || selectedUser.nickname}</div>
                       <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>@{selectedUser.nickname}</div>
                     </div>
                     {!initialTarget && (
                       <button onClick={() => setStep("search")} style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><RotateCcw size={16} /></button>
                     )}
                   </div>

                   <div style={{ textAlign: "center", background: "#f8fafc", padding: "24px", borderRadius: 24, border: "1.5px solid #e2e8f0" }}>
                     <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#64748b", marginBottom: 12 }}>MONTO A ENVIAR</label>
                     <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                        <Coins size={28} color={parseInt(amount) > currentBalance ? "#e11d48" : "#0F62FE"} />
                        <input type="number" autoFocus placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} 
                          style={{ background: "transparent", border: "none", fontSize: 44, fontWeight: 900, color: "#0f172a", outline: "none", width: "120px", textAlign: "center" }} 
                        />
                        <span style={{ fontSize: 18, fontWeight: 900, color: "#94a3b8" }}>BC</span>
                     </div>
                     <div style={{ marginTop: 12, height: 2, background: parseInt(amount) > currentBalance ? "#e11d48" : "#e2e8f0", width: "80%", margin: "12px auto" }} />
                     <div style={{ fontSize: 13, fontWeight: 700, color: parseInt(amount) > currentBalance ? "#e11d48" : "#64748b" }}>
                        {parseInt(amount) > currentBalance ? "Saldo insuficiente" : `Disponible: ${currentBalance} BC`}
                     </div>
                   </div>

                   <div>
                     <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#475569", marginBottom: 8 }}>Nota (Opcional)</label>
                     <input placeholder="Añade un mensaje..." value={concept} onChange={(e) => setConcept(e.target.value)} 
                        style={{ width: "100%", padding: "16px 20px", borderRadius: 16, border: "2px solid #e2e8f0", fontSize: 15, outline: "none" }} />
                   </div>

                   <button 
                     onClick={handleTransfer}
                     disabled={isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance}
                     style={{ width: "100%", padding: "18px", borderRadius: 18, background: "linear-gradient(135deg, #0f172a 0%, #0F62FE 100%)", color: "white", border: "none", fontSize: 17, fontWeight: 800, cursor: isProcessing ? "default" : "pointer", opacity: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? 0.5 : 1, transition: "all 0.3s ease", boxShadow: "0 10px 25px rgba(15,98,254,0.3)" }}
                   >
                     {isProcessing ? "Procesando..." : "Confirmar Transferencia"}
                   </button>
                    {error && <div style={{ textAlign: "center", color: "#e11d48", fontSize: 13, fontWeight: 700 }}>{error}</div>}
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", textAlign: "center" }}>
                 <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 10px 25px rgba(16,185,129,0.2)" }}>
                   <Check size={48} color="#059669" />
                 </div>
                 <h2 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 900, color: "#0f172a" }}>¡Listo!</h2>
                 <p style={{ margin: "0 0 32px", fontSize: 16, color: "#64748b", lineHeight: 1.5 }}>
                   Has enviado <strong style={{color: "#0F62FE"}}>{amount} BC</strong> a <strong style={{color: "#0f172a"}}>{selectedUser.fullName || selectedUser.nickname}</strong> exitosamente.
                 </p>
                 <button onClick={onClose} style={{ width: "100%", maxWidth: 260, padding: "16px", borderRadius: 16, background: "#0f172a", color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Volver al Inicio</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <style>{`
        .transfer-modal-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(12px); 
          display: flex; alignItems: center; justifyContent: center; zIndex: 10000; padding: 20px;
        }
        .transfer-modal-container {
          background: white; width: 100%; maxWidth: 900px; minHeight: 600px; maxHeight: 90vh;
          display: flex; flexDirection: column; borderRadius: 32px; overflow: hidden;
          boxShadow: 0 25px 70px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05);
        }
        @media (max-width: 640px) {
          .transfer-modal-overlay { padding: 0 !important; }
          .transfer-modal-container { 
            maxWidth: 100% !important; minHeight: 100dvh !important; maxHeight: 100dvh !important; 
            borderRadius: 0 !important; 
          }
          .search-grid { grid-template-columns: 1fr !important; }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
