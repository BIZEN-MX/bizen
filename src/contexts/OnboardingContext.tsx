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

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
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
    /** Mark a specific page as seen */
    markPageAsSeen: (path: string) => void
    /** Is the user currently in the middle of a setup or tour? */
    isActive: boolean
}

const OnboardingContext = createContext<OnboardingContextType>({
    startTour: () => { },
    markPageAsSeen: () => { },
    isActive: false,
})

export function useOnboarding() {
    return useContext(OnboardingContext)
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const pathname = usePathname()

    const [showSetup, setShowSetup] = useState(false) // profile setup modal
    const [showTour, setShowTour] = useState(false) // page discovery tour
    const [seenPaths, setSeenPaths] = useState<string[]>([])
    const [allSeen, setAllSeen] = useState(false)

    // Load seen paths and global flag from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("bizen_seen_onboarding_paths")
        const globalSeen = localStorage.getItem("bizen_onboarding_all_seen") === "true"
        
        if (globalSeen) {
            setAllSeen(true)
        }

        if (saved) {
            try {
                setSeenPaths(JSON.parse(saved))
            } catch (e) {
                console.error("Error parsing seen paths", e)
            }
        }
    }, [])

    const markAllAsSeen = useCallback(() => {
        setAllSeen(true)
        localStorage.setItem("bizen_onboarding_all_seen", "true")
    }, [])

    const markPageAsSeen = useCallback((path: string) => {
        setSeenPaths(prev => {
            if (prev.includes(path)) return prev
            const next = [...prev, path]
            localStorage.setItem("bizen_seen_onboarding_paths", JSON.stringify(next))
            return next
        })
    }, [])

    // Determine whether to show profile setup on first login
    useEffect(() => {
        if (loading || !user || !pathname) return

        // Skip on excluded paths
        if (SKIP_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return
        if (pathname.startsWith("/diagnostic")) return
        
        // Don't show setup if we are currently in the middle of a ADN evolution reveal
        if (typeof window !== 'undefined' && window.location.search.includes('showEvolution=true')) return

        const isComplete = user.user_metadata?.onboarding_complete === true
        if (!isComplete && !showTour) {
            const timer = setTimeout(() => setShowSetup(true), 700)
            return () => clearTimeout(timer)
        }
    }, [user, loading, pathname, showTour])

    // Discovery mode: trigger tour if we land on a "tourable" page for the first time
    useEffect(() => {
        if (loading || !user || !pathname || showSetup || showTour || allSeen) return
        
        // Don't trigger if profile onboarding isn't done yet
        if (user.user_metadata?.onboarding_complete !== true) return

        // Skip excludes
        if (SKIP_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"))) return

        // Check if this path should have an onboarding
        const tourablePaths = ["/courses", "/dashboard", "/tools/budget", "/tools/vision", "/forum", "/impacto-social", "/tienda", "/leaderboard", "/profile"]
        
        if (tourablePaths.includes(pathname) && !seenPaths.includes(pathname)) {
            // Wait a bit for page to settle
            const timer = setTimeout(() => {
                setShowTour(true)
            }, 1200)
            return () => clearTimeout(timer)
        }
    }, [pathname, seenPaths, loading, user, showSetup, showTour])

    const handleSetupComplete = useCallback(() => {
        setShowSetup(false)
        // Mark the current page as seen so we don't immediately show the discovery overlay on the same page they just landed on
        if (pathname) markPageAsSeen(pathname)
        // User is now free to explore! Discovery mode will trigger as they visit other pages.
    }, [pathname, markPageAsSeen])

    const handleTourEnd = useCallback(() => {
        setShowTour(false)
        markAllAsSeen()
        if (pathname) markPageAsSeen(pathname)
    }, [pathname, markPageAsSeen, markAllAsSeen])

    const startTour = useCallback(() => {
        setShowSetup(false)
        setShowTour(true)
    }, [])

    const isActive = showSetup || showTour

    return (
        <OnboardingContext.Provider value={{ startTour, markPageAsSeen, isActive }}>
            {children}
            {showSetup && <OnboardingModal onComplete={handleSetupComplete} />}
            {showTour && <AppTourOverlay onEnd={handleTourEnd} discoveryMode={true} />}
        </OnboardingContext.Provider>
    )
}
