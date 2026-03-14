import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BIZEN",
  description: "BIZEN",
}

export default function BizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ height: "100%" }}>
      <body style={{ margin: 0, background: "#fff" }}>
        {children}
      </body>
    </html>
  )
}


