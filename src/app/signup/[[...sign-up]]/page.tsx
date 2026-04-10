"use client"

import * as React from "react"
import Link from "next/link"
import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function BIZENSignupPage() {
  React.useEffect(() => {
    document.documentElement.style.overflow = "auto"
    document.body.style.overflow = "auto"
    document.body.style.background = "linear-gradient(135deg, #020e27 0%, #041640 40%, #061a4a 70%, #020e27 100%)"
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      document.body.style.background = ""
    }
  }, [])

  return (
    <main style={{
      position: "relative",
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #050b14 0%, #0a192f 40%, #173d7a 100%)",
      overflow: "hidden",
      padding: "clamp(16px, 4vw, 40px)",
      boxSizing: "border-box",
    }}>

      {/* Grid overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,86,231,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,86,231,0.07) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Blobs */}
      <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-10%", width: "clamp(280px,50vw,560px)", height: "clamp(280px,50vw,560px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,86,231,0.22) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-15%", left: "-10%", width: "clamp(240px,45vw,480px)", height: "clamp(240px,45vw,480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(25,131,253,0.18) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />

      {/* Logo */}
      <Link href="/" style={{
        position: "absolute", top: 24, left: "clamp(20px, 4vw, 36px)",
        textDecoration: "none", zIndex: 10, display: "flex", alignItems: "center", gap: 8,
      }}>
        <strong style={{ fontSize: "clamp(22px, 3vw, 28px)", color: "#fff", letterSpacing: "-0.02em" }}>
          BIZEN<span style={{ color: "#1983FD" }}>.</span>
        </strong>
      </Link>

      <div style={{ position: "relative", zIndex: 2 }}>
        <SignUp
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#050b14] border border-white/10 shadow-[0_0_80px_-20px_rgba(245,158,11,0.3)] rounded-[32px] overflow-hidden",
              headerTitle: "text-4xl sm:text-5xl font-black tracking-tighter text-white mb-2 pb-2 border-b border-white/5",
              headerSubtitle: "text-zinc-400 font-bold text-lg",
              main: "gap-8 pb-4",
              socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-500 rounded-2xl h-14",
              socialButtonsBlockButtonText: "text-white font-black tracking-tight text-base",
              formButtonPrimary: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-[length:200%_auto] hover:bg-right text-black font-black uppercase tracking-[0.25em] py-5 rounded-2xl shadow-2xl shadow-amber-500/30 transition-all duration-500 active:scale-95 text-sm",
              formFieldLabel: "text-zinc-500 uppercase tracking-widest text-[11px] font-black mb-2 flex items-center gap-2",
              formFieldInput: "bg-white/5 border-white/10 text-white rounded-2xl h-14 text-lg focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all",
              footerActionLink: "text-amber-500 hover:text-amber-400 font-black transition-all hover:scale-105 inline-block underline decoration-amber-500/50 underline-offset-8",
              identityPreviewText: "text-white font-black text-lg",
              identityPreviewEditButtonIcon: "text-amber-500 w-5 h-5",
              dividerLine: "bg-white/10 h-[1px]",
              dividerText: "text-zinc-500 text-[11px] uppercase font-black tracking-[0.3em] px-4",
              formFieldInputShowPasswordButton: "text-zinc-500 hover:text-amber-500",
              footer: "bg-black/40 border-t border-white/10 py-6",
            },
            variables: {
              colorPrimary: '#f59e0b',
              colorBackground: '#050b14',
              colorText: '#ffffff',
              colorInputBackground: 'transparent',
              colorInputText: '#ffffff',
              borderRadius: '1.25rem',
              fontSize: '1rem',
            }
          }}
          routing="path"
          path="/signup"
          signInUrl="/login"
          socialButtonsPlacement="top"
          socialButtonsVariant="blockButton"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
        />
      </div>

    </main>
  )
}
