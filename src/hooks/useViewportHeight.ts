"use client"

import { useEffect, useState } from 'react'

/**
 * Hook to fix iOS Safari viewport height issues
 * Updates CSS variable for dynamic viewport height
 */
export function useViewportHeight() {
  const [vh, setVh] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      setVh(vh)
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Set initial value
    setViewportHeight()

    // Update on resize and orientation change
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)

    // Also listen for visual viewport changes (iOS Safari)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setViewportHeight)
    }

    return () => {
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setViewportHeight)
      }
    }
  }, [])

  return vh
}

