"use client"

import { useState, useRef, useEffect, useCallback } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number // Minimum distance in pixels to trigger swipe
  velocity?: number // Minimum velocity to trigger swipe
  preventDefault?: boolean
}

export function useSwipeGesture(options: SwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
    preventDefault = true
  } = options

  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null)
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    touchEnd.current = null
    setIsSwiping(true)
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }
  }, [preventDefault])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touch = e.changedTouches[0]
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    if (!touchStart.current || !touchEnd.current) return

    const deltaX = touchEnd.current.x - touchStart.current.x
    const deltaY = touchEnd.current.y - touchStart.current.y
    const deltaTime = touchEnd.current.time - touchStart.current.time
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const swipeVelocity = distance / deltaTime

    // Check if swipe meets threshold and velocity requirements
    if (distance < threshold || swipeVelocity < velocity) {
      setIsSwiping(false)
      setSwipeDirection(null)
      return
    }

    // Determine primary direction (horizontal or vertical)
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        setSwipeDirection('right')
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        setSwipeDirection('left')
        onSwipeLeft()
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        setSwipeDirection('down')
        onSwipeDown()
      } else if (deltaY < 0 && onSwipeUp) {
        setSwipeDirection('up')
        onSwipeUp()
      }
    }

    setIsSwiping(false)
    // Reset direction after animation
    setTimeout(() => setSwipeDirection(null), 300)
  }, [threshold, velocity, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  const attachSwipeListeners = useCallback((element: HTMLElement | null) => {
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault])

  return {
    isSwiping,
    swipeDirection,
    attachSwipeListeners
  }
}

