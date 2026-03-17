// src/app/layout.tsx
import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import { AppLayout } from "@/components/AppLayout"
import { AchievementToastProvider } from "@/components/AchievementToast"
// Production Build Trigger - Wed Feb 18 14:50:00 CST 2026
import "./globals.css"

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
  },
  twitter: {
    card: "summary_large_image",
    title: "BIZEN",
    description: "Educación financiera premium para la nueva generación",
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
    <html lang="es">
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
