"use client"

import { useEffect, useRef, useCallback, useState } from 'react'

interface InfiniteScrollOptions {
  onLoadMore: () => Promise<void> | void
  hasMore: boolean
  threshold?: number // Distance from bottom to trigger load
  disabled?: boolean
  rootMargin?: string
}

export function useInfiniteScroll(options: InfiniteScrollOptions) {
  const {
    onLoadMore,
    hasMore,
    threshold = 200,
    disabled = false,
    rootMargin = '200px'
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || disabled) return

    setIsLoading(true)
    try {
      await onLoadMore()
    } catch (error) {
      console.error('Infinite scroll error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [onLoadMore, hasMore, isLoading, disabled])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || disabled || !hasMore) return

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isLoading) {
          handleLoadMore()
        }
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: 0.1
      }
    )

    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current && sentinel) {
        observerRef.current.unobserve(sentinel)
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, disabled, isLoading, handleLoadMore, rootMargin])

  return {
    isLoading,
    sentinelRef
  }
}

