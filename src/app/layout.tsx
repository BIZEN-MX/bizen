// src/app/layout.tsx
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "BIZEN App",
  description: "Modern web app scaffold",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ height: "100%", margin: 0, padding: 0 }}>
      <body style={{ margin: 0, padding: 0, height: "100%", minHeight: "100vh", width: "100vw", overflowX: "hidden", background: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #BFDBFE 100%)" }}>
        <SettingsProvider>
          <AuthProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
