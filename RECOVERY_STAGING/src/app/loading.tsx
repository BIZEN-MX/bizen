"use client"

import PageLoader from "@/components/PageLoader"

/**
 * Root Loading State
 * Next.js uses this automatically to wrap every page in a Suspense boundary.
 * This is crucial for fixing React Error #310 (bubbled-up suspension).
 */
export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <PageLoader />
    </div>
  )
}
