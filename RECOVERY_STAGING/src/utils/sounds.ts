/**
 * Sound utilities for button clicks and interactions
 */

export const playClickSound = () => {
  try {
    // Create a simple click sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Configure the sound - pleasant click
    oscillator.frequency.value = 800 // Higher pitch for click
    oscillator.type = 'sine'
    
    // Volume envelope - quick fade out
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    // Play the sound
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (error) {
    console.log('Could not play click sound:', error)
  }
}

export const playSuccessSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Success sound - higher and more pleasant
    oscillator.frequency.value = 1000
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  } catch (error) {
    console.log('Could not play success sound:', error)
  }
}

export const playErrorSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Error sound - lower pitch
    oscillator.frequency.value = 200
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  } catch (error) {
    console.log('Could not play error sound:', error)
  }
}

export const playCelebrationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create a satisfying celebration sound with multiple tones
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.15) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = 'sine'
      
      // Volume envelope
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime + startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration)
      
      oscillator.start(audioContext.currentTime + startTime)
      oscillator.stop(audioContext.currentTime + startTime + duration)
    }
    
    // Play a more satisfying and recognizable celebration chord (C major arpeggio with more notes)
    playTone(523.25, 0, 0.2, 0.2)      // C5 (higher volume)
    playTone(659.25, 0.1, 0.2, 0.2)    // E5
    playTone(783.99, 0.2, 0.3, 0.25)   // G5 (final note, louder)
    playTone(1046.50, 0.35, 0.4, 0.3)  // C6 (higher octave for grand finish)
    
  } catch (error) {
    console.log('Could not play celebration sound:', error)
  }
}


