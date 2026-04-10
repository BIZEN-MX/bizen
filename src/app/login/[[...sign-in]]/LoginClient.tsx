"use client"

import * as React from "react"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function LoginClient() {
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
      <div aria-hidden style={{ position: "absolute", top: "-10%", left: "-10%", width: "clamp(280px,50vw,560px)", height: "clamp(280px,50vw,560px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,86,231,0.22) 0%, transparent 70%)", filter: "blur(40px)", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "clamp(240px,45vw,480px)", height: "clamp(240px,45vw,480px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(25,131,253,0.18) 0%, transparent 70%)", filter: "blur(50px)", zIndex: 0 }} />

      {/* Logo top-left */}
      <Link href="/" style={{
        position: "absolute", top: 24, left: "clamp(20px, 4vw, 36px)",
        textDecoration: "none", zIndex: 10, display: "flex", alignItems: "center", gap: 8,
      }}>
        <strong style={{ fontSize: "clamp(22px, 3vw, 28px)", color: "#fff", letterSpacing: "-0.02em" }}>
          BIZEN<span style={{ color: "#1983FD" }}>.</span>
        </strong>
      </Link>

      <div style={{ position: "relative", zIndex: 2 }}>
        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#050b14] border border-white/10 shadow-[0_0_50px_-12px_rgba(245,158,11,0.2)] rounded-[32px] overflow-hidden",
              headerTitle: "text-3xl font-black tracking-tight text-white",
              headerSubtitle: "text-zinc-500 font-medium",
              main: "gap-6",
              socialButtonsBlockButton: "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-500 rounded-2xl",
              socialButtonsBlockButtonText: "text-white font-bold tracking-tight",
              formButtonPrimary: "bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95",
              formFieldLabel: "text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1",
              formFieldInput: "bg-white/5 border-white/10 text-white rounded-2xl h-12 focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all",
              footerActionLink: "text-amber-500 hover:text-amber-400 font-black transition-colors underline decoration-amber-500/30 underline-offset-4",
              identityPreviewText: "text-white font-bold",
              identityPreviewEditButtonIcon: "text-amber-500",
              dividerLine: "bg-white/10",
              dividerText: "text-zinc-600 text-[10px] uppercase font-bold tracking-widest",
              formFieldInputShowPasswordButton: "text-zinc-500 hover:text-amber-500",
              footer: "bg-black/20 border-t border-white/5",
            },
            variables: {
              colorPrimary: '#f59e0b',
              colorBackground: '#050b14',
              colorText: '#ffffff',
              colorInputBackground: 'transparent',
              colorInputText: '#ffffff',
              borderRadius: '1rem',
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
        />
      </div>

    </main>
  )
}
