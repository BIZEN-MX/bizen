"use client"

import { useState, useCallback, useRef } from 'react'

export interface BillyMessage {
  text: string
  audioUrl?: string
  duration?: number
}

export interface UseBillyReturn {
  /** Make Billy speak text */
  speak: (text: string) => void
  /** Make Billy play audio */
  playAudio: (audioUrl: string) => void
  /** Stop Billy from speaking */
  stop: () => void
  /** Check if Billy is currently speaking */
  isSpeaking: boolean
  /** Current message being spoken */
  currentMessage: string | null
  /** Queue a series of messages */
  queueMessages: (messages: BillyMessage[]) => void
  /** Clear message queue */
  clearQueue: () => void
}

/**
 * Hook to control Billy the talking character
 * Makes it easy to trigger speech from anywhere in your app
 */
export function useBilly(): UseBillyReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<string | null>(null)
  const messageQueueRef = useRef<BillyMessage[]>([])
  const isProcessingRef = useRef(false)

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'es-ES' // Spanish
      utterance.rate = 1
      utterance.pitch = 1
      
      utterance.onstart = () => {
        setIsSpeaking(true)
        setCurrentMessage(text)
      }
      
      utterance.onend = () => {
        setIsSpeaking(false)
        setCurrentMessage(null)
        processNextMessage()
      }
      
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error)
        setIsSpeaking(false)
        setCurrentMessage(null)
        processNextMessage()
      }
      
      window.speechSynthesis.speak(utterance)
    } else {
      console.warn('Speech synthesis not supported in this browser')
    }
  }, [])

  const playAudio = useCallback((audioUrl: string) => {
    setCurrentMessage(audioUrl)
    setIsSpeaking(true)
    
    // Audio playback would be handled by the TalkingCharacter component
    // This is mainly for state management
  }, [])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
    setCurrentMessage(null)
    messageQueueRef.current = []
    isProcessingRef.current = false
  }, [])

  const processNextMessage = useCallback(() => {
    if (isProcessingRef.current || messageQueueRef.current.length === 0) {
      isProcessingRef.current = false
      return
    }
    
    isProcessingRef.current = true
    const nextMessage = messageQueueRef.current.shift()
    
    if (nextMessage) {
      if (nextMessage.audioUrl) {
        playAudio(nextMessage.audioUrl)
      } else {
        speak(nextMessage.text)
      }
    } else {
      isProcessingRef.current = false
    }
  }, [speak, playAudio])

  const queueMessages = useCallback((messages: BillyMessage[]) => {
    messageQueueRef.current.push(...messages)
    if (!isProcessingRef.current) {
      processNextMessage()
    }
  }, [processNextMessage])

  const clearQueue = useCallback(() => {
    messageQueueRef.current = []
    isProcessingRef.current = false
  }, [])

  return {
    speak,
    playAudio,
    stop,
    isSpeaking,
    currentMessage,
    queueMessages,
    clearQueue,
  }
}

/**
 * Predefined Billy messages for common scenarios
 */
export const BillyMessages = {
  welcome: '¡Hola! Bienvenido a BIZEN. Estoy aquí para ayudarte en tu aprendizaje.',
  moduleComplete: '¡Felicidades! Has completado este módulo. Excelente trabajo.',
  quizStart: 'Comencemos con el quiz. Lee cada pregunta cuidadosamente.',
  quizCorrect: '¡Correcto! Muy bien hecho.',
  quizIncorrect: 'No es correcto, pero sigue intentando. ¡Tú puedes!',
  takeBreak: 'Recuerda tomar descansos regulares. Tu bienestar es importante.',
  encouragement: '¡Vas muy bien! Sigue así.',
  reviewReminder: 'No olvides revisar el material anterior para reforzar tu aprendizaje.',
  nextLesson: '¿Listo para la siguiente lección? ¡Vamos!',
  help: 'Si necesitas ayuda, no dudes en consultar los recursos adicionales.',
  certification: '¡Estás cerca de obtener tu certificación! Sigue avanzando.',
} as const

/**
 * Billy messages for specific modules
 */
export const ModuleMessages = {
  m1: {
    start: 'Bienvenido al Módulo 1: Identidad Digital. Vamos a aprender juntos.',
    end: 'Has completado el Módulo 1. Ahora sabes cómo construir tu presencia digital.',
  },
  m2: {
    start: 'Módulo 2: Storytelling. Aprenderás a contar historias que conecten.',
    end: '¡Módulo 2 completado! Ahora puedes crear narrativas impactantes.',
  },
  m3: {
    start: 'Módulo 3: Producción audiovisual. Hora de crear contenido profesional.',
    end: '¡Excelente! Ya sabes producir contenido audiovisual de calidad.',
  },
  m4: {
    start: 'Módulo 4: Herramientas de edición. Domina las herramientas creativas.',
    end: 'Módulo 4 completado. Ahora eres un experto en edición.',
  },
  m5: {
    start: 'Módulo 5: Estrategia de contenidos. Planifica tu éxito.',
    end: '¡Increíble! Ya puedes diseñar estrategias efectivas.',
  },
  m6: {
    start: 'Módulo 6: Analítica y crecimiento. Mide y optimiza tu impacto.',
    end: '¡Felicidades! Has completado todos los módulos de BIZEN.',
  },
} as const


