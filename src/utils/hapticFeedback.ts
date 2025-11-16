/**
 * Haptic Feedback Utilities for Mobile
 * Provides tactile feedback on supported devices (iOS, Android)
 */

export type HapticFeedbackType = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'warning' 
  | 'error'

/**
 * Check if haptic feedback is supported
 */
export function isHapticFeedbackSupported(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check for Vibration API
  if ('vibrate' in navigator) return true
  
  // Check for iOS Haptic Feedback (iOS 10+)
  if (typeof window !== 'undefined' && 'TapticEngine' in window) return true
  
  return false
}

/**
 * Trigger haptic feedback
 */
export function triggerHapticFeedback(type: HapticFeedbackType = 'medium'): void {
  if (typeof window === 'undefined') return

  // Vibration API (Android and some iOS devices)
  if ('vibrate' in navigator) {
    const patterns: Record<HapticFeedbackType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [20, 50, 20],
      error: [30, 50, 30]
    }
    
    navigator.vibrate(patterns[type])
    return
  }

  // iOS Taptic Engine (iOS 10+)
  const TapticEngine = (window as any).TapticEngine
  if (TapticEngine) {
    try {
      switch (type) {
        case 'light':
          TapticEngine?.selection()
          break
        case 'medium':
          TapticEngine?.impact({ style: 'medium' })
          break
        case 'heavy':
          TapticEngine?.impact({ style: 'heavy' })
          break
        case 'success':
          TapticEngine?.notification({ type: 'success' })
          break
        case 'warning':
          TapticEngine?.notification({ type: 'warning' })
          break
        case 'error':
          TapticEngine?.notification({ type: 'error' })
          break
      }
    } catch (error) {
      // Silently fail if haptic feedback is not available
      console.debug('Haptic feedback not available:', error)
    }
  }
}

/**
 * Trigger haptic feedback for UI interactions
 */
export const haptic = {
  light: () => triggerHapticFeedback('light'),
  medium: () => triggerHapticFeedback('medium'),
  heavy: () => triggerHapticFeedback('heavy'),
  success: () => triggerHapticFeedback('success'),
  warning: () => triggerHapticFeedback('warning'),
  error: () => triggerHapticFeedback('error'),
}

