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
import "./globals.css"

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
        <React.Suspense fallback={
          <div className="flex h-screen w-screen items-center justify-center bg-[#FBFAF5]">
             <PageLoader />
          </div>
        }>
          <ClerkProvider>
            <Providers>
              <ClientLayoutWrapper>
                <AppLayout>
                  {children}
                </AppLayout>
              </ClientLayoutWrapper>
              <AchievementToastProvider />
            </Providers>
          </ClerkProvider>
        </React.Suspense>
      </body>
    </html>
  )
}
