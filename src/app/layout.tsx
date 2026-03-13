// src/app/layout.tsx
import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"
import { AppLayout } from "@/components/AppLayout"
// Production Build Trigger - Wed Feb 18 14:50:00 CST 2026
import "./globals.css"

export const metadata: Metadata = {
  title: "BIZEN",
  description: "Educación financiera premium para la nueva generación",
  openGraph: {
    title: "BIZEN",
    description: "Educación financiera premium para la nueva generación",
    type: "website",
    locale: "es_MX",
    siteName: "BIZEN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIZEN",
    description: "Educación financiera premium para la nueva generación",
  },
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
      </head>
      <body>
        <Providers>
          <ClientLayoutWrapper>
            <AppLayout>
              {children}
            </AppLayout>
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
