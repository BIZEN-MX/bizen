"use client"

import { useEffect, useRef, useState } from 'react'

interface KeyboardHandlerOptions {
  onKeyboardShow?: () => void
  onKeyboardHide?: () => void
  scrollToInput?: boolean
  offset?: number // Offset from top when scrolling to input
}

/**
 * Hook to handle keyboard appearance on mobile devices
 * Automatically scrolls to focused input when keyboard appears
 */
export function useKeyboardHandler(options: KeyboardHandlerOptions = {}) {
  const {
    onKeyboardShow,
    onKeyboardHide,
    scrollToInput = true,
    offset = 100
  } = options

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const viewportHeightRef = useRef<number>(0)
  const activeInputRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Store initial viewport height
    viewportHeightRef.current = window.innerHeight

    const handleResize = () => {
      const currentHeight = window.innerHeight
      const heightDiff = viewportHeightRef.current - currentHeight

      // Keyboard is likely visible if viewport shrunk significantly (>150px)
      const keyboardVisible = heightDiff > 150

      if (keyboardVisible !== isKeyboardVisible) {
        setIsKeyboardVisible(keyboardVisible)

        if (keyboardVisible) {
          // Keyboard appeared
          if (scrollToInput) {
            // Find active input
            const activeElement = document.activeElement as HTMLElement
            if (activeElement && (
              activeElement.tagName === 'INPUT' ||
              activeElement.tagName === 'TEXTAREA' ||
              activeElement.tagName === 'SELECT'
            )) {
              activeInputRef.current = activeElement
              
              // Scroll to input with offset
              setTimeout(() => {
                if (activeElement) {
                  const rect = activeElement.getBoundingClientRect()
                  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
                  const targetY = scrollTop + rect.top - offset
                  
                  window.scrollTo({
                    top: Math.max(0, targetY),
                    behavior: 'smooth'
                  })
                }
              }, 100)
            }
          }
          onKeyboardShow?.()
        } else {
          // Keyboard hidden
          activeInputRef.current = null
          onKeyboardHide?.()
        }
      }

      // Update stored height
      viewportHeightRef.current = currentHeight
    }

    // Listen for viewport resize (keyboard show/hide)
    window.addEventListener('resize', handleResize)
    
    // Also listen for focus events on inputs
    const handleInputFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        activeInputRef.current = target
        
        // Small delay to let keyboard appear
        setTimeout(() => {
          if (scrollToInput && target) {
            const rect = target.getBoundingClientRect()
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop
            const targetY = scrollTop + rect.top - offset
            
            window.scrollTo({
              top: Math.max(0, targetY),
              behavior: 'smooth'
            })
          }
        }, 300)
      }
    }

    document.addEventListener('focusin', handleInputFocus)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('focusin', handleInputFocus)
    }
  }, [isKeyboardVisible, scrollToInput, offset, onKeyboardShow, onKeyboardHide])

  return {
    isKeyboardVisible
  }
}

