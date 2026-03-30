"use client"

import React, { useState } from "react"
import { X, Search, Loader2, Check } from "lucide-react"

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
      <div className="fade-up" style={{ background: "white", width: "100%", maxWidth: 400, borderRadius: 24, overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1.5px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a" }}>
            {step === "success" ? "Transferencia Exitosa" : initialTarget ? `Regalar a ${selectedUser.nickname || selectedUser.fullName}` : "Nueva Transferencia"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={20} /></button>
        </div>

        <div style={{ padding: 24 }}>
          {step === "search" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Busca a un compañero:</div>
              <div style={{ position: "relative" }}>
                <input 
                  autoFocus 
                  placeholder="Ej: Diego, Juan..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()} 
                  style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none" }} 
                />
                <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              </div>
              {isSearching ? (
                <div style={{ textAlign: "center", padding: 20 }}><Loader2 size={24} className="animate-spin" color="#0F62FE" style={{ margin: "0 auto" }} /></div>
              ) : searchResults.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {searchResults.map(u => (
                    <div key={u.userId} onClick={() => { setSelectedUser(u); setStep("amount"); }} style={{ padding: 12, borderRadius: 12, border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", overflow: "hidden" }}>
                        {u.avatar && <img src={u.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </div>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{u.fullName || u.nickname}</div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 3 && (
                <div style={{ textAlign: "center", padding: 20, fontSize: 12, color: "#94a3b8" }}>No se encontraron usuarios.</div>
              )}
            </div>
          )}

          {step === "amount" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#f8fafc", borderRadius: 16, border: "1px solid #f1f5f9" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0F62FE", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 800 }}>
                  {(selectedUser.fullName || selectedUser.nickname)?.[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Destinatario</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{selectedUser.fullName || selectedUser.nickname}</div>
                </div>
                {!initialTarget && <button onClick={() => setStep("search")} style={{ background: "none", border: "none", color: "#0F62FE", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Cambiar</button>}
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Monto a enviar</label>
                <div style={{ position: "relative" }}>
                   <input type="number" autoFocus placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "16px 60px 16px 20px", borderRadius: 16, border: "2px solid #0F62FE", fontSize: 24, fontWeight: 800, color: "#0f172a", outline: "none" }} />
                   <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 800, color: "#0F62FE" }}>BIZCOINS</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: parseInt(amount) > currentBalance ? "#e11d48" : "#64748b", fontWeight: 600 }}>Tu saldo: {currentBalance} BC</div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Concepto (Opcional)</label>
                <input placeholder="Ej: Regalo, pago..." value={concept} onChange={(e) => setConcept(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none" }} />
              </div>

              {error && <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: 10, color: "#b91c1c", fontSize: 12, fontWeight: 600 }}>{error}</div>}

              <button 
                onClick={handleTransfer}
                disabled={isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance}
                style={{ width: "100%", padding: "16px", borderRadius: 16, background: "#0F62FE", color: "white", border: "none", fontSize: 15, fontWeight: 800, cursor: isProcessing ? "default" : "pointer", opacity: (isProcessing || !amount || parseInt(amount) <= 0 || parseInt(amount) > currentBalance) ? 0.6 : 1, transition: "all 0.2s" }}
              >
                {isProcessing ? "Procesando..." : "Confirmar Envío"}
              </button>
            </div>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
               <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Check size={40} color="#10B981" /></div>
               <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900, color: "#0f172a" }}>¡Enviado!</h2>
               <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>Has enviado con éxito <strong style={{color: "#0f172a"}}>{amount} Bizcoins</strong> a <strong style={{color: "#0f172a"}}>{selectedUser.fullName || selectedUser.nickname}</strong>.</p>
               <button onClick={onClose} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "#0f172a", color: "white", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Listo</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
