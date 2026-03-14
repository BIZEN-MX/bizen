// src/app/layout.tsx
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import GlobalButtonSounds from "@/components/GlobalButtonSounds"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "BIZEN",
  description: "BIZEN",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ height: "100%" }}>
      <body style={{ margin: 0, background: "#fff", height: "100%", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
        <AuthProvider>
          <GlobalButtonSounds />
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
