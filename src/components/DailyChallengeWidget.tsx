"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Target, Zap, Flame, Sparkles, ChevronRight, CheckCircle, Clock, Trophy, ArrowRight, Lightbulb, X, Send, Camera, Image as ImageIcon, Trash2 } from "lucide-react"
import confetti from "canvas-confetti"
import { useAuth } from "@/contexts/AuthContext"
import BizcoinIcon from "@/components/BizcoinIcon"

interface DailyChallenge {
    id: string
    title: string
    description: string
    challengeType: string
    xpReward: number
    estimatedTime: string
    isCompleted: boolean
    payload: any
    expertAdvice?: string
}

const IcoCoin = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 0 1 0 3.5H10.5a1.75 1.75 0 0 0 0 3.5H14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

export default function DailyChallengeWidget() {
    const { refreshUser, user, dbProfile } = useAuth()
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
    const [loading, setLoading] = useState(true)
    const [isExpanding, setIsExpanding] = useState(false)
    const [response, setResponse] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [completed, setCompleted] = useState(false)

    const isAdminOrTeacher = dbProfile?.role === 'school_admin' || dbProfile?.role === 'teacher';

    
    // Image Upload State
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchChallenge()
    }, [])

    const fetchChallenge = async () => {
        try {
            const res = await fetch("/api/daily-challenge/today")
            if (res.ok) {
                const data = await res.json()
                setChallenge(data)
                if (data.isCompleted) setCompleted(true)
            }
        } catch (err) {
            console.error("Reto: Error fetching:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userName', user?.email || 'Student')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            if (res.ok) {
                const data = await res.json()
                setUploadedUrl(data.url)
            } else {
                const errorData = await res.json()
                console.error("Upload failed:", errorData)
                alert(`Error al subir imagen: ${errorData.error || 'Intenta con una imagen más pequeña.'}`)
                setImagePreview(null)
            }
        } catch (err: any) {
            console.error("Upload error:", err)
            alert(`Error de conexión al subir: ${err.message}`)
            setImagePreview(null)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        setUploadedUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSubmit = async () => {
        if (!challenge || (!response.trim() && !uploadedUrl)) return
        setSubmitting(true)

        try {
            const res = await fetch("/api/evidence", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dailyChallengeId: challenge.id,
                    didToday: response,
                    attachments: uploadedUrl ? [{ type: 'image', url: uploadedUrl }] : null
                })
            })

            if (res.ok) {
                await refreshUser()
                setCompleted(true)
                setIsExpanding(false)
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#3b82f6", "#8b5cf6", "#10b981"]
                })
            } else {
                const errorData = await res.json()
                alert(`Error: ${errorData.error || 'No se pudo completar la misión.'}`)
            }
        } catch (err: any) {
            console.error("Reto: Error submitting:", err)
            alert(`No se pudo enviar la misión: ${err.message || 'Error desconocido'}`)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div style={{ height: 160, background: "#fff", borderRadius: 24, padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #f3f4f6", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
    )

    if (!challenge) return null

    return (
        <div className="dc" style={{
            background: completed 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "linear-gradient(145deg, #0d1b4b 0%, #1e0648 50%, #2d0a6b 100%)",
            borderRadius: 24, padding: "16px 20px",
            boxShadow: completed 
                ? "0 12px 32px rgba(16,185,129,0.25)"
                : "0 12px 40px rgba(109,40,217,0.3)",
            position: "relative", overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            marginBottom: 16
        }}>
            {/* Orbs */}
            {!completed && (
                <>
                    <div style={{ position: "absolute", top: "-25%", right: "-12%", width: 220, height: 220, background: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 180, height: 180, background: "radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                </>
            )}

            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanding ? 16 : 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ 
                            width: 40, height: 40, borderRadius: 12, 
                            background: completed ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.10)", 
                            border: "1px solid rgba(255,255,255,0.12)", 
                            display: "flex", alignItems: "center", justifyContent: "center" 
                        }}>
                            {completed ? <CheckCircle size={20} color="#fff" /> : <Target size={20} color="#c4b5fd" />}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                                {completed ? "Misión Cumplida" : "Misión del Día"}
                                {completed && <Sparkles size={12} color="#fff" />}
                            </div>
                            <div style={{ fontSize: 11, color: completed ? "rgba(255,255,255,0.8)" : "#a78bfa", fontWeight: 500, marginTop: 1 }}>
                                {completed ? "¡Has ganado XP y BIZCOINS!" : "Completa y gana premios"}
                            </div>
                        </div>
                    </div>
                    {isExpanding && (
                        <button onClick={() => setIsExpanding(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 4 }}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!isExpanding ? (
                        <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ margin: "16px 0" }}>
                                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>{challenge.title}</h3>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {challenge.description}
                                </p>
                            </div>

                            {!completed && (
                                <button 
                                    onClick={() => !isAdminOrTeacher && setIsExpanding(true)}
                                    disabled={isAdminOrTeacher}
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "14px 18px", background: isAdminOrTeacher ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)", 
                                        border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16,
                                        cursor: isAdminOrTeacher ? "default" : "pointer", transition: "all 0.2s"
                                    }}
                                    onMouseEnter={e => { if(!isAdminOrTeacher) e.currentTarget.style.background = "rgba(255,255,255,0.15)" }}
                                    onMouseLeave={e => { if(!isAdminOrTeacher) e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
                                >
                                    <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                                        {isAdminOrTeacher ? "Reto Activo (Solo Lectura)" : "Comenzar Misión"}
                                    </span>
                                    {isAdminOrTeacher ? <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Solo alumnos pueden publicar</div> : <ArrowRight size={18} color="#fff" />}
                                </button>
                            )}
                            
                            {completed && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ 
                                        padding: "16px", 
                                        background: "rgba(255,255,255,0.2)", 
                                        border: "1px solid rgba(255,255,255,0.3)", 
                                        borderRadius: 20,
                                        backdropFilter: "blur(4px)",
                                        textAlign: "center",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>¡Objetivo del día alcanzado!</div>
                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                                        Vuelve mañana por tu siguiente reto estratégico.
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    ) : (
                        <motion.div key="expanded" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                            <div style={{ marginBottom: 20 }}>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: "12px 0 20px" }}>
                                    {challenge.description}
                                </p>

                                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                                    <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 800 }}>Premio</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                                            <Zap size={14} color="#fbbf24" fill="#fbbf24" /> +50 XP
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 800 }}>Premio</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
                                            <BizcoinIcon size={14} /> +50 bz
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                    <label style={{ fontSize: 12, fontWeight: 800, color: "#a78bfa", textTransform: "uppercase" }}>Tu evidencia:</label>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ 
                                            display: "flex", alignItems: "center", gap: 6, 
                                            background: "rgba(255,255,255,0.1)", border: "none", 
                                            padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                                            color: "#fff", fontSize: 11, fontWeight: 700
                                        }}
                                    >
                                        <Camera size={14} /> {imagePreview ? "Cambiar Foto" : "Subir Foto"}
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        hidden 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                    />
                                </div>
                                
                                {imagePreview && (
                                    <div style={{ position: "relative", marginBottom: 16 }}>
                                        <div style={{ 
                                            width: "100%", height: 160, borderRadius: 16, overflow: "hidden", 
                                            border: "2px solid rgba(196, 181, 253, 0.4)", background: "#000"
                                        }}>
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: uploading ? 0.5 : 1 }} />
                                            {uploading && (
                                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <div style={{ width: 30, height: 30, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={removeImage}
                                            style={{ 
                                                position: "absolute", top: 8, right: 8, 
                                                background: "rgba(239, 68, 68, 0.9)", border: "none", 
                                                color: "#fff", padding: 6, borderRadius: 8, cursor: "pointer" 
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}

                                <textarea 
                                    autoFocus
                                    value={response}
                                    onChange={e => setResponse(e.target.value)}
                                    placeholder="Cuéntanos un poco sobre tu avance..."
                                    style={{
                                        width: "100%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)",
                                        borderRadius: 16, padding: "14px", color: "#fff", fontSize: 14, minHeight: 80, outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#c4b5fd"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                                />
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={submitting || uploading || (!response.trim() && !uploadedUrl)}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                    padding: "16px", background: (response.trim() || uploadedUrl) ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.1)",
                                    border: "none", borderRadius: 16, cursor: (response.trim() || uploadedUrl) ? "pointer" : "default",
                                    fontSize: 16, fontWeight: 800, color: (response.trim() || uploadedUrl) ? "#fff" : "rgba(255,255,255,0.3)",
                                    boxShadow: (response.trim() || uploadedUrl) ? "0 8px 24px rgba(59,130,246,0.3)" : "none"
                                }}
                            >
                                {submitting ? "Enviando..." : (
                                    <>
                                        ¡Misión cumplida! <Send size={18} />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
            `}</style>
        </div>
    )
}
