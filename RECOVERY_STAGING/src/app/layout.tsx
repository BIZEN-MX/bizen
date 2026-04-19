// src/app/layout.tsx
import type { Metadata } from "next"
import { Geist, Outfit } from "next/font/google"
import { Providers } from "@/components/Providers"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import { AppLayout } from "@/components/AppLayout"
import { AchievementToastProvider } from "@/components/AchievementToast"
import StructuredData from "@/components/SEO/StructuredData"
import PageLoader from "@/components/PageLoader"
import React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { esMX } from "@clerk/localizations" // <- Traducción a español
import { dark } from "@clerk/themes"
import "./globals.css"

// ... (skipping unchanged code for clarity in instructions, but using full replacement)

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})


export const metadata: Metadata = {
  metadataBase: new URL("https://bizen.mx"),
  title: {
    default: "BIZEN - Educación Financiera Premium para Jóvenes",
    template: "%s | BIZEN",
  },
  description: "Plataforma de educación financiera premium para la nueva generación en México. Domina tus finanzas con simuladores, IA y contenido gamificado.",
  applicationName: "BIZEN",
  keywords: [
    "Educación financiera",
    "Finanzas personales",
    "Jóvenes",
    "México",
    "Ahorro",
    "Inversión",
    "Simulador financiero",
    "BIZEN",
    "IA financiera",
    "Estudiantes",
    "Instituciones educativas",
  ],
  authors: [{ name: "BIZEN Team" }],
  category: "education",
  appleWebApp: {
    capable: true,
    title: "BIZEN",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "BIZEN | Educación Financiera Premium",
    description: "La plataforma líder en educación financiera para jóvenes en México. Gamificada, con IA y simuladores reales.",
    url: "https://bizen.mx",
    siteName: "BIZEN",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/og-bizen.png",
        width: 1200,
        height: 630,
        alt: "BIZEN - El futuro de la educación financiera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIZEN | Educación Financiera para Jóvenes",
    description: "Domina tus finanzas personales con BIZEN. Educación financiera premium para la nueva generación.",
    images: ["/og-bizen.png"],
    creator: "@bizen_mx",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/thumbs up.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport = {
  themeColor: "#0056E7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover" as const, // Enable safe area insets for iOS devices with notches
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${outfit.variable}`}>

      <head>
        <StructuredData />
      </head>
      <body>
        <React.Suspense fallback={null}>
          <ClerkProvider 
            localization={esMX}
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} 
            signInUrl="/login"
            signUpUrl="/signup"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#0F62FE",
                colorBackground: "#060f20",
                colorInputBackground: "#0a1324",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "rgba(148,163,184,0.9)",
                colorNeutral: "#94a3b8",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-geist), Inter, sans-serif",
                fontFamilyButtons: "var(--font-outfit), Outfit, sans-serif",
                fontSize: "15px",
                spacingUnit: "1rem",
              },
            }}
          >
            <Providers>
              <ClientLayoutWrapper>
                 {children}
              </ClientLayoutWrapper>
            </Providers>
          </ClerkProvider>
        </React.Suspense>
      </body>
    </html>
  )
}
