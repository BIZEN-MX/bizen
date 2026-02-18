// src/app/layout.tsx
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"
import { SettingsProvider } from "@/contexts/SettingsContext"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import { AppLayout } from "@/components/AppLayout"
import { BillyTourProvider } from "@/components/billy-tour/BillyTourProvider"
// Production Build Trigger - Wed Feb 18 14:50:00 CST 2026
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
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SettingsProvider>
          <AuthProvider>
            <BillyTourProvider>
              <AppLayout>
                <ClientLayoutWrapper>
                  {children}
                </ClientLayoutWrapper>
              </AppLayout>
            </BillyTourProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
