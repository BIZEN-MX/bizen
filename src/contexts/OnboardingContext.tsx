"use client"

/**
 * OnboardingContext
 *
 * Manages two independent flows:
 *
 * 1. PROFILE SETUP   (OnboardingModal)
 *    — Shown only once on first login (user_metadata.onboarding_complete !== true)
 *    — After completion, immediately starts the App Tour
 *
 * 2. APP TOUR        (AppTourOverlay)
 *    — Navigates the user through each main page with a floating guide card
 *    — Can be replayed any time via startTour()
 *
 * Both flows are portal-rendered at the root so they work on every page.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuth } from "@/contexts/AuthContext"

// Lazy-load both heavy components
const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), { ssr: false })
const AppTourOverlay = dynamic(() => import("@/components/AppTourOverlay"), { ssr: false })

// Pages where neither overlay should appear
const SKIP_PATHS = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/bizen/privacidad",
    "/bizen/terminos",
    "/payment",
]

interface OnboardingContextType {
    /** Start (or restart) the app navigation tour */
    startTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType>({
    startTour: () => { },
})

export function useOnboarding() {
    return useContext(OnboardingContext)
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const pathname = usePathname()

    const [showSetup, setShowSetup] = useState(false) // profile setup modal
    const [showTour, setShowTour] = useState(false) // navigation tour overlay

    // Determine whether to show profile setup on first login
    useEffect(() => {
        if (loading) return
        if (!user) return
        if (!pathname) return

        // Skip on excluded paths
        if (SKIP_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return
        // Skip on diagnostic pages
        if (pathname.startsWith("/diagnostic")) return

        const isComplete = user.user_metadata?.onboarding_complete === true
        if (!isComplete && !showTour) {
            const timer = setTimeout(() => setShowSetup(true), 700)
            return () => clearTimeout(timer)
        }
        // Only re-run when user or pathname change, not on showTour toggle
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading, pathname])

    // Called when the profile setup modal finishes
    const handleSetupComplete = useCallback(() => {
        setShowSetup(false)
        // Small gap so the modal fully exits before tour slides in
        setTimeout(() => setShowTour(true), 400)
    }, [])

    // Called when the tour finishes/skips
    const handleTourEnd = useCallback(() => {
        setShowTour(false)
    }, [])

    // Public API — trigger tour from anywhere (e.g. profile page button)
    const startTour = useCallback(() => {
        setShowSetup(false)
        setShowTour(true)
    }, [])

    return (
        <OnboardingContext.Provider value={{ startTour }}>
            {children}
            {showSetup && <OnboardingModal onComplete={handleSetupComplete} />}
            {showTour && <AppTourOverlay onEnd={handleTourEnd} />}
        </OnboardingContext.Provider>
    )
}
