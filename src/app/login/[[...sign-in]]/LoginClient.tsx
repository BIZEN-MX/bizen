"use client"

import * as React from "react"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function LoginClient() {
  React.useEffect(() => {
    document.documentElement.style.overflow = "auto"
    document.body.style.overflow = "auto"
    document.body.style.background = "#020e27"
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
      background: "linear-gradient(135deg, #020e27 0%, #041640 50%, #020e27 100%)",
      overflow: "hidden",
      padding: "clamp(16px, 4vw, 40px)",
      boxSizing: "border-box",
    }}>

      {/* Animated mesh grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(15,98,254,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,98,254,0.06) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Primary blue orb — top left */}
      <div aria-hidden style={{
        position: "absolute", top: "-15%", left: "-10%",
        width: "clamp(320px, 55vw, 640px)", height: "clamp(320px, 55vw, 640px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(15,98,254,0.25) 0%, transparent 70%)",
        filter: "blur(60px)", zIndex: 0,
      }} />

      {/* Accent blue orb — bottom right */}
      <div aria-hidden style={{
        position: "absolute", bottom: "-20%", right: "-12%",
        width: "clamp(280px, 48vw, 560px)", height: "clamp(280px, 48vw, 560px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,86,231,0.20) 0%, transparent 70%)",
        filter: "blur(70px)", zIndex: 0,
      }} />

      {/* Subtle highlight orb — center */}
      <div aria-hidden style={{
        position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        width: "clamp(200px, 35vw, 400px)", height: "clamp(200px, 35vw, 400px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(25,131,253,0.08) 0%, transparent 70%)",
        filter: "blur(40px)", zIndex: 0,
      }} />

      {/* Logo */}
      <Link href="/" style={{
        position: "absolute", top: 28, left: "clamp(20px, 4vw, 40px)",
        textDecoration: "none", zIndex: 10, display: "flex", alignItems: "center", gap: 10,
      }}>
        <strong style={{
          fontSize: "clamp(24px, 3vw, 30px)", color: "#fff",
          letterSpacing: "-0.03em", fontWeight: 900,
        }}>
          BIZEN<span style={{ color: "#0F62FE" }}>.</span>
        </strong>
      </Link>

      {/* Tagline top right */}
      <div style={{
        position: "absolute", top: 32, right: "clamp(20px, 4vw, 40px)",
        zIndex: 10, display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{
          fontSize: 12, color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
        }}>
          Educación Financiera Premium
        </span>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#0F62FE",
          boxShadow: "0 0 8px rgba(15,98,254,0.8)",
        }} />
      </div>

      {/* Card container */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 460 }}>

        {/* Glow ring behind card */}
        <div aria-hidden style={{
          position: "absolute", inset: -2, borderRadius: 36,
          background: "linear-gradient(135deg, rgba(15,98,254,0.3), rgba(0,86,231,0.15), transparent 60%)",
          filter: "blur(20px)", zIndex: -1,
        }} />

        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "mx-auto w-full",
              card: [
                "relative w-full overflow-hidden",
                "bg-[rgba(4,22,64,0.85)]",
                "border border-[rgba(15,98,254,0.2)]",
                "rounded-[32px]",
                "shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(15,98,254,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]",
                "backdrop-blur-[24px]",
              ].join(" "),

              headerTitle: [
                "text-[28px] sm:text-[32px] font-black tracking-[-0.03em] text-white",
                "pb-2",
              ].join(" "),
              headerSubtitle: "text-[rgba(255,255,255,0.45)] text-sm font-medium",

              main: "gap-5 pb-2",

              // Google button — premium glass
              socialButtonsBlockButton: [
                "group relative w-full h-[52px] rounded-2xl overflow-hidden",
                "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]",
                "hover:bg-[rgba(15,98,254,0.12)] hover:border-[rgba(15,98,254,0.4)]",
                "transition-all duration-300",
              ].join(" "),
              socialButtonsBlockButtonText: "text-white font-semibold text-[15px] tracking-[-0.01em]",
              socialButtonsBlockButtonArrow: "hidden",

              // Primary action button — BIZEN blue
              formButtonPrimary: [
                "w-full h-[52px] rounded-2xl font-bold text-[15px] tracking-[-0.01em]",
                "bg-[#0F62FE] hover:bg-[#0043ce]",
                "text-white",
                "shadow-[0_8px_24px_rgba(15,98,254,0.45)]",
                "hover:shadow-[0_12px_32px_rgba(15,98,254,0.55)]",
                "transition-all duration-300 active:scale-[0.98]",
                "border-0",
              ].join(" "),

              formFieldLabel: [
                "text-[rgba(255,255,255,0.5)] text-[11px] uppercase tracking-[0.12em] font-semibold mb-1.5",
              ].join(" "),
              formFieldInput: [
                "w-full h-[50px] rounded-xl px-4",
                "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]",
                "text-white text-[15px] placeholder:text-[rgba(255,255,255,0.25)]",
                "focus:border-[rgba(15,98,254,0.6)] focus:bg-[rgba(15,98,254,0.06)]",
                "focus:ring-2 focus:ring-[rgba(15,98,254,0.25)] focus:outline-none",
                "transition-all duration-200",
              ].join(" "),
              formFieldInputShowPasswordButton: "text-[rgba(255,255,255,0.3)] hover:text-[rgba(15,98,254,0.9)] transition-colors",

              footerActionLink: [
                "text-[#1983FD] hover:text-[#5aabff] font-semibold",
                "transition-colors duration-200",
                "underline-offset-4 decoration-[rgba(25,131,253,0.4)]",
              ].join(" "),
              footerAction: "text-[rgba(255,255,255,0.4)] text-sm",

              identityPreviewText: "text-white font-semibold",
              identityPreviewEditButtonIcon: "text-[#0F62FE]",

              dividerLine: "bg-[rgba(255,255,255,0.07)]",
              dividerText: "text-[rgba(255,255,255,0.3)] text-[11px] uppercase tracking-[0.2em] font-semibold",

              footer: [
                "bg-[rgba(0,0,0,0.25)] border-t border-[rgba(255,255,255,0.05)]",
                "py-5",
              ].join(" "),

              // Alert / error messages
              formFieldErrorText: "text-red-400 text-sm mt-1",
              alertText: "text-white text-sm",
              alert: "bg-red-500/10 border border-red-500/20 rounded-xl",
            },
            variables: {
              colorPrimary: '#0F62FE',
              colorBackground: '#041640',
              colorText: '#ffffff',
              colorTextSecondary: 'rgba(255,255,255,0.5)',
              colorInputBackground: 'rgba(255,255,255,0.04)',
              colorInputText: '#ffffff',
              colorNeutral: 'rgba(255,255,255,0.15)',
              colorDanger: '#f87171',
              borderRadius: '1rem',
              fontSize: '1rem',
              fontFamily: '"Inter", "Geist", ui-sans-serif, system-ui, sans-serif',
              spacingUnit: '1rem',
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
          socialButtonsPlacement="top"
          socialButtonsVariant="blockButton"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
        />
      </div>

      {/* Bottom badge */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 10, display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#0F62FE", boxShadow: "0 0 6px rgba(15,98,254,0.9)",
        }} />
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.12em", textTransform: "uppercase",
        }}>
          Plataforma segura · TLS 1.3
        </span>
        <div style={{
          width: 5, height: 5, borderRadius: "50%",
          background: "#0F62FE", boxShadow: "0 0 6px rgba(15,98,254,0.9)",
        }} />
      </div>

    </main>
  )
}
