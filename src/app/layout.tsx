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
    viewportFit: "cover", // Enable safe area insets for iOS devices with notches
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ height: "100%", margin: 0, padding: 0 }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ margin: 0, padding: 0, height: "100%", overflowX: "hidden", fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
        <div className="app-root">
          <div className="app-bg" />
          <div className="app-content">
            <SettingsProvider>
              <AuthProvider>
                <ClientLayoutWrapper>
                  {children}
                </ClientLayoutWrapper>
              </AuthProvider>
            </SettingsProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
