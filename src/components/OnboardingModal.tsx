"use client"

import { useState, useEffect, useCallback } from "react"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import { AVATAR_OPTIONS, AVATAR_CATEGORIES } from "@/lib/avatarOptions"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { SchoolIcon, CakeIcon, PartyIcon, RocketIcon, ChevronRightIcon } from "@/components/CustomIcons"

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "welcome" | "avatar" | "username" | "school" | "birthday"

interface OnboardingModalProps {
    onComplete: () => void
}

// ─── Particle Component ───────────────────────────────────────────────────────
const PARTICLES = [
    { top: "8%", left: "6%", size: 2.5, dur: 3.2, del: 0, opacity: 0.7 },
    { top: "15%", left: "90%", size: 1.5, dur: 4.1, del: 0.5, opacity: 0.5 },
    { top: "4%", left: "52%", size: 1, dur: 2.8, del: 1.1, opacity: 0.4 },
    { top: "25%", left: "93%", size: 2, dur: 3.6, del: 0.3, opacity: 0.6 },
    { top: "32%", left: "2%", size: 1.5, dur: 4.5, del: 1.4, opacity: 0.3 },
    { top: "58%", left: "96%", size: 1, dur: 3.0, del: 0.8, opacity: 0.5 },
    { top: "72%", left: "4%", size: 2, dur: 4.2, del: 0.2, opacity: 0.6 },
    { top: "85%", left: "82%", size: 1.5, dur: 2.9, del: 1.0, opacity: 0.4 },
    { top: "90%", left: "18%", size: 1, dur: 3.8, del: 0.6, opacity: 0.3 },
    { top: "20%", left: "42%", size: 1.5, dur: 3.4, del: 1.8, opacity: 0.5 },
    { top: "48%", left: "8%", size: 1, dur: 5.0, del: 0.4, opacity: 0.4 },
    { top: "65%", left: "78%", size: 2, dur: 3.1, del: 1.2, opacity: 0.6 },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const { user, refreshUser } = useAuth()
    const supabase = createClient()

    const [step, setStep] = useState<Step>("welcome")
    const [selectedAvatar, setSelectedAvatar] = useState<any>(AVATAR_OPTIONS[0])
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [selectedSchool, setSelectedSchool] = useState("")
    const [schools, setSchools] = useState<{ id: string, name: string }[]>([])
    const [usernameError, setUsernameError] = useState("")
    const [saving, setSaving] = useState(false)
    const [exiting, setExiting] = useState(false)
    const [avatarCategory, setAvatarCategory] = useState(0)
    const [screenSize, setScreenSize] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        fetch("/api/schools")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSchools(data)
                else setSchools([])
            })
            .catch(() => setSchools([]))
    }, [])

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            const suggested = user.user_metadata.full_name
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_.-]/g, "")
                .slice(0, 20)
            setUsername(suggested)
        }
    }, [user])

    const goToStep = useCallback((next: Step) => {
        setAnimating(true)
        setTimeout(() => {
            setStep(next)
            setAnimating(false)
        }, 280)
    }, [])

    const validateUsername = (val: string): string => {
        if (val.length < 3) return "Mínimo 3 caracteres"
        if (val.length > 30) return "Máximo 30 caracteres"
        if (!/^[a-zA-Z0-9_.-]+$/.test(val)) return "Solo letras, números, _ . -"
        return ""
    }

    const handleUsernameChange = (val: string) => {
        setUsername(val)
        setUsernameError(validateUsername(val))
    }

    const handleSaveAndStartTour = async () => {
        const err = validateUsername(username)
        if (err) { setUsernameError(err); return }

        setSaving(true)
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, bio, avatar: selectedAvatar, birthDate: birthDate || null, schoolId: selectedSchool }),
            })

            if (!res.ok) {
                let errorMsg = "Error al guardar"
                try {
                    const data = await res.json()
                    errorMsg = data.error || errorMsg
                } catch { }
                setUsernameError(errorMsg)
                setSaving(false)
                return
            }

            await supabase.auth.refreshSession()
            await refreshUser()
            setExiting(true)
            setTimeout(onComplete, 500)
        } catch {
            setUsernameError("Error de conexión. Intenta de nuevo.")
        } finally {
            setSaving(false)
        }
    }

    const profileName = user?.user_metadata?.full_name?.split(" ")[0] || "usuario"
    const emailForRole = user?.email?.toLowerCase() || ''
    const isInstitutional = emailForRole.endsWith('.edu') || emailForRole.includes('.edu.')
    const stepList: Step[] = isInstitutional
        ? ["welcome", "avatar", "username", "school", "birthday"]
        : ["welcome", "avatar", "username", "birthday"]
    const totalSteps = stepList.length - 1

    const getProgressPct = () => {
        const idx = stepList.indexOf(step)
        return Math.round((idx / (stepList.length - 1)) * 100)
    }

    const calcAge = (dateStr: string): number | null => {
        if (!dateStr) return null
        const bd = new Date(dateStr)
        const today = new Date()
        let age = today.getFullYear() - bd.getFullYear()
        const m = today.getMonth() - bd.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
        return age
    }

    const progressPct = getProgressPct()
    const stepIdx = stepList.indexOf(step)

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        /* ── Keyframes ── */
        @keyframes ob-fade-in    { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ob-slide-up   { from { opacity: 0; transform: translateY(60px) scale(0.94) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes ob-slide-out  { from { opacity: 1; transform: translateY(0) scale(1) } to { opacity: 0; transform: translateY(-32px) scale(0.95) } }
        @keyframes ob-spin       { to { transform: rotate(360deg) } }
        @keyframes ob-pop        { 0% { transform: scale(0.6); opacity: 0 } 65% { transform: scale(1.08) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes ob-twinkle    { 0%,100% { opacity:0.2; transform:scale(0.7) } 50% { opacity:1; transform:scale(1.4) } }
        @keyframes ob-glow-pulse { 0%,100% { opacity:0.5; transform:scale(1) } 50% { opacity:0.8; transform:scale(1.08) } }
        @keyframes ob-float      { 0%,100% { transform:translateY(0) rotate(-1deg) } 50% { transform:translateY(-10px) rotate(1deg) } }
        @keyframes ob-shimmer    { 0% { background-position: -200% center } 100% { background-position: 200% center } }
        @keyframes ob-breathe    { 0%,100% { box-shadow: 0 8px 32px rgba(15,98,254,0.45) } 50% { box-shadow: 0 16px 48px rgba(15,98,254,0.65), 0 0 40px rgba(79,142,255,0.3) } }
        @keyframes ob-step-in    { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
        @keyframes ob-step-out   { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(-24px) } }
        @keyframes ob-ring-pulse { 0% { transform:scale(0.92); opacity:0.5 } 100% { transform:scale(1.5); opacity:0 } }
        @keyframes ob-badge-in   { from { opacity:0; transform:translateY(-8px) scale(0.9) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes ob-line-in    { from { width:0 } to { width:100% } }

        /* ── Overlay ── */
        .ob-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(2,8,23,0.92);
          backdrop-filter: blur(20px) saturate(200%);
          -webkit-backdrop-filter: blur(20px) saturate(200%);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(8px, 3vw, 24px);
          animation: ob-fade-in 0.4s ease both;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── Card ── */
        .ob-card {
          background: #ffffff;
          border-radius: clamp(24px, 4vw, 36px);
          width: 100%;
          max-width: clamp(300px, 94vw, 560px);
          max-height: 96dvh;
          overflow-y: auto;
          overflow-x: hidden;
          box-shadow:
            0 0 0 1px rgba(15,98,254,0.1),
            0 32px 80px rgba(2,8,23,0.6),
            0 8px 24px rgba(0,0,0,0.15);
          animation: ob-slide-up 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          position: relative;
        }
        .ob-card.exit { animation: ob-slide-out 0.4s cubic-bezier(0.4,0,0.2,1) forwards; }
        .ob-card::-webkit-scrollbar { width: 3px; }
        .ob-card::-webkit-scrollbar-track { background: transparent; }
        .ob-card::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }

        /* ── Progress Track (top) ── */
        .ob-progress-track {
          height: 4px; background: #f1f5f9; position: relative; overflow: hidden;
        }
        .ob-progress-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, #0F62FE 0%, #60a5fa 50%, #0F62FE 100%);
          background-size: 200% auto;
          animation: ob-shimmer 2.5s linear infinite;
          transition: width 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Welcome Hero ── */
        .ob-hero {
          position: relative; overflow: hidden; text-align: center;
          background:
            radial-gradient(ellipse 90% 60% at 50% -10%, rgba(37,99,235,0.7) 0%, transparent 65%),
            radial-gradient(ellipse 60% 80% at 15% 110%, rgba(99,40,220,0.4) 0%, transparent 65%),
            radial-gradient(ellipse 80% 60% at 90% 80%, rgba(15,98,254,0.25) 0%, transparent 70%),
            linear-gradient(175deg, #020817 0%, #050d2d 45%, #030a1e 100%);
          padding: clamp(36px, 8vw, 64px) clamp(24px, 6vw, 44px) clamp(32px, 7vw, 52px);
          animation: ob-fade-in 0.6s ease both;
        }
        .ob-hero-particle {
          position: absolute; border-radius: 50%; background: #fff;
          animation: ob-twinkle var(--dur, 3s) ease-in-out infinite;
          animation-delay: var(--del, 0s);
          opacity: var(--op, 0.5);
        }
        .ob-hero-glow {
          position: absolute; inset: -60%; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(37,99,235,0.1) 45%, transparent 70%);
          animation: ob-glow-pulse 4s ease-in-out infinite;
        }
        .ob-hero-ring {
          position: absolute; inset: -20%; border-radius: 50%; pointer-events: none;
          border: 1.5px solid rgba(37,99,235,0.3);
          animation: ob-ring-pulse 2.8s ease-out infinite;
        }
        .ob-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px; padding: 6px 18px;
          margin-bottom: clamp(12px, 3vw, 20px);
          backdrop-filter: blur(8px);
          animation: ob-badge-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        .ob-hero-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 8px #4ade80, 0 0 16px rgba(74,222,128,0.4);
        }
        .ob-hero-badge-text {
          font-size: clamp(10px, 2.5vw, 11.5px); font-weight: 700;
          color: rgba(255,255,255,0.88); letter-spacing: 0.08em; text-transform: uppercase;
        }
        .ob-hero-mascot {
          position: relative; z-index: 2;
          width: clamp(110px, 26vw, 156px); height: clamp(110px, 26vw, 156px);
          margin: 0 auto clamp(24px, 6vw, 36px);
          animation: ob-float 4.5s ease-in-out infinite;
          filter: drop-shadow(0 4px 24px rgba(37,99,235,0.6)) drop-shadow(0 8px 12px rgba(0,0,20,0.4));
        }
        .ob-hero-h1 {
          font-size: clamp(26px, 6.5vw, 40px); font-weight: 900;
          color: #fff; margin: 0 0 clamp(10px, 2.5vw, 18px);
          letter-spacing: -0.04em; line-height: 1.1;
          text-shadow: 0 4px 24px rgba(37,99,235,0.5);
        }
        .ob-hero-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #93c5fd 0%, #818cf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ob-hero-sub {
          font-size: clamp(14px, 3.5vw, 16.5px); color: rgba(186,210,255,0.75);
          margin: 0 0 clamp(8px, 2vw, 12px); line-height: 1.7;
        }
        .ob-hero-hint {
          font-size: clamp(11.5px, 2.8vw, 13px); color: rgba(148,172,255,0.6);
          margin: 0 0 clamp(28px, 7vw, 44px); line-height: 1.6;
        }
        .ob-hero-hint strong { color: #93c5fd; font-weight: 700; }
        .ob-hero-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 0 0 clamp(18px, 4.5vw, 28px);
        }
        .ob-hero-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        }
        .ob-hero-divider-text {
          font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap;
        }

        /* ── Feature pills on welcome ── */
        .ob-features {
          display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
          margin: 0 0 clamp(20px, 5vw, 32px);
        }
        .ob-feature-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px; padding: 5px 12px;
          font-size: clamp(10.5px, 2.5vw, 12px); font-weight: 500;
          color: rgba(255,255,255,0.75);
          backdrop-filter: blur(6px);
        }
        .ob-feature-pill-icon { font-size: 13px; }

        /* ── Welcome Primary CTA ── */
        .ob-hero-btn {
          width: 100%; padding: clamp(14px, 3.5vw, 18px) 24px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #4f46e5 100%);
          color: white; border: none; border-radius: 16px;
          font-size: clamp(14.5px, 3.5vw, 16px); font-weight: 700;
          cursor: pointer; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          letter-spacing: 0.01em;
          animation: ob-breathe 3s ease-in-out infinite;
          transition: filter 0.2s, transform 0.2s;
          box-shadow: 0 8px 32px rgba(37,99,235,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset;
        }
        .ob-hero-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
          background-size: 200% auto;
          animation: ob-shimmer 3s linear infinite;
        }
        .ob-hero-btn:hover { filter: brightness(1.1); transform: translateY(-1px); animation-play-state: paused; }
        .ob-hero-btn:active { transform: scale(0.98) translateY(0); }

        /* ── Step dots ── */
        .ob-dots {
          display: flex; gap: 6px; justify-content: center;
          margin-top: clamp(18px, 4.5vw, 28px);
        }
        .ob-dot {
          height: 5px; border-radius: 99px;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ob-dot.on-dark { background: rgba(255,255,255,0.85) !important; }
        .ob-dot.on-dark-inactive { background: rgba(255,255,255,0.2) !important; }
        .ob-dot.on-dark-done { background: rgba(255,255,255,0.45) !important; }
        .ob-dot.on-light-active { background: #0F62FE !important; }
        .ob-dot.on-light-done { background: rgba(15,98,254,0.35) !important; }
        .ob-dot.on-light-inactive { background: #e2e8f0 !important; }

        /* ── Step area ── */
        .ob-step-body {
          padding: clamp(22px, 5.5vw, 44px) clamp(22px, 5.5vw, 40px) clamp(22px, 5.5vw, 36px);
          animation: ob-step-in 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both;
        }
        .ob-step-body.out { animation: ob-step-out 0.28s ease forwards; }

        /* ── Step nav ── */
        .ob-step-nav {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: clamp(16px, 4vw, 28px);
        }
        .ob-back-btn {
          background: none; border: none; cursor: pointer;
          color: #94a3b8; font-size: clamp(12.5px, 3vw, 14px); font-weight: 500;
          padding: 6px 4px; transition: color 0.2s;
          display: flex; align-items: center; gap: 4px;
          font-family: inherit;
        }
        .ob-back-btn:hover { color: #475569; }
        .ob-step-label {
          font-size: clamp(10px, 2.5vw, 12px); color: #94a3b8; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        /* ── Step heading ── */
        .ob-step-icon-circle {
          width: clamp(64px, 16vw, 80px); height: clamp(64px, 16vw, 80px);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin: 0 auto clamp(12px, 3vw, 20px);
          animation: ob-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .ob-step-h2 {
          font-size: clamp(18px, 4.8vw, 24px); font-weight: 800;
          color: #0f172a; margin: 0 0 6px; letter-spacing: -0.025em;
          text-align: center;
        }
        .ob-step-h2-sub {
          font-size: clamp(12.5px, 3.2vw, 14px); color: #64748b;
          margin: 0; text-align: center; line-height: 1.6;
        }
        .ob-step-heading-wrap {
          text-align: center; margin-bottom: clamp(20px, 5vw, 32px);
        }

        /* ── Inline avatar preview ── */
        .ob-avatar-preview {
          width: clamp(58px, 14vw, 76px); height: clamp(58px, 14vw, 76px);
          border-radius: 50%;
          background: linear-gradient(135deg, #0F62FE, #10b981);
          margin: 0 auto clamp(12px, 3vw, 18px);
          overflow: hidden; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 28px rgba(15,98,254,0.35);
          animation: ob-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        /* ── Avatar category tabs ── */
        .ob-cat-tabs {
          display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;
          margin-bottom: clamp(14px, 3.5vw, 22px);
        }
        .ob-cat-tab {
          padding: 6px 16px; border-radius: 999px; border: none;
          font-size: clamp(11px, 2.8vw, 13px); font-weight: 600;
          cursor: pointer; transition: all 0.22s ease; font-family: inherit;
        }
        .ob-cat-tab.active {
          background: linear-gradient(135deg, #0F62FE, #6366f1);
          color: white; box-shadow: 0 4px 14px rgba(15,98,254,0.35);
        }
        .ob-cat-tab.inactive { background: #f1f5f9; color: #64748b; }
        .ob-cat-tab.inactive:hover { background: #e2e8f0; color: #475569; }

        /* ── Avatar grid ── */
        .ob-avatar-grid {
          display: grid; grid-template-columns: repeat(5, 1fr);
          gap: clamp(8px, 2vw, 14px);
          margin-bottom: clamp(20px, 5vw, 30px);
        }
        @media (max-width: 440px) { .ob-avatar-grid { grid-template-columns: repeat(4, 1fr); } }
        .ob-av-btn {
          aspect-ratio: 1; width: 100%; border-radius: 50%;
          cursor: pointer; border: 3px solid transparent;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          background: rgba(15,98,254,0.04); padding: 0; outline: none;
          flex-direction: column;
        }
        .ob-av-btn:hover { transform: scale(1.14); border-color: rgba(15,98,254,0.3); background: rgba(15,98,254,0.08); }
        .ob-av-btn.selected {
          border-color: #0F62FE; transform: scale(1.1);
          box-shadow: 0 0 0 5px rgba(15,98,254,0.18);
          background: rgba(15,98,254,0.07);
        }
        .ob-av-label {
          font-size: clamp(8px, 2vw, 10px); font-weight: 600;
          color: #94a3b8; text-align: center; line-height: 1.1;
          transition: color 0.2s; margin-top: 3px;
        }
        .selected .ob-av-label { color: #0F62FE; }

        /* ── Inline avatar + heading combo ── */
        .ob-username-heading {
          display: flex; align-items: center; gap: clamp(12px, 3vw, 18px);
          margin-bottom: clamp(18px, 4.5vw, 28px);
        }
        .ob-username-av {
          width: clamp(46px, 12vw, 58px); height: clamp(46px, 12vw, 58px);
          border-radius: 50%; background: linear-gradient(135deg, #0F62FE, #10b981);
          flex-shrink: 0; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(15,98,254,0.3);
        }

        /* ── Inputs ── */
        .ob-field { margin-bottom: clamp(14px, 3.5vw, 22px); }
        .ob-label {
          display: block; font-size: clamp(10px, 2.5vw, 11.5px); font-weight: 700;
          color: #374151; text-transform: uppercase; letter-spacing: 0.07em;
          margin-bottom: 8px;
        }
        .ob-label-optional { font-weight: 500; color: #9ca3af; text-transform: none; letter-spacing: 0; }
        .ob-input {
          width: 100%; padding: clamp(12px, 3vw, 15px) clamp(14px, 3.5vw, 18px);
          border: 2px solid #e8ecf2; border-radius: 14px;
          font-size: clamp(14px, 3.5vw, 15.5px); color: #111827; outline: none;
          transition: all 0.2s; box-sizing: border-box;
          background: #f8fafc; font-family: inherit;
          -webkit-appearance: none; appearance: none;
        }
        .ob-input:focus { border-color: #0F62FE; background: #fff; box-shadow: 0 0 0 4px rgba(15,98,254,0.1); }
        .ob-input.error { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.08); }
        .ob-input-at { position: relative; }
        .ob-input-at-sym {
          position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 15px; pointer-events: none; font-weight: 600;
        }
        .ob-input-at input { padding-left: 30px; }
        .ob-input-hint { font-size: clamp(11px, 2.8vw, 12.5px); margin: 5px 0 0; }
        .ob-input-hint.ok { color: #10b981; }
        .ob-input-hint.err { color: #ef4444; }
        .ob-input-hint.neutral { color: #9ca3af; }
        .ob-char-count { font-size: clamp(10px, 2.5vw, 11px); color: #9ca3af; text-align: right; margin: 3px 0 0; }

        /* ── Age reveal ── */
        .ob-age-reveal {
          margin-top: 12px; padding: 12px 16px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 1.5px solid #bfdbfe; border-radius: 14px;
          display: flex; align-items: center; gap: 12px;
          animation: ob-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        /* ── Primary button ── */
        .ob-btn-primary {
          width: 100%; padding: clamp(14px, 3.5vw, 17px) 24px;
          background: linear-gradient(135deg, #0F62FE 0%, #4F8EFF 100%);
          color: white; border: none; border-radius: 15px;
          font-size: clamp(14px, 3.5vw, 15.5px); font-weight: 700;
          cursor: pointer; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: inherit; letter-spacing: 0.02em;
          transition: filter 0.2s, transform 0.15s;
          box-shadow: 0 8px 24px rgba(15,98,254,0.4);
        }
        .ob-btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
          background-size: 200%; animation: ob-shimmer 2.8s linear infinite;
        }
        .ob-btn-primary:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1.5px); }
        .ob-btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .ob-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

        /* ── Skip / ghost button ── */
        .ob-btn-ghost {
          background: none; border: none; cursor: pointer; font-family: inherit;
          color: #94a3b8; font-size: clamp(12px, 3vw, 13.5px); font-weight: 500;
          padding: 8px; transition: color 0.2s; width: 100%;
        }
        .ob-btn-ghost:hover { color: #64748b; }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .ob-card { border-radius: 26px; }
          .ob-hero { padding: 32px 20px 24px; }
          .ob-step-body { padding: 20px 18px; }
        }
      `}</style>

            <div className="ob-overlay">
                <div className={`ob-card${exiting ? " exit" : ""}`}>

                    {/* ── Progress stripe ── */}
                    <div className="ob-progress-track">
                        <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    {/* ─── WELCOME ──────────────────────────────────────────── */}
                    {step === "welcome" && (
                        <div className="ob-hero">
                            {/* Particles */}
                            {PARTICLES.map((p, i) => (
                                <div key={i} className="ob-hero-particle" style={{
                                    top: p.top, left: p.left,
                                    width: p.size, height: p.size,
                                    "--dur": `${p.dur}s`, "--del": `${p.del}s`, "--op": p.opacity,
                                } as React.CSSProperties} />
                            ))}

                            {/* Mascot with glow */}
                            <div style={{ position: "relative", display: "inline-block", marginBottom: "clamp(24px,6vw,36px)" }}>
                                <div className="ob-hero-glow" />
                                <div className="ob-hero-ring" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/image copy 5.png" alt="Billy, mascota BIZEN" className="ob-hero-mascot" style={{ margin: 0 }} />
                            </div>

                            {/* Badge */}
                            <div className="ob-hero-badge">
                                <div className="ob-hero-badge-dot" />
                                <span className="ob-hero-badge-text">Bienvenido a BIZEN</span>
                            </div>

                            {/* Heading */}
                            <h1 className="ob-hero-h1">
                                Hola, <em>{profileName}</em> 👋
                            </h1>
                            <p className="ob-hero-sub">
                                En 2 minutos configuramos tu perfil y te mostramos todo lo que puedes hacer aquí.
                            </p>
                            <p className="ob-hero-hint">
                                <strong>Billy</strong>, tu mentor de finanzas, te guiará en cada paso.
                            </p>

                            {/* Feature pills */}
                            <div className="ob-features">
                                {[
                                    { icon: "📚", label: "30 temas" },
                                    { icon: "🤖", label: "IA con Billy" },
                                    { icon: "🏅", label: "Retos diarios" },
                                    { icon: "💰", label: "Simuladores" },
                                    { icon: "🏆", label: "Rankings" },
                                    { icon: "🌱", label: "Impacto social" },
                                ].map(f => (
                                    <div key={f.label} className="ob-feature-pill">
                                        <span className="ob-feature-pill-icon">{f.icon}</span>
                                        {f.label}
                                    </div>
                                ))}
                            </div>

                            <div className="ob-hero-divider">
                                <div className="ob-hero-divider-line" />
                                <span className="ob-hero-divider-text">Empecemos</span>
                                <div className="ob-hero-divider-line" />
                            </div>

                            {/* CTA */}
                            <button className="ob-hero-btn" onClick={() => goToStep("avatar")}>
                                <ChevronRightIcon size={18} color="white" />
                                Crear mi perfil
                            </button>

                            {/* Dots */}
                            <div className="ob-dots">
                                {stepList.map((s, i) => {
                                    const isActive = s === step
                                    const isDone = i < stepIdx
                                    return (
                                        <div key={s} className={`ob-dot ${isActive ? "on-dark" : isDone ? "on-dark-done" : "on-dark-inactive"}`}
                                            style={{ width: isActive ? 26 : 7 }} />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ─── AVATAR ───────────────────────────────────────────── */}
                    {step === "avatar" && (
                        <div className={`ob-step-body${animating ? " out" : ""}`}>
                            <div className="ob-step-nav">
                                <button className="ob-back-btn" onClick={() => goToStep("welcome")}>← Atrás</button>
                                <span className="ob-step-label">Paso 1 de {totalSteps}</span>
                            </div>

                            <div className="ob-step-heading-wrap">
                                <div className="ob-avatar-preview">
                                    <AvatarDisplay avatar={selectedAvatar} size={50} />
                                </div>
                                <h2 className="ob-step-h2">Elige tu avatar</h2>
                                <p className="ob-step-h2-sub">Esta será tu cara en el foro y tu perfil público</p>
                            </div>

                            {/* Category tabs */}
                            <div className="ob-cat-tabs">
                                {AVATAR_CATEGORIES.map((cat, ci) => (
                                    <button key={cat.label} onClick={() => setAvatarCategory(ci)}
                                        className={`ob-cat-tab ${avatarCategory === ci ? "active" : "inactive"}`}>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className="ob-avatar-grid">
                                {AVATAR_OPTIONS
                                    .filter(av => AVATAR_CATEGORIES[avatarCategory].ids.includes(av.id))
                                    .map(av => {
                                        const isSel = selectedAvatar?.id === av.id
                                        return (
                                            <div key={av.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                                <button onClick={() => setSelectedAvatar(av)} className={`ob-av-btn${isSel ? " selected" : ""}`}>
                                                    <AvatarDisplay avatar={av} size={screenSize < 400 ? 48 : 56} />
                                                </button>
                                                <span style={{
                                                    fontSize: "clamp(8px,2vw,10px)", fontWeight: isSel ? 700 : 500,
                                                    color: isSel ? "#0F62FE" : "#94a3b8",
                                                    textAlign: "center", transition: "color 0.2s"
                                                }}>{av.label}</span>
                                            </div>
                                        )
                                    })}
                            </div>

                            <button className="ob-btn-primary" onClick={() => goToStep("username")}>
                                Continuar →
                            </button>

                            <div className="ob-dots" style={{ marginTop: 16 }}>
                                {stepList.map((s, i) => {
                                    const isActive = s === step
                                    const isDone = i < stepIdx
                                    return (
                                        <div key={s} className={`ob-dot ${isActive ? "on-light-active" : isDone ? "on-light-done" : "on-light-inactive"}`}
                                            style={{ width: isActive ? 24 : 7 }} />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ─── USERNAME ─────────────────────────────────────────── */}
                    {step === "username" && (
                        <div className={`ob-step-body${animating ? " out" : ""}`}>
                            <div className="ob-step-nav">
                                <button className="ob-back-btn" onClick={() => goToStep("avatar")}>← Atrás</button>
                                <span className="ob-step-label">Paso 2 de {totalSteps}</span>
                            </div>

                            {/* Avatar + heading combo */}
                            <div className="ob-username-heading">
                                <div className="ob-username-av">
                                    <AvatarDisplay avatar={selectedAvatar} size={34} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "clamp(17px,4.5vw,22px)", fontWeight: 800, color: "#0f172a", margin: "0 0 3px", letterSpacing: "-0.025em" }}>
                                        Tu nombre en BIZEN
                                    </h2>
                                    <p style={{ fontSize: "clamp(11.5px,3vw,13px)", color: "#64748b", margin: 0 }}>Así te verán todos en el foro y rankings</p>
                                </div>
                            </div>

                            {/* Username */}
                            <div className="ob-field">
                                <label className="ob-label">Nombre de usuario *</label>
                                <div className="ob-input-at">
                                    <span className="ob-input-at-sym">@</span>
                                    <input
                                        className={`ob-input${usernameError ? " error" : ""}`}
                                        style={{ paddingLeft: 30 }}
                                        placeholder="tu_nombre_aqui"
                                        value={username}
                                        maxLength={30}
                                        onChange={(e) => handleUsernameChange(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {usernameError ? (
                                    <p className="ob-input-hint err">{usernameError}</p>
                                ) : username.length >= 3 ? (
                                    <p className="ob-input-hint ok">✓ Disponible</p>
                                ) : (
                                    <p className="ob-input-hint neutral">Letras, números, guiones y puntos. 3-30 caracteres.</p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="ob-field">
                                <label className="ob-label">
                                    Intereses financieros <span className="ob-label-optional">(opcional)</span>
                                </label>
                                <textarea
                                    className="ob-input"
                                    style={{ resize: "vertical", minHeight: "clamp(64px,18vw,80px)", lineHeight: 1.6 }}
                                    placeholder="Ej: Quiero aprender a invertir y ahorrar para mi futuro..."
                                    value={bio}
                                    maxLength={200}
                                    onChange={e => setBio(e.target.value)}
                                    rows={3}
                                />
                                <p className="ob-char-count">{bio.length}/200</p>
                            </div>

                            <button
                                className="ob-btn-primary"
                                disabled={!!usernameError || username.length < 3}
                                onClick={() => goToStep(isInstitutional ? "school" : "birthday")}
                                style={{ marginBottom: 0 }}
                            >
                                Continuar →
                            </button>

                            <div className="ob-dots" style={{ marginTop: 16 }}>
                                {stepList.map((s, i) => {
                                    const isActive = s === step
                                    const isDone = i < stepIdx
                                    return (
                                        <div key={s} className={`ob-dot ${isActive ? "on-light-active" : isDone ? "on-light-done" : "on-light-inactive"}`}
                                            style={{ width: isActive ? 24 : 7 }} />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ─── SCHOOL ───────────────────────────────────────────── */}
                    {step === "school" && (
                        <div className={`ob-step-body${animating ? " out" : ""}`}>
                            <div className="ob-step-nav">
                                <button className="ob-back-btn" onClick={() => goToStep("username")}>← Atrás</button>
                                <span className="ob-step-label">Paso 3 de {totalSteps}</span>
                            </div>

                            <div className="ob-step-heading-wrap">
                                <div className="ob-step-icon-circle" style={{ background: "#EFF6FF" }}>
                                    <SchoolIcon size={36} color="#0F62FE" />
                                </div>
                                <h2 className="ob-step-h2">¿Cuál es tu escuela?</h2>
                                <p className="ob-step-h2-sub">Compara tu progreso con el de tus compañeros</p>
                            </div>

                            <div className="ob-field">
                                <label className="ob-label">Selecciona tu institución *</label>
                                <select
                                    className="ob-input"
                                    value={selectedSchool}
                                    onChange={e => setSelectedSchool(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona tu escuela...</option>
                                    {Array.isArray(schools) && schools.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="ob-btn-primary" disabled={!selectedSchool} onClick={() => goToStep("birthday")}>
                                Continuar →
                            </button>

                            <div className="ob-dots" style={{ marginTop: 16 }}>
                                {stepList.map((s, i) => {
                                    const isActive = s === step
                                    const isDone = i < stepIdx
                                    return (
                                        <div key={s} className={`ob-dot ${isActive ? "on-light-active" : isDone ? "on-light-done" : "on-light-inactive"}`}
                                            style={{ width: isActive ? 24 : 7 }} />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ─── BIRTHDAY ─────────────────────────────────────────── */}
                    {step === "birthday" && (
                        <div className={`ob-step-body${animating ? " out" : ""}`}>
                            <div className="ob-step-nav">
                                <button className="ob-back-btn" onClick={() => goToStep(isInstitutional ? "school" : "username")}>← Atrás</button>
                                <span className="ob-step-label">Paso {isInstitutional ? 4 : 3} de {totalSteps}</span>
                            </div>

                            <div className="ob-step-heading-wrap">
                                <div className="ob-step-icon-circle" style={{ background: "#FFF1F2" }}>
                                    <CakeIcon size={36} color="#F43F5E" />
                                </div>
                                <h2 className="ob-step-h2">¿Cuándo es tu cumpleaños?</h2>
                                <p className="ob-step-h2-sub">Nos ayuda a personalizar tu experiencia</p>
                            </div>

                            <div className="ob-field">
                                <label className="ob-label">
                                    Fecha de nacimiento <span className="ob-label-optional">(opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    className="ob-input"
                                    value={birthDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={e => setBirthDate(e.target.value)}
                                    style={{ colorScheme: "light" }}
                                />
                                {birthDate && (() => {
                                    const age = calcAge(birthDate)
                                    return age !== null && age >= 0 && age <= 120 ? (
                                        <div className="ob-age-reveal">
                                            <PartyIcon size={22} color="#1e40af" />
                                            <div>
                                                <div style={{ fontSize: "clamp(12.5px,3vw,14px)", fontWeight: 700, color: "#1e40af" }}>¡Tienes {age} años! 🎉</div>
                                                <div style={{ fontSize: "clamp(10.5px,2.5vw,12px)", color: "#3b82f6" }}>Bienvenido a BIZEN</div>
                                            </div>
                                        </div>
                                    ) : null
                                })()}
                            </div>

                            {/* Final CTA */}
                            <button
                                className="ob-btn-primary"
                                disabled={saving}
                                onClick={handleSaveAndStartTour}
                                style={{ marginBottom: 10 }}
                            >
                                {saving ? (
                                    <>
                                        <span style={{ width: 16, height: 16, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "ob-spin 0.8s linear infinite", display: "inline-block", flexShrink: 0 }} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        ¡Listo! Ver el tour
                                        <RocketIcon size={18} color="white" />
                                    </>
                                )}
                            </button>

                            {!birthDate && (
                                <button className="ob-btn-ghost" onClick={handleSaveAndStartTour} disabled={saving}>
                                    Saltar este paso
                                </button>
                            )}

                            <div className="ob-dots" style={{ marginTop: 8 }}>
                                {stepList.map((s, i) => {
                                    const isActive = s === step
                                    const isDone = i < stepIdx
                                    return (
                                        <div key={s} className={`ob-dot ${isActive ? "on-light-active" : isDone ? "on-light-done" : "on-light-inactive"}`}
                                            style={{ width: isActive ? 24 : 7 }} />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}
