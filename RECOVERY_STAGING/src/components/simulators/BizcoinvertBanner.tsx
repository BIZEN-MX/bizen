"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Trophy, Users, TrendingUp, Zap, Clock, CalendarDays, Award } from "lucide-react"
import BizcoinIcon from "@/components/BizcoinIcon"

const ENROLLED_KEY = "bizcoinvert_enrolled_v2"

// Compute the next "25th of month" end date from today.
// Each challenge runs from the 25th of month N to the 24th of month N+1.
function getNextChallengeEnd(): Date {
  const now = new Date()
  const day = now.getDate()
  // If we haven't passed the 25th yet this month, the current cycle ends on the 25th of next month at 23:59
  // If we already passed the 25th, the next cycle ends the 25th of the month after next
  let year = now.getFullYear()
  let month = now.getMonth() // 0-indexed

  if (day < 25) {
    // End is the 24th at end-of-day of the current month (the 25th starts the NEW cycle)
    // Challenge end = day 25 of *next* month - 1 second
    month += 1
  } else {
    // Already on or past 25th — next end is in 2 months
    month += 2
  }

  if (month > 11) {
    month -= 12
    year += 1
  }

  return new Date(year, month, 24, 23, 59, 59)
}

function getNextChallengeStart(): Date {
  const now = new Date()
  const day = now.getDate()
  let year = now.getFullYear()
  let month = now.getMonth()

  if (day < 25) {
    // next start is the 25th of this month
  } else {
    // already past 25th, next start is the 25th of next month
    month += 1
    if (month > 11) { month -= 12; year += 1 }
  }

  return new Date(year, month, 25, 0, 0, 0)
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

export function BizcoinvertBanner({ userEmail }: { userEmail?: string }) {
  const [enrolled, setEnrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Challenge dates computed once on mount
  const [challengeEnd] = useState(getNextChallengeEnd)
  const [challengeStart] = useState(getNextChallengeStart)
  const isActive = new Date() >= challengeStart

  const timeLeft = useCountdown(isActive ? challengeEnd : challengeStart)
  const countdownLabel = isActive ? "Termina en" : "Comienza en"

  useEffect(() => {
    setMounted(true)
    if (localStorage.getItem(ENROLLED_KEY)) setEnrolled(true)
  }, [])

  const handleEnroll = () => {
    localStorage.setItem(ENROLLED_KEY, "true")
    setEnrolled(true)
    window.dispatchEvent(new CustomEvent("bizcoinvert-view-rankings"))
  }

  const email = userEmail?.toLowerCase() || ""

  const isEligible = email && (
    email.endsWith('.edu') ||
    email.endsWith('.edu.mx') ||
    email.endsWith('anahuac.mx') ||
    email.endsWith('@bizen.mx')
  )

  const isAnahuac = email && (
    email.endsWith('@anahuac.mx') || 
    email.endsWith('.anahuac.mx') || 
    email.endsWith('@bizen.mx')
  )

  if (!mounted || !isEligible || enrolled) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-7 rounded-3xl overflow-hidden select-none"
      >
        {/* ── BACKGROUND ──────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#06153a] via-[#0b2065] to-[#0a1840]" />

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Gold glow top-right */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        {/* Blue glow bottom-left */}
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

        {/* ── MAIN CONTENT ────────────────────────────────── */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-0">

          {/* === LEFT COLUMN === */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-5">

            {/* Top: badge + title */}
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <motion.span 
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 12px rgba(16,185,129,0.5)", "0 0 0px rgba(16,185,129,0)"],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  {isActive ? "Reto Activo" : "Próximo Reto"}
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1 bg-white/8 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                >
                  <CalendarDays size={10} />
                  Cada 25 del mes
                </motion.span>
              </div>

              {/* Title & Logo */}
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-white text-[22px] md:text-[26px] font-black tracking-tight leading-snug m-0">
                  Únete al Reto{" "}
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    Bizcoinvert
                  </span>
                </h2>
                {isAnahuac && (
                  <div className="bg-white/10 p-1.5 rounded border border-white/20 shadow-lg">
                    <Image src="/anahuac-logo.png" alt="Anáhuac" width={32} height={32} className="object-contain" />
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-white/60 text-[13px] md:text-[14px] leading-relaxed m-0 max-w-[500px]">
                Compite contra {isAnahuac ? "todos los Leones" : <span>alumnos de <strong className="text-white/85">todas las instituciones educativas</strong></span>} de BIZEN.
                El {isAnahuac ? "León" : "estudiante"} con el mejor rendimiento en el simulador al final del ciclo mensual se lleva{" "}
                <strong className="text-amber-300">50,000 Bizcoins</strong>. Los rankings se actualizan en tiempo real.
              </p>
            </div>

            {/* Challenge dates row */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-white/45 text-[12px] font-semibold">
                <CalendarDays size={13} className="text-blue-300 shrink-0" />
                <span>Inicia: <strong className="text-white/70">{formatDate(challengeStart)}</strong></span>
              </div>
              <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
              <div className="flex items-center gap-2 text-white/45 text-[12px] font-semibold">
                <Clock size={13} className="text-amber-300 shrink-0" />
                <span>Cierra: <strong className="text-white/70">{formatDate(challengeEnd)}</strong></span>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Users size={12} />, label: isAnahuac ? "Exclusivo para Leones" : "Todas las instituciones", color: "text-blue-300" },
                { icon: <TrendingUp size={12} />, label: "Rankings en tiempo real", color: "text-emerald-400" },
                { icon: <Zap size={12} />, label: "Sin costo de inscripción", color: "text-amber-300" },
              ].map((f) => (
                <div
                  key={f.label}
                  className={`flex items-center gap-1.5 bg-white/6 border border-white/10 rounded-full px-3 py-1.5 text-[12px] font-semibold ${f.color}`}
                >
                  {f.icon}
                  <span className="text-white/55">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* === RIGHT COLUMN === */}
          <div className="md:w-[320px] shrink-0 flex flex-col items-center justify-between gap-4 p-6 md:p-8 border-t border-white/8 md:border-t-0 md:border-l md:border-white/8">

            {/* Prize */}
            <div className="w-full flex items-center justify-between bg-amber-400/10 border border-amber-400/25 rounded-2xl px-5 py-3.5 shadow-[0_4px_20px_rgba(251,191,36,0.08)]">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-amber-400" />
                <span className="text-white/55 text-[11px] font-bold uppercase tracking-wider">Premio</span>
              </div>
              <div className="flex items-center gap-2">
                <BizcoinIcon size={18} />
                <span className="text-amber-300 text-[22px] font-black tracking-tight">50,000</span>
                <span className="text-amber-400/70 text-[12px] font-bold">BZ</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="w-full">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={11} className="text-white/30" />
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{countdownLabel}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: timeLeft.days, label: "días" },
                  { val: timeLeft.hours, label: "hrs" },
                  { val: timeLeft.minutes, label: "min" },
                  { val: timeLeft.seconds, label: "seg" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col items-center bg-white/8 border border-white/10 rounded-xl py-2 px-1"
                  >
                    <span className="text-white text-[20px] font-black leading-none tabular-nums">
                      {String(t.val).padStart(2, "0")}
                    </span>
                    <span className="text-white/30 text-[9px] font-bold uppercase tracking-wider mt-0.5">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleEnroll}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-emerald-950 text-[13px] font-black cursor-pointer border-none shadow-[0_8px_24px_rgba(16,185,129,0.3)] hover:brightness-105 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Trophy size={15} />
              Inscribirme al Reto
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
