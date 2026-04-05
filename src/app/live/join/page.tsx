"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft } from "lucide-react"
import { IconBolt, IconGamepad } from "@/components/live/LiveIcons"
import { AVATARS, AvatarSvg } from "@/components/live/LiveAvatars"

// Floating particle component
function Particle({ x, y, size, delay, duration, color }: { x: string; y: string; size: number; delay: number; duration: number; color: string }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(1px)",
        pointerEvents: "none",
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.4, 1, 0.4],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

const PARTICLES = [
  { x: "10%", y: "20%", size: 6, delay: 0, duration: 3.5, color: "rgba(251,191,36,0.7)" },
  { x: "85%", y: "15%", size: 4, delay: 0.7, duration: 4.2, color: "rgba(15,98,254,0.8)" },
  { x: "25%", y: "75%", size: 5, delay: 1.2, duration: 3.8, color: "rgba(15,98,254,0.7)" },
  { x: "75%", y: "70%", size: 7, delay: 0.4, duration: 4.5, color: "rgba(34,197,94,0.6)" },
  { x: "60%", y: "30%", size: 3, delay: 1.8, duration: 3.2, color: "rgba(251,191,36,0.5)" },
  { x: "40%", y: "85%", size: 5, delay: 0.9, duration: 4.0, color: "rgba(15,98,254,0.6)" },
  { x: "90%", y: "50%", size: 4, delay: 2.1, duration: 3.6, color: "rgba(251,191,36,0.8)" },
  { x: "5%",  y: "60%", size: 6, delay: 1.5, duration: 4.8, color: "rgba(15,98,254,0.5)" },
]

export default function JoinPage() {
  const router = useRouter()
  const { user, dbProfile } = useAuth()

  const [pin, setPin] = useState(["", "", "", "", "", ""])
  const [nickname, setNickname] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("fox")
  const [step, setStep] = useState<"pin" | "profile">("pin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [popIndex, setPopIndex] = useState<number | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (dbProfile?.nickname || dbProfile?.full_name) {
      setNickname(dbProfile.nickname || dbProfile.full_name.split(" ")[0])
    }
    if (user) {
      setSelectedEmoji(AVATARS[Math.floor(Math.random() * AVATARS.length)].id)
    }
  }, [dbProfile, user])

  // Focus first empty input on step enter
  useEffect(() => {
    if (step === "pin") {
      setTimeout(() => inputRefs.current[0]?.focus(), 200)
    }
  }, [step])

  const handlePinDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setError("")
    setPopIndex(index)
    setTimeout(() => setPopIndex(null), 300)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    if (value && index === 5) {
      const fullPin = [...newPin].join("")
      if (fullPin.length === 6) setTimeout(() => setStep("profile"), 300)
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePinPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setPin(pasted.split(""))
      setTimeout(() => setStep("profile"), 300)
    }
  }

  const handleJoin = async () => {
    if (!nickname.trim()) { setError("Ingresa tu nombre o apodo"); return }
    const fullPin = pin.join("")
    if (fullPin.length !== 6) { setError("Ingresa el PIN completo"); setStep("pin"); return }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/live/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: fullPin, nickname: nickname.trim(), avatar: { emoji: selectedEmoji } }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "No se pudo unir a la sesión")
        setLoading(false)
        return
      }

      sessionStorage.setItem("live_session_id", data.session_id)
      sessionStorage.setItem("live_participant_id", data.participant_id)
      sessionStorage.setItem("live_nickname", data.nickname)
      sessionStorage.setItem("live_emoji", selectedEmoji)

      router.push(`/live/play?session=${data.session_id}`)
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        /* Full screen, no sidebar offsets */

        .pin-input:focus { border-color: rgba(15,98,254,0.8) !important; box-shadow: 0 0 0 4px rgba(15,98,254,0.15), 0 0 20px rgba(15,98,254,0.2) !important; }
        .pin-input::placeholder { color: rgba(255,255,255,0.15); }

        @keyframes float-card { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(15,98,254,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 16px rgba(15,98,254,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(15,98,254,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes bounce-in { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }

        .pin-pop { animation: bounce-in 0.28s cubic-bezier(.36,.07,.19,.97) both; }

        .join-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #0056E7 0%, #1983FD 50%, #0056E7 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .join-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,86,231,0.5) !important; }
        .join-btn:active { transform: translateY(0); }

        .emoji-btn { transition: all 0.15s cubic-bezier(.36,.07,.19,.97); }
        .emoji-btn:hover { transform: scale(1.2) rotate(-5deg); }

        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .text-gradient {
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-yellow {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Full screen dark bg */}
      <div style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #060c1d 0%, #0a0f28 50%, #060c1d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.12)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          style={{
            position: "fixed", 
            top: "clamp(16px, 4vw, 32px)", 
            left: "clamp(16px, 4vw, 32px)", 
            zIndex: 100,
            width: "clamp(40px, 10vw, 52px)", 
            height: "clamp(40px, 10vw, 52px)", 
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            cursor: "pointer", 
            color: "white", 
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            transition: "background 0.2s"
          }}
        >
          <ArrowLeft size={24} />
        </motion.button>

        {/* Ambient background rings */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <motion.div
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: "min(600px, 90vw)", height: "min(600px, 90vw)",
              marginLeft: "min(-300px, -45vw)", marginTop: "min(-300px, -45vw)",
              borderRadius: "50%",
              border: "1px solid rgba(15,98,254,0.08)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: "min(400px, 70vw)", height: "min(400px, 70vw)",
              marginLeft: "min(-200px, -35vw)", marginTop: "min(-200px, -35vw)",
              borderRadius: "50%",
              border: "1px solid rgba(251,191,36,0.06)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          {/* Glow blobs */}
          <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(15,98,254,0.12) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "55vw", height: "55vw", background: "radial-gradient(circle, rgba(15,98,254,0.10) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", top: "30%", right: "15%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 65%)", borderRadius: "50%", filter: "blur(40px)" }} />
        </div>

        {/* Floating particles */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
        </div>

        {/* Main card */}
        <motion.div
          className="glass-card"
          style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, padding: "40px 36px", margin: "24px 20px" }}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <motion.div
            style={{ textAlign: "center", marginBottom: 36 }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 99, padding: "6px 16px", marginBottom: 20 }}>
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }} style={{ display: "inline-flex" }}><IconBolt size={16} color="#fbbf24" /></motion.span>
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", color: "#fbbf24", textTransform: "uppercase" }}>BIZEN Live</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={step}
                className="text-gradient"
                style={{ fontSize: "clamp(26px, 6vw, 34px)", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {step === "pin" ? "Únete a Bizen Live" : `¡Hola, ${nickname || "jugador"}!`}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={step + "-sub"}
                style={{ color: "rgba(255,255,255,0.38)", fontSize: 14, margin: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {step === "pin" ? "Ingresa el PIN de 6 dígitos que te compartieron" : "Elige tu avatar y confirma tu nombre"}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            {["pin", "profile"].map((s, i) => (
              <motion.div
                key={s}
                style={{ height: 4, borderRadius: 4, background: step === s ? "#fbbf24" : "rgba(255,255,255,0.12)" }}
                animate={{ width: step === s ? 28 : 12 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ─── STEP 1: PIN ─── */}
            {step === "pin" && (
              <motion.div
                key="pin-step"
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* PIN inputs */}
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }}>
                  {pin.map((digit, i) => (
                    <motion.input
                      key={i}
                      ref={el => { inputRefs.current[i] = el }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handlePinDigit(i, e.target.value)}
                      onKeyDown={e => handlePinKeyDown(i, e)}
                      onPaste={i === 0 ? handlePinPaste : undefined}
                      className={`pin-input${popIndex === i ? " pin-pop" : ""}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.35 }}
                      style={{
                        width: "clamp(44px, 13vw, 56px)",
                        height: "clamp(56px, 16vw, 70px)",
                        textAlign: "center",
                        fontSize: "clamp(22px, 6vw, 30px)",
                        fontWeight: 900,
                        color: digit ? "#fbbf24" : "white",
                        background: digit ? "rgba(251,191,36,0.10)" : "rgba(255,255,255,0.05)",
                        border: `2px solid ${digit ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 16,
                        outline: "none",
                        cursor: "text",
                        transition: "all 0.2s",
                        boxShadow: digit ? "0 0 16px rgba(251,191,36,0.2)" : "none",
                        letterSpacing: 0,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 16, fontWeight: 600 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  className="join-btn"
                  onClick={() => {
                    const full = pin.join("")
                    if (full.length < 6) { setError("Ingresa los 6 dígitos del PIN"); return }
                    setStep("profile")
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "18px",
                    border: "none", borderRadius: 18,
                    color: "white", fontSize: 16, fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 8px 32px rgba(0,86,231,0.4)",
                    letterSpacing: "0.03em",
                  }}
                >
                  Continuar →
                </motion.button>

                <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                  El PIN lo da el anfitrión antes de iniciar
                </p>

                <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1.5px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 16 }}>¿Quieres ser el anfitrión?</p>
                  <button 
                    onClick={() => router.push("/live/host")}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "12px 24px",
                      borderRadius: 14,
                      color: "white",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    Explorar Catálogo y Lanzar Quiz
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: PROFILE ─── */}
            {step === "profile" && (
              <motion.div
                key="profile-step"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* SVG Avatar selector */}
                <motion.div style={{ textAlign: "center", marginBottom: 16 }} key={selectedEmoji} animate={{ scale: [1.3, 1], rotate: [10, 0] }} transition={{ duration: 0.3, ease: "backOut" }}>
                  <div style={{ margin: "0 auto" }}>
                    <AvatarSvg id={selectedEmoji} size={80} />
                  </div>
                </motion.div>

                {/* Avatar grid */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                  {AVATARS.map((av, i) => (
                    <motion.button key={av.id} className="emoji-btn" onClick={() => setSelectedEmoji(av.id)}
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03, duration: 0.25, ease: "backOut" }} whileTap={{ scale: 0.85 }}
                      style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: av.id === selectedEmoji ? `${av.color}30` : "rgba(255,255,255,0.05)", border: `2px solid ${av.id === selectedEmoji ? av.color : "rgba(255,255,255,0.07)"}`, cursor: "pointer", color: av.color, transform: av.id === selectedEmoji ? "scale(1.18)" : "scale(1)", boxShadow: av.id === selectedEmoji ? `0 0 16px ${av.color}50` : "none" }}
                    >
                      <AvatarSvg id={av.id} size={24} />
                    </motion.button>
                  ))}
                </div>

                {/* Nickname */}
                <input
                  type="text"
                  placeholder="Tu apodo o nombre"
                  value={nickname}
                  onChange={e => { setNickname(e.target.value); setError("") }}
                  maxLength={30}
                  autoFocus
                  onKeyDown={e => { if (e.key === "Enter") handleJoin() }}
                  style={{
                    width: "100%", padding: "16px 20px",
                    fontSize: 18, fontWeight: 700,
                    background: "rgba(255,255,255,0.06)",
                    border: "2px solid rgba(255,255,255,0.1)",
                    borderRadius: 16, color: "white", outline: "none",
                    marginBottom: 14, textAlign: "center",
                    letterSpacing: "0.02em", boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)"
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(251,191,36,0.1)"
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 12, fontWeight: 600 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  className="join-btn"
                  onClick={handleJoin}
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%", padding: "18px",
                    border: "none", borderRadius: 18,
                    color: "white", fontSize: 16, fontWeight: 800,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    boxShadow: loading ? "none" : "0 8px 32px rgba(0,86,231,0.4)",
                    marginBottom: 12,
                    letterSpacing: "0.03em",
                  }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ display: "inline-flex" }}><IconBolt size={16} color="white" /></motion.span>
                      Uniéndome...
                    </span>
                  ) : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><IconGamepad size={18} color="white" /> ¡Entrar a Bizen Live!</span>}
                </motion.button>

                <button
                  onClick={() => { setStep("pin"); setError("") }}
                  style={{
                    width: "100%", padding: "10px", background: "transparent", border: "none",
                    color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)" }}
                >
                  ← Cambiar PIN
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}
