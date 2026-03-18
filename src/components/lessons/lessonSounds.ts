/**
 * Sound utilities for lesson interactions
 * Provides correct/incorrect feedback sounds
 */

let globalAudioContext: AudioContext | null = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  
  if (!globalAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    globalAudioContext = new AudioContextClass()
  }
  
  if (globalAudioContext?.state === 'suspended') {
    globalAudioContext.resume()
  }
  
  return globalAudioContext
}

export const playCorrectSound = () => {
  const audioContext = getAudioContext()
  if (!audioContext) return

  try {
    // Play a pleasant ascending chord for correct answers
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.2) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime + startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration)

      oscillator.start(audioContext.currentTime + startTime)
      oscillator.stop(audioContext.currentTime + startTime + duration)
    }

    // Play a pleasant ascending chord (C major)
    playTone(523.25, 0, 0.15, 0.25)    // C5
    playTone(659.25, 0.05, 0.15, 0.25)  // E5
    playTone(783.99, 0.1, 0.2, 0.3)     // G5 (final note, louder)
  } catch (error) {
    console.log('Could not play correct sound:', error)
  }
}

export const playIncorrectSound = () => {
  const audioContext = getAudioContext()
  if (!audioContext) return

  try {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Softer error sound - two low, gentle pulses
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(330, audioContext.currentTime) // E4
    oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.3) // A3 (descending)

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    console.log('Could not play incorrect sound:', error)
  }
}

export const playFlipSound = () => {
  const audioContext = getAudioContext()
  if (!audioContext) return

  try {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Quick "flip" sound - subtle high-to-mid frequency shift
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (error) {
    console.log('Could not play flip sound:', error)
  }
}
