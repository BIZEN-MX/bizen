import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BIZEN Live",
  description: "Bizen Live — Experiencia en tiempo real",
}

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#060c1d",
      display: "flex",
      flexDirection: "column",
    }}>
      {children}
    </div>
  )
}
