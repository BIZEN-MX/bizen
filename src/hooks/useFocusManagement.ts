"use client"

import { useEffect, useRef } from 'react'

interface FocusManagementOptions {
  trapFocus?: boolean // Trap focus within element
  restoreFocus?: boolean // Restore focus on unmount
  initialFocus?: HTMLElement | string // Element to focus initially
  skipFocusable?: string[] // Selectors to skip
}

/**
 * Hook for managing focus on mobile devices
 * Provides visible focus indicators and proper tab order
 */
export function useFocusManagement(
  elementRef: React.RefObject<HTMLElement>,
  options: FocusManagementOptions = {}
) {
  const {
    trapFocus = false,
    restoreFocus = false,
    initialFocus,
    skipFocusable = []
  } = options

  const previousActiveElement = useRef<HTMLElement | null>(null)
  const firstFocusableRef = useRef<HTMLElement | null>(null)
  const lastFocusableRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Store previous active element for restoration
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement
    }

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ]
        .filter(selector => !skipFocusable.some(skip => selector.includes(skip)))
        .join(', ')

      return Array.from(element.querySelectorAll(focusableSelectors)) as HTMLElement[]
    }

    // Set initial focus
    if (initialFocus) {
      const focusElement = typeof initialFocus === 'string'
        ? element.querySelector(initialFocus) as HTMLElement
        : initialFocus

      if (focusElement) {
        setTimeout(() => focusElement.focus(), 100)
      }
    }

    // Trap focus within element
    if (trapFocus) {
      const focusableElements = getFocusableElements()
      
      if (focusableElements.length > 0) {
        firstFocusableRef.current = focusableElements[0]
        lastFocusableRef.current = focusableElements[focusableElements.length - 1]

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return

          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableRef.current) {
              e.preventDefault()
              lastFocusableRef.current?.focus()
            }
          } else {
            // Tab
            if (document.activeElement === lastFocusableRef.current) {
              e.preventDefault()
              firstFocusableRef.current?.focus()
            }
          }
        }

        element.addEventListener('keydown', handleKeyDown)

        return () => {
          element.removeEventListener('keydown', handleKeyDown)
          
          // Restore previous focus
          if (restoreFocus && previousActiveElement.current) {
            previousActiveElement.current.focus()
          }
        }
      }
    }

    return () => {
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [elementRef, trapFocus, restoreFocus, initialFocus, skipFocusable])
}

