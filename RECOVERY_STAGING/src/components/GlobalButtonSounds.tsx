"use client"

import { useEffect } from "react"
import { playClickSound } from "@/utils/sounds"

/**
 * Global component that adds click sounds to ALL buttons in the app
 * Add this once to your root layout and all buttons will have click sounds!
 */
export default function GlobalButtonSounds() {
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check if clicked element or its parent is a button-like element
      const element = target.closest('button, a, [role="button"], .btn, [onclick], [data-testid*="button"]') as HTMLElement
      
      if (element) {
        // Don't play sound if button is disabled or has aria-disabled
        const isDisabled = 
          (element as HTMLButtonElement).disabled ||
          element.getAttribute('aria-disabled') === 'true' ||
          element.classList.contains('disabled')
        
        // Don't play sound for certain elements (customize as needed)
        const shouldSkip = 
          element.hasAttribute('data-no-sound') ||
          element.closest('[data-no-sound]')
        
        if (!isDisabled && !shouldSkip) {
          playClickSound()
        }
      }
    }

    // Add click listener to document (capture phase to catch it early)
    document.addEventListener('click', handleButtonClick, true)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleButtonClick, true)
    }
  }, [])

  // This component doesn't render anything
  return null
}

