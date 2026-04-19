"use client"

import { useState, useRef, useCallback, useEffect } from 'react'

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void
  threshold?: number // Distance in pixels to trigger refresh
  disabled?: boolean
  resistance?: number // How much to resist pull (0-1)
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    disabled = false,
    resistance = 0.5
  } = options

  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStart = useRef<{ y: number; scrollTop: number } | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const element = elementRef.current
    if (!element || disabled || isRefreshing) return

    const scrollTop = element.scrollTop || window.scrollY
    // Only allow pull-to-refresh when at the very top of the page (within 5px)
    if (scrollTop <= 5) {
      touchStart.current = {
        y: e.touches[0].clientY,
        scrollTop: scrollTop
      }
    } else {
      // If not at top, don't track touch
      touchStart.current = null
    }
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current || disabled || isRefreshing) return

    const currentY = e.touches[0].clientY
    const deltaY = currentY - touchStart.current.y

    const element = elementRef.current
    const scrollTop = element?.scrollTop || window.scrollY

    // If scrolling up (deltaY < 0) or not at top, cancel pull-to-refresh
    if (deltaY < 0 || scrollTop > 5) {
      touchStart.current = null
      setPullDistance(0)
      setIsPulling(false)
      if (element) {
        element.style.transform = ''
      }
      return
    }

    // Only allow downward pull when at the very top
    if (deltaY > 0 && scrollTop <= 5) {
      // Don't prevent default here - let touchMoveHandler decide
      // Only update state if pulling down significantly
      if (deltaY > 20) {
        const distance = deltaY * resistance
        setPullDistance(distance)
        setIsPulling(distance > 10)

        // Visual feedback - add transform to body
        if (element) {
          element.style.transform = `translateY(${distance}px)`
        }
      }
    }
  }, [disabled, isRefreshing, resistance])

  const handleTouchEnd = useCallback(async () => {
    if (!touchStart.current || disabled || isRefreshing) return

    const element = elementRef.current

    if (pullDistance >= threshold) {
      // Trigger refresh
      setIsRefreshing(true)
      setIsPulling(false)

      try {
        await onRefresh()
      } catch (error) {
        console.error('Pull-to-refresh error:', error)
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        if (element) {
          element.style.transform = ''
          element.style.transition = ''
          // Force reflow to ensure transform is cleared
          void element.offsetHeight
        }
      }
    } else {
      // Snap back
      setIsPulling(false)
      setPullDistance(0)
      if (element) {
        element.style.transition = 'transform 0.3s ease-out'
        element.style.transform = ''
        setTimeout(() => {
          if (element) {
            element.style.transition = ''
            // Force reflow to ensure transform is cleared
            void element.offsetHeight
          }
        }, 300)
      }
    }

    touchStart.current = null
  }, [pullDistance, threshold, onRefresh, disabled, isRefreshing])

  const attachPullListeners = useCallback((element: HTMLElement | null) => {
    if (!element) return

    elementRef.current = element
    
    // Use passive listeners for better scroll performance
    // Only make touchmove non-passive if we're actually at the top
    const touchMoveHandler = (e: TouchEvent) => {
      const scrollTop = element.scrollTop || window.scrollY
      
      // If not at top or no touch start, don't prevent default (allow normal scroll)
      if (scrollTop > 5 || !touchStart.current) {
        handleTouchMove(e)
        return
      }
      
      // Only prevent default if we're at top and pulling down significantly
      const currentY = e.touches[0].clientY
      const deltaY = currentY - touchStart.current.y
      
      // Only prevent default if pulling down more than 25px (allows normal scroll to work)
      if (deltaY > 25) {
        e.preventDefault()
      }
      
      handleTouchMove(e)
    }
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', touchMoveHandler, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', touchMoveHandler)
      element.removeEventListener('touchend', handleTouchEnd)
      const el = elementRef.current
      if (el) {
        el.style.transform = ''
        el.style.transition = ''
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    attachPullListeners,
    refreshThreshold: threshold
  }
}

