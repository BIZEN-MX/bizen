import { Suspense } from "react"
import DashboardContent from "./DashboardClient"
import PageLoader from "@/components/PageLoader"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | BIZEN",
  description: "Tu centro de control financiero. Consulta tus estadísticas, sigue tus cursos y mide tu impacto social."
}

export const dynamic = "force-dynamic"

export default function DashboardPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardContent />
    </Suspense>
  )
}
