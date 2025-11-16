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
    // Only allow pull-to-refresh when at the top of the page
    if (scrollTop <= 0) {
      touchStart.current = {
        y: e.touches[0].clientY,
        scrollTop: scrollTop
      }
    }
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current || disabled || isRefreshing) return

    const currentY = e.touches[0].clientY
    const deltaY = currentY - touchStart.current.y

    // Only allow downward pull
    if (deltaY > 0) {
      const element = elementRef.current
      const scrollTop = element?.scrollTop || window.scrollY

      // Only if we're at the top
      if (scrollTop <= 0) {
        e.preventDefault()
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
          }
        }, 300)
      }
    }

    touchStart.current = null
  }, [pullDistance, threshold, onRefresh, disabled, isRefreshing])

  const attachPullListeners = useCallback((element: HTMLElement | null) => {
    if (!element) return

    elementRef.current = element
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
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

