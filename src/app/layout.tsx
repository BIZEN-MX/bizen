// src/app/layout.tsx
import type { Metadata } from "next"
import { Geist, Outfit } from "next/font/google"
import { Providers } from "@/components/Providers"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import { AppLayout } from "@/components/AppLayout"
import { AchievementToastProvider } from "@/components/AchievementToast"
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
  title: "BIZEN",
  description: "Educación financiera premium para la nueva generación",
  applicationName: "BIZEN",
  appleWebApp: {
    capable: true,
    title: "BIZEN",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "BIZEN",
    description: "Educación financiera premium para la nueva generación",
    url: "https://bizen.mx",
    siteName: "BIZEN",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/og-bizen.png",
        width: 1200,
        height: 630,
        alt: "BIZEN - Educación Financiera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIZEN",
    description: "Educación financiera premium para la nueva generación",
    images: ["/og-bizen.png"],
  },
  icons: {
    icon: "/thumbs up.png",
    apple: "/thumbs up.png",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover" as const, // Enable safe area insets for iOS devices with notches
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geist.variable} ${outfit.variable}`}>

      <head />
      <body>
        <Providers>
          <ClientLayoutWrapper>
            <AppLayout>
              {children}
            </AppLayout>
          </ClientLayoutWrapper>
          <AchievementToastProvider />
        </Providers>
      </body>
    </html>
  )
}
