import { Suspense } from "react"
import ForumContent from "./ForumClient"
import PageLoader from "@/components/PageLoader"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Comunidad | BIZEN",
  description: "Únete a la comunidad de BIZEN. Comparte tus aprendizajes, resuelve tus dudas financieras y colabora con otros usuarios."
}

/**
 * Server-Side Entry Point for Forum
 * Next.js 15 requires useSearchParams to be wrapped in a Suspense boundary 
 * provided by a parent/server component to avoid hydration mismatches.
 */
export default function ForumPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ForumContent />
    </Suspense>
  )
}
