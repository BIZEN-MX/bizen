"use client"

import * as React from "react"
import Link from "next/link"
import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function BIZENSignupPage() {
  React.useEffect(() => {
    document.documentElement.style.overflow = "auto"
    document.body.style.overflow = "auto"
    document.body.style.background = "#030b1a"
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
      background: "linear-gradient(145deg, #030b1a 0%, #060f26 40%, #030b1a 100%)",
      overflow: "hidden",
      padding: "clamp(16px, 4vw, 40px)",
      boxSizing: "border-box",
    }}>

      {/* Mesh grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      {/* Top-left orb */}
      <div aria-hidden style={{
        position: "absolute", top: "-18%", left: "-8%",
        width: "clamp(300px, 50vw, 600px)", height: "clamp(300px, 50vw, 600px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)",
        filter: "blur(70px)", zIndex: 0,
      }} />

      {/* Bottom-right orb */}
      <div aria-hidden style={{
        position: "absolute", bottom: "-15%", right: "-8%",
        width: "clamp(250px, 40vw, 500px)", height: "clamp(250px, 40vw, 500px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,78,216,0.15) 0%, transparent 65%)",
        filter: "blur(80px)", zIndex: 0,
      }} />

      {/* Logo */}
      <Link href="/" style={{
        position: "absolute", top: 28, left: "clamp(20px, 4vw, 40px)",
        textDecoration: "none", zIndex: 10, display: "flex", alignItems: "center", gap: 10,
      }}>
        <strong style={{
          fontSize: "clamp(22px, 2.5vw, 28px)", color: "#fff",
          letterSpacing: "-0.03em", fontWeight: 900,
        }}>
          BIZEN<span style={{ color: "#3b82f6" }}>.</span>
        </strong>
      </Link>

      {/* Top right badge */}
      <div style={{
        position: "absolute", top: 32, right: "clamp(20px, 4vw, 40px)",
        zIndex: 10, display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#3b82f6", boxShadow: "0 0 10px rgba(59,130,246,0.9)",
        }} />
        <span style={{
          fontSize: 11, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
        }}>
          Educación Financiera Premium
        </span>
      </div>

      {/* Card wrapper */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 440 }}>

        {/* Card glow */}
        <div aria-hidden style={{
          position: "absolute", inset: -1, borderRadius: 28,
          background: "linear-gradient(135deg, rgba(59,130,246,0.4) 0%, rgba(29,78,216,0.2) 50%, transparent 80%)",
          filter: "blur(16px)", zIndex: -1,
        }} />

        <SignUp
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: "mx-auto w-full",

              card: [
                "relative w-full overflow-hidden",
                "rounded-[24px]",
              ].join(" "),

              headerTitle: "text-white font-black text-[30px] tracking-tight pb-1",
              headerSubtitle: "text-[#94a3b8] text-[14px] font-medium",

              main: "gap-4",

              // Google button - WHITE, dark text = max contrast
              socialButtonsBlockButton: [
                "w-full h-[50px] rounded-2xl",
                "bg-white hover:bg-[#f1f5f9]",
                "border border-[#e2e8f0]",
                "transition-all duration-200 shadow-sm hover:shadow-md",
              ].join(" "),
              socialButtonsBlockButtonText: "text-[#0f172a] font-semibold text-[14px]",
              socialButtonsBlockButtonArrow: "hidden",

              // CTA button - solid blue, white text
              formButtonPrimary: [
                "w-full h-[50px] rounded-2xl font-bold text-[15px]",
                "bg-[#2563eb] hover:bg-[#1d4ed8]",
                "text-white",
                "shadow-[0_4px_20px_rgba(37,99,235,0.5)]",
                "hover:shadow-[0_6px_28px_rgba(37,99,235,0.65)]",
                "transition-all duration-200 active:scale-[0.98] border-none",
              ].join(" "),

              // Labels - high contrast, readable
              formFieldLabel: "text-[#94a3b8] text-[12px] font-semibold uppercase tracking-[0.08em] mb-1",

              // Inputs - dark fill, visible border, white text
              formFieldInput: [
                "w-full h-[48px] rounded-xl px-4",
                "bg-[#0d1e3d] border border-[#1e3a5f]",
                "text-white text-[15px] placeholder:text-[#4a6280] font-medium",
                "focus:border-[#3b82f6] focus:bg-[#0d2040]",
                "focus:ring-2 focus:ring-[rgba(59,130,246,0.3)] focus:outline-none",
                "transition-all duration-200",
              ].join(" "),
              formFieldInputShowPasswordButton: "text-[#4a6280] hover:text-[#60a5fa] transition-colors",

              // Links - bright readable blue
              footerActionLink: "text-[#60a5fa] hover:text-[#93c5fd] font-semibold transition-colors underline-offset-4",
              footerAction: "text-[#64748b] text-[13px]",

              identityPreviewText: "text-white font-semibold",
              identityPreviewEditButtonIcon: "text-[#3b82f6]",

              dividerLine: "bg-[#1e3a5f]",
              dividerText: "text-[#475569] text-[11px] uppercase tracking-[0.15em] font-semibold",

              footer: "bg-[rgba(3,11,26,0.6)] border-t border-[#0f2040] py-5",

              formFieldErrorText: "text-[#f87171] text-[13px] font-medium mt-1",
              alertText: "text-[#fecaca] text-[13px] font-medium",
              alert: "bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] rounded-xl",

              otpCodeFieldInput: [
                "!bg-[#0d1e3d] !border-[#1e3a5f] !text-white",
                "focus:!border-[#3b82f6]",
              ].join(" "),

              formResendCodeLink: "text-[#60a5fa] hover:text-[#93c5fd] font-semibold transition-colors",
            },
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#060f26',
              colorText: '#ffffff',
              colorTextSecondary: '#94a3b8',
              colorInputBackground: '#0d1e3d',
              colorInputText: '#ffffff',
              colorNeutral: '#1e3a5f',
              colorDanger: '#f87171',
              colorSuccess: '#34d399',
              borderRadius: '0.875rem',
              fontSize: '1rem',
              fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
              fontWeight: { normal: 400, medium: 500, bold: 700 },
              spacingUnit: '1rem',
            }
          }}
          routing="path"
          path="/signup"
          signInUrl="/login"
          socialButtonsPlacement="top"
          socialButtonsVariant="blockButton"
          forceRedirectUrl="/onboarding"
          fallbackRedirectUrl="/onboarding"
        />
      </div>

      {/* Bottom badge */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        zIndex: 10, display: "flex", alignItems: "center", gap: 8,
        whiteSpace: "nowrap",
      }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 6px rgba(59,130,246,0.9)" }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Plataforma segura · TLS 1.3
        </span>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 6px rgba(59,130,246,0.9)" }} />
      </div>

    </main>
  )
}
