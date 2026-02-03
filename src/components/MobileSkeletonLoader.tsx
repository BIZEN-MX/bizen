"use client"

interface MobileSkeletonLoaderProps {
  type?: 'card' | 'list' | 'text' | 'button' | 'input'
  count?: number
  width?: string
  height?: string
}

/**
 * Mobile-optimized skeleton loader component
 * Provides smooth loading states for mobile devices
 */
export default function MobileSkeletonLoader({
  type = 'card',
  count = 1,
  width,
  height
}: MobileSkeletonLoaderProps) {
  const getSkeletonStyle = () => {
    const baseStyle: React.CSSProperties = {
      background: '#e5e7eb',
      borderRadius: 8,
      position: 'relative',
      overflow: 'hidden'
    }

    switch (type) {
      case 'card':
        return {
          ...baseStyle,
          width: width || '100%',
          height: height || '120px',
          marginBottom: 16
        }
      case 'list':
        return {
          ...baseStyle,
          width: width || '100%',
          height: height || '60px',
          marginBottom: 12
        }
      case 'text':
        return {
          ...baseStyle,
          width: width || '100%',
          height: height || '16px',
          marginBottom: 8,
          borderRadius: 4
        }
      case 'button':
        return {
          ...baseStyle,
          width: width || '120px',
          height: height || '44px',
          borderRadius: 8
        }
      case 'input':
        return {
          ...baseStyle,
          width: width || '100%',
          height: height || '48px',
          borderRadius: 8,
          marginBottom: 16
        }
      default:
        return baseStyle
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={getSkeletonStyle()}
          data-loading="true"
          aria-label="Loading..."
        />
      ))}
    </>
  )
}


